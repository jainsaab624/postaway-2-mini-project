import express from "express";
import friendshipController from "./friends.controller.js";

const FriendController = new friendshipController();
export const friendRouter = express.Router();

// url to toggle the friendship
friendRouter.get("/toggle-friendship/:friendId", (req, res) => {
  FriendController.toggleFriendship(req, res);
});

// url to response to friend request
friendRouter.get("/response-to-request/:friendId", (req, res) => {
  FriendController.responseToFriendRequest(req, res);
});

// url to get pending request
friendRouter.get("/get-pending-requests", (req, res) => {
  FriendController.getPendingRequest(req, res);
});

// url to get users friends
friendRouter.get("/get-friends/:userId", (req, res) => {
  FriendController.userFriends(req, res);
});
