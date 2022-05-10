import {
  FETCH_ALL,
  FETCH_BY_SEARCH,
  UPDATE,
  LIKE,
  DELETE,
  CREATE,
  START_LOADING,
  END_LOADING,
  FETCH_POST,
} from "../constants/actionTypes";

// a reducer is a function that accepts a state and action
// then, based on the action type, we do a logic and can change the state

// state of the reducer should always be something and so we set it to an array since the posts are the array
export default (state = { isLoading: true, posts: [] }, action) => {
  switch (action.type) {
    // start loading, isLoading to true
    case START_LOADING:
      return { ...state, isLoading: true };
    // end loading, isLoading to false
    case END_LOADING:
      return { ...state, isLoading: false };
    // now, we should specify all our types aka what we want to be doing with the posts
    case FETCH_ALL:
      // returning all posts based on the logic setup in ../actions/posts.js
      return {
        ...state,
        posts: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages,
      };
    // fetching post by id
    case FETCH_POST:
      return { ...state, post: action.payload };
    // case for searching posts
    // returning the payload since it consists of the data of posts matching the search query and sent from actions
    case FETCH_BY_SEARCH:
      return { ...state, posts: action.payload };
    case CREATE:
      return { ...state, posts: [...state.posts, action.payload] };
    // both UPDATE and LIKE will follow the same return logic
    case UPDATE:
    case LIKE:
      /* 
      1. Array is the output of the map method
      2. So, we will be mapping over the posts array -> changing smth in there -> returning the changed array
      3. action.payload is the updated post -> if post._id === action.payload._id , then we return action.payload as it's the updated post, otherwise returning the post as it was
        */
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      };
    case DELETE:
      // filtering out the deleted post at the return by keeping only the posts which ids are not equal to the id we send as a payload when deleting the post of that id
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload),
      };
    default:
      return state;
  }
};
