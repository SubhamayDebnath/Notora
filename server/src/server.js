import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { limit } from "./constants.js";
import logger from "./utils/logger.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import { CORS_ORIGIN } from "./config/config.js";
const app = express();

app.use(
	helmet({
		contentSecurityPolicy: false,
		crossOriginEmbedderPolicy: false,
	})
);
app.use(
	cors({
		origin: CORS_ORIGIN,
		credentials: true,
	})
);
app.use(express.json({ limit: limit }));
app.use(express.urlencoded({ limit: limit, extended: true }));
app.use(cookieParser());
app.use(
	morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } })
);
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per window
	message: "Too many requests, please try again later.",
});
app.use(limiter);
app.disable("x-powered-by");
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
