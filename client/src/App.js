// importing useState for keeping track of the current id for post editing purposes
import React, { useEffect, useState } from "react";
import { Container, AppBar, Typography, Grow, Grid } from "@material-ui/core";
// when Redux is set, we need to dispatch the get posts action
// useDispatch allows for dispatching any action
import { useDispatch } from "react-redux";

// getPosts as an action to dispatch in useEffect
import { getPosts } from "./actions/posts";
import Posts from "./components/Posts/Posts";
import Form from "./components/Form/Form";
import memories from "./images/memories.png";
import useStyles from "./styles";

/* 
1. For post editing purposes, we need to keep track of the current id. 
2. We need to do it in App.js because we have to share the state of the current id between Posts and Form, and App.js is the only parent component for both Posts and Form
  */

const App = () => {
  // useState for tracking the current id for post updating
  // default null if no id is selected
  const [currentId, setCurrentId] = useState(null);
  // classes allow us to match the UI to what we set in ./styles
  const classes = useStyles();
  //defining the dispatch, useDispatch() is a hook
  const dispatch = useDispatch();
  // now, we need to find a way where we are actually gonna dispatch the action. Best way - insise of the useEffect
  // [dispatch] is the dependency array: it basically tells the hook to "only trigger when the dependency array changes". In the below example, it means "run the callback every time the dispatch variable changes".
  useEffect(() => {
    dispatch(getPosts());
    // adding currentId to the dependency array to enable immediate page update to show the updated post as when we update the post we reset currentId to null in the Form component
  }, [currentId, dispatch]);

  return (
    // lg = large
    // Grow provides a simple animation
    // xs and sm are the adaptations for diffent device sizes (values are given in the number of spaces)
    <Container maxwidth="lg">
      <AppBar className={classes.appBar} position="static" color="inherit">
        <Typography className={classes.heading} variant="h2" align="center">
          Memories
        </Typography>
        <img
          className={classes.image}
          src={memories}
          alt="memories"
          height="60"
        />
      </AppBar>
      <Grow in>
        <Container>
          <Grid
            className={classes.mainContainer}
            container
            justifyContent="space-between"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item xs={12} sm={7}>
              {/*passing the setter methods for the current id*/}
              <Posts setCurrentId={setCurrentId} />
            </Grid>
            <Grid item xs={12} sm={4}>
              {/*passing the current id to Form + setter methods for that id*/}
              <Form currentId={currentId} setCurrentId={setCurrentId} />
            </Grid>
          </Grid>
        </Container>
      </Grow>
    </Container>
  );
};

export default App;
