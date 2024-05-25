import mongoose from "mongoose";

export const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: [true, "caption is required"],
  },
  imageUrl: {
    type: String,
    required: [true, "image is required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postComments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
  ],
  postLikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Like",
    },
  ],
});
