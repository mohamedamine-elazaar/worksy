import Post from "../models/Post.js";

export const listPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("authorId", "fullName email role");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("authorId", "fullName email role");
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const authorId = req.user?.id;
    if (!authorId) return res.status(401).json({ msg: "Unauthorized" });
    const { title, body, images = [], tags = [] } = req.body;
    const post = await Post.create({ authorId, title, body, images, tags });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const authorId = req.user?.id;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (String(post.authorId) !== String(authorId)) return res.status(403).json({ msg: "Forbidden" });

    const { title, body, images, tags } = req.body;
    if (title !== undefined) post.title = title;
    if (body !== undefined) post.body = body;
    if (images !== undefined) post.images = images;
    if (tags !== undefined) post.tags = tags;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const authorId = req.user?.id;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (String(post.authorId) !== String(authorId)) return res.status(403).json({ msg: "Forbidden" });

    await post.deleteOne();
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
