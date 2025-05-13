import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';
import CreditSale from '../models/CreditSale.js';
import Produce from '../models/Produce.js';

const router = express.Router();

// Get all credit sales for a branch
router.get('/', auth, async (req, res) => {
  try {
    const creditSales = await CreditSale.find({ branch: req.user.branch })
      .populate('produce')
      .populate('salesAgent', 'name');
    res.json(creditSales);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Record new credit sale
router.post('/', [
  auth,
  body('buyer.name').isLength({ min: 2 }),
  body('buyer.nationalId').matches(/^CM[A-Z0-9]{12}$/),
  body('buyer.location').isLength({ min: 2 }),
  body('buyer.contact').matches(/^[0-9]{10}$/),
  body('produce').isMongoId(),
  body('tonnage').isInt({ min: 1 }),
  body('amountDue').isInt({ min: 10000 }),
  body('dueDate').isISO8601()
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

    const creditSale = new CreditSale({
      ...req.body,
      branch: req.user.branch,
      salesAgent: req.user._id
    });

    // Update produce stock
    produce.tonnage -= tonnage;
    await produce.save();
    
    await creditSale.save();
    res.status(201).json(creditSale);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Record payment for credit sale
router.post('/:id/payment', [
  auth,
  body('amount').isInt({ min: 1 })
], async (req, res) => {
  try {
    const creditSale = await CreditSale.findOne({
      _id: req.params.id,
      branch: req.user.branch
    });

    if (!creditSale) {
      return res.status(404).json({ message: 'Credit sale not found' });
    }

    const { amount } = req.body;
    const totalPaid = creditSale.payments.reduce((sum, payment) => sum + payment.amount, 0) + amount;

    creditSale.payments.push({
      amount,
      date: new Date()
    });

    creditSale.status = totalPaid >= creditSale.amountDue ? 'paid' : 'partial';
    
    await creditSale.save();
    res.json(creditSale);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;