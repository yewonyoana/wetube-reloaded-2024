import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comments";

// configure app
// req, res: send request to browser -> must return a response
// next: moving onto the next function, every middleware must have it
// exporting each and every function
// "home" => name of file, variable "pageTitle" => sent to pug from this very controller
export const home = async (req, res) => {
	const videos = await Video.find({})
		.sort({ createdAt: "desc" })
		.populate("owner");
	return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
	// same as const id = req.params.id;
	const { id } = req.params;
	// populate = fills and changes the owner id with owner's data
	const video = await Video.findById(id).populate("owner").populate("comments");
	// checking for errors
	if (!video) {
		return res.status(404).render("404", { pageTitle: "Video Not Found" });
	}
	return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
	const { id } = req.params;
	const {
		user: { _id },
	} = req.session;
	/// findById is needed to send the video object to edit template
	const video = await Video.findById(id);
	if (!video) {
		return res.status(404).render("404", { pageTitle: "Video Not Found" });
	}
	if (String(video.owner) !== String(_id)) {
		req.flash("error", "Not Authorized");
		return res.status(403).redirect("/");
	}
	return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
	const { id } = req.params;
	const {
		user: { _id },
	} = req.session;
	const { title, description, hashtags } = req.body;
	// "video" object found in database
	// checking if _id is same as id = true/false
	const video = await Video.exists({ _id: id });
	if (!video) {
		return res.render("404", { pageTitle: "Video Not Found" });
	}
	if (String(video.owner) !== String(_id)) {
		return res.status(403).redirect("/");
	}
	// "Video" is model from Video.js
	await Video.findByIdAndUpdate(id, {
		title,
		description,
		hashtags: Video.formatHashtags(hashtags),
	});
	req.flash("success", "Changes Saved");
	return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
	return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
	const {
		user: { _id },
	} = req.session;
	const { video, thumb } = req.files;
	const { title, description, hashtags } = req.body;
	try {
		const newVideo = await Video.create({
			title,
			description,
			fileUrl: video[0].location,
			thumbUrl: thumb[0].location,
			owner: _id,
			hashtags: Video.formatHashtags(hashtags),
		});
		const user = await User.findById(_id);
		user.videos.push(newVideo._id);
		user.save();
		return res.redirect("/");
	} catch (error) {
		console.log(error);
		return res.status(400).render("upload", {
			pageTitle: "Upload Video",
			errorMessage: error._message,
		});
	}
};

export const deleteVideo = async (req, res) => {
	const {
		user: { _id },
	} = req.session;
	const { id } = req.params;
	const video = await Video.findById(id);
	if (!video) {
		return res.status(404).render("404", { pageTitle: "Video Not Found" });
	}
	if (String(video.owner) !== String(_id)) {
		return res.status(403).redirect("/");
	}
	await Video.findByIdAndDelete(id);
	return res.redirect("/");
};

export const search = async (req, res) => {
	const { keyword } = req.query;
	let videos = [];
	if (keyword) {
		// search for video
		videos = await Video.find({
			title: {
				$regex: new RegExp(keyword, "i"),
			},
		}).populate("owner");
	}
	return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
	const { id } = req.params;
	const video = await Video.findById(id);
	if (!video) {
		return res.sendStatus(404);
	}
	video.meta.views = video.meta.views + 1;
	await video.save();
	return res.sendStatus(200);
};

export const createComment = async (req, res) => {
	const {
		session: { user },
		body: { text },
		params: { id },
	} = req;

	const video = await Video.findById(id);

	if (!video) {
		return res.sendStatus(404);
	}

	const userObject = await User.findById(user._id);

	const comment = await Comment.create({
		text,
		owner: user._id,
		ownerName: userObject.username,
		video: id,
	});

	video.comments.push(comment._id);
	video.save();
	return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
	const {
		session: { user },
		body: { commentId },
		params: { id },
	} = req;

	const video = await Video.findById(id);

	if (!video) {
		return res.sendStatus(404);
	}

	video.comments = video.comments.filter((id) => id !== commentId);
	video.save();

	await Comment.findByIdAndDelete(commentId);

	return res.sendStatus(200);
};
