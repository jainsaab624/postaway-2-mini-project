import mongoose from "mongoose";

export const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    // Validate email format using a regular expression
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },

  otp: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // TTL (Time-To-Live) set to 5 minutes (300 seconds)
  },
});
