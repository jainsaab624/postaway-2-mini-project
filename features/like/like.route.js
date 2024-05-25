import express from "express";
import likeController from "./like.controller.js";

const LikeController = new likeController();
export const likeRouter = express.Router();

// url to toggle the like
likeRouter.get("/toggle/:id",  (req, res) => {
    LikeController.toggleLike(req, res);
});

// url to get all the likes
likeRouter.get("/:id",  (req, res) => {
    LikeController.getlikes(req, res);
});