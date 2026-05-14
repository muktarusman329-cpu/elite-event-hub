import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  amount: Number,
  currency: { type: String, default: 'usd' },
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  provider: String,
  providerId: String,
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
