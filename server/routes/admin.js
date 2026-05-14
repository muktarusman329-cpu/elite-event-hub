import express from 'express';
import Booking from '../models/Booking.js';
import Hall from '../models/Hall.js';
import Payment from '../models/Payment.js';
import { authGuard, adminGuard } from '../middleware/auth.js';

const router = express.Router();

router.use(authGuard, adminGuard);

router.get('/summary', async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({ order: [['createdAt', 'DESC']], limit: 10 });
    const halls = await Hall.findAll({ order: [['createdAt', 'DESC']] });
    const payments = await Payment.findAll();
    const revenue = payments.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    res.json({ revenue, bookings, halls });
  } catch (error) {
    next(error);
  }
});

export default router;
