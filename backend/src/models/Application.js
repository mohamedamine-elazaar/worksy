import mongoose from "mongoose";

const appSchema = new mongoose.Schema({
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "pending" }
}, { timestamps: true });

export default mongoose.model("Application", appSchema);
