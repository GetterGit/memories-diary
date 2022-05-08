import { AUTH, LOGOUT } from "../constants/actionTypes";

// authData is null by default
const authReducer = (state = { authData: null }, action) => {
  switch (action.type) {
    case AUTH:
      // saving the auth data to the local storage so that the browser knew we are logged in after the page refresh
      localStorage.setItem("profile", JSON.stringify({ ...action?.data }));

      return { ...state, authData: action.data };
    case LOGOUT:
      // clearing local storage to remove the profile data
      localStorage.clear();

      return { ...state, authData: null };
    default:
      return state;
  }
};

export default authReducer;
