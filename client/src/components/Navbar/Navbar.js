// useState from handling logged and unlogged users
// useEffect for automatically switching between Auth and Home depending on whether the user is logged
import React, { useState, useEffect } from "react";
// importing the Link component so that the user would be redirected to "/" when clicking the site title
// useNavigate for redirecting to the Auth page once logged out
// useLocation for automatically changing the Sign In button to Log Out button when the user is redirected from "/auth" to "/" after successful login
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Avatar, Toolbar, Button, Typography } from "@material-ui/core";
import useStyles from "./styles";
import memories from "../../images/memories.png";
// useDispatch for logout
import { useDispatch } from "react-redux";
// for decoding the JWT token to redirect the user to the login page when the JWT expires
import decode from "jwt-decode";

const Navbar = () => {
  const classes = useStyles();
  // useDispatch for logout
  const dispatch = useDispatch();
  // useNavigate for redirecting to the Auth page once logged out
  const navigate = useNavigate();
  // location tracks the url path change and then we can apply some logic upon that change
  const location = useLocation();

  // adding the user after successful login, first via Google Login
  // by default, catching the actual user - need to retrieve it from localStorage
  // storing 'profile' in localStorage in Auth.js and and auth.js reducer
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));

  // useEffect for automatically switching between Auth and Home depending on whether the user is logged
  useEffect(() => {
    // checking for the token existence. If exists - sending it to the token variable
    const token = user?.token;

    // Checking for JsonWebToken if manual signup. No need to do it for Google Login. If JWT expired, redirect the user to the login page
    if (token) {
      const decodedToken = decode(token);

      // .exp if the expiry of the token
      // by * 1000 getting a value in milliseconds
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  // logout function
  const logout = () => {
    dispatch({ type: "LOGOUT" });

    // redirecting to the Home page once logged out
    navigate("/auth");
    // setting user to null so that the Sing In button would be displayed in the navbar
    setUser(null);
  };

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <div className={classes.brandContainer}>
        <Typography
          component={Link}
          to="/"
          className={classes.heading}
          variant="h2"
          align="center"
        >
          Memories
        </Typography>
        <img className={classes.image} src={memories} alt="icon" height="60" />
      </div>
      <Toolbar className={classes.toolbar}>
        {user?.result ? (
          <div className={classes.profile}>
            <Avatar
              className={classes.purple}
              alt={user?.result.name}
              src={user?.result.imageUrl}
            >
              {user?.result.name.charAt(0)}
            </Avatar>
            <Typography className={classes.userName} variant="h6">
              {user.result?.name}
            </Typography>
            <Button
              className={classes.logout}
              variant="contained"
              color="secondary"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            component={Link}
            to="/auth"
            variant="contained"
            color="primary"
          >
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
