import User from './User.js';
import Hall from './Hall.js';
import Booking from './Booking.js';
import Payment from './Payment.js';

// Define associations
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Hall.hasMany(Booking, { foreignKey: 'hallId' });
Booking.belongsTo(Hall, { foreignKey: 'hallId' });

Booking.hasOne(Payment, { foreignKey: 'bookingId' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId' });

export { User, Hall, Booking, Payment };