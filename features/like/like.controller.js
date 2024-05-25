import ApplicationError from "../../errorHandler/application.error.js";
import likeRepository from "./like.repository.js";

export default class likeController {
  constructor() {
    this.likeRepository = new likeRepository();
  }

  async toggleLike(req, res) {
    const type = req.query.type;
    const id = req.params.id;
    const userId = req._id;
    if (type !== "Post" && type !== "Comment") {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide a valid model and id" });
    }
    try {
      if (type == "Post") {
        const result = await this.likeRepository.postlike(userId, id);
        if (result == "post is unliked successfully") {
          return res.status(200).json({
            success: true,
            msg: "post has been unliked successfully",
          });
        } else {
          return res.status(201).json({
            success: true,
            msg: "post has been liked successfully",
          });
        }
      } else {
        const result = await this.likeRepository.commentlike(userId, id);
        if (result == "comment is unliked successfully") {
          return res.status(200).json({
            success: true,
            msg: "comment has been unliked successfully",
          });
        } else {
          return res.status(201).json({
            success: true,
            msg: "comment has been liked successfully",
          });
        }
      }
    } catch (error) {
      console.log(error);
      throw new ApplicationError("failed to like the post or comment ", 500);
    }
  }

  async getlikes(req, res) {
    try {
      const { id } = req.params;
      const likes = await this.likeRepository.getlikes(id);
      if (likes.length == 0) {
        return res.status(404).json({
          success: false,
          msg: "likes not found",
        });
      }

      return res.status(200).json({
        success: true,
        likes,
      });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("failed to like the post or comment ", 500);
    }
  }
}
