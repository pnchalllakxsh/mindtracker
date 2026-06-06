import mongoose from 'mongoose';

/**
 * JournalEntry model schema.
 * Stores free-form reflective journal entries written by the user.
 * Sentiment score is optional and populated by the AI coach analysis.
 */
const JournalEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [1, 'Content cannot be empty'],
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    prompt: { type: String, maxlength: 200 },
    sentiment: {
      type: Number,
      min: [-1, 'Sentiment must be between -1 and 1'],
      max: [1, 'Sentiment must be between -1 and 1'],
    },
    tags: [{ type: String, maxlength: 30 }],
  },
  { timestamps: true }
);

// Compound index for efficient per-user chronological listing
JournalEntrySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.JournalEntry || mongoose.model('JournalEntry', JournalEntrySchema);
