import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '../.env'), override: true });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const env = (key, fallback = '') => {
  const value = process.env[key];
  return value === undefined || value === null ? fallback : String(value).trim();
};

const requireEnv = (key) => {
  const value = env(key);

  if (!value) {
    throw new Error(
      `${key} is required. Check server/.env and restart the backend.`
    );
  }

  return value;
};

const useIntegratedAuth =
  env('DB_USE_INTEGRATED_AUTH') === 'true';

const databaseName = requireEnv('DB_NAME');

const databaseUser = useIntegratedAuth
  ? null
  : requireEnv('DB_USER');

const databasePassword = useIntegratedAuth
  ? null
  : requireEnv('DB_PASSWORD');

const commonOptions = {
  host: env('DB_HOST', 'localhost'),

  port:
    Number(env('DB_PORT', '1433')) || 1433,

  dialect: 'mssql',

  dialectOptions: {
    options: {
      encrypt:
        env('DB_ENCRYPT') === 'true',

      trustServerCertificate:
        env('DB_TRUST_SERVER_CERT') ===
        'true',

      ...(useIntegratedAuth && {
        trustedConnection: true,
      }),
    },
  },

  logging:
    env('DB_LOGGING') === 'true'
      ? console.log
      : false,
};

const sequelize = useIntegratedAuth
  ? new Sequelize(
      databaseName,
      null,
      null,
      commonOptions
    )
  : new Sequelize(
      databaseName,
      databaseUser,
      databasePassword,
      commonOptions
    );

let isSynced = false;

const connectDB = async () => {
  try {
    console.log(
      `Connecting to SQL Server ${commonOptions.host}:${commonOptions.port}/${databaseName} using ${
        useIntegratedAuth
          ? 'integrated auth'
          : `SQL auth user "${databaseUser}"`
      }.`
    );

    await sequelize.authenticate();

    console.log(
      'SQL Server connected successfully.'
    );

    // DEVELOPMENT ONLY — alter keeps existing data while updating schema
    if (env('NODE_ENV') !== 'production' && !isSynced) {
      console.log(
        'Syncing development schema (alter mode — data preserved).'
      );

      await sequelize.sync({ force: false });
      isSynced = true;
    }
  } catch (error) {
    console.error(
      'SQL Server connection error:',
      error
    );

    throw error;
  }
};

export default connectDB;

export { sequelize };