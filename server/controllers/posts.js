// creating all handlers for our posts routes meaning all route logic is gonna be here
import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
  // each callback function should have a 'try - catch' block
  try {
    // trying to retrieve all messages that we have
    // PostMessage.find() takes time to find smth inside of the model - hence adding await and making the whole getPosts function async
    const postMessages = await PostMessage.find();

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  // creating a new instance of the PostMessage model
  const newPost = new PostMessage(post);

  try {
    await newPost.save();

    // 201: successful creation
    // more on the status codes: https://www.restapitutorial.com/httpstatuscodes.html
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  // first, extracting the id
  // id: _id renaming id to _id
  const { id: _id } = req.params;
  // receiving data for updates from the request's body
  const post = req.body;

  // checking if _id is indeed a mongoose object id
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");

  // if the id is valid, updating our post
  // specifying new: true so that we can actually receive the updated version of the post
  // passing the spread post's objects + its id
  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    {
      new: true,
    }
  );

  // sending over the updated post
  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");

  await PostMessage.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully" });
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");

  // first, we need to find the post we are looking for
  const post = await PostMessage.findById(id);
  // updating the post with the new like amount
  const updatedPost = await PostMessage.findByIdAndUpdate(
    id,
    { likeCount: post.likeCount + 1 },
    { new: true }
  );

  res.json(updatedPost);
};
