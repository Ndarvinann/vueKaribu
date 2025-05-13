import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth, isManager } from '../middleware/auth.js';
import Produce from '../models/Produce.js';

const router = express.Router();

// Get all produce for a branch
router.get('/', auth, async (req, res) => {
  try {
    const produce = await Produce.find({ branch: req.user.branch });
    res.json(produce);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new produce (managers only)
router.post('/', [
  auth,
  isManager,
  body('name').isLength({ min: 2 }),
  body('type').matches(/^[A-Za-z]+$/).isLength({ min: 2 }),
  body('tonnage').isInt({ min: 1000 }),
  body('costPerKg').isInt({ min: 100 }),
  body('sellingPricePerKg').isInt({ min: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const produce = new Produce({
      ...req.body,
      branch: req.user.branch
    });

    await produce.save();
    res.status(201).json(produce);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update produce stock
router.patch('/:id/stock', [
  auth,
  isManager,
  body('tonnage').isInt({ min: 0 })
], async (req, res) => {
  try {
    const produce = await Produce.findOne({
      _id: req.params.id,
      branch: req.user.branch
    });

    if (!produce) {
      return res.status(404).json({ message: 'Produce not found' });
    }

    produce.tonnage = req.body.tonnage;
    await produce.save();
    res.json(produce);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;