import express from "express";
import postController from "./post.controller.js";
import { upload } from "../../middleware/fileupload.middleware.js";

const PostController = new postController();
export const postRouter = express.Router();

// url to create the new post
postRouter.post("/", upload.single("imageUrl"), (req, res) => {
  PostController.createPost(req, res);
});

// url to get the specific post by post id
postRouter.get("/:postId", (req, res) => {
  PostController.getOnePost(req, res);
});

// url to get the specific user post
postRouter.get("/", (req, res) => {
  PostController.getUserPost(req, res);
});

// url to update the post
postRouter.put("/:postId", upload.single("imageUrl"), (req, res) => {
  PostController.updatePost(req, res);
});

// url to delete the post
postRouter.delete("/:postId", (req, res) => {
  PostController.deletePost(req, res);
});

// url to get all  users post
postRouter.get("/all/allposts", (req, res) => {
  PostController.getAllPost(req, res);
});
