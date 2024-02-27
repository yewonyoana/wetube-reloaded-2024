// init will be importers

// importing file
// dotenv reads env file and puts variable inside the according value, required as soon as possible when server is turned on
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import app from "./server";

const PORT = 4000;

// listen to external connection
const handleListening = () =>
	console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

// sever keeps listening until it is turned off
app.listen(PORT, handleListening);
