import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const useIntegratedAuth = process.env.DB_USE_INTEGRATED_AUTH === 'true';

const commonOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 1433,
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === 'true',
      ...(useIntegratedAuth && { trustedConnection: true }),
    },
  },
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
};

const sequelize = useIntegratedAuth
  ? new Sequelize(process.env.DB_NAME, null, null, commonOptions)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      commonOptions
    );

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQL Server connected successfully.');
    // Note: Avoid calling sequelize.sync() in production. Use database migrations instead.
    if (process.env.NODE_ENV !== 'production') {
       await sequelize.sync(); 
    }
  } catch (error) {
    console.error('SQL Server connection error:', error);
    throw error;
  }
};

export default connectDB;
export { sequelize };
