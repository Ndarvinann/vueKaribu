import mongoose from 'mongoose';

const produceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2
  },
  type: {
    type: String,
    required: true,
    minLength: 2,
    match: /^[A-Za-z]+$/
  },
  branch: {
    type: String,
    enum: ['Maganjo', 'Matugga'],
    required: true
  },
  tonnage: {
    type: Number,
    required: true,
    min: 1000 // Minimum 1000kg (1 tonne)
  },
  costPerKg: {
    type: Number,
    required: true,
    min: 100 // Minimum cost in UGX
  },
  sellingPricePerKg: {
    type: Number,
    required: true,
    min: 100
  }
}, { timestamps: true });

export default mongoose.model('Produce', produceSchema);