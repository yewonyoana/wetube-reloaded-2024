import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
	credentials: {
		accessKeyId: process.env.AWS_ID,
		secretAccessKey: process.env.AWS_SECRET,
	},
});

const multerUploader = multerS3({
	s3: s3,
	bucket: "wetube-reloaded-2024",
	acl: "public-read",
});

export const localsMiddleware = (req, res, next) => {
	// logging in the user by adding info into req.session object
	//to get if user is logged in (true) or not (false)
	// locals is an object that can be accessed by the pug templates without having to import and export
	res.locals.loggedIn = Boolean(req.session.loggedIn);
	res.locals.siteName = "Wetube";
	// sharing logged in user with base.pug
	res.locals.loggedInUser = req.session.user || {};
	next();
};

// if user is loggedIn, continue the request or redirect to login
export const protectorMiddleware = (req, res, next) => {
	if (req.session.loggedIn) {
		next();
	} else {
		req.flash("error", "Not Authorized");
		return res.redirect("/login");
	}
};

// if user isn't loggedIn, continue with request or redirect to homepage
export const publicOnlyMiddleware = (req, res, next) => {
	if (!req.session.loggedIn) {
		return next();
	} else {
		req.flash("error", "Not Authorized");
		return res.redirect("/");
	}
};

// middleware to upload files from users to "uploads"
export const avatarUpload = multer({
	dest: "uploads/avatars/",
	limits: {
		fileSize: 3000000,
	},
	storage: multerUploader,
});
export const videoUpload = multer({
	dest: "uploads/videos/",
	limits: {
		fileSize: 10000000,
	},
	storage: multerUploader,
});
