// importing everything from the actions as api
import * as api from "../api";
// importing the action types to make the code cleaner and less prone to typos
import {
  FETCH_ALL,
  FETCH_BY_SEARCH,
  CREATE,
  UPDATE,
  DELETE,
  LIKE,
  START_LOADING,
  END_LOADING,
  FETCH_POST,
} from "../constants/actionTypes";

// making Action Creators - functions which return actions
// to fetch all posts some time will have to pass - hence we need to use redux-thunk (adding async(dispatch))
// accepting page as a param to get only the posts from the specific page
export const getPosts = (page) => async (dispatch) => {
  try {
    // starting loading
    dispatch({ type: START_LOADING });

    // trying to fetch all data from the api - data represents the posts
    // also passing the page to api
    const { data } = await api.fetchPosts(page);

    console.log(data);

    // using Redux to dispatch an action from the data from our BE
    dispatch({ type: FETCH_ALL, payload: data });
    // end loading
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

// getting post by id
export const getPost = (id) => async (dispatch) => {
  try {
    // starting loading
    dispatch({ type: START_LOADING });
    // fetching the post by id
    const { data } = await api.fetchPost(id);

    dispatch({ type: FETCH_POST, payload: data });
    // end loading
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

// getting posts by the search terms
// accepting searchQuery as a param and passing it to the api
export const getPostsBySearch = (searchQuery) => async (dispatch) => {
  try {
    // starting loading
    dispatch({ type: START_LOADING });

    const {
      data: { data },
    } = await api.fetchPostsBySearch(searchQuery);

    dispatch({ type: FETCH_BY_SEARCH, payload: data });
    // end loading
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const createPost = (post, navigate) => async (dispatch) => {
  try {
    // starting loading
    dispatch({ type: START_LOADING });

    const { data } = await api.createPost(post);

    dispatch({ type: CREATE, payload: data });
    navigate(`/posts/${data._id}`);
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
