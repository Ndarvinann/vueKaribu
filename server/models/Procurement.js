import mongoose from 'mongoose';

const procurementSchema = new mongoose.Schema({
  produce: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produce',
    required: true
  },
  dealer: {
    name: {
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
  tonnage: {
    type: Number,
    required: true,
    min: 1000
  },
  costPerKg: {
    type: Number,
    required: true,
    min: 100
  },
  totalCost: {
    type: Number,
    required: true,
    min: 100000
  },
  branch: {
    type: String,
    enum: ['Maganjo', 'Matugga'],
    required: true
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Procurement', procurementSchema);