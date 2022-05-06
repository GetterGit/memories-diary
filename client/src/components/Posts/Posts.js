import React from "react";
import { Grid, CircularProgress } from "@material-ui/core";
// we need to fetch the data from the global Redux store
import { useSelector } from "react-redux";

import Post from "./Post/Post";
import useStyles from "./styles";

// passing setCurrentId as props for updating a post with the current id
const Posts = ({ setCurrentId }) => {
  // using a hook to fetch the data from global Redux store
  // state.posts since in the index.js (reducers) we called a respective reducer posts
  const posts = useSelector((state) => state.posts);
  const classes = useStyles();

  console.log(posts);

  // if no posts, then show a loading spinner, else - loop over the posts
  return !posts.length ? (
    <CircularProgress />
  ) : (
    <Grid
      className={classes.container}
      container
      alignItems="stretch"
      spacing={3}
    >
      {posts.map((post) => (
        <Grid key={post._id} item xs={12} sm={6}>
          {/*passing setCurrentId to Post to for staying consistent (called props drilling)*/}
          <Post post={post} setCurrentId={setCurrentId} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Posts;
