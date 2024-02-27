import express from "express";
import {
	getEdit,
	postEdit,
	logout,
	see,
	startGitHubLogin,
	finishGitHubLogin,
	getChangePassword,
	postChangePassword,
} from "../controllers/userController";
import {
	protectorMiddleware,
	publicOnlyMiddleware,
	avatarUpload,
} from "../middleware";

const userRouter = express.Router();

// since routers with a common beginning are used, the url will automatically be "users/edit"
userRouter.get("/logout", protectorMiddleware, logout);
userRouter
	.route("/edit")
	.all(protectorMiddleware)
	.get(getEdit)
	// multer will get the "avatar" file, save it in uploads folder, then give that info to postEdit function
	.post(avatarUpload.single("avatar"), postEdit);
userRouter
	.route("/change-password")
	.all(protectorMiddleware)
	.get(getChangePassword)
	.post(postChangePassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGitHubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGitHubLogin);
userRouter.get("/:id", see);

export default userRouter;
