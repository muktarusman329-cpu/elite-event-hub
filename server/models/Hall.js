import mongoose from 'mongoose';

const hallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  features: [{ type: String }],
  status: { type: String, default: 'Available' },
  image: String,
  category: String,
}, { timestamps: true });

export default mongoose.model('Hall', hallSchema);
