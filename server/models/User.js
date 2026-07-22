import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['email'],
    },
  ],
});

export default User;
