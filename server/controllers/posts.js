// creating all handlers for our posts routes meaning all route logic is gonna be here
import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
  //accepting the page the user is currently on to display the posts only for this page
  const { page } = req.query;

  // each callback function should have a 'try - catch' block
  try {
    // adding the logic for Pagination to fetch only the posts for a given page
    // LIMIT is the num of posts per page
    const LIMIT = 4;
    // startIndex of a post on a specific page (e.g. 1st post on the 3rd page will have index of (4+4+4-1))
    const startIndex = (Number(page) - 1) * LIMIT;
    // counting the total posts in the DB to display the right number of pages on the FE
    const total = await PostMessage.countDocuments();

    // trying to retrieve all messages that we have
    // PostMessage.find() takes time to find smth inside of the model - hence adding await and making the whole getPosts function async
    // sorting to get the newest posts first
    // limiting the number of posts per page
    // skipping the posts to startIndex to get the posts for a specific page we are on
    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    // passing the posts, current page and total pages to the FE
    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// getting post by id
export const getPost = async (req, res) => {
  // getting the post's id
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    req.status(404).json({ message: error.message });
  }
};

// controller for getting searched posts
export const getPostsBySearch = async (req, res) => {
  // we want to retrieve the query data from req.query
  // req.query and req.params are different: QUERY -> /posts?page=1 -> page = 1 ; PARAMS -> /posts/123 -> id = 123
  // using QUERY when searching for smth, using PARAMS when getting some specific resource like a post
  const { searchQuery, tags } = req.query;

  try {
    // RegExp is used to match text with a pattern
    // 'i' ignores text case so that Test, test, TEST are searched the same
    const title = new RegExp(searchQuery, "i");

    // writing a DB query in find()
    // $or stands for either find the title or the tags
    // since tags is an array, we use $in to find a tag in the given array of tags that matches the tags in our query
    // spliting the query tags by coma sine we previously joined them to make a tags String
    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });

    // returning the object with the posts matching the search query back to the FE
    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  // creating a new instance of the PostMessage model
  // making the BE automatically specify the creator of a specific post as the id of the user, not the name
  // also, making sure the BE records when exactly the post was created
  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

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

  // checking if the user is logged in
  if (!req.userId) return res.json({ message: "Unathenticated" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");

  // first, we need to find the post we are looking for
  const post = await PostMessage.findById(id);

  // checking if this user already liked this post
  // below, each like is an id of a specific user: looping through all ids and comparing them to userId. If match -> then the user already liked and his action will be an unlike. Else, allow the user to like.
  // index = 1 if already liked, else index = -1
  const index = post.likes.findIndex((id) => id === String(req.userId));

  // if not liked before, liking the post for this user. Else, disliking the post for this user.
  if (index === -1) {
    // likes is an Array of the users who liked a specific post
    post.likes.push(req.userId);
  } else {
    // looping through the likes array and only leaving those likes which were put by other users
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  // updating the post with the updated likes array by just passing the post itself as the 2nd prop since this post object now also includes the updated likes array
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};
