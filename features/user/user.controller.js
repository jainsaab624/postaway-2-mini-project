import userRepository from "./user.repository.js";
import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt"
import ApplicationError from "../../errorHandler/application.error.js";
// import { loggedInUser } from "../../middleware/jwt.middleware.js";

export default class userController {
  constructor() {
    this.userRepository = new userRepository();
  }

  async signUp(req, res) {
    try {
      console.log(req.body);
      const newUser = await this.userRepository.signUp(req.body);
      if (newUser == "email already exist") {
        return res.status(409).json({
          success: true,
          msg: "User already exists",
          newUser,
        });
      } else {
        return res.status(201).json({
          success: true,
          msg: "User registered successful",
          newUser,
        });
      }
    } catch (error) {
      // Handle errors
      console.log(error);
      throw new ApplicationError("user signup failed", 500);
    }
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;
      const validUser = await this.userRepository.confirmUser(email, password);

      if (
        validUser == "user not found" ||
        validUser == "password is incorrect"
      ) {
        return res.status(404).json({
          success: false,
          msg: "Wrong Credentials",
        });
      } else {
        const token = jwt.sign(
          {
            _id: validUser._id,
            email: validUser.email,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        validUser.tokens.push(token);
        await validUser.save();

        res.cookie("jwtToken", token, {
          maxAge: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
          httpOnly: true, // Cookie accessible only via HTTP(S)
          // Other options can be added here (secure, sameSite, etc.)
        });

        return res
          .status(200)
          .json({ success: true, msg: "User login successful", token });
      }
    } catch (error) {
      console.log(error);
      throw new ApplicationError("user login failed", 500);
    }
  }

  async logout(req, res) {
    const { jwtToken } = req.cookies;
    const id = req._id;

    try {
      const user = await this.userRepository.logout(id, jwtToken);
      if (user == "user not found") {
        return res.status(404).json({
          success: false,
          msg: "user not found to logout",
        });
      }

      res
        .status(200)
        .clearCookie("jwtToken")
        .json({ success: true, msg: "logout successfully" });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("logout failed", 500);
    }
  }

  async userlogoutAll(req, res) {
    const id = req._id;

    try {
      const user = await this.userRepository.userlogoutAll(id);
      if (user == "user not found") {
        return res.status(404).json({
          success: false,
          msg: "user not found to logout",
        });
      }

      res
        .status(200)
        .clearCookie("jwtToken")
        .json({ success: true, msg: "logout from all devices successfull" });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("user logout All failed", 500);
    }
  }

  async getDetails(req, res) {
    const userId = req.params.userId;
    try {
      const userdetails = await this.userRepository.getUserDetails(userId);
      if (!userdetails) {
        return res.status(404).json({
          success: false,
          msg: "user not found",
        });
      } else {
        return res.status(200).json({ success: true, userdetails });
      }
    } catch (error) {
      console.log(error);
      throw new ApplicationError("failed to retrive the details", 500);
    }
  }

  async getAllDetails(req, res) {
    try {
      const allUsersDetails = await this.userRepository.getAllUsersDetails();
      if (!allUsersDetails) {
        return res.status(404).json({
          success: false,
          msg: "user not found",
        });
      } else {
        return res.status(200).json({ success: true, allUsersDetails });
      }
    } catch (err) {
      console.log(error);
      throw new ApplicationError("failed to retrive the details", 500);
    }
  }

  async updateDetails(req, res) {
    const userId = req.params.userId;
    const { name, email, gender } = req.body;
    const userDetails = { name, email, gender };
    try {
      const updatedDetails = await this.userRepository.updateUserdetails(
        userId,
        userDetails
      );

      if (!updatedDetails) {
        return res.status(404).json({
          success: false,
          msg: "user not found",
        });
      } else {
        return res.status(200).json({ success: true, updatedDetails });
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("failed to update the details", 500);
    }
  }
}
