// enabling the state track for when the password is hidden and when shown by using useState
import React, { useState } from "react";
// importing useNavigate to redirect the logged user to Home
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";
// enabling the Sign In with Google
import { GoogleLogin } from "react-google-login";
// icon for the Google Login
import Icon from "./Icon";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import useStyles from "./styles";
import Input from "./Input";
// useDispatch for dispatching the data on successful Google Login
import { useDispatch } from "react-redux";
// importing signin and signup actions
import { signin, signup } from "../../actions/auth";

// initial state for the Auth form fields
const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Auth = () => {
  const classes = useStyles();
  // enabling the state track for when the password is hidden and when shown by using useState
  // false by default
  const [showPassword, setShowPassword] = useState(false);
  // enabling the state track for whether the user is on Sign Up or Sign In form and then using the state to allow the user to switch between the two forms
  const [isSignUp, setIsSignUp] = useState(false);
  // state field for capturing the auth form inputs in the state
  const [formData, setFormData] = useState(initialState);
  // useDispatch for dispatching the data on successful Google Login
  const dispatch = useDispatch();
  // useNavigate to redirect the logged user to Home
  const navigate = useNavigate();

  // handing the manual Sing Up or Sign In
  const handleSubmit = (e) => {
    // preventing the default event of browser refresh upon a form submission
    e.preventDefault();
    // handling both Sign Up and Sign In cases
    if (isSignUp) {
      // passing the Sign Up data and navigate so that the user is redirected to Home after successful registration
      dispatch(signup(formData, navigate));
    } else {
      dispatch(signin(formData, navigate));
    }
  };
  // handling changes in formData
  const handleChange = (e) => {
    // spreading all properties but only changing the one we are on with the target value (meaning the current input)
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // toggling the state of the password from hidden to visible
  // need a previous state to then toggle to the opposite state
  const handleShowPassword = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword);
  // function for switching between Sign Up and Sign In forms
  const switchMode = () => {
    setIsSignUp((prevIsSignedUp) => !prevIsSignedUp);
    // also hiding the password when the user switches between the Sign Up and Sign In forms
    setShowPassword(false);
  };
  // functions for Google Login
  // when the Google Login succeeded
  const googleSuccess = async (res) => {
    // ?. is an optional chaining operator that is not going to throw and error if we don't have access to the res object because maybe sometimes we won't have the res object so we want to make sure we don't get an error here
    const result = res?.profileObj;
    const token = res?.tokenId;

    // as we are working with async function, we need to use the 'try ... catch' block
    try {
      dispatch({ type: "AUTH", data: { result, token } });

      // once dispatching the AUTH data, redirecting the user to Home
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  // when the Google Login failed
  const googleFailure = (error) => {
    console.log(error);
    console.log("Google Sign In was unsuccessful");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">{isSignUp ? "Sign Up" : "Sign In"}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* isSignUp && is equal to 'only if it is signed up' as an alternative to the ternary operator */}
            {isSignUp && (
              <>
                {/* now we are just passing the dynamic props to the Input component function importend from ./Input.js */}
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
            />
            {/* Showing the passford confirmation field ONLY if on the Sign Up form */}
            {isSignUp && (
              <Input
                name="confirmPassword"
                label="Repeat Password"
                handleChange={handleChange}
                type="password"
              />
            )}
          </Grid>
          <Button
            className={classes.submit}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
          {/* Adding Google Login. Render prop defines how the button is gonna look like */}
          <GoogleLogin
            clientId="80886782680-bigosue0n0fo04d11hjlf56r0dme8p10.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button
                className={classes.googleButton}
                color="primary"
                fullWidth
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                startIcon={<Icon />}
                variant="contained"
              >
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          />

          {/* Below, setting up a Grid to switch between Sign Up Sign In forms */}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignUp
                  ? "Already have an accoint? Sign In"
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
