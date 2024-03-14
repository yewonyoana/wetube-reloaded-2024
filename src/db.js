import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
	// useNewUrlParser: true,
	// useUnifiedTopology: true,
	// useFindAndModify: false,
	// useCreateIndex: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("DB Error", error);

// show error when there is database error, happen all the time with "on"
db.on("error", handleError);
// happen only "once" when database is connected
db.once("open", handleOpen);
