import express from "express";
import { registerUser, loginUser, requestPasswordReset } from "../controllers/AuthController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot", requestPasswordReset);

export default router;
