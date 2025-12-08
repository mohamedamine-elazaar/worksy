import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  images: [{ type: String }],
  tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
