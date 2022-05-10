import React, { useEffect } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Divider,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
// moment is a js library that deals with time
import moment from "moment";
// useParams returns an object of the params for the route rendered
import { useParams, useNavigate } from "react-router-dom";
// getting post by id and then getting recommended posts
import { getPost, getPostsBySearch } from "../../actions/posts";

import useStyles from "./styles";

const PostDetails = () => {
  // getting the post data from useSelector: using a callback function with the state and getting state.posts reducer
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  // getting the post id
  const { id } = useParams();

  // for getting post by id
  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);

  // for getting recommended posts by tags
  useEffect(() => {
    if (post) {
      dispatch(
        // the result of this query is going to populate the posts object in useSelector as the state will change
        getPostsBySearch({ search: "none", tags: post?.tags.join(",") })
      );
    }
  }, [post]);

  // when the posts object got populated by the query results, we use those results as recommended posts
  // avoiding the current post to appear as recommended post
  const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

  // for redirecting the user to a clicked recommended post
  const openPost = (_id) => navigate(`/posts/${_id}`);

  // preventing errors occurring when we try to render smth before the data is actually fetched from the BE
  if (!post) return null;
  if (isLoading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  return (
    <Paper style={{ padding: "20px", borderRadius: "15px" }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">
            {post.title}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            color="textSecondary"
            component="h2"
          >
            {post.tags.map((tag) => `#${tag} `)}
          </Typography>
          <Typography gutterBottom variant="body1" component="p">
            {post.message}
          </Typography>
          <Typography variant="h6">Created by: {post.name}</Typography>
          <Typography variant="body1">
            {moment(post.createdAt).fromNow()}
          </Typography>
          <Divider style={{ margin: "20px 0" }} />
          <Typography variant="body1">
            <strong>Comments - coming soon</strong>
          </Typography>
          <Divider style={{ margin: "20px 0" }} />
        </div>
        <div className={classes.imageSection}>
          <img
            className={classes.media}
            src={
              post.selectedFile ||
              "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
            }
            alt={post.title}
          />
        </div>
      </div>
      {recommendedPosts.length && (
        <div className={classes.section}>
          <Typography gutterBottom variant="h5">
            You might also like:
          </Typography>
          <Divider />
          <div className={classes.recommendedPosts}>
            {recommendedPosts.map(
              ({ title, message, name, likes, selectedFile, _id }) => (
                <div
                  style={{ margin: "20px", cursor: "pointer" }}
                  onClick={() => {
                    openPost(_id);
                  }}
                  key={_id}
                >
                  <Typography gutterBottom variant="h6">
                    {title}
                  </Typography>
                  <Typography gutterBottom variant="subtitle2">
                    {name}
                  </Typography>
                  <Typography gutterBottom variant="subtitle2">
                    {message}
                  </Typography>
                  <Typography gutterBottom variant="subtitle1">
                    Likes: {likes.length}
                  </Typography>
                  <img src={selectedFile} width="200px" />
                </div>
              )
            )}
          </div>
        </div>
      )}
    </Paper>
  );
};

export default PostDetails;
