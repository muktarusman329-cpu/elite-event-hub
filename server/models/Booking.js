import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Booking = sequelize.define(
  'Booking',
  {
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

    hallname: {
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
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    guestToken: {
      type: DataTypes.STRING,
      unique: true,
    },
    guestTokenExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    time: {
      type: DataTypes.STRING,
    },

    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'HH:mm format e.g 10:00',
    },

    endTime: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'HH:mm format e.g 16:00',
    },

    duration: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 1,
      comment: 'Duration in hours',
    },

    eventType: {
      type: DataTypes.STRING,
      defaultValue: 'Wedding',
    },

    guests: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    services: {
      type: DataTypes.TEXT,

      get() {
        const rawValue = this.getDataValue('services');
        return rawValue ? JSON.parse(rawValue) : [];
      },

      set(value) {
        this.setDataValue(
          'services',
          JSON.stringify(value || [])
        );
      },
    },

    notes: {
      type: DataTypes.TEXT,
    },

    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    hourlyCharge: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    guestCharge: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    servicesTotal: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    weekendCharge: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    luxuryCharge: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    vatCharge: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    paymentStatus: {
      type: DataTypes.ENUM(
        'Pending',
        'Paid',
        'Failed',
        'Refunded'
      ),
      defaultValue: 'Pending',
    },

    paymentReference: {
      type: DataTypes.STRING,
    },

    paymentMethod: {
      type: DataTypes.STRING,
      defaultValue: 'Paystack',
    },

    status: {
      type: DataTypes.ENUM(
        'Pending',
        'Approved',
        'Rejected',
        'Paid',
        'Cancelled',
        'Completed'
      ),
      defaultValue: 'Pending',
    },
  },
  {
    timestamps: true,

    indexes: [
      {
        fields: ['hallId'],
      },
      {
        fields: ['date'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['paymentStatus'],
      },
    ],
  }
);

export default Booking;