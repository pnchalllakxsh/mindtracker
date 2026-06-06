import mongoose from 'mongoose';

/**
 * User model schema.
 * Passwords are stored hashed — never in plaintext.
 * Email is indexed for fast lookups and stored in lowercase.
 */
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
  },
  { timestamps: true }
);

// Index for fast email lookups during login
UserSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);
