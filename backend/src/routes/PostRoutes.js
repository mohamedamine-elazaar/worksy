import express from "express";
import auth from "../middleware/auth.js";
import { listPosts, getPost, createPost, updatePost, deletePost } from "../controllers/PostController.js";

const router = express.Router();

router.get("/", listPosts);
router.get("/:id", getPost);
router.post("/", auth, createPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

export default router;
