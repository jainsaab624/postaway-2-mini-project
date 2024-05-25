import mongoose from "mongoose";
import { otpSchema } from "./otp.schema.js";
import ApplicationError from "../../errorHandler/application.error.js";

const otpModel = mongoose.model("Otp", otpSchema);

export default class otpRepository {
  async sendOtp(userEmail) {
    try {
      // this will 6 digit otp
      const otpGenerator = Math.floor(100000 + Math.random() * 900000);
      let otp = await otpModel.findOne({ email: userEmail });
      if (otp) {
        otp.otp = otpGenerator;
        await otp.save();
      } else {
        // Create new OTP
        otp = await otpModel.create({
          email: userEmail,
          otp: otpGenerator,
        });
      }

      return otp;
    } catch (error) {
      console.error(error);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  async verifyOtp(email, otp) {
    try {
      const verifiedOtp = await otpModel.findOne({
        email: email,
        otp: otp,
      });
      return verifiedOtp;
    } catch (error) {
      console.error(error);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  async deleteOtp(otpRecordid) {
    try {
      const deleteOtp = await otpModel.findByIdAndDelete(otpRecordid);
      if (deleteOtp) {
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }
}
