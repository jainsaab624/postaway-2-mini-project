import mongoose from "mongoose";
import { postSchema } from "./post.schema.js";
import ApplicationError from "../../errorHandler/application.error.js";

export const postModel = mongoose.model("Post", postSchema);

export default class postRepository {
  async createNewPost(postData) {
    try {
      const newPost = new postModel(postData);
      const createdPost = await newPost.save();

      return createdPost;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getOnePost(postId) {
    try {
      const post = await postModel
        .findById(postId)
        .populate({
          path: "userId",
          select: "_id name email",
        })
        .populate({
          path: "postComments",
          populate: {
            path: "userId",
            select: "_id name email",
          },
        })
        .populate({
          path: "postLikes",
          populate: {
            path: "userId",
            select: "_id name email",
          },
        });

        if(!post){
          return "post not found"
        }

      return post;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async userPost(userId) {
    try {
      const userPost = await postModel
        .find({ userId: userId })
        .populate({
          path: "userId",
          select: "_id name email",
        })
        .populate({
          path: "postComments",
          populate: {
            path: "userId",
            select: "_id name email",
          },
        })
        .populate({
          path: "postLikes",
          populate: {
            path: "userId",
            select: "_id name email",
          },
        });

        if(!userPost){
          return "posts not found"
        }
      return userPost;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async allPosts() {
    try {
      const allPosts = await postModel
        .find({})
        .populate({
          path: "userId",
          select: "_id name email",
        })
        .populate({
          path: "postComments",
          populate: {
            path: "userId",
            select: "_id name email",
          },
        })
        .populate({
          path: "postLikes",
          populate: {
            path: "userId",
            select: "_id name email",
          },
        });
      console.log(allPosts);
      return allPosts;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async updatepost(postDetails, userId, postId) {
    try {
      const post = await postModel.findOne({ _id: postId, userId: userId });
      if (post) {
        const updatedPost = await postModel.findOneAndUpdate(
          { _id: postId, userId: userId },
          {
            $set: {
              caption: postDetails.caption,
              imageUrl: postDetails.imageUrl,
            },
          },
          {
            new: true,
          }
        );

        return updatedPost;
      } else {
        return "post not found";
      }
    } catch (error) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async deletePost(postId, userId) {
    try {
      const post = await postModel.findOne({ _id: postId, userId: userId });
      if (post) {
        const deletedPost = await postModel.findOneAndDelete({
          _id: postId,
          userId: userId,
        });

        return deletedPost;
      } else {
        return "post not found";
      }
    } catch (error) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
