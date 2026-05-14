import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Hall from '../models/Hall.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';

dotenv.config();

const halls = [
  {
    name: 'Omega Grand Ballroom',
    capacity: 320,
    price: 5800,
    location: 'Downtown Luxury District',
    features: ['AC', 'Parking', 'Stage', 'Catering', 'Décor', 'WiFi'],
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
    category: 'Weddings',
  },
  {
    name: 'Aurora Conference Hall',
    capacity: 140,
    price: 3200,
    location: 'Cityview Plaza',
    features: ['AC', 'Projector', 'Parking', 'WiFi', 'Catering'],
    status: 'Limited',
    image: 'https://images.unsplash.com/photo-1502767089025-6572583495b0?auto=format&fit=crop&w=1200&q=80',
    category: 'Conferences',
  },
  {
    name: 'Luna Sunset Terrace',
    capacity: 90,
    price: 2100,
    location: 'Riverside Event Park',
    features: ['Open-air', 'Catering', 'Decoration', 'WiFi', 'Parking'],
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    category: 'Parties',
  },
  {
    name: 'Zenith Celebration Hall',
    capacity: 200,
    price: 4400,
    location: 'Skyline Avenue',
    features: ['AC', 'Stage', 'Catering', 'Décor', 'Sound'],
    status: 'Booked',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    category: 'Weddings',
  },
];

const seed = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Hall.deleteMany();
    await Booking.deleteMany();
    await Payment.deleteMany();

    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123';
    const admin = await User.create({
      name: 'Elite Admin',
      email: process.env.ADMIN_EMAIL || 'admin@eliteeventhub.com',
      password: await bcrypt.hash(adminPassword, 12),
      role: 'admin',
    });

    const createdHalls = await Hall.insertMany(halls);

    const bookings = await Booking.insertMany([
      {
        hallId: createdHalls[0]._id,
        hallName: createdHalls[0].name,
        name: 'Olivia Kim',
        email: 'olivia@example.com',
        date: '2026-05-27',
        time: '18:00',
        eventType: 'Wedding',
        guests: 240,
        services: ['Catering', 'Décor'],
        total: 6350,
        status: 'Confirmed',
      },
      {
        hallId: createdHalls[1]._id,
        hallName: createdHalls[1].name,
        name: 'Mason Reed',
        email: 'mason@example.com',
        date: '2026-06-04',
        time: '09:00',
        eventType: 'Conference',
        guests: 110,
        services: ['AV Support', 'WiFi'],
        total: 3450,
        status: 'Pending',
      },
    ]);

    await Payment.insertMany([
      { bookingId: bookings[0]._id, amount: bookings[0].total, status: 'paid', provider: 'stripe' },
      { bookingId: bookings[1]._id, amount: bookings[1].total, status: 'pending', provider: 'stripe' },
    ]);

    console.log(`Seed completed: admin=${admin.email}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
