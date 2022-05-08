// importing useEffect to populate the values of the form with the values of the post chosen to be editted
import React, { useState, useEffect } from "react";
import useStyles from "./styles";
import { TextField, Button, Typography, Paper } from "@material-ui/core";
import FileBase from "react-file-base64";
// importing useDispatch to be able to dispatach a new post to be created
// importing useSelector now, when the currentId is set to be passed to the form for the post edition, we need to pass the current pos contents to the form as well
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../../actions/posts";

// for updating existing posts: once we click ... in the post card, we need to pass the id of this specific post to the form component
// passing currentId and its set method as props for updating a post with the chosen id
const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
  });

  // now, when the currentId is set to be passed to the form for the post edition, we need to pass the current pos contents to the form as well
  // if currentId is not null, finding and returning the post (p) with this id
  const post = useSelector((state) =>
    currentId ? state.posts.find((p) => p._id === currentId) : null
  );
  const classes = useStyles();
  // enabling action dispatching, then need to decide where we want to dispatch actions
  const dispatch = useDispatch();
  // adding the name of the user to be recorded for a given post which is being created. Note, that the creator is gonna be this user's id
  const user = JSON.parse(localStorage.getItem("profile"));

  // to populate the values of the form with the values of the post chosen to be editted
  // running the arrow function when the post value changes
  useEffect(() => {
    // if the post is chosen to be editted, populate the form fields with that post's data
    if (post) setPostData(post);
  }, [post]);

  const handleSubmit = (e) => {
    // preventing event default not to get refresh on the browser
    e.preventDefault();

    // adding IF statement to differentiate between post creation and post edition
    if (currentId) {
      dispatch(
        updatePost(currentId, { ...postData, name: user?.result?.name })
      );
    } else {
      // adding the name of the user to be recorded for a given post which is being created. Note, that the creator is gonna be this user's id
      dispatch(createPost({ ...postData, name: user?.result?.name }));
    }

    clear();

    // once the action is dispatched, we need to go to reducers
  };

  // for clearing the Form by clicking the Clear button
  const clear = () => {
    setCurrentId(null);
    setPostData({
      title: "",
      message: "",
      tags: "",
      selectedFile: "",
    });
  };

  // if no logged in users, show a card saying that the post cannot be created unless logged in
  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please, sign in to create your memories or like memories
        </Typography>
      </Paper>
    );
  }

  return (
    // Paper is a div which has a white-ish backgroun
    // TextField values are gonna be stored in an object in the state, and then object key is going to be a specific text field (e.g. value={postData.creator})
    // with onChange we have an object in the state and we want to update just 1 of the object's properties. We use the below syntax where e is event. Using ...postData means all data is going to persist for the object apart from the specified property
    <Paper className={classes.paper}>
      <form
        autoComplete="off"
        noValidate
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">
          {currentId ? "Editing" : "Creating"} a Memory
        </Typography>
        <TextField
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <TextField
          name="message"
          variant="outlined"
          label="Message"
          fullWidth
          multiline
          maxRows={4}
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
        />
        <TextField
          name="tags"
          variant="outlined"
          label="Tags (coma separated)"
          fullWidth
          value={postData.tags}
          onChange={(e) =>
            setPostData({ ...postData, tags: e.target.value.split(",") })
          }
        />
        <div className={classes.fileInput}>
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          />
        </div>
        <Button
          className={classes.buttonSubmit}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          fullWidth
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={clear}
          fullWidth
        >
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default Form;
