import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import http from 'http';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import './models/index.js';

import User from './models/User.js';
import Hall from './models/Hall.js';
import Booking from './models/Booking.js';
import ServiceCatalogue from './models/ServiceCatalogue.js';

import authRoutes from './routes/auth.js';
import hallRoutes from './routes/halls.js';
import bookingRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
import serviceRoutes from './routes/services.js';

import paymentRoutes, {
  webhookRouter as paystackWebhookRouter,
} from './routes/payments.js';

import { errorHandler } from './middleware/errorHandler.js';
import { initSocket } from './config/socket.js';
import { corsOriginCheck } from './config/corsOrigins.js';
import seedServices from './seed_services.js';

const __dirname = path.dirname(
  fileURLToPath(import.meta.url)
);

dotenv.config({
  path: path.join(__dirname, '.env'),
  override: true,
});

dotenv.config({
  path: path.join(__dirname, '../.env'),
});

const app = express();

const server = http.createServer(app);

initSocket(server);

app.set('trust proxy', 1);

const frontendUrl =
  process.env.FRONTEND_URL || 'http://localhost:5173';

const apiBaseUrl =
  process.env.API_BASE_URL || 'http://localhost:4001';

const googleCallbackUrl =
  process.env.GOOGLE_CALLBACK_URL ||
  `${apiBaseUrl}/api/auth/google/callback`;

const googleAuthConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

/* =========================
   PASSPORT + SESSION
========================= */

