import connectDB, { sequelize } from './config/db.js';
import './models/index.js';

const fixDb = async () => {
  try {
    await connectDB();
    console.log('Fixing tables...');
    await sequelize.sync({ force: true });
    console.log('Tables fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing tables:', error);
    process.exit(1);
  }
};

fixDb();
