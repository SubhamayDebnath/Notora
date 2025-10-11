import { mongoose } from "mongoose";

// Database connection
const databaseConnection = async () => {
	try {
		const { connection } = await mongoose.connect(process.env.MONGO_URI);
		console.log("Database connected successfully with : ", connection.host);
	} catch (error) {
		console.error(`Database connection error: ${error}`);
		process.exit(1);
	}
};

export default databaseConnection;
