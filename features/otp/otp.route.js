import express from "express";
import otpController from "./otp.controller.js";

const OtpController = new otpController();
export const otpRouter = express.Router();

// url to send the otp
otpRouter.post("/send",  (req, res) => {
    OtpController.sendOtp(req, res);
});

// url to verify the otp
otpRouter.post("/verify",  (req, res) => {
    OtpController.verifyOtp(req, res);
});

// url to verify the otp
otpRouter.post("/reset-password",  (req, res) => {
    OtpController.resetPassword(req, res);
});

