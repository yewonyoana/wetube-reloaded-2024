// init will be importers

// importing file
import "./db";
import "./models/Video";
import app from "./server";

const PORT = 4000;

// listen to external connection
const handleListening = () =>
	console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

// sever keeps listening until it is turned off
app.listen(PORT, handleListening);
