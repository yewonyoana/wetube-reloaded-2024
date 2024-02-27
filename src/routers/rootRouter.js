// every file in javascript is a module, which is isolated
// importing from package
import express from "express";
// importing each function into an object from controller file (path) with the exact name
import {
	getJoin,
	postJoin,
	getLogin,
	postLogin,
} from "../controllers/userController";
import { home, search } from "../controllers/videoController";
import { publicOnlyMiddleware } from "../middleware";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter
	.route("/login")
	.all(publicOnlyMiddleware)
	.get(getLogin)
	.post(postLogin);
rootRouter.get("/search", search);

// default export one variable (rootRouter) to the main server javascript file
// a file can only have 1 default export, so can import with any name
export default rootRouter;
