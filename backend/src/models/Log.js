import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    action: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

const Log = mongoose.model('Log', logSchema);
export default Log;
