import express from 'express';
import Hall from '../models/Hall.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const halls = await Hall.find().sort({ createdAt: -1 });
    res.json({ halls });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const hall = await Hall.create(req.body);
    res.status(201).json({ hall });
  } catch (error) {
    next(error);
  }
});

export default router;
