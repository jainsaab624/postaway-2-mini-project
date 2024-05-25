import ApplicationError from "../../errorHandler/application.error.js";
import postRepository from "./post.repository.js";

export default class postController {
  constructor() {
    this.postRepository = new postRepository();
  }

  async createPost(req, res) {
    try {
      const userId = req._id;
      const { caption } = req.body;
      const imageUrl = req.file.filename;
      const postData = { caption, imageUrl, userId };
      const newPost = await this.postRepository.createNewPost(postData);
      if(!newPost){
        return res.status(400).json({
          success: false,
          msg:"can't create the post",
        });
      }
      return res.status(201).json({
        success: true,
        newPost,
      });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("creating new post failed", 500);
    }
  }

  async getOnePost(req, res) {
    try {
      const postId = req.params.postId;
      const post = await this.postRepository.getOnePost(postId);
      // Check if the post exists
      if (post == "post not found") {
        return res.status(404).json({
          success: false,
          msg: "Post not found",
        });
      }
      return res.status(200).json({
        success: true,
        post,
      });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("getting one post failed", 500);
    }
  }

  async getUserPost(req, res) {
    try {
      const userId = req._id;
      const Userposts = await this.postRepository.userPost(userId);
      if (Userposts.length == 0) {
        return res.status(404).json({
          success: false,
          msg: "No post are found by this user",
        });
      }
      return res.status(200).json({
        success: true,
        Userposts,
      });
    } catch (err) {
      throw new ApplicationError("getting users post failed", 500);
    }
  }

  async getAllPost(req, res) {
    try {
     
      const allPosts = await this.postRepository.allPosts();
      if (!allPosts) {
        return res.status(404).json({
          success: false,
          msg: "Posts not found",
        });
      }

      return res.status(200).json({
        success: true,
        allPosts,
      });
    } catch (error) {
      console.log(error)
      throw new ApplicationError("getting all users post failed", 500);
    }
  }

  async updatePost(req, res) {
    try {
      const postId = req.params.postId;
      const userId = req._id;
      const { caption } = req.body;
      const imageUrl = req.file.filename;
      const postDetails = { caption, imageUrl };
      const updatedpost = await this.postRepository.updatepost(
        postDetails,
        userId,
        postId
      );
     
      if (updatedpost == "post not found") {
        return res.status(404).json({
          success: false,
          msg: "post doesnt exist",
        });
      }

      return res.status(200).json({
        success: true,
        updatedpost,
      });
    } catch (error) {
      console.log(err);
      throw new ApplicationError("updating a post failed", 500);
    }
  }

  async deletePost(req,res){
    try{
      const postId = req.params.postId;
      const userId = req._id;
      const deletedPost = await this.postRepository.deletePost(postId,userId)
      if (deletedPost == "post not found") {
        return res.status(404).json({
          success: false,
          msg: "post doesnt exist",
        });
      }

      return res.status(200).json({
        success: true,
        deletedPost,
      });
    }catch(error){
      console.log(error);
      throw new ApplicationError("deleting a post failed", 500);
    }
  }
}
