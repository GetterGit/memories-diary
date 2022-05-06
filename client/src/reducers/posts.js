import {
  FETCH_ALL,
  UPDATE,
  LIKE,
  DELETE,
  CREATE,
} from "../constants/actionTypes";

// a reducer is a function that accepts a state and action
// then, based on the action type, we do a logic and can change the state

// state of the reducer should always be something and so we set it to an array since the posts are the array
// state is named as posts below
export default (posts = [], action) => {
  switch (action.type) {
    // now, we should specify all our types aka what we want to be doing with the posts
    case FETCH_ALL:
      // returning all posts based on the logic setup in ../actions/posts.js
      return action.payload;
    case CREATE:
      return [...posts, action.payload];
    default:
      return posts;
    // both UPDATE and LIKE will follow the same return logic
    case UPDATE:
    case LIKE:
      /*
      1. Array is the output of the map method
      2. So, we will be mapping over the posts array -> changing smth in there -> returning the changed array
      3. action.payload is the updated post -> if post._id === action.payload._id , then we return action.payload as it's the updated post, otherwise returning the post as it was
        */
      return posts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    case DELETE:
      // filtering out the deleted post at the return by keeping only the posts which ids are not equal to the id we send as a payload when deleting the post of that id
      return posts.filter((post) => post._id !== action.payload);
  }
};
