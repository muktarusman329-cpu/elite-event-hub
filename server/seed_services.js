import connectDB from './config/db.js';
import ServiceCatalogue from './models/ServiceCatalogue.js';

/**
 * Seed default extra services into the database.
 * This runs on server start. It will only insert services when the table is empty
 * to avoid duplicate entries on subsequent restarts.
 */
const seedServices = async () => {
  try {
    // Ensure DB connection
    await connectDB();
    const count = await ServiceCatalogue.count();
    if (count > 0) {
      console.log('Services already seeded. Skipping.');
      return;
    }
    console.log('Seeding default services...');
    await ServiceCatalogue.bulkCreate([
      {
        name: 'Catering',
        description: 'Full-service catering for events, including meals and beverages.',
        price: 5000,
        icon: 'Utensils',
        active: true,
      },
      {
        name: 'Photography',
        description: 'Professional photography coverage for your event.',
        price: 2500,
        icon: 'Camera',
        active: true,
      },
      {
        name: 'Decoration',
        description: 'Elegant decoration and floral arrangements.',
        price: 3000,
        icon: 'Sparkles',
        active: true,
      },
      {
        name: 'DJ & Music',
        description: 'Live DJ and music setup to keep the party going.',
        price: 2000,
        icon: 'Music',
        active: true,
      },
      {
        name: 'Security',
        description: 'Trained security personnel for event safety.',
        price: 1500,
        icon: 'Shield',
        active: true,
      },
      {
        name: 'Live Streaming',
        description: 'High‑quality live streaming for remote attendees.',
        price: 3500,
        icon: 'Video',
        active: true,
      },
      {
        name: 'MC / Host',
        description: 'Professional MC or host to manage the program.',
        price: 1800,
        icon: 'Mic2',
        active: true,
      },
    ]);
    console.log('Default services seeded successfully.');
  } catch (error) {
    console.error('Failed to seed services:', error);
  }
};

export default seedServices;
