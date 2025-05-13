import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';
import Sale from '../models/Sale.js';
import Produce from '../models/Produce.js';

const router = express.Router();

// Get all sales for a branch
router.get('/', auth, async (req, res) => {
  try {
    const sales = await Sale.find({ branch: req.user.branch })
      .populate('produce')
      .populate('salesAgent', 'name');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Record new sale
router.post('/', [
  auth,
  body('produce').isMongoId(),
  body('tonnage').isInt({ min: 1 }),
  body('amountPaid').isInt({ min: 10000 }),
  body('buyer.name').isLength({ min: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { produce: produceId, tonnage } = req.body;

    // Check produce availability
    const produce = await Produce.findById(produceId);
    if (!produce) {
      return res.status(404).json({ message: 'Produce not found' });
    }

    if (produce.tonnage < tonnage) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const sale = new Sale({
      ...req.body,
      branch: req.user.branch,
      salesAgent: req.user._id
    });

    // Update produce stock
    produce.tonnage -= tonnage;
    await produce.save();
    
    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;