// model for the data helps save, update, delete data
import mongoose from "mongoose";

// define shape of model = schema
const videoSchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true, maxLength: 20 },
	fileUrl: { type: String, required: true },
	thumbUrl: { type: String, required: true },
	description: { type: String, required: true, trim: true },
	createdAt: { type: Date, default: Date.now, required: true },
	hashtags: [{ type: String, required: true, trim: true }],
	meta: {
		views: { type: Number, default: 0, required: true },
	},
	owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

videoSchema.static("formatHashtags", function (hashtags) {
	return hashtags
		.split(",")
		.map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
