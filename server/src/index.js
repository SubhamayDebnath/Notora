import { config } from "dotenv";
config({ path: ".env" });
import app from "./server.js";
import databaseConnection from "./database/database.js";

// connect to database and start server
databaseConnection()
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`);
		});
	})
	.catch((error) => {
		console.log("Failed to connect database. Error : ", error.message || "");
	});
