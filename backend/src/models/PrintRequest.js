import mongoose from 'mongoose';

const printRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    filePath: { type: String, required: true },
    material: { type: String, trim: true },
    quantity: { type: Number, default: 1, min: 1 },
    observation: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'printing', 'finished', 'ready_for_pickup', 'delivered', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const PrintRequest = mongoose.model('PrintRequest', printRequestSchema);
export default PrintRequest;
