import commentRepository from "./comment.repository.js";
import ApplicationError from "../../errorHandler/application.error.js";

export default class commentController {
  constructor() {
    this.commentRepository = new commentRepository();
  }

  async addComment(req, res) {
    try {
      const userId = req._id;
      const postId = req.params.postId;
      const { comment } = req.body;

      const newComment = await this.commentRepository.addComment(
        userId,
        postId,
        comment
      );

      if (newComment == "post not found") {
        return res.status(404).json({
          success: false,
          msg: "sorry cant find the post to add the comment",
        });
      }
      return res.status(200).json({
        success: true,
        comment: newComment,
      });
    } catch (error) {
      throw new ApplicationError("adding a comments failed", 500);
    }
  }

  async getPostComment(req, res) {
    try {
      const postId = req.params.postId;
      const postComment = await this.commentRepository.getPostComment(postId);

      if (postComment.length == 0) {
        return res.status(404).json({
          success: false,
          msg: "sorry cant find any of the comments on this post",
        });
      }
      return res.status(200).json({
        success: true,
        comments: postComment,
      });
    } catch (error) {
      throw new ApplicationError("getting a comments on post failed", 500);
    }
  }

  async updateComment(req, res) {
    try {
      const commentId = req.params.commentId;
      const userId = req._id;
      const { comment } = req.body;
      const updatedComment = await this.commentRepository.updateComment(
        commentId,
        userId,
        comment
      );

      if (updatedComment == "comment not found") {
        return res.status(404).json({
          success: false,
          msg: "cant find the comment",
        });
      } else if (
        updatedComment == "User is not authorized to update the comment"
      ) {
        return res.status(401).json({
          success: false,
          msg: "unauthorized user",
        });
      }

      return res.status(200).json({
        success: true,
        comments: updatedComment,
      });
    } catch (error) {
      throw new ApplicationError("updating a comment failed", 500);
    }
  }

  async deleteComment(req, res) {
    try {
      const commentId = req.params.commentId;
      const userId = req._id;
      const deletedComment = await this.commentRepository.deleteComment(
        commentId,
        userId
      );
      if (deletedComment == "comment not found") {
        return res.status(404).json({
          success: false,
          msg: "cant find the comment",
        });
      } else if (
        deletedComment == "User is not authorized to delete the comment"
      ) {
        return res.status(401).json({
          success: false,
          msg: "unauthorized user",
        });
      }

      return res.status(200).json({
        success: true,
        comments: deletedComment,
      });
    } catch (error) {
      throw new ApplicationError("deleting a comment failed", 500);
    }
  }
}
