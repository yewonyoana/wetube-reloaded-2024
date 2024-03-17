import bcrypt from "bcrypt";
import fetch from "node-fetch";
import User from "../models/User";
import Video from "../models/Video";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
	const { name, username, email, password, password2, location } = req.body;
	const pageTitle = "Join";
	if (password !== password2) {
		return res.status(400).render("join", {
			pageTitle,
			errorMessage: "Password Confirmation Does Not Match",
		});
	}
	const exists = await User.exists({ $or: [{ username }, { email }] });
	if (exists) {
		return res.status(400).render("join", {
			pageTitle,
			errorMessage: "Username or Email Is Taken",
		});
	}
	try {
		await User.create({ name, username, email, password, password2, location });
		return res.redirect("/login");
	} catch (error) {
		return res.status(400).render("join", {
			pageTitle: "Join",
			errorMessage: error._message,
		});
	}
};

export const getLogin = (req, res) =>
	res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
	const { username, password } = req.body;
	const pageTitle = "Login";
	// check if username exists
	const user = await User.findOne({ username, socialOnly: false });
	if (!user) {
		return res.status(400).render("login", {
			pageTitle,
			errorMessage: "Username Does Not Exist",
		});
	}
	const ok = await bcrypt.compare(password, user.password);
	if (!ok) {
		return res
			.status(400)
			.render("login", { pageTitle, errorMessage: "Wrong Password" });
	}
	// adding information to the req.session depending on user's logged in status
	req.session.loggedIn = true;
	req.session.user = user;
	// check if password exists
	res.redirect("/");
};

export const startGitHubLogin = (req, res) => {
	const baseURL = "https://github.com/login/oauth/authorize";
	const config = {
		client_id: process.env.GH_CLIENT,
		allow_signup: false,
		scope: "read:user user:email",
	};
	const params = new URLSearchParams(config).toString();
	const finalURL = `${baseURL}?${params}`;
	return res.redirect(finalURL);
};

export const finishGitHubLogin = async (req, res) => {
	const baseURL = "https://github.com/login/oauth/access_token";
	const config = {
		client_id: process.env.GH_CLIENT,
		client_secret: process.env.GH_SECRET,
		code: req.query.code,
	};
	const params = new URLSearchParams(config).toString();
	const finalURL = `${baseURL}?${params}`;
	const tokenRequest = await (
		await fetch(finalURL, {
			method: "POST",
			headers: { Accept: "application/json" },
		})
	).json();
	if ("access_token" in tokenRequest) {
		// access api
		const { access_token } = tokenRequest;
		const apiUrl = "https://api.github.com";
		const userData = await (
			await fetch(`${apiUrl}/user`, {
				headers: { Authorization: `token ${access_token}` },
			})
		).json();
		const emailData = await (
			await fetch(`${apiUrl}/user/emails`, {
				headers: { Authorization: `token ${access_token}` },
			})
		).json();
		const emailObj = emailData.find(
			(email) => email.primary === true && email.verified === true
		);
		if (!emailObj) {
			return res.redirect("/login");
		}
		// if user has an email already registered either github/joined
		let user = await User.findOne({ email: emailObj.email });
		if (!user) {
			// create an account
			user = await User.create({
				avatarUrl: userData.avatar_url,
				name: userData.name,
				username: userData.login,
				email: emailObj.email,
				password: "",
				socialOnly: true,
				location: userData.location,
			});
		}
		req.session.loggedIn = true;
		req.session.user = user;
		return res.redirect("/");
	} else {
		return res.redirect("/login");
	}
};

export const logout = (req, res) => {
	req.flash("info", "Bye Bye!");
	req.session.destroy();
	return res.redirect("/");
};

export const getEdit = (req, res) => {
	return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
	// coming from the edit-profile and value is needed!!!
	const {
		session: {
			user: { _id, avatarUrl },
		},
		body: { name, email, username, location },
		file,
	} = req;
	const updatedUser = await User.findByIdAndUpdate(
		_id,
		{
			avatarUrl: file ? file.location : avatarUrl,
			name,
			email,
			username,
			location,
		},
		{ new: true }
	);
	req.session.user = updatedUser;
	return res.redirect("/");
};

export const getChangePassword = (req, res) => {
	if (req.session.user.socialOnly === true) {
		req.flash("error", "Unable to Change Password");
		return res.redirect("/");
	}
	return res.render("users/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
	const {
		session: {
			user: { _id },
		},
		body: { oldPassword, newPassword, newPasswordConfirmation },
	} = req;
	const user = await User.findById(_id);
	const ok = await bcrypt.compare(oldPassword, user.password);
	if (!ok) {
		return res.status(400).render("users/change-password", {
			pageTitle: "Change Password",
			errorMessage: "Current Password is Incorrect",
		});
	}
	// send notification about password change confirmation
	if (newPassword !== newPasswordConfirmation) {
		return res.status(400).render("users/change-password", {
			pageTitle: "Change Password",
			errorMessage: "Password Confirmation Does Not Match",
		});
	}
	user.password = newPassword;
	// triggers userSchema
	await user.save();
	req.flash("info", "Password Updated");
	// update session
	return res.redirect("/users/logout");
};
export const see = async (req, res) => {
	const { id } = req.params;
	const user = await User.findById(id).populate({
		path: "videos",
		populate: {
			path: "owner",
			model: "User",
		},
	});
	if (!user) {
		return res.status(404).render("404", { pageTitle: "User Not Found" });
	}
	return res.render("users/profile", {
		pageTitle: user.name,
		user,
	});
};
