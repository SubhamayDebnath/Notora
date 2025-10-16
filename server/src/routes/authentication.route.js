import { Router } from "express";
import {
	registerUser,
	verifyUser,
	loginUser,
	resetPasswordSendEmail,
	resetPassword,
	changePassword,
	logoutUser,
	refreshAccessToken,
} from "../controllers/authentication.controller.js";
import { verifyUserAccess } from "../middlewares/authentication.middlewares.js";
const router = Router();

router.post("/register", registerUser);
router.post("/verification", verifyUser);
router.post("/send-reset-password", resetPasswordSendEmail);
router.patch("/reset-password", resetPassword);
router.post("/login", loginUser);
router.post("/logout", verifyUserAccess, logoutUser);
router.patch("/change-password", verifyUserAccess, changePassword);
router.post("/refresh-token", refreshAccessToken);

export default router;
