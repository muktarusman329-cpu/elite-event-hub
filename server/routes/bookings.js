import express from 'express';
import { Op } from 'sequelize';
import Booking from '../models/Booking.js';
import Hall from '../models/Hall.js';
import { authGuard, adminGuard } from '../middleware/auth.js';
import { getIO } from '../config/socket.js';

const router = express.Router();

const emitBookingEvent = (event, booking) => {
  try {
    const io = getIO();
    io.to('admins').emit(event, booking);
    if (booking.userId) {
      io.to(`user_${booking.userId}`).emit(event, booking);
    }
    io.emit('availability_updated', { hallId: booking.hallId, date: booking.date });
  } catch (e) {
    console.error('Socket error:', e);
  }
};

/**
 * Convert "HH:mm" to total minutes from midnight for comparison.
 */
const timeToMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

/**
 * Calculate duration in hours between two HH:mm strings.
 */
const calcDuration = (startTime, endTime) => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  return Math.max(0, (end - start) / 60);
};

/**
 * Check if two time ranges overlap.
 * Overlap condition: newStart < existingEnd && newEnd > existingStart
 */
const hasOverlap = (newStart, newEnd, existingStart, existingEnd) => {
  const ns = timeToMinutes(newStart);
  const ne = timeToMinutes(newEnd);
  const es = timeToMinutes(existingStart);
  const ee = timeToMinutes(existingEnd);
  return ns < ee && ne > es;
};

// GET /api/bookings/availability?hallId=1&date=2024-12-25
router.get('/availability', async (req, res, next) => {
  try {
    const { hallId, date } = req.query;
    if (!hallId || !date) {
      return res.status(400).json({ message: 'hallId and date are required.' });
    }
    const bookings = await Booking.findAll({
      where: {
        hallId,
        date,
        status: { [Op.notIn]: ['Cancelled', 'Rejected'] },
      },
      attributes: ['id', 'startTime', 'endTime', 'time', 'status', 'eventType'],
    });
    // Normalise legacy bookings that only have 'time' but no startTime/endTime
    const slots = bookings.map((b) => ({
      id: b.id,
      startTime: b.startTime || b.time || null,
      endTime: b.endTime || null,
      status: b.status,
      eventType: b.eventType,
    }));
    res.json({ available: bookings.length === 0, bookings: slots });
  } catch (error) {
    next(error);
  }
});

// GET /api/bookings/calendar
router.get('/calendar', async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      attributes: ['id', 'hallId', 'hallname', 'date', 'time', 'startTime', 'endTime', 'duration', 'status', 'eventType'],
      where: { status: { [Op.notIn]: ['Cancelled', 'Rejected'] } },
      order: [['date', 'ASC'], ['startTime', 'ASC']],
    });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

// GET /api/bookings/mine
router.get('/mine', authGuard, async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      where: {
        [Op.or]: [{ userId: req.user.id }, { email: req.user.email }],
      },
      order: [['createdAt', 'DESC']],
    });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

