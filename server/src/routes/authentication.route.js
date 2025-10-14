import { Router } from "express";
import {
	registerUser,
	verifyUser,
	loginUser,
} from "../controllers/authentication.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/verification", verifyUser);
router.post("/login", loginUser);

export default router;
