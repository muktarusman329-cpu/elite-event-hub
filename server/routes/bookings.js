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
    const bookings = await Booking.findAll({ order: [['date', 'ASC'], ['time', 'ASC']] });
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

    const total = parseFloat(hall.price) + (services?.length || 0) * 250;
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

    const payment = await Payment.create({ bookingId: booking.id, amount: total, status: 'pending', provider: 'stripe' });

    res.status(201).json({ bookingId: booking.id, paymentId: payment.id });
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

router.patch('/:id/status', authGuard, async (req, res, next) => {
  try {
    const [updatedRowsCount] = await Booking.update({ status: req.body.status }, { where: { id: req.params.id } });
    if (updatedRowsCount === 0) return res.status(404).json({ message: 'Booking not found.' });
    const booking = await Booking.findByPk(req.params.id);
    res.json({ booking });
  } catch (error) {
    next(error);
  }
});

export default router;