app.use(
  session({
    name: process.env.SESSION_NAME || 'elite.sid',
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use(passport.initialize());

app.use(passport.session());

if (googleAuthConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          process.env.GOOGLE_CLIENT_ID,

        clientSecret:
          process.env.GOOGLE_CLIENT_SECRET,

        callbackURL:
          googleCallbackUrl,
      },

      async (
        accessToken,
        refreshToken,
        profile,
        done
      ) => {
        try {
          let user =
            await User.findOne({
              where: {
                email:
                  profile.emails?.[0]?.value,
              },
            });

          if (!user) {
            user = await User.create({
              name:
                profile.displayName,
              email:
                profile.emails?.[0]?.value,
              password: 'google-auth',
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
} else {
  console.warn(
    'Google OAuth is disabled because GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not configured.'
  );
}

passport.serializeUser(
  (user, done) => {
    done(null, user.id);
  }
);

passport.deserializeUser(
  async (id, done) => {
    try {
      const user =
        await User.findByPk(id);

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
);

/* =========================
   GOOGLE AUTH ROUTES
========================= */

app.get(
  '/api/auth/google',
  (req, res, next) => {
    if (!googleAuthConfigured) {
      return res.status(503).json({
        message: 'Google authentication is not configured.',
      });
    }
    return next();
  },
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

app.get(
  '/api/auth/google/callback',
  (req, res, next) => {
    if (!googleAuthConfigured) {
      return res.redirect(`${frontendUrl}/login`);
    }
    return next();
  },
  passport.authenticate('google', {
    failureRedirect: `${frontendUrl}/login`,
  }),
  async (req, res) => {
    try {
      if (req.user) {
        await Booking.update(
          { userId: req.user.id },
          { where: { email: req.user.email, userId: null } }
        );
      }
    } catch (error) {
      console.error(
        'Error linking bookings during Google Auth:',
        error
      );
    }

    try {
      const redirectPath = req.user?.role === 'admin' ? '/admin' : '/dashboard';
      const target = new URL(frontendUrl);
      target.pathname = redirectPath;
      res.redirect(target.toString());
    } catch (e) {
      res.redirect(frontendUrl);
    }
  }
);

/* =========================
   MIDDLEWARE
========================= */

const uploadsPath = path.join(
  __dirname,
  'uploads'
);

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, {
    recursive: true,
  });
}

app.use(
  cors({
    origin: corsOriginCheck,
    credentials: true,
  })
);

app.use(
  '/api/payments/webhook',
  express.raw({
    type: 'application/json',
  }),
  paystackWebhookRouter
);

app.use(express.json());

app.use(cookieParser());

app.use(
  '/uploads',
  express.static(uploadsPath)
);

/* =========================
   API ROUTES
========================= */

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'elite-event-hub',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);

app.use('/api/halls', hallRoutes);

app.use('/api/bookings', bookingRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/payments', paymentRoutes);

app.use('/api/services', serviceRoutes);

/* =========================
   CLIENT BUILD
========================= */

const clientDistPath = path.join(
  __dirname,
  '../client/dist'
);

app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(
      path.join(
        clientDistPath,
        'index.html'
      )
    );
  }
});

app.use(errorHandler);

const PORT =
  process.env.PORT || 4001;

/* =========================
   DEFAULT ADMIN
========================= */

const ensureAdminUser =
  async () => {
    const adminEmail =
      process.env.ADMIN_EMAIL;

    const adminPassword =
      process.env.ADMIN_PASSWORD;

    if (
      !adminEmail ||
      !adminPassword
    ) {
      console.warn(
        'ADMIN_EMAIL and ADMIN_PASSWORD are not configured.'
      );

      return;
    }

    const existingAdmin =
      await User.findOne({
        where: {
          email: adminEmail,
        },
      });

    if (!existingAdmin) {
      const passwordHash =
        await bcrypt.hash(
          adminPassword,
          12
        );

      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: passwordHash,
        role: 'admin',
      });

      console.log(
        `Created admin user: ${adminEmail}`
      );
    }
  };

/* =========================
   SEED HALLS
========================= */

const seedDefaultHalls =
  async () => {
    const count =
      await Hall.count();

    if (count > 0) return;

    await Hall.bulkCreate([
      {
        name: 'Omega Grand Ballroom',
        capacity: 320,
        price: 50000,
        hourlyRate: 15000,
        capacityPricePerGuest: 500,
        baseGuestCount: 100,
        location: 'Downtown Luxury District',
        features: ['AC', 'Parking', 'Stage', 'Catering', 'Décor', 'WiFi'],
        status: 'Available',
        image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
        category: 'Weddings',
        description: 'Luxury ballroom for premium events.',
        rating: 4.9,
      },
      {
        name: 'Aurora Conference Hall',
        capacity: 140,
        price: 30000,
        hourlyRate: 8000,
        capacityPricePerGuest: 300,
        baseGuestCount: 50,
        location: 'Cityview Plaza',
        features: ['AC', 'Projector', 'Parking', 'WiFi', 'Catering'],
        status: 'Available',
        image: 'https://images.unsplash.com/photo-1502767089025-6572583495b0?auto=format&fit=crop&w=1200&q=80',
        category: 'Conferences',
        description: 'State-of-the-art corporate event space.',
        rating: 4.7,
      },
      {
        name: 'Luna Sunset Terrace',
        capacity: 90,
        price: 20000,
        hourlyRate: 5000,
        capacityPricePerGuest: 200,
        baseGuestCount: 30,
        location: 'Riverside Event Park',
        features: ['Open-air', 'Catering', 'Decoration', 'WiFi', 'Parking'],
        status: 'Available',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
        category: 'Parties',
        description: 'Beautiful rooftop venue with natural lighting and skyline views.',
        rating: 4.6,
      },
      {
        name: 'Zenith Celebration Hall',
        capacity: 200,
        price: 40000,
        hourlyRate: 12000,
        capacityPricePerGuest: 400,
        baseGuestCount: 80,
        location: 'Skyline Avenue',
        features: ['AC', 'Stage', 'Catering', 'Décor', 'Sound'],
        status: 'Available',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
        category: 'Weddings',
        description: 'Vibrant modern hall for medium to large gatherings.',
        rating: 4.8,
      },
    ]);

    console.log(
      'Default halls seeded.'
    );
  };

/* =========================
   START SERVER
========================= */

const start = async () => {
  try {
    await connectDB();

    await ensureAdminUser();

    await seedDefaultHalls();

    await seedServices();

    server.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  } catch (err) {
    console.error(
      'Database connection failed:',
      err.message
    );

    process.exit(1);
  }
};

start();
