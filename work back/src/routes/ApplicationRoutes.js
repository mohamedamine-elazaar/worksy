import express from "express";
import { applyToOffer } from "../controllers/ApplicationController.js";

const router = express.Router();

router.post("/", applyToOffer);

export default router;
