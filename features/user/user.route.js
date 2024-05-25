import express from "express";
import userController from "./user.controller.js";
import { auth } from "../../middleware/jwt.middleware.js";


const UserController = new userController();
export const userRouter = express.Router();


userRouter.post('/signup', (req, res)=>{
    UserController.signUp(req, res)
});
userRouter.post('/signin', (req, res)=>{
    UserController.signIn(req, res)
});
userRouter.get('/logout', auth, (req, res)=>{
    UserController.logout(req, res)
});
userRouter.get('/logout-all-devices', auth, (req, res)=>{
    UserController.userlogoutAll(req, res)
});
userRouter.get('/get-details/:userId', auth, (req, res)=>{
    UserController.getDetails(req, res)
});
userRouter.get('/get-all-details', auth, (req, res)=>{
    UserController.getAllDetails(req, res)
});
userRouter.put('/update-details/:userId', auth, (req, res)=>{
    UserController.updateDetails(req, res)
});
