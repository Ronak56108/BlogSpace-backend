import asyncHandler from 'express-async-handler';
import postService from '../services/post.service.js';

const createPost = asyncHandler(async (req, res) => {
  const postData = {
    ...req.body,
    author: req.user._id,
  };

  const post = await postService.createPost(postData);
  res.status(201).json(post);
});

const getPosts = asyncHandler(async (req, res) => {
  const { page, limit, search, category, status, author } = req.query;
  const query = { search, category, status, author };

  const result = await postService.getPosts(query, page, limit);
  res.json(result);
});

const getMyPosts = asyncHandler(async (req, res) => {
  const query = { author: req.user._id };
  const { page, limit } = req.query;

  const result = await postService.getPosts(query, page, limit);
  res.json(result);
});

const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await postService.getPostBySlug(req.params.slug);
  res.json(post);
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await postService.getPostById(req.params.id);
  res.json(post);
});

const updatePost = asyncHandler(async (req, res) => {
  const post = await postService.updatePost(req.params.id, req.body);
  res.json(post);
});

const deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.id);
  res.json({ message: 'Post deleted successfully' });
});

export default {
  createPost,
  getPosts,
  getMyPosts,
  getPostBySlug,
  getPostById,
  updatePost,
  deletePost,
};