import { Schema, model } from "mongoose";

const folderSchema = new Schema(
	{
		folderName: {
			type: String,
			required: [true, "Folder name is required"],
			trim: true,
			lowercase: true,
		},
		isAchieved: {
			type: Boolean,
			default: false,
		},
		color: {
			type: Schema.Types.ObjectId,
			ref: "Color",
			required: true,
		},
		categories: [
			{
				type: Schema.Types.ObjectId,
				ref: "Category",
			},
		],
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);
const Folder = model("Folder", folderSchema);
export default Folder;
