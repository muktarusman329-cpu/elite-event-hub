import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  bookingId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Bookings',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'usd',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  provider: {
    type: DataTypes.STRING,
  },
  providerId: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
});

export default Payment;
