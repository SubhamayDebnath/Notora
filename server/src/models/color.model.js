import { Schema, model } from "mongoose";

const colorSchema = new Schema(
	{
		colorName: {
			type: String,
			required: [true, "Color name is required"],
			unique: true,
			trim: true,
			lowercase: true,
		},
		colorCode: {
			type: String,
			required: [true, "Color code is required"],
			trim: true,
			unique: true,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			enum: ["background", "text"],
			required: [true, "Type is required"],
			trim: true,
			lowercase: true,
		},
		colorType: {
			type: String,
			enum: ["folder", "note", "both"],
			required: [true, "Color type is required"],
			trim: true,
			lowercase: true,
		},
	},
	{
		timestamps: true,
	}
);
const Color = model("Color", colorSchema);
export default Color;
