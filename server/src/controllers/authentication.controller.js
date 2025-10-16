import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import ApiResponse from "../utils/apiResponse.js";
import generateVerificationToken from "../utils/generateVerificationToken.js";
import {
	verificationEmailTemplate,
	resetPasswordEmailTemplate,
} from "../utils/emailTemplate.js";
import { isValidEmail, cookieOption } from "../utils/helper.js";
import { REFRESH_TOKEN_SECRET } from "../config/config.js";
import sendEmail from "../utils/sendMail.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// generate Access token and refresh token
const generateAccessTokenAndRefreshToken = async (userId) => {
	try {
		const user = await User.findById(userId).select("+refreshToken");
		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();
		user.refreshToken = refreshToken;
		await user.save({
			validateBeforeSave: false,
		});
		return { accessToken, refreshToken };
	} catch (error) {
		throw new AppError(500, "Something went wrong while generating token");
	}
};

// register new user
export const registerUser = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;
	// check if all fields are filled
	if (
		[username, email, password].some((field) => !field || field?.trim() === "")
	) {
		throw new AppError(400, "All fields are required");
	}
	// check if email is valid
	if (!isValidEmail(email)) {
		throw new AppError(400, "Invalid email");
	}
	// check if user already exists
	const existingUser = await User.findOne({ email });
	if (existingUser) {
		throw new AppError(400, "User already exists");
	}
	// create user
	const user = await User.create({ username, email, password });
	if (!user) {
		throw new AppError(400, "User creation failed");
	}
	// get verification token and expiry date
	const { token, expiresIn } = await generateVerificationToken();
	await user.updateOne({
		verificationToken: {
			token: token,
			expires: expiresIn,
		},
	});
	// generate email verification link
	const verificationLink = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/auth/verify?token=${token}`;
	const generatedVerifiedEmail = verificationEmailTemplate(
		username,
		verificationLink
	);
	// send verification email
	await sendEmail(user.email, "Verify Your Email", generatedVerifiedEmail);
	return res.status(201).json(
		new ApiResponse(
			201,
			"User created successfully, please verify your account",
			{
				isVerified: user.isVerified,
			}
		)
	);
});

// verify user
export const verifyUser = asyncHandler(async (req, res) => {
	const { token } = req.body;
	// check if all fields are filled
	if (token.trim() === "") {
		throw new AppError(400, "Token is required");
	}
	// check if user already exists
	const user = await User.findOne({
		"verificationToken.token": token,
		"verificationToken.expires": { $gt: Date.now() },
	});
	if (!user) {
		throw new AppError(400, "Invalid token");
	}
	// check if user is verified
	if (user.isVerified) {
		throw new AppError(400, "User is already verified");
	}
	// verify user
	await user.updateOne({
		isVerified: true,
		$unset: { verificationToken: "" },
	});

	return res
		.status(200)
		.json(new ApiResponse(200, "User verified successfully"));
});

// login User
export const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	// check if all fields are filled
	if ([email, password].some((field) => !field || field?.trim() === "")) {
		throw new AppError(400, "All fields are required");
	}
	if (!isValidEmail(email)) {
		throw new AppError(400, "Invalid email");
	}
	// check if user already exists
	const user = await User.findOne({ email }).select("+password");
	if (!user) {
		throw new AppError(400, "Invalid credentials");
	}
	// check if user is verified
	if (!user.isVerified) {
		throw new AppError(400, "User is not verified");
	}
	// check if user is blocked
	if (user.isBlocked) {
		throw new AppError(
			400,
			"You cannot login because your account is blocked,please contact us"
		);
	}
	// check if password is correct
	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new AppError(400, "Invalid credentials");
	}
	const { accessToken, refreshToken } =
		await generateAccessTokenAndRefreshToken(user._id);
	return res
		.status(200)
		.cookie("accessToken", accessToken, cookieOption)
		.cookie("refreshToken", refreshToken, cookieOption)
		.json(
			new ApiResponse(200, "User logged in successfully", {
				username: user.username,
				email: user.email,
				isAdmin: user.isAdmin,
			})
		);
});

// forgot password
export const resetPasswordSendEmail = asyncHandler(async (req, res) => {
	const { email } = req.body;
	if (!email) {
		throw new AppError(400, "Email is required");
	}
	// check if email is valid
	if (!isValidEmail(email)) {
		throw new AppError(400, "Invalid email");
	}
	// check if user already exists
	const user = await User.findOne({ email });
	if (!user) {
		throw new AppError(400, "User not found");
	}
	const { token, expiresIn } = await generateVerificationToken();
	await user.updateOne({
		resetPasswordToken: {
			token: token,
			expires: expiresIn,
		},
	});
	// generate email reset password verification link
	const verificationLink = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/auth/reset-password?token=${token}`;
	const generatedVerifiedEmail = resetPasswordEmailTemplate(
		user.username,
		verificationLink
	);
	// send verification email
	await sendEmail(user.email, "Reset Your Password", generatedVerifiedEmail);
	return res
		.status(200)
		.json(new ApiResponse(200, "Reset password link sent successfully"));
});

