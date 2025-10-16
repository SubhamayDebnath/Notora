import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import ApiResponse from "../utils/apiResponse.js";
import Color from "../models/color.model.js";
import Folder from "../models/folder.model.js";
import Note from "../models/note.model.js";

// add color code
export const addColor = asyncHandler(async (req, res) => {
	const { colorName, colorCode } = req.body;
	if ([colorCode, colorName].some((field) => !field || field?.trim() === "")) {
		throw new AppError(400, "All fields are required");
	}
	if (!/^#([0-9A-Fa-f]{3}){1,2}$/.test(colorCode)) {
		throw new AppError(400, "Invalid color code format. Use #RGB or #RRGGBB");
	}
	// check if color already exists
	const existingColor = await Color.findOne({ colorName, colorCode });
	if (existingColor) {
		throw new AppError(400, "Color already exists");
	}
	const color = await Color.create({
		colorName,
		colorCode,
		createdBy: req.user._id,
	});
	if (!color) {
		throw new AppError(400, "Color creation failed");
	}
	return res.status(200).json(new ApiResponse(200, "Color added successfully"));
});

// update color
export const updateColor = asyncHandler(async (req, res) => {
	const { colorId } = req.params;
	// check if color id is provided
	if (!colorId) {
		throw new AppError(400, "Color id is required");
	}
	const { colorName, colorCode, type, colorType, isDisabled } = req.body;
	// check if color already exists
	const existingColor = await Color.findOne({ colorName, colorCode });
	if (existingColor) {
		throw new AppError(400, "Color already exists");
	}
	const color = await Color.findById(colorId);
	if (!color) {
		throw new AppError(400, "Color update failed");
	}
	if (colorName) {
		color.colorName = colorName;
	}
	// check if colorCode is provided
	if (colorCode) {
		if (!/^#([0-9A-Fa-f]{3}){1,2}$/.test(colorCode)) {
			throw new AppError(400, "Invalid color code format. Use #RGB or #RRGGBB");
		}
		color.colorCode = colorCode.trim();
	}
	// check if type is provided
	if (type) {
		if (!["background", "text"].includes(type.toLowerCase())) {
			throw new AppError(400, "Invalid type. Must be 'background' or 'text'");
		}
		color.type = type.toLowerCase();
	}
	// check if colorType is provided
	if (colorType) {
		if (!["folder", "note", "both"].includes(colorType.toLowerCase())) {
			throw new AppError(
				400,
				"Invalid colorType. Must be 'folder', 'note', or 'both'"
			);
		}
		color.colorType = colorType.toLowerCase();
	}
	if (isDisabled) {
		color.isDisabled = isDisabled;
	}
	await color.save();
	return res
		.status(200)
		.json(new ApiResponse(200, "Color updated successfully"));
});

// delete color
export const deleteColor = asyncHandler(async (req, res) => {
	const { colorId } = req.params;
	// check if color id is provided
	if (!colorId) {
		throw new AppError(400, "Color id is required");
	}
	const color = await Color.findById(colorId);
	if (!color) {
		throw new AppError(400, "Color not found");
	}
	//remove color references from notes/folders
	const [folders, notes] = await Promise.all([
		Folder.updateMany({ color: colorId }, { $unset: { color: "" } }),
		Note.updateMany({ color: colorId }, { $unset: { color: "" } }),
	]);
	if (folders.modifiedCount === 0 && notes.modifiedCount === 0) {
		throw new AppError(400, "Color deletion failed");
	}
	// Delete the color
	await color.deleteOne();
	return res
		.status(200)
		.json(new ApiResponse(200, "Color deleted successfully"));
});

// get color details only admin can access
export const getColorDetails = asyncHandler(async (req, res) => {
	const color = await Color.find()
		.populate("createdBy")
		.sort({ createdAt: -1 });
	if (color && color.length > 0) {
		return res.status(200).json(new ApiResponse(200, "Color details", color));
	}
	return res
		.status(200)
		.json(new ApiResponse(200, "Color details not found", []));
});

// get color details for form
export const getAllColorCodesAndNames = asyncHandler(async (req, res) => {
	const color = await Color.find().select("_id colorName colorCode");
	if (color && color.length > 0) {
		return res.status(200).json(new ApiResponse(200, "Color details", color));
	}
	return res
		.status(200)
		.json(new ApiResponse(200, "Color details not found", []));
});
