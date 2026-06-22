import mongoose from 'mongoose';

const laboratorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    description: { type: String, trim: true },
    capacity: { type: Number, default: 0, min: 0 },
    resources: { type: [String], default: [] },
    status: { type: String, enum: ['active', 'maintenance', 'inactive'], default: 'active' },
  },
  {
    timestamps: true,
  }
);

const Laboratory = mongoose.model('Laboratory', laboratorySchema);
export default Laboratory;
