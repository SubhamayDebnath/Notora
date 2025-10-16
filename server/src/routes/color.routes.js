import { Router } from "express";
import {
	addColor,
	updateColor,
	deleteColor,
	getColorDetails,
	getAllColorCodesAndNames,
} from "../controllers/color.controller.js";
import {
	verifyUserAccess,
	isAdmin,
} from "../middlewares/authentication.middlewares.js";
const router = Router();

router.post("/add", verifyUserAccess, isAdmin, addColor);
router.patch("/update/:colorId", verifyUserAccess, isAdmin, updateColor);
router.delete("/delete/:colorId", verifyUserAccess, isAdmin, deleteColor);
router.get("/all", verifyUserAccess, isAdmin, getColorDetails);
router.get("/get-colors-and-codes", getAllColorCodesAndNames);

export default router;
