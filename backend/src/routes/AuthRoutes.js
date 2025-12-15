import express from "express";
import { registerUser, loginUser, requestPasswordReset, me } from "../controllers/AuthController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot", requestPasswordReset);
router.get("/me", auth, me);

export default router;
