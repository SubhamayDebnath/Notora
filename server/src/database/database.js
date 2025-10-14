import { mongoose } from "mongoose";
import { MONGODB_URI } from "../config/config.js";
// Database connection
const databaseConnection = async () => {
	try {
		const { connection } = await mongoose.connect(MONGODB_URI);
		console.log("Database connected successfully with : ", connection.host);
	} catch (error) {
		console.error(`Database connection error: ${error}`);
		process.exit(1);
	}
};

export default databaseConnection;
