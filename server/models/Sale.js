import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
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
  amountPaid: {
    type: Number,
    required: true,
    min: 10000
  },
  buyer: {
    name: {
      type: String,
      required: true,
      minLength: 2
    }
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
  }
}, { timestamps: true });

export default mongoose.model('Sale', saleSchema);