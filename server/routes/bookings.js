import express from 'express';
import { Op } from 'sequelize';
import Booking from '../models/Booking.js';
import Hall from '../models/Hall.js';
import Payment from '../models/Payment.js';
import { authGuard, adminGuard } from '../middleware/auth.js';
import Stripe from 'stripe';
import { getIO } from '../config/socket.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

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

router.get('/availability', async (req, res, next) => {
  try {
    const { hallId, date } = req.query;
    if (!hallId || !date) {
      return res.status(400).json({ message: 'hallId and date are required.' });
    }
    const conflicts = await Booking.findAll({
      where: {
        hallId,
        date,
        status: { [Op.notIn]: ['Cancelled', 'Rejected'] },
      },
      attributes: ['id', 'time', 'status'],
    });
    res.json({ available: conflicts.length === 0, bookings: conflicts });
  } catch (error) {
    next(error);
  }
});

router.get('/calendar', async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      attributes: ['id', 'hallId', 'hallName', 'date', 'time', 'status', 'eventType'],
      where: { status: { [Op.notIn]: ['Cancelled', 'Rejected'] } },
      order: [['date', 'ASC'], ['time', 'ASC']],
    });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

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

router.get('/', authGuard, adminGuard, async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { hallId, date, time, eventType, guests, services, name, email } = req.body;
    const hall = await Hall.findByPk(hallId);
    if (!hall) return res.status(404).json({ message: 'Selected hall not found.' });

    const conflict = await Booking.findOne({
      where: {
        hallId,
        date,
        time,
        status: { [Op.notIn]: ['Cancelled', 'Rejected'] },
      },
    });
    if (conflict) {
      return res.status(409).json({ message: 'This hall is already booked for the selected date and time.' });
    }

    const authHeader = req.headers.authorization;
    let userId = null;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        userId = decoded.id;
      } catch {
        /* guest booking */
      }
    }

    const total = parseFloat(hall.price) + (services?.length || 0) * 250;
    const booking = await Booking.create({
      hallId,
      hallName: hall.name,
      userId,
      date,
      time,
      eventType,
      guests,
      services,
      name: name || req.user?.name,
      email: email || req.user?.email,
      total,
      status: 'Pending',
    });

    await Payment.create({
      bookingId: booking.id,
      amount: total,
      status: 'pending',
      provider: 'stripe',
    });

    emitBookingEvent('new_booking', booking);
    res.status(201).json({ bookingId: booking.id, booking });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/cancel', authGuard, async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    const isOwner =
      booking.userId === req.user.id || booking.email === req.user.email;
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

router.post('/pay', authGuard, async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round((booking.total || 0) * 100),
      currency: 'usd',
      metadata: { bookingId: booking.id.toString() },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', authGuard, adminGuard, async (req, res, next) => {
  try {
    const [updatedRowsCount] = await Booking.update(
      { status: req.body.status },
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

export default router;
