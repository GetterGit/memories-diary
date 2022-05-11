// using axious to make api calls
import axios from "axios";

// base URL pointing to our backend route. Then, adding the routes depending on what we want to achieve
const API = axios.create({ baseURL: "http://localhost:4000" });

// adding an intercepter to each of our requests to enable the middleware
// because we need to send out token back to BE for the BE middleware to verify that the user is logged in
API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    // adding an Authorization header to our request
    // need to put our token in this header, starting with the Bearer word as it's gonna be a Bearer token
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }

  // with interceptors, we have to return the actual request so that we can make our request moving forward
  // returned req will include the Authorization header with the user's token inside
  return req;
});

// the below is to return all posts in the DB as it will be using /posts route (see the posts.js routes for more info)
// passing the page to the BE so that it knew which page we are currently on
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const createPost = (newPost) => API.post("/posts", newPost);
export const updatePost = (id, updatedPost) =>
  API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
// fetching post by id
export const fetchPost = (id) => API.get(`/posts/${id}`);

// routes for signin and signup
export const signIn = (formData) => API.post("/user/signin", formData);
export const signUp = (formData) => API.post("/user/signup", formData);

// routes for search by query
// query params start from ? and then we specify a variable name
// using 'none' if no search is provided
export const fetchPostsBySearch = (searchQuery) =>
  API.get(
    `/posts/search?searchQuery=${searchQuery.search || "none"}&tags=${
      searchQuery.tags
    }`
  );

// commenting posts
export const commentPost = (value, id) =>
  API.post(`/posts/${id}/commentPost`, { value });

// then, focusing on adding Redux capabilities so that all actions towards the BE would be done using Redux
// hence, we need to dispatch those actions - to do that we need to add some boiler plate code meaning create several files and folders for higher scalability and better structure
