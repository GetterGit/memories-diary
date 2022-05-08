// importing everything from the actions as api
import * as api from "../api";
// importing the action types to make the code cleaner and less prone to typos
import {
  FETCH_ALL,
  CREATE,
  UPDATE,
  DELETE,
  LIKE,
} from "../constants/actionTypes";

// making Action Creators - functions which return actions
// to fetch all posts some time will have to pass - hence we need to use redux-thunk (adding async(dispatch))
export const getPosts = () => async (dispatch) => {
  try {
    // trying to fetch all data from the api - data represents the posts
    const { data } = await api.fetchPosts();

    // using Redux to dispatch an action from the data from our BE
    dispatch({ type: FETCH_ALL, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createPost = (post) => async (dispatch) => {
  try {
    const { data } = await api.createPost(post);

    dispatch({ type: CREATE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);

    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);

    // no need for other payload apart from the id we want to delete because we are not interested in the return data when deleting
    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = (id) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id);

    dispatch({ type: LIKE, payload: data });
  } catch (error) {
    console.log(error);
  }
};
