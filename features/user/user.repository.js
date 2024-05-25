import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import bcrypt from "bcrypt";
// import { ObjectId } from "mongodb";
import ApplicationError from "../../errorHandler/application.error.js";

export const userModel = mongoose.model("User", userSchema);

export default class UserRepository {
  async signUp(userData) {
    try {
      // Check if user with the same email already exists
      const existingUser = await userModel.exists({ email: userData.email });
      if (existingUser) {
        return "email already exist";
      }

      // Hash the password before saving the user
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      userData.password = hashedPassword;

      // Create and save the new user
      const newUser = new userModel(userData);
      await newUser.save();
      return newUser;
    } catch (err) {
      // If an error occurs, throw an ApplicationError
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async confirmUser(email, password) {
    try {
      const user = await userModel.findOne({ email });

      if (!user) {
        return "user not found";
      }

      const validateUser = await bcrypt.compare(password, user.password);
      if (!validateUser) {
        return "password is incorrect";
      }

      return user;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async logout(id, token) {
    try {
      const user = await userModel.findById(id);
      if (!user) {
        return "user not found";
      }

      // Remove the provided token from the user's list of tokens
      user.tokens = user.tokens.filter((t) => t !== token);

      return await user.save();
    } catch (error) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async userlogoutAll(id) {
    try {
      const user = await userModel.findById(id);
      if (!user) {
        return "user not found";
      }

      user.tokens = [];

      return await user.save();
    } catch (error) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getUserDetails(userId) {
    try {
      const userDetails = await userModel.findById(userId, {
        password: 0,
        tokens: 0,
      });

      return userDetails;
    } catch (error) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getAllUsersDetails() {
    try {
      const allusersDetails = await userModel.find(
        {},
        { password: 0, tokens: 0 }
      );
      return allusersDetails;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async updateUserdetails(userId, userDetails) {
    try {
      const updatedUserDetails = await userModel.findByIdAndUpdate(
        userId,
        userDetails,
        { new: true, lean: true, select: "_id name email gender" }
      );
      return updatedUserDetails;
    } catch (error) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async resetPassword(email, newPassword) {
    try {
      const updatedPassword = await userModel.findOneAndUpdate(
        {
          email: email,
        },
        {
          $set: {
            password: newPassword,
          },
        },
        {
          new: true,
        }
      );
      return updatedPassword;
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
