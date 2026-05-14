import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
  hallName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  date: String,
  time: String,
  eventType: String,
  guests: Number,
  services: [String],
  status: { type: String, enum: ['Pending', 'Confirmed', 'Rejected'], default: 'Pending' },
  total: Number,
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
