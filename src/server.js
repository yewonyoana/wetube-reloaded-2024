// server only for servers

// using express
import express from "express";
import morgan from "morgan";
// importing default export
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

// create express app
const app = express();
const logger = morgan("dev");

// setting "pug" as the view engine
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
// makes express application understand and transform html form values into javascript that can be used later
app.use(express.urlencoded({ extended: true }));
// allows to make global middlewares that can be used anywhere
// order: app.use -> app.get
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

// middleware = software in the middle between request and response
// middleware are handlers/controllers and vice-versa

// routers = allows to organize controllers and urls in an easier way (make mini-application)

export default app;
