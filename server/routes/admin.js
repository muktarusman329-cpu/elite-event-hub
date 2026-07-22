import express from 'express';
import { Op } from 'sequelize';
import Booking from '../models/Booking.js';
import Hall from '../models/Hall.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import { authGuard, adminGuard } from '../middleware/auth.js';
import { getIO } from '../config/socket.js';
import { upload } from '../config/upload.js';

const router = express.Router();

const getPublicBaseUrl = (req) =>
  process.env.PUBLIC_URL ||
  process.env.FRONTEND_URL ||
  `${req.protocol}://${req.get('host')}`;

router.use(authGuard, adminGuard);

// GET /api/admin/summary
router.get('/summary', async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({ order: [['createdAt', 'DESC']], limit: 50 });
    const halls = await Hall.findAll({ order: [['createdAt', 'DESC']] });
    const payments = await Payment.findAll();
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'profilePicture', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    const revenue = payments
      .filter((p) => p.status === 'paid' || p.status === 'succeeded')
      .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

    const pending = bookings.filter((b) => b.status === 'Pending').length;
    const approved = bookings.filter((b) => b.status === 'Approved').length;
    const completed = bookings.filter((b) => b.status === 'Completed').length;

    res.json({
      revenue,
      bookings,
      halls,
      users,
      stats: { pending, approved, completed, totalUsers: users.length },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/bookings  — full booking table with filters
router.get('/bookings', async (req, res, next) => {
  try {
    const { status, date, hallId, search } = req.query;
    const where = {};
    if (status && status !== 'all') where.status = status;
    if (date) where.date = date;
    if (hallId) where.hallId = hallId;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { hallname: { [Op.like]: `%${search}%` } },
      ];
    }
    const bookings = await Booking.findAll({
      where,
      include: [
        { model: Hall, attributes: ['name', 'hourlyRate', 'category', 'image'] },
        { model: User, attributes: ['name', 'email', 'profilePicture'], required: false },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/users
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'profilePicture', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res, next) => {
  try {
    if (Number(req.params.id) === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account.' });
    }
    await User.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/halls/:id
router.put('/halls/:id', upload.single('image'), async (req, res, next) => {
  try {
    const hall = await Hall.findByPk(req.params.id);
    if (!hall) return res.status(404).json({ message: 'Hall not found.' });
    const updates = { ...req.body };

    // Coerce numeric fields
    ['capacity', 'price', 'hourlyRate', 'capacityPricePerGuest', 'baseGuestCount', 'rating'].forEach((field) => {
      if (updates[field] !== undefined) updates[field] = Number(updates[field]);
    });

    if (req.file) {
      updates.image = `${getPublicBaseUrl(req)}/uploads/${req.file.filename}`;
    }
    await hall.update(updates);
    try { getIO().emit('halls_updated'); } catch { /* noop */ }
    res.json({ hall });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/halls/:id
router.delete('/halls/:id', async (req, res, next) => {
  try {
    const active = await Booking.count({
      where: {
        hallId: req.params.id,
        status: { [Op.notIn]: ['Cancelled', 'Rejected', 'Completed'] },
      },
    });
    if (active > 0) {
      return res.status(400).json({ message: 'Hall has active bookings and cannot be deleted.' });
    }
    await Hall.destroy({ where: { id: req.params.id } });
    try { getIO().emit('halls_updated'); } catch { /* noop */ }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
