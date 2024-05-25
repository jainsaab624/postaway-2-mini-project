import mongoose from "mongoose";

export const friendShipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user id is required"],
  },
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "friend id is required"],
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});