// reset password and update password
export const resetPassword = asyncHandler(async (req, res) => {
	const { token, newPassword } = req.body;
	if ([token, newPassword].some((field) => !field || field?.trim() === "")) {
		throw new AppError(400, "All fields are required");
	}
	// check if user already exists
	const user = await User.findOne({
		"resetPasswordToken.token": token,
		"resetPasswordToken.expires": { $gt: Date.now() },
	}).select("+password");
	if (!user) {
		throw new AppError(400, "Invalid token");
	}
	// check if password is correct
	const isPasswordCorrect = await user.comparePassword(password);
	if (isPasswordCorrect) {
		throw new AppError(400, "Invalid credentials");
	}
	await user.updateOne({
		password: password,
		$unset: { resetPasswordToken: "" },
	});

	return res
		.status(200)
		.json(new ApiResponse(200, "Password reset successfully"));
});

// change password
export const changePassword = asyncHandler(async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	if (
		[oldPassword, newPassword].some((field) => !field || field?.trim() === "")
	) {
		throw new AppError(400, "All fields are required");
	}
	// check if user already exists
	const user = await User.findById(req.user.id).select("+password");
	if (!user) {
		throw new AppError(400, "User not found");
	}
	// check if password is correct
	const isPasswordCorrect = await user.comparePassword(oldPassword);
	if (!isPasswordCorrect) {
		throw new AppError(400, "Invalid credentials");
	}
	await user.updateOne({
		password: newPassword,
	});
	return res
		.status(200)
		.json(new ApiResponse(200, "Password changed successfully"));
});

// logout user
export const logoutUser = asyncHandler(async (req, res) => {
	return res
		.status(200)
		.clearCookie("accessToken")
		.clearCookie("refreshToken")
		.json(new ApiResponse(200, "User logged out successfully"));
});

// refresh access token
export const refreshAccessToken = asyncHandler(async (req, res) => {
	const inComingRefreshToken =
		req.cookies.refreshToken || req.body.refreshToken;
	if (!inComingRefreshToken) {
		throw new AppError(400, "Refresh token is required");
	}
	try {
		// decode refresh token
		const decodedToken = jwt.verify(inComingRefreshToken, REFRESH_TOKEN_SECRET);
		const user = await User.findById(decodedToken._id);
		// check if user exists
		if (!user) {
			throw new AppError(400, "Unauthorized access");
		}
		// check if refresh token is valid
		if (inComingRefreshToken !== user.refreshToken) {
			throw new AppError(400, "Unauthorized access");
		}
		// generate access token
		const { accessToken, refreshToken } =
			await generateAccessTokenAndRefreshToken(user._id);
		return res
			.status(200)
			.cookie("accessToken", accessToken, cookieOption)
			.cookie("refreshToken", refreshToken, cookieOption)
			.json(new ApiResponse(200, "Access token refreshed successfully"));
	} catch (error) {}
});
