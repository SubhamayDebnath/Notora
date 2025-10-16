import { Schema, model } from "mongoose";

const noteSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, "Title is required"],
			trim: true,
		},
		description: {
			type: String,
			required: [true, "Description is required"],
			trim: true,
		},
		folder: {
			type: Schema.Types.ObjectId,
			ref: "Folder",
			required: false,
		},
		categories: [
			{
				type: Schema.Types.ObjectId,
				ref: "Category",
			},
		],
		tags: {
			type: [String],
			required: false,
		},
	},
	{ timestamps: true }
);
const Note = model("Note", noteSchema);
export default Note;
