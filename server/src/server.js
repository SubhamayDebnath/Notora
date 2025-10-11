import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { limit } from "./constants.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json({ limit: limit }));
app.use(express.urlencoded({ limit: limit, extended: true }));
app.use(morgan("dev"));
app.use(errorMiddleware);

export default app;
