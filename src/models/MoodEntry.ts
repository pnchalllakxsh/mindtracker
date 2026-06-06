import mongoose from 'mongoose';

const MoodEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: Number, required: true, min: 1, max: 5 },
  energy: { type: Number, required: true, min: 1, max: 5 },
  anxiety: { type: Number, required: true, min: 1, max: 5 },
  triggers: [{ type: String }],
  note: { type: String },
  subject: { type: String },
  examContext: { type: String },
}, { timestamps: true });

export default mongoose.models.MoodEntry || mongoose.model('MoodEntry', MoodEntrySchema);
