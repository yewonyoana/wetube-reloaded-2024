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
		return res.redirect("/login");
	}
};

// if user isn't loggedIn, continue with request or redirect to homepage
export const publicOnlyMiddleware = (req, res, next) => {
	if (!req.session.loggedIn) {
		return next();
	} else {
		return res.redirect("/");
	}
};
