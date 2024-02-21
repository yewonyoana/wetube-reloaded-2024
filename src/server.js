// server only for servers

// using express
import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
// importing default export
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middleware";

// create express app
const app = express();
const logger = morgan("dev");

// setting "pug" as the view engine
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
// makes express application understand and transform html form values into javascript that can be used later
app.use(express.urlencoded({ extended: true }));

// session middleware from express-session
// anytime a browser interacts with backend, it sends the backend cookie (pieces of info that the backend can give to browser)
// remembers everyone who visits the website, even if not logged in
app.use(
	// session ID saved on cookie which will also be saved in the backend
	// each browser, including incognito, has different session ID
	session({
		secret: "hello",
		resave: true,
		saveUninitialized: true,
		// saving mongo database to store sessions so that loggedIn users are remembered even if server is killed then restarted
		store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/wetube" }),
	})
);

// allows to make global middlewares that can be used anywhere
// order: app.use -> app.get

// localsMiddleware must be used after the session to access and get the info in the session middleware
app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

// middleware = software in the middle between request and response
// middleware are handlers/controllers and vice-versa

// routers = allows to organize controllers and urls in an easier way (make mini-application)

export default app;
