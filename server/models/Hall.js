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
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  features: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
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
}, {
  timestamps: true,
});

export default Hall;
