// using express
import express from "express";
import morgan from "morgan";
// importing default export
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;

// create express app
const app = express();
const logger = morgan("dev");
app.use(logger);

// allows to make global middlewares that can be used anywhere
// order: app.use -> app.get
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

// listen to external connection
const handleListening = () =>
	console.log(`Server listening on port http://localhost:${PORT} 🚀`);

// sever keeps listening until it is turned off
app.listen(PORT, handleListening);

// middleware = software in the middle between request and response
// middleware are handlers/controllers and vice-versa

// routers = allows to organize controllers and urls in an easier way (make mini-application)
