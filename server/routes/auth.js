import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Booking from '../models/Booking.js';

const router = express.Router();

/* =========================
   LOCAL SIGNUP
========================= */
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: passwordHash,
      role: 'user',
    });

    // Automatically link any previous guest bookings to this user
    await Booking.update(
      { userId: user.id },
      { where: { email, userId: null } }
    );

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Clean user object for client
    const userJson = user.toJSON();
    delete userJson.password;

    res.status(201).json({
      success: true,
      user: userJson,
      token,
    });
  } catch (error) {
    next(error);
  }
});

/* =========================
   LOCAL LOGIN
========================= */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Automatically link any previous guest bookings to this user
    await Booking.update(
      { userId: user.id },
      { where: { email, userId: null } }
    );

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userJson = user.toJSON();
    delete userJson.password;

    res.json({
      success: true,
      user: userJson,
      token,
    });
  } catch (error) {
    next(error);
  }
});

/* =========================
   CURRENT USER
========================= */
router.get('/me', (req, res) => {
  if (!req.user) return res.json(null);

  const user = { ...req.user.toJSON ? req.user.toJSON() : req.user };
  delete user.password;

  res.json(user);
});

/* =========================
   LOGOUT
========================= */
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    // destroy session and clear cookie
    req.session.destroy(() => {
      res.clearCookie(process.env.SESSION_NAME || 'elite.sid');
      res.json({ success: true, message: 'Logged out successfully' });
    });
  });
});

export default router;
