import express from "express";
import {
	getEdit,
	postEdit,
	logout,
	see,
	startGitHubLogin,
	finishGitHubLogin,
} from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middleware";

const userRouter = express.Router();

// since routers with a common beginning are used, the url will automatically be "users/edit"
userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get("/github/start", publicOnlyMiddleware, startGitHubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGitHubLogin);
userRouter.get(":id", see);

export default userRouter;
