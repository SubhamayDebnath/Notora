import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { JWT_SECRET } from "../config/config.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// verify user
export const verifyUserAccess = asyncHandler(async (req, res, next) => {
	const token =
		req.cookies?.accessToken ||
		req.header("Authorization")?.replace("Bearer ", "");
	if (!token) {
		throw new AppError(401, "Unauthorized access");
	}
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, JWT_SECRET);
	} catch (error) {
		throw new AppError(401, "Unauthorized access");
	}
	const user = await User.findById(decodedToken?.userId);
	if (!user) {
		throw new AppError(401, "Unauthorized access");
	}
	req.user = user;
	next();
});

// check if user is admin
export const isAdmin = asyncHandler(async (req, res, next) => {
	if (!req.user) {
		throw new AppError(401, "Unauthorized access");
	}
	if (!req.user.isAdmin) {
		throw new AppError(
			403,
			"Forbidden: You do not have permission to access this resource"
		);
	}
	next();
});
