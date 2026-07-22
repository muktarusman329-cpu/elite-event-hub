import connectDB, { sequelize } from './config/db.js';
import Hall from './models/Hall.js';

const seedHalls = async () => {
  try {
    await connectDB();
    const count = await Hall.count();
    if (count === 0) {
      console.log('Seeding initial halls...');
      await Hall.bulkCreate([
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
      ]);
      console.log('Halls seeded successfully!');
    } else {
      console.log('Halls already exist. no seeding needed.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedHalls();
