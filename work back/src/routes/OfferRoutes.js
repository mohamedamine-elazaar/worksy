import express from "express";
import { createOffer, getOffers } from "../controllers/OfferController.js";

const router = express.Router();

router.post("/", createOffer);
router.get("/", getOffers);

export default router;
