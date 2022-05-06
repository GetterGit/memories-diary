// using axious to make api calls
import axios from "axios";

// URL pointing to our backend route
const url = "http://localhost:4000/posts";

// the below is to return all posts in the DB as it will be using /posts route (see the posts.js routes for more info)
export const fetchPosts = () => axios.get(url);
export const createPost = (newPost) => axios.post(url, newPost);
export const updatePost = (id, updatedPost) =>
  axios.patch(`${url}/${id}`, updatedPost);
export const deletePost = (id) => axios.delete(`${url}/${id}`);
export const likePost = (id) => axios.patch(`${url}/${id}/likePost`);

// exporing the above function
// then, focusing on adding Redux capabilities so that all actions towards the BE would be done using Redux
// hence, we need to dispatch those actions - to do that we need to add some boiler plate code meaning create several files and folders for higher scalability and better structure
