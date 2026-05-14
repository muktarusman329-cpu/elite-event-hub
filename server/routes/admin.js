import express from 'express';
import Booking from '../models/Booking.js';
import Hall from '../models/Hall.js';
import Payment from '../models/Payment.js';
import { authGuard, adminGuard } from '../middleware/auth.js';

const router = express.Router();

router.use(authGuard, adminGuard);

router.get('/summary', async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(10);
    const halls = await Hall.find().sort({ createdAt: -1 });
    const payments = await Payment.find();
    const revenue = payments.reduce((sum, item) => sum + (item.amount || 0), 0);
    res.json({ revenue, bookings, halls });
  } catch (error) {
    next(error);
  }
});

export default router;
