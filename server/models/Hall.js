import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Hall = sequelize.define('Hall', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Base price for the hall',
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: 'Additional charge per hour of event duration',
  },
  capacityPricePerGuest: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: 'Extra charge per guest above baseGuestCount',
  },
  baseGuestCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of guests included in the base price',
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  features: {
    type: DataTypes.TEXT,
    get() {
      const rawValue = this.getDataValue('features');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('features', JSON.stringify(value || []));
    },
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Available',
  },
  image: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 4.5,
  },
}, {
  timestamps: true,
});

export default Hall;
