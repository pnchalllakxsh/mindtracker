import mongoose from 'mongoose';

/**
 * MoodEntry model schema.
 * Each entry belongs to a user and captures their emotional state at a point in time.
 * Numeric fields are validated at both the API (Zod) and DB level.
 */
const MoodEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      index: true,
    },
    mood: {
      type: Number,
      required: [true, 'Mood score is required'],
      min: [1, 'Mood must be at least 1'],
      max: [5, 'Mood cannot exceed 5'],
    },
    energy: {
      type: Number,
      required: [true, 'Energy score is required'],
      min: [1, 'Energy must be at least 1'],
      max: [5, 'Energy cannot exceed 5'],
    },
    anxiety: {
      type: Number,
      required: [true, 'Anxiety score is required'],
      min: [1, 'Anxiety must be at least 1'],
      max: [5, 'Anxiety cannot exceed 5'],
    },
    triggers: [{ type: String, maxlength: 50 }],
    note: { type: String, maxlength: 500 },
    subject: { type: String, maxlength: 100 },
    examContext: { type: String, maxlength: 50 },
  },
  { timestamps: true }
);

// Compound index for efficient per-user time-range queries (used in insights)
MoodEntrySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.MoodEntry || mongoose.model('MoodEntry', MoodEntrySchema);
