import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  entrepriseId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  type: { type: String, enum: ["stage", "freelance", "emploi"] },
  location: String,
  requirements: [String],
}, { timestamps: true });

export default mongoose.model("Offer", offerSchema);
