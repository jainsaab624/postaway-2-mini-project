import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minLength: [3, "The name should be at least 3 characters long"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Validate email format using a regular expression
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "password is required"],

  },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  tokens: [
    {
      type: String,

    },
  ],
});
