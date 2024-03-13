import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	avatarUrl: String,
	socialOnly: { type: Boolean, default: false },
	username: { type: String, required: true, unique: true },
	password: { type: String },
	name: { type: String, required: true },
	location: String,
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
	videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

// intercepting the saving event to do the following function first
userSchema.pre("save", async function () {
	// with "if" the password will be modified only when it is modified
	if (this.isModified("password")) {
		// this from User.create in userController
		this.password = await bcrypt.hash(this.password, 5);
	}
});

const User = mongoose.model("User", userSchema);

export default User;
