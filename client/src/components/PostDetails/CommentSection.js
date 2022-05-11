// useRef for automatically scrolling the comment section to the latest comment
import React, { useState, useRef } from "react";
import { Typography, TextField, Button } from "@material-ui/core";
import { useDispatch } from "react-redux";

// importing commentPost to submit the comment to the BE
import { commentPost } from "../../actions/posts";

import useStyles from "./styles";

const CommentSection = ({ post }) => {
  const classes = useStyles();
  // comments state responsible for displaying new comments
  // current post's comments are displayed by default
  const [comments, setComments] = useState(post?.comments);
  //keeping track of the text field's value when writing a comment
  const [comment, setComment] = useState("");
  // enabling dispatching a comment
  const dispatch = useDispatch();
  // fetching the user to know who comments
  const user = JSON.parse(localStorage.getItem("profile"));
  // useRef for automatically scrolling the comment section to the latest comment
  const commentsRef = useRef();

  // handling the user's click on the Comment button
  // making the function async to implement immediate comments update when a new comment is added. We can do it because the dispatch action returns the updated array of comments for the post
  const handleClick = async () => {
    const finalComment = `${user.result.name}: ${comment}`;
    // dispatching the final comment and which post the comment belongs to
    const newComments = await dispatch(commentPost(finalComment, post._id));

    // setting the comments to the updated comments array
    setComments(newComments);
    // resetting the comment state back to an empty string to reset the text field value
    setComment("");

    // Automatically scrolling to the latest comment when a new comment is added by the current user
    commentsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          <Typography gutterBottom variant="h6">
            Comments
          </Typography>
          {/* Looping over the comments for a given post */}
          {comments.map((comment, index) => (
            <Typography key={index} gutterBottom variant="subtitle1">
              <strong>{comment.split(": ")[0]}</strong>
              {comment.split(":")[1]}
            </Typography>
          ))}
          {/* Automatically scrolling to the latest comment when a new comment is added by the current user. Using commentsRef as te anchor point. */}
          <div ref={commentsRef} />
        </div>
        {/* Showing the comment form only for logged users */}
        {user?.result?.name && (
          <div style={{ width: "70%" }}>
            <Typography gutterBottom variant="h6">
              Write a Comment
            </Typography>
            <TextField
              fullWidth
              minRows={4}
              variant="outlined"
              label="Comment"
              multiline
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              style={{ marginTop: "10px" }}
              fullWidth
              disabled={!comment}
              variant="contained"
              color="primary"
              onClick={handleClick}
            >
              Comment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
