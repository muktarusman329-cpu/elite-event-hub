import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  hallId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Halls',
      key: 'id',
    },
  },
  hallName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.STRING,
  },
  time: {
    type: DataTypes.STRING,
  },
  eventType: {
    type: DataTypes.STRING,
  },
  guests: {
    type: DataTypes.INTEGER,
  },
  services: {
    type: DataTypes.TEXT,
    get() {
      const rawValue = this.getDataValue('services');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('services', JSON.stringify(value || []));
    },
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
  },
}, {
  timestamps: true,
});

export default Booking;
