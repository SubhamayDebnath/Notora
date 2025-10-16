import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { limit } from "./constants.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import { CORS_ORIGIN } from "./config/config.js";
const app = express();
app.use(
	cors({
		origin: CORS_ORIGIN,
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json({ limit: limit }));
app.use(express.urlencoded({ limit: limit, extended: true }));
app.use(morgan("dev"));
// import routes
import authenticationRoute from "./routes/authentication.route.js";
import colorRoute from "./routes/color.routes.js";
// use routes
app.use("/api/v1/auth", authenticationRoute);
app.use("/api/v1/color", colorRoute);
// not found
app.use((req, res, next) => {
	return res.status(404).json({ message: "Not Found" });
});
app.use(errorMiddleware);

export default app;
