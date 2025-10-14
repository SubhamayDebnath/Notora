import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
	REFRESH_TOKEN_SECRET,
	REFRESH_TOKEN_EXPIRY,
	ACCESS_TOKEN_EXPIRY,
	ACCESS_TOKEN_SECRET,
} from "../config/config.js";

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: [true, "Username is required"],
			minLength: [3, "Name must be greater than 3 character long"],
			maxLength: [26, "Name must be less than 26 character long"],
			lowercase: true,
			trim: true,
			index: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			lowercase: true,
			trim: true,
			unique: true,
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				"Please fill valid email address",
			],
			index: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			trim: true,
			minLength: [6, "Password must be greater than 6 character long"],
			select: false,
		},
		folders: [
			{
				type: Schema.Types.ObjectId,
				ref: "Folder",
			},
		],
		notes: [
			{
				type: Schema.Types.ObjectId,
				ref: "Note",
			},
		],
		isVerified: {
			type: Boolean,
			default: false,
		},
		isBlocked: {
			type: Boolean,
			default: false,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		refreshToken: {
			type: String,
			select: false,
		},
		verificationToken: {
			token: { type: String, select: false },
			expires: { type: Date, select: false },
		},
		resetPasswordToken: {
			token: { type: String, select: false },
			expires: { type: Date, select: false },
		},
	},
	{ timestamps: true }
);
// hashed the password
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});
// compare the new password with hashed saved password
userSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};
// generate access token
userSchema.methods.generateAccessToken = function () {
	return jwt.sign({ id: this._id }, ACCESS_TOKEN_SECRET, {
		expiresIn: ACCESS_TOKEN_EXPIRY,
	});
};
// generate refresh token
userSchema.methods.generateRefreshToken = function () {
	return jwt.sign({ id: this._id }, REFRESH_TOKEN_SECRET, {
		expiresIn: REFRESH_TOKEN_EXPIRY,
	});
};
const User = model("User", userSchema);
export default User;
