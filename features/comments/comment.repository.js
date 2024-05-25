import mongoose from "mongoose";
import { commentSchema } from "./comment.schema.js";
import { postModel } from "../post/post.repository.js";
import ApplicationError from "../../errorHandler/application.error.js";

const commentModel = mongoose.model("Comment", commentSchema);

export default class commentRepository {
  async addComment(userId, postId, comment) {
    try {
      const newComment = new commentModel({
        userId: userId,
        postId: postId,
        comment: comment,
      });
      const post = await postModel.findByIdAndUpdate(
        postId,
        {
          $push: { postComments: newComment._id },
        },
        { new: true }
      );
      if (!post) {
        return "post not found";
      }

      await post.save();
      const savedComment = await newComment.save();

      return savedComment;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getPostComment(postId) {
    try {
      const postComment = await commentModel.find({ postId: postId }).populate({
        path: 'userId',
        select: '_id name email',
      });
      if (!postComment) {
        return "comments not found on the post";
      }

      return postComment;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async updateComment(commentId, userId, newComment) {
    try {
      const comment = await commentModel.findById(commentId).populate("postId");
      if (!comment) {
        return "comment not found";
      }

      if (
        !comment.userId.equals(userId) &&
        !comment.postId.userId.equals(userId)
      ) {
        return "User is not authorized to update the comment";
      }

      const updatedComment = await commentModel.findByIdAndUpdate(
        commentId,
        { comment: newComment },
        { new: true }
      );

      if (!updatedComment) {
        return "comment not found";
      }

      return updatedComment;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async deleteComment(commentId, userId) {
    try {
      const comment = await commentModel.findById(commentId).populate("postId");
      if (!comment) {
        return "comment not found";
      }

      if (
        !comment.userId.equals(userId) &&
        !comment.postId.userId.equals(userId)
      ) {
        return "User is not authorized to delete the comment";
      }

      const deletedComment = await commentModel.findByIdAndDelete(commentId);

      if (!deletedComment) {
        return "comment not found";
      }

      // Remove the comment reference from the post's comments array
      await postModel.findByIdAndUpdate(comment.postId, {
        $pull: { postComments: commentId },
      });

      return deletedComment;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
