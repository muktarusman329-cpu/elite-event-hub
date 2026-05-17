import express from 'express';
import { Op } from 'sequelize';
import Booking from '../models/Booking.js';
import Hall from '../models/Hall.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import { authGuard, adminGuard } from '../middleware/auth.js';
import { getIO } from '../config/socket.js';

const router = express.Router();

router.use(authGuard, adminGuard);

router.get('/summary', async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({ order: [['createdAt', 'DESC']], limit: 50 });
    const halls = await Hall.findAll({ order: [['createdAt', 'DESC']] });
    const payments = await Payment.findAll();
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    const revenue = payments
      .filter((p) => p.status === 'paid' || p.status === 'succeeded')
      .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

    const pending = bookings.filter((b) => b.status === 'Pending').length;
    const approved = bookings.filter((b) => b.status === 'Approved').length;

    res.json({ revenue, bookings, halls, users, stats: { pending, approved, totalUsers: users.length } });
  } catch (error) {
    next(error);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

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

router.put('/halls/:id', async (req, res, next) => {
  try {
    const hall = await Hall.findByPk(req.params.id);
    if (!hall) return res.status(404).json({ message: 'Hall not found.' });
    await hall.update(req.body);
    try {
      getIO().emit('halls_updated');
    } catch {
      /* noop */
    }
    res.json({ hall });
  } catch (error) {
    next(error);
  }
});

router.delete('/halls/:id', async (req, res, next) => {
  try {
    const active = await Booking.count({
      where: {
        hallId: req.params.id,
        status: { [Op.notIn]: ['Cancelled', 'Rejected'] },
      },
    });
    if (active > 0) {
      return res.status(400).json({ message: 'Hall has active bookings and cannot be deleted.' });
    }
    await Hall.destroy({ where: { id: req.params.id } });
    try {
      getIO().emit('halls_updated');
    } catch {
      /* noop */
    }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
