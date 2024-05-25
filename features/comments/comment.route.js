import express from "express";
import commentController from "./comment.controller.js";

const CommentController = new commentController();
export const commentRouter = express.Router();

// url to create the new comment
commentRouter.post("/:postId", (req, res) => {
  CommentController.addComment(req, res);
});

// url to get all the comments on the post
commentRouter.get("/:postId", (req, res) => {
  CommentController.getPostComment(req, res);
});

// url to update the comment
commentRouter.put("/:commentId", (req, res) => {
  CommentController.updateComment(req, res);
});

//   url to delete the comment
commentRouter.delete("/:commentId", (req, res) => {
  CommentController.deleteComment(req, res);
});
