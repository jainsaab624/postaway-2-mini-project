import dotenv from "dotenv";
dotenv.config();
import express from "express";
import swagger from "swagger-ui-express";
import apiDocs from "./swagger.json" assert { type: "json" };
import loggerMiddleware from "./middleware/logger.middleware.js";
import { auth } from "./middleware/jwt.middleware.js";
import { userRouter } from "./features/user/user.route.js";
import { postRouter } from "./features/post/post.route.js";
import { commentRouter } from "./features/comments/comment.route.js";
import { likeRouter } from "./features/like/like.route.js";
import { friendRouter } from "./features/friendship/friends.route.js";
import { otpRouter } from "./features/otp/otp.route.js";
import ApplicationError from "./errorHandler/application.error.js";
import cookieParser from "cookie-parser";
import { connectToDb } from "./config/mongooseConfig.js";
const app = express();

// save the token in cookie
app.use(cookieParser());

app.use(express.static("public"));
//THIS IS THE BODY PARSER MIDDLEWARE
app.use(express.json());

//THIS MIDDLEWARE LOGS EVERY REQUEST URL AND REQUEST BODY IN [log.txt] FILE
app.use(loggerMiddleware);

//THIS MIDDLEWARE IS FOR API DOCUMENTATION
app.use("/api/docs", swagger.serve, swagger.setup(apiDocs));

//THIS MIDDLEWARE REDIRECTS EVERY REQUEST TO THE [postRouter] WHICH CORRESPONDS TO POSTS
app.use("/api/posts", auth, postRouter);

//THIS MIDDLEWARE REDIRECTS EVERY REQUEST TO THE [friendRouter] WHICH CORRESPONDS TO friend
app.use("/api/friends", auth, friendRouter);

//THIS MIDDLEWARE REDIRECTS EVERY REQUEST TO THE [friendRouter] WHICH CORRESPONDS TO friend
app.use("/api/otp", otpRouter);

//THIS MIDDLEWARE REDIRECTS EVERY REQUEST TO THE [userRouter] WHICH CORRESPONDS TO USER
app.use("/api/users", userRouter);

//THIS MIDDLEWARE REDIRECTS EVERY REQUEST TO THE [commentRouter] WHICH CORRESPONDS TO COMMENTS
app.use("/api/comments", auth, commentRouter);

//THIS MIDDLEWARE REDIRECTS EVERY REQUEST TO THE [likeRouter] WHICH CORRESPONDS TO LIKES
app.use("/api/likes", auth, likeRouter);

//TESTING ROUTE
app.get("/", (req, res) => {
  return res.send("The app is working.");
});

//HANDLING WRONG APIs
app.use((req, res) => {
  return res
    .status(404)
    .send("API NOT FOUND, Please Check The API And Try Again.");
});

//HANDLING APPLICATION LEVEL ERRORS LIKE SYNTAX ERROR AND OTHERS.
app.use((err, req, res, next) => {
  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).send(err.message);
  }
  //IF ERROR IS NOT DEFINED THE USER WILL GET THIS RESPONSE.
  return res.status(500).send("Something Went Wrong Please Try Again Later.");
});

app.listen(8000, async () => {
  console.log("The app is listening on port number 8000.");
  await connectToDb();
});
