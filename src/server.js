// server only for servers

// using express
import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
// importing default export
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middleware";
import apiRouter from "./routers/apiRouter";
// create express app
const app = express();
const logger = morgan("dev");

// setting "pug" as the view engine
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use((req, res, next) => {
	res.header("Cross-Origin-Embedder-Policy", "require-corp");
	res.header("Cross-Origin-Opener-Policy", "same-origin");
	next();
});
app.use(logger);
// makes express application understand and transform html form values into javascript that can be used later
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session middleware from express-session
// anytime a browser interacts with backend, it sends the backend cookie (pieces of info that the backend can give to browser)
// remembers everyone who visits the website, even if not logged in
app.use(
	// session ID saved on cookie which will also be saved in the backend
	// each browser, including incognito, has different session ID
	session({
		// string of text used to assign cookie to check that our backend is which gave the user the cookie (cookie can be stolen)
		secret: process.env.COOKIE_SECRET,
		// only giving cookie only when session is modified (the user who loggedIn), no cookie for anonymous users
		resave: false,
		saveUninitialized: false,
		// saving mongo database to store sessions so that loggedIn users are remembered even if server is killed then restarted
		store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
	})
);

// allows to make global middlewares that can be used anywhere
// order: app.use -> app.get

app.use(flash());
// localsMiddleware must be used after the session to access and get the info in the session middleware
app.use(localsMiddleware);
// asking assets to make users look into the designed folders
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

// middleware = software in the middle between request and response
// middleware are handlers/controllers and vice-versa

// routers = allows to organize controllers and urls in an easier way (make mini-application)

export default app;
