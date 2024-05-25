import mongoose from "mongoose";
import ApplicationError from "../../errorHandler/application.error.js";
import { friendShipSchema } from "./friends.schema.js";

const friendshipModel = mongoose.model("Friendship", friendShipSchema);

export default class friendshipRepository {
  async toggleFriendship(userId, friendId) {
    try {
      // Find and delete existing accepted friendship
      const existingFriendship = await friendshipModel.findOneAndDelete({
        $or: [
          { userId: userId, friendId: friendId, status: "accepted" },
          { friendId: friendId, userId: userId, status: "accepted" },
        ],
      });

      if (existingFriendship) {
        return "Friendship has been removed";
      } else {
        // Check for any pending or rejected requests
        const pendingOrRejectedFriendship = await friendshipModel.findOne({
          $or: [
            { userId: userId, friendId: friendId },
            { friendId: friendId, userId: userId },
          ],
          status: { $in: ["pending", "rejected"] },
        });

        if (pendingOrRejectedFriendship) {
          return "A friendship request is already pending or has been rejected";
        }

        // Create new friendship request
        const newFriendship = new friendshipModel({
          userId: userId,
          friendId: friendId,
        });
        await newFriendship.save();
        console.log(newFriendship);
        return "Friend request sent";
      }
    } catch (error) {
      console.error(error);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  async responseToFriendRequest(userId, friendId, status) {
    try {
      const friendship = await friendshipModel.findOne({
        userId: userId,
        friendId: friendId,
        status: "pending",
      });

      console.log(friendship);

      if (!friendship) {
        return {
          success: false,
          message: "Friend request not found or already accepted or rejected",
        };
      }

      if (status === "accept") {
        friendship.status = "accepted";
        await friendship.save();
        return {
          success: true,
          message: "Friend request accepted successfully",
        };
      } else if (status === "reject") {
        await friendshipModel.findOneAndDelete({ _id: friendship._id });
        return {
          success: true,
          message: "Friend request rejected and deleted successfully",
        };
      } else {
        return {
          success: false,
          message: "invalid status",
        };
      }
    } catch (error) {
      console.error(error);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  async getPendingRequest(userId) {
    try {
      const pendingRequests = await friendshipModel
        .find({
          userId: userId,
          status: "pending",
        })
       

      if (!pendingRequests) {
        return "no pending request found for this user";
      }

      return pendingRequests;
    } catch (error) {
      console.error(error);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  async userFriends(userId) {
    try {
      const friendships = await friendshipModel
        .find({
            $or: [
              { userId: userId, status: 'accepted' },
              { friendId: userId, status: 'accepted' },
            ],
          })
       
      if (friendships.length > 0) {
        return friendships;
      } else {
        return "Friends not found";
      }
    } catch (error) {
      console.error(error);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }
}
