import express from 'express';
import Hall from '../models/Hall.js';
import { authGuard, adminGuard } from '../middleware/auth.js';
import { getIO } from '../config/socket.js';
import { upload } from '../config/upload.js';

const router = express.Router();

const getPublicBaseUrl = (req) =>
  process.env.PUBLIC_URL ||
  process.env.FRONTEND_URL ||
  `${req.protocol}://${req.get('host')}`;

// GET /api/halls  — public
router.get('/', async (req, res, next) => {
  try {
    const halls = await Hall.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ halls });
  } catch (error) {
    next(error);
  }
});

// GET /api/halls/:id  — public
router.get('/:id', async (req, res, next) => {
  try {
    const hall = await Hall.findByPk(req.params.id);
    if (!hall) return res.status(404).json({ message: 'Hall not found.' });
    res.json({ hall });
  } catch (error) {
    next(error);
  }
});

// POST /api/halls  — admin only
router.post('/', authGuard, adminGuard, upload.single('image'), async (req, res, next) => {
  try {
    const payload = { ...req.body };

    // Parse numeric fields sent as form-data strings
    ['capacity', 'price', 'hourlyRate', 'capacityPricePerGuest', 'baseGuestCount', 'rating'].forEach((field) => {
      if (payload[field] !== undefined) payload[field] = Number(payload[field]);
    });

    if (req.file) {
      payload.image = `${getPublicBaseUrl(req)}/uploads/${req.file.filename}`;
    }

    const hall = await Hall.create(payload);
    try { getIO().emit('halls_updated'); } catch { /* noop */ }
    res.status(201).json({ hall });
  } catch (error) {
    next(error);
  }
});

export default router;
