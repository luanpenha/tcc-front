import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, default: 0, min: 0 },
    unit: { type: String, required: true, trim: true },
    minimumQuantity: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

const Material = mongoose.model('Material', materialSchema);
export default Material;
