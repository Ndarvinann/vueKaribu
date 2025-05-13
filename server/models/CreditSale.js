import mongoose from 'mongoose';

const creditSaleSchema = new mongoose.Schema({
  buyer: {
    name: {
      type: String,
      required: true,
      minLength: 2
    },
    nationalId: {
      type: String,
      required: true,
      match: /^CM[A-Z0-9]{12}$/ // Uganda NIN format
    },
    location: {
      type: String,
      required: true,
      minLength: 2
    },
    contact: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/ // Uganda phone number format
    }
  },
  produce: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produce',
    required: true
  },
  tonnage: {
    type: Number,
    required: true,
    min: 1
  },
  amountDue: {
    type: Number,
    required: true,
    min: 10000
  },
  dueDate: {
    type: Date,
    required: true
  },
  salesAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  branch: {
    type: String,
    enum: ['Maganjo', 'Matugga'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'partial', 'paid'],
    default: 'pending'
  },
  payments: [{
    amount: Number,
    date: Date
  }]
}, { timestamps: true });

export default mongoose.model('CreditSale', creditSaleSchema);