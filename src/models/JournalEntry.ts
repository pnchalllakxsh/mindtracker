import mongoose from 'mongoose';

const JournalEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  prompt: { type: String },
  sentiment: { type: Number },
  tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.JournalEntry || mongoose.model('JournalEntry', JournalEntrySchema);
