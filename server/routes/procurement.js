import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth, isManager } from '../middleware/auth.js';
import Procurement from '../models/Procurement.js';
import Produce from '../models/Produce.js';

const router = express.Router();

// Get all procurements for a branch
router.get('/', auth, isManager, async (req, res) => {
  try {
    const procurements = await Procurement.find({ branch: req.user.branch })
      .populate('produce')
      .populate('recordedBy', 'name');
    res.json(procurements);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Record new procurement
router.post('/', [
  auth,
  isManager,
  body('produce').isMongoId(),
  body('dealer.name').isLength({ min: 2 }),
  body('dealer.contact').matches(/^[0-9]{10}$/),
  body('tonnage').isInt({ min: 1000 }),
  body('costPerKg').isInt({ min: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { produce: produceId, tonnage, costPerKg } = req.body;
    
    // Calculate total cost
    const totalCost = tonnage * costPerKg;

    const procurement = new Procurement({
      ...req.body,
      totalCost,
      branch: req.user.branch,
      recordedBy: req.user._id
    });

    // Update produce stock
    const produce = await Produce.findById(produceId);
    if (!produce) {
      return res.status(404).json({ message: 'Produce not found' });
    }

    produce.tonnage += tonnage;
    await produce.save();
    
    await procurement.save();
    res.status(201).json(procurement);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;