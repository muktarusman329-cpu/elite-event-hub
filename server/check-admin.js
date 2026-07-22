import connectDB from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const checkAdmin = async () => {
  try {
    await connectDB();
    const admin = await User.findOne({ where: { email: 'admin@eliteeventhub.com' } });
    if (!admin) {
      console.log('Admin not found!');
      process.exit(1);
    }
    
    const isChangeMe = await bcrypt.compare('change_me_before_production', admin.password);
    const isAdminPass = await bcrypt.compare('change_me_before_production', admin.password);
    
    console.log('Password is "change_me_before_production":', isChangeMe);
    console.log('Password is "change_me_before_production":', isAdminPass);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkAdmin();
