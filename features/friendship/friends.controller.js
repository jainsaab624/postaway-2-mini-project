import friendshipRepository from "./friends.repository.js";
import ApplicationError from "../../errorHandler/application.error.js";

export default class friendshipController {
  constructor() {
    this.friendshipRepository = new friendshipRepository();
  }

  async toggleFriendship(req, res) {
    const friendId = req.params.friendId;
    const userId = req._id;

    if (friendId === userId) {
      return res.status(400).json({
        success: false,
        msg: "you cannot send yourself a friend request",
      });
    }

    try {
      console.log(friendId);
      console.log(userId);
      const result = await this.friendshipRepository.toggleFriendship(
        userId,
        friendId
      );

      if (result == "Friendship has been removed") {
        return res.status(200).json({
          success: true,
          msg: "friend has been removed",
        });
      } else if (
        result == "A friendship request is already pending or has been rejected"
      ) {
        return res.status(200).json({
          success: true,
          msg: "your friend request is already pending or has been rejected",
        });
      } else {
        return res.status(200).json({
          success: true,
          msg: "friend request has been send successfully",
        });
      }
    } catch (error) {
      console.log(error);
      throw new ApplicationError("failed to toggle the friendship", 500);
    }
  }

  async responseToFriendRequest(req, res) {
    try {
      const friendId = req.params.friendId;
      const status = req.query.status;
      const userId = req._id;
      const resp = await this.friendshipRepository.responseToFriendRequest(
        userId,
        friendId,
        status
      );
      if (resp.success == false) {
        return res.status(404).json({ success: false, msg: resp.message });
      } else if (resp.success == true) {
        return res.status(200).json({ success: true, msg: resp.message });
      }
    } catch (error) {
      console.log(error);
      throw new ApplicationError("failed to respond the friendrequest", 500);
    }
  }

  async getPendingRequest(req, res) {
    try {
      const userId = req._id;
      const pendingRequests = await this.friendshipRepository.getPendingRequest(
        userId
      );
      if (pendingRequests.length == 0) {
        return res
          .status(404)
          .json({ success: false, msg: "No pending request" });
      }

      return res
        .status(200)
        .json({ success: true, pendingRequests: pendingRequests });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("failed to get the pending requests", 500);
    }
  }

  async userFriends(req, res) {
    try {
      const userId = req.params.userId;
      const result = await this.friendshipRepository.userFriends(userId);

      if (result.length == 0) {
        return res
          .status(404)
          .json({ success: false, msg: "No friends found" });
      }

      return res.status(200).json({ success: true, friends: result });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("failed to get the pending requests", 500);
    }
  }
}
