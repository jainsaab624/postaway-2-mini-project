import ApplicationError from "../../errorHandler/application.error.js";
import otpRepository from "./otp.repository.js";
import UserRepository from "../user/user.repository.js";
import { userModel } from "../user/user.repository.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

export default class otpController {
  constructor() {
    this.otpRepository = new otpRepository();
    this.UserRepository = new UserRepository();
  }

  async sendOtp(req, res) {
    try {
      const userEmail = req.body.email;
      const result = await this.otpRepository.sendOtp(userEmail);
      if (!result) {
        return res.status(404).json({
          success: false,
          msg: "otp not found or otp got expired",
        });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "codingninjas2k16@gmail.com",
          pass: "slwvvlczduktvhdj",
        },
      });

      const mailOptions = {
        from: "codingninjas2k16@gmail.com",
        to: userEmail,
        subject: "Your OTP",
        text: `Your OTP is: ${result.otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(info.response);
        }
      });

      return res.status(200).json({
        success: true,
        msg: "otp has been sended successfully",
      });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("failed to send the otp", 500);
    }
  }

  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;
      const result = await this.otpRepository.verifyOtp(email, otp);
      if (!result) {
        return res.status(404).json({
          success: false,
          msg: "otp not found or otp got expired",
        });
      }
      return res.status(200).json({
        success: true,
        msg: "otp has been verified successfully",
      });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("failed to verify the otp", 500);
    }
  }

  async resetPassword(req, res) {
    try {
      const { email, newPassword, otp } = req.body;

      const otpRecord = await this.otpRepository.verifyOtp(email, otp);
      if (!otpRecord) {
        return res.status(404).json({
          success: false,
          msg: "otp is not found or otp got expired",
        });
      }

      const user = await userModel.findOne({ email: email });
      if (!user) {
        return res.status(404).json({
          success: false,
          msg: "User not found",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      const updatedPassword = await this.UserRepository.resetPassword(
        email,
        hashedPassword
      );

      if (!updatedPassword) {
        return res
          .status(500)
          .json({ success: false, message: "Failed to update password" });
      }

      await this.otpRepository.deleteOtp(otpRecord._id);
      return res.status(200).json({
        success: true,
        msg: "Password reset successfully",
      });
    } catch (error) {
      console.log(error);
      throw new ApplicationError("failed to verify the otp", 500);
    }
  }
}
