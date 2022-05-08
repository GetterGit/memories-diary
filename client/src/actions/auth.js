// importing everything from the actions as api
import * as api from "../api";
// importing the action types to make the code cleaner and less prone to typos
import { AUTH } from "../constants/actionTypes";

// signin action creator is a function which returns an action
// signin function returns an async function with a dispatch
export const signin = (formData, navigate) => async (dispatch) => {
  try {
    // login the user
    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, data });

    navigate("/");
  } catch (error) {
    console.log(error);
  }
};

export const signup = (formData, navigate) => async (dispatch) => {
  try {
    // sign up the user
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, data });

    navigate("/");
  } catch (error) {
    console.log(error);
  }
};
