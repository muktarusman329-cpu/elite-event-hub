import express from 'express';
import Booking from '../models/Booking.js';
import Hall from '../models/Hall.js';
import Payment from '../models/Payment.js';
import { authGuard } from '../middleware/auth.js';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

router.get('/', async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ date: 1, time: 1 });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { hallId, date, time, eventType, guests, services, name, email } = req.body;
    const hall = await Hall.findById(hallId);
    if (!hall) return res.status(404).json({ message: 'Selected hall not found.' });

    const total = hall.price + (services?.length || 0) * 250;
    const booking = await Booking.create({
      hallId,
      hallName: hall.name,
      date,
      time,
      eventType,
      guests,
      services,
      name,
      email,
      total,
      status: 'Pending',
    });

    const payment = await Payment.create({ bookingId: booking._id, amount: total, status: 'pending', provider: 'stripe' });

    res.status(201).json({ bookingId: booking._id, paymentId: payment._id });
  } catch (error) {
    next(error);
  }
});

router.post('/pay', authGuard, async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round((booking.total || 0) * 100),
      currency: 'usd',
      metadata: { bookingId: booking._id.toString() },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', authGuard, async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    res.json({ booking });
  } catch (error) {
    next(error);
  }
});

export default router;
