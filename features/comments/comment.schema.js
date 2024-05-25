import mongoose from "mongoose";
import moment from "moment-timezone";

export const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  comment: {
    type: String,
    required: [true, "comment is required"],
  },
  createdAt: { 
    type: Date, 
    default: () => moment().tz('Asia/Kolkata').toDate()
} 
});
