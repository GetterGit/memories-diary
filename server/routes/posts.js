// all routes related to posts
import express from "express";

import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPostsBySearch,
} from "../controllers/posts.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", getPosts);
// need to be logged in to create post - hence using middleware
router.post("/", auth, createPost);
// patch exists for updating existing documents
// :id meaning the request is gonna be made to /posts/124 or any other specified id
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
// cannot like more than once - hence using middleware
router.patch("/:id/likePost", auth, likePost);

// creating a route for searched posts
router.get("/search", getPostsBySearch);

export default router;
