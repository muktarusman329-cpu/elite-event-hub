import express from 'express';
import ServiceCatalogue from '../models/ServiceCatalogue.js';
import { authGuard, adminGuard } from '../middleware/auth.js';

const router = express.Router();

// GET /api/services  — public, returns active services
router.get('/', async (req, res, next) => {
  try {
    const services = await ServiceCatalogue.findAll({
      where: { active: true },
      order: [['name', 'ASC']],
    });
    res.json({ services });
  } catch (error) {
    next(error);
  }
});

// GET /api/services/all  — admin, returns all including inactive
router.get('/all', authGuard, adminGuard, async (req, res, next) => {
  try {
    const services = await ServiceCatalogue.findAll({ order: [['name', 'ASC']] });
    res.json({ services });
  } catch (error) {
    next(error);
  }
});

// POST /api/services  — admin, create a new service
router.post('/', authGuard, adminGuard, async (req, res, next) => {
  try {
    const { name, price, description, icon, active } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ message: 'name and price are required.' });
    }
    const service = await ServiceCatalogue.create({
      name,
      price: Number(price),
      description,
      icon,
      active: active !== undefined ? active : true,
    });
    res.status(201).json({ service });
  } catch (error) {
    next(error);
  }
});

// PUT /api/services/:id  — admin, update a service
router.put('/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    const service = await ServiceCatalogue.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    const { name, price, description, icon, active } = req.body;
    await service.update({
      ...(name !== undefined && { name }),
      ...(price !== undefined && { price: Number(price) }),
      ...(description !== undefined && { description }),
      ...(icon !== undefined && { icon }),
      ...(active !== undefined && { active }),
    });
    res.json({ service });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/services/:id  — admin
router.delete('/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    const service = await ServiceCatalogue.findByPk(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    await service.destroy();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
