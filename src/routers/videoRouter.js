import express from "express";
import {
	watch,
	getEdit,
	postEdit,
	getUpload,
	postUpload,
	deleteVideo,
} from "../controllers/videoController";
import { protectorMiddleware } from "../middleware";

const videoRouter = express.Router();

// parameter (:value) allows url with variables inside
// will only get video id with digits with regular expression ([0-9a-f]{24})
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
	.route("/:id([0-9a-f]{24})/edit")
	.all(protectorMiddleware)
	.get(getEdit)
	.post(postEdit);
videoRouter
	.route("/:id([0-9a-f]{24})/delete")
	.all(protectorMiddleware)
	.get(deleteVideo);
videoRouter
	.route("/upload")
	.all(protectorMiddleware)
	.get(getUpload)
	.post(postUpload);

export default videoRouter;
