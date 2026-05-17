import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import './models/index.js';
import authRoutes from './routes/auth.js';
import hallRoutes from './routes/halls.js';
import bookingRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initSocket } from './config/socket.js';
import { corsOriginCheck } from './config/corsOrigins.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(cors({ origin: corsOriginCheck, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  }

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `Port ${PORT} is already in use. Stop the other process or set PORT in .env.`
      );
    } else {
      console.error('Server error:', err);
    }
    process.exit(1);
  });

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

start();
