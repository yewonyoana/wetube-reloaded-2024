// every file in javascript is a module, which is isolated
// importing from package
import express from "express";
// importing each function into an object from controller file (path) with the exact name
import { join, login } from "../controllers/userController";
import { home, search } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

// default export one variable (globalRouter) to the main server javascript file
// a file can only have 1 default export, so can import with any name
export default globalRouter;
