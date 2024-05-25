import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import ApplicationError from "../../errorHandler/application.error.js";
import { postModel } from "../post/post.repository.js";

const likeModel = mongoose.model("Like", likeSchema);

export default class likeRepository {
  async postlike(userId, id) {
    try {
      const existingLike = await likeModel.findOne({
        userId: userId,
        likeable: id,
        on_model: "Post",
      });

      if (existingLike) {
        await likeModel.deleteOne({ _id: existingLike._id });
        await postModel.findByIdAndUpdate(
          id,
          {
            $pull: {
              postLikes: existingLike._id,
            },
          },
          {
            new: true,
          }
        );
        return "post is unliked successfully";
      } else {
        const newLike = new likeModel({
          userId: userId,
          likeable: id,
          on_model: "Post",
        });
        const savedliked = await newLike.save();
        console.log(savedliked);
        const post = await postModel.findByIdAndUpdate(
          id,
          {
            $push: {
              postLikes: savedliked._id,
            },
          },
          {
            new: true,
          }
        );
        console.log(post);
        return "post is liked successfully";
      }
    } catch (error) {
      console.error(error);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  async commentlike(userId, id) {
    try {
      const existingLike = await likeModel.findOne({
        userId: userId,
        likeable: id,
        on_model: "Comment",
      });
      if (existingLike) {
        await likeModel.deleteOne({ _id: existingLike._id });
        return "comment is unliked successfully";
      } else {
        const newLike = new likeModel({
          userId: userId,
          likeable: id,
          on_model: "Comment",
        });

        await newLike.save();
        return "comment is liked successfully";
      }
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getlikes(id) {
    try {
      const likes = await likeModel
        .find({ likeable: id })
        .populate({ path: "userId", select: "_id name email" })
        .populate("likeable");
      return likes;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
