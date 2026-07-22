import crypto from 'crypto';
import express from 'express';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import { getIO } from '../config/socket.js';

const router = express.Router();
const webhookRouter = express.Router();

const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const PAYMENT_CHANNELS = ['card', 'bank_transfer', 'ussd', 'mobile_money'];

const getPaystackSecret = () => {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error('PAYSTACK_SECRET_KEY is not configured.');
  }
  return process.env.PAYSTACK_SECRET_KEY;
};

const amountToKobo = (amount) => Math.round(Number(amount || 0) * 100);

const generateReference = (bookingId) => {
  const random = crypto.randomBytes(8).toString('hex');
  return `EEH-${bookingId}-${Date.now()}-${random}`;
};

const callPaystack = async (path, options = {}) => {
  const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getPaystackSecret()}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const payload = await response.json();
  if (!response.ok || !payload.status) {
    throw new Error(payload.message || 'Paystack request failed.');
  }
  return payload.data;
};

const initializePaystackTransaction = (booking, reference, amount) =>
  callPaystack('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email: booking.email,
      amount,
      currency: 'NGN',
      reference,
      channels: PAYMENT_CHANNELS,
      metadata: {
        bookingId: booking.id,
        bookingName: booking.hallname,
        customerName: booking.name,
      },
    }),
  });

const emitPaidBooking = (booking) => {
  try {
    const io = getIO();
    io.to('admins').emit('booking_updated', booking);
    if (booking.userId) io.to(`user_${booking.userId}`).emit('booking_updated', booking);
  } catch {
    /* Socket is best-effort for payment confirmation. */
  }
};

const confirmPayment = async (transaction) => {
  const bookingId = transaction.metadata?.bookingId;
  const reference = transaction.reference;
  const booking = await Booking.findByPk(bookingId);
  if (!booking) throw new Error('Booking for this payment was not found.');

  const expectedAmount = amountToKobo(booking.total);
  const paidAmount = Number(transaction.amount);
  const currency = transaction.currency;

  if (transaction.status !== 'success') {
    await Payment.update({ status: transaction.status || 'failed' }, { where: { providerId: reference } });
    throw new Error('Payment was not successful.');
  }

  if (currency !== 'NGN' || paidAmount !== expectedAmount) {
    await Payment.update({ status: 'amount_mismatch' }, { where: { providerId: reference } });
    throw new Error('Payment amount or currency did not match this booking.');
  }

  const [payment] = await Payment.findOrCreate({
    where: { providerId: reference },
    defaults: {
      bookingId: booking.id,
      amount: Number(booking.total),
      currency: 'NGN',
      status: 'paid',
      provider: 'paystack',
      providerId: reference,
    },
  });

  await payment.update({
    bookingId: booking.id,
    amount: Number(booking.total),
    currency: 'NGN',
    status: 'paid',
    provider: 'paystack',
    providerId: reference,
  });

  await booking.update({ status: 'Paid', paymentStatus: 'Paid', paymentReference: reference });
  emitPaidBooking(booking);

  return { booking, payment };
};

router.get('/config', (req, res) => {
  res.json({
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
    channels: PAYMENT_CHANNELS,
    currency: 'NGN',
  });
});

router.post('/initialize', async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findByPk(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    if (['Cancelled', 'Rejected'].includes(booking.status)) {
      return res.status(400).json({ message: 'This booking cannot be paid for.' });
    }
    if (booking.status === 'Paid') {
      return res.status(400).json({ message: 'This booking is already paid.' });
    }
    if (!booking.email) {
      return res.status(400).json({ message: 'Booking email is required before payment.' });
    }

    const amount = amountToKobo(booking.total);
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Booking has an invalid payment amount.' });
    }

    const reference = generateReference(booking.id);
    const paystackTransaction = await initializePaystackTransaction(booking, reference, amount);

    await Payment.create({
      bookingId: booking.id,
      amount: Number(booking.total),
      currency: 'NGN',
      status: 'pending',
      provider: 'paystack',
      providerId: reference,
    });

    res.json({
      publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
      reference,
      accessCode: paystackTransaction.access_code,
      authorizationUrl: paystackTransaction.authorization_url,
      amount,
      currency: 'NGN',
      email: booking.email,
      channels: PAYMENT_CHANNELS,
      metadata: {
        bookingId: booking.id,
        bookingName: booking.hallname,
        customerName: booking.name,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/verify', async (req, res, next) => {
  try {
    const { reference } = req.body;
    if (!reference) return res.status(400).json({ message: 'Payment reference is required.' });

    const transaction = await callPaystack(`/transaction/verify/${encodeURIComponent(reference)}`);
    const { booking, payment } = await confirmPayment(transaction);

    res.json({
      success: true,
      message: 'Payment verified successfully.',
      booking,
      payment: {
        id: payment.id,
        reference: payment.providerId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
      },
    });
  } catch (error) {
    next(error);
  }
});

webhookRouter.post('/', async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    const secret = getPaystackSecret();
    const hash = crypto.createHmac('sha512', secret).update(req.body).digest('hex');
    if (hash !== signature) return res.sendStatus(401);

    const event = JSON.parse(req.body.toString('utf8'));
    if (event.event === 'charge.success') {
      await confirmPayment(event.data);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('[paystack:webhook] Failed to process webhook:', error);
    res.sendStatus(200);
  }
});

export { webhookRouter };
export default router;
