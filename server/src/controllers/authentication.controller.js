import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import ApiResponse from "../utils/apiResponse.js";
import generateVerificationToken from "../utils/generateVerificationToken.js";
import { verificationEmailTemplate } from "../utils/emailTemplate.js";
import sendEmail from "../utils/sendMail.js";
import User from "../models/user.model.js";

// register new user
export const registerUser = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;
	// check if all fields are filled
	if ([username, email, password].some((field) => field.trim() === "")) {
		throw new AppError(400, "All fields are required");
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
	await user.updateOne({ isVerified: true });
	return res
		.status(200)
		.json(new ApiResponse(200, "User verified successfully"));
});

// login User
export const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	// check if all fields are filled
	if ([email, password].some((field) => field.trim() === "")) {
		throw new AppError(400, "All fields are required");
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
	return res.status(200).json(
		new ApiResponse(200, "User logged in successfully", {
			username: user.username,
			email: user.email,
			isAdmin: user.isAdmin,
		})
	);
});
