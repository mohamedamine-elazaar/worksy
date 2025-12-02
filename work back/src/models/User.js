import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["freelancer", "stager", "entreprise", "admin"] },
  skills: [String],
}, { timestamps: true });

export default mongoose.model("User", userSchema);