// GET /api/bookings  (admin only)
router.get('/', authGuard, adminGuard, async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const where = {};
    if (status) where.status = status;
    if (date) where.date = date;
    const bookings = await Booking.findAll({
      where,
      include: [{ model: Hall, attributes: ['name', 'hourlyRate', 'category'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

// POST /api/bookings
router.post('/', async (req, res, next) => {
  try {
    const {
      hallId, date, startTime, endTime, time,
      eventType, guests, services, name, email, notes,
    } = req.body;

    const hall = await Hall.findByPk(hallId);
    if (!hall) return res.status(404).json({ message: 'Selected hall not found.' });

    // Resolve start/end — support legacy single `time` field as fallback
    const resolvedStart = startTime || time || null;
    const resolvedEnd = endTime || null;

    if (!resolvedStart) {
      return res.status(400).json({ message: 'Start time is required.' });
    }
    if (resolvedEnd && timeToMinutes(resolvedEnd) <= timeToMinutes(resolvedStart)) {
      return res.status(400).json({ message: 'End time must be after start time.' });
    }

    // --- Overlap conflict detection ---
    const existingBookings = await Booking.findAll({
      where: {
        hallId,
        date,
        status: { [Op.notIn]: ['Cancelled', 'Rejected'] },
      },
      attributes: ['id', 'startTime', 'endTime', 'time'],
    });

    if (resolvedEnd) {
      // Full range overlap check
      for (const existing of existingBookings) {
        const eStart = existing.startTime || existing.time;
        const eEnd = existing.endTime;
        if (eStart && eEnd && hasOverlap(resolvedStart, resolvedEnd, eStart, eEnd)) {
          return res.status(409).json({
            message: `This hall is already booked from ${eStart} to ${eEnd} on that date. Please choose a different time slot.`,
          });
        }
        // Legacy booking with only a single time — treat as 1 hour block
        if (eStart && !eEnd) {
          const legacyEnd = `${String(parseInt(eStart.split(':')[0], 10) + 1).padStart(2, '0')}:${eStart.split(':')[1]}`;
          if (hasOverlap(resolvedStart, resolvedEnd, eStart, legacyEnd)) {
            return res.status(409).json({
              message: `This hall is already booked at ${eStart} on that date.`,
            });
          }
        }
      }
    } else {
      // Legacy: exact time match only
      const conflict = existingBookings.find(
        (b) => (b.startTime || b.time) === resolvedStart
      );
      if (conflict) {
        return res.status(409).json({
          message: 'This hall is already booked for the selected date and time.',
        });
      }
    }

    // --- Dynamic pricing ---
    const duration = resolvedEnd ? calcDuration(resolvedStart, resolvedEnd) : 1;
    const basePrice = parseFloat(hall.price) || 0;
    const hourlyCharge = parseFloat(hall.hourlyRate || 0) * duration;
    const extraGuests = Math.max(0, (guests || 0) - (hall.baseGuestCount || 0));
    const guestCharge = extraGuests * parseFloat(hall.capacityPricePerGuest || 0);

    // Services: accept array of { name, price } objects or plain strings
    let servicesTotal = 0;
    const servicesArray = Array.isArray(services) ? services : [];
    servicesArray.forEach((svc) => {
      if (typeof svc === 'object' && svc.price) {
        servicesTotal += parseFloat(svc.price) || 0;
      }
    });

    const total = basePrice + hourlyCharge + guestCharge + servicesTotal;

    // --- Authenticate optional user ---
    const authHeader = req.headers.authorization;
    let userId = null;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        // Verify user actually exists to prevent FK constraint errors (e.g. after DB wipe)
        const User = (await import('../models/User.js')).default;
        const userExists = await User.findByPk(decoded.id);
        if (userExists) {
          userId = decoded.id;
        }
      } catch {
        /* guest booking or invalid token */
      }
    }

    // --- Guest token handling ---
    const crypto = await import('crypto');
    const guestToken = crypto.randomUUID();
    const tokenExpiresAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days

    const booking = await Booking.create({
      hallId,
      hallname: hall.name,
      userId,
      date,
      time: resolvedStart,
      startTime: resolvedStart,
      endTime: resolvedEnd,
      duration,
      eventType,
      guests,
      services: servicesArray,
      notes,
      name: name || req.user?.name,
      email: email || req.user?.email,
      basePrice,
      hourlyCharge,
      guestCharge,
      servicesTotal,
      total,
      status: 'Pending',
      guestToken,
      guestTokenExpiresAt: tokenExpiresAt,
    });

    // Send confirmation email to guest (if email provided)
    if (booking.email) {
      const { sendGuestEmail } = await import('../utils/email.js');
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const emailHtml = `<!DOCTYPE html><html style="font-family:Arial,Helvetica,sans-serif;background:#1a202c;color:#e2e8f0;"><head><meta charset="UTF-8"><title>Booking Confirmation</title></head><body style="padding:20px;max-width:600px;margin:auto;">` +
        `<div style="text-align:center;margin-bottom:20px;"><img src="https://via.placeholder.com/150x50?text=Elite+Event+Hub" alt="Logo" style="max-width:100%;"/></div>` +
        `<h2 style="color:#10b981;">Your booking is confirmed!</h2>` +
        `<p>Booking ID: <strong>${booking.id}</strong></p>` +
        `<p>We’ve created a secure link for you to view and manage your booking.</p>` +
        `<a href="${frontendUrl}/booking/${booking.id}?token=${guestToken}" style="display:inline-block;background:#10b981;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;margin-top:15px;">View My Booking</a>` +
        `<p style="margin-top:20px;font-size:0.9em;">This link is valid for 10 days.</p>` +
        `<hr style="border-color:#2d3748;margin:30px 0;"/>` +
        `<p>Thank you for choosing Elite Event Hub!</p>` +
        `</body></html>`;
      await sendGuestEmail(booking.email, 'Booking Confirmation', emailHtml);
    }

    emitBookingEvent('new_booking', booking);
    res.status(201).json({ bookingId: booking.id, booking });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', authGuard, async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    const isOwner = booking.userId === req.user.id || booking.email === req.user.email;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed to cancel this booking.' });
    }

    await booking.update({ status: 'Cancelled' });
    emitBookingEvent('booking_updated', booking);
    res.json({ booking });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/bookings/:id/status  (admin)
router.patch('/:id/status', authGuard, adminGuard, async (req, res, next) => {
  try {
    const validStatuses = ['Pending', 'Approved', 'Rejected', 'Paid', 'Cancelled', 'Completed'];
    const { status } = req.body;
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }
    const [updatedRowsCount] = await Booking.update(
      { status },
      { where: { id: req.params.id } }
    );
    if (updatedRowsCount === 0) return res.status(404).json({ message: 'Booking not found.' });
    const booking = await Booking.findByPk(req.params.id);
    emitBookingEvent('booking_updated', booking);
    res.json({ booking });
  } catch (error) {
    next(error);
  }
});
// GET /api/bookings/:id  — open to guests via ?token=, or to authenticated owners
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Hall, attributes: ['name', 'location', 'image', 'category', 'capacity'] }],
    });

    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    // ── Guest token path ──────────────────────────────────────────────
    const { token } = req.query;
    if (token) {
      if (booking.guestToken !== token) {
        return res.status(403).json({ message: 'Invalid or expired booking link.' });
      }
      if (booking.guestTokenExpiresAt && new Date() > new Date(booking.guestTokenExpiresAt)) {
        return res.status(403).json({ message: 'This booking link has expired.' });
      }
      return res.json({ booking });
    }

    // ── Authenticated user path ───────────────────────────────────────
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const jwt = (await import('jsonwebtoken')).default;
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        const isOwner = booking.userId === decoded.id || booking.email === decoded.email;
        const isAdmin = decoded.role === 'admin';
        if (isOwner || isAdmin) return res.json({ booking });
        return res.status(403).json({ message: 'Access denied.' });
      } catch {
        return res.status(401).json({ message: 'Invalid token.' });
      }
    }

    return res.status(401).json({ message: 'Authentication or booking token required.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;

