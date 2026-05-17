import express from 'express';
import Hall from '../models/Hall.js';
import { authGuard, adminGuard } from '../middleware/auth.js';
import { getIO } from '../config/socket.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const halls = await Hall.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ halls });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const hall = await Hall.findByPk(req.params.id);
    if (!hall) return res.status(404).json({ message: 'Hall not found.' });
    res.json({ hall });
  } catch (error) {
    next(error);
  }
});

router.post('/', authGuard, adminGuard, async (req, res, next) => {
  try {
    const hall = await Hall.create(req.body);
    try {
      getIO().emit('halls_updated');
    } catch {
      /* noop */
    }
    res.status(201).json({ hall });
  } catch (error) {
    next(error);
  }
});

export default router;
