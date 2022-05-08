// importing useState for keeping track of the current id for post editing purposes
import React, { useState, useEffect } from "react";
import { Container, Grow, Grid, Paper } from "@material-ui/core";
import Posts from "../Posts/Posts";
import Form from "../Form/Form";
// when Redux is set, we need to dispatch the get posts action
// useDispatch allows for dispatching any action
import { useDispatch } from "react-redux";
// getPosts as an action to dispatch in useEffect
import { getPosts } from "../../actions/posts";
import useStyles from "./styles";
// importing Pagination for navigating users to chosen posts
import Pagination from "../Pagination";

const Home = () => {
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
            <Paper className={classes.pagination} elevation={6}>
              <Pagination />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
