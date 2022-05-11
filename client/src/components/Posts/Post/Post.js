// importing useState to implement Quick Liking - showing the like to the user while this like action is still being handled by the BE
import React, { useState } from "react";
import useStyles from "./styles";
// ButtonBase for clicking the post card to go to the card details
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  ButtonBase,
} from "@material-ui/core";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbUpAltOutlined from "@material-ui/icons/ThumbUpAltOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
// importing moment to then display smth like "Created 5 min ago" for a given post
import moment from "moment";
// importing the reducer for deleting a post by its id
import { useDispatch } from "react-redux";
import { deletePost, likePost } from "../../../actions/posts";
// enablinhg navigation to the post details
import { useNavigate } from "react-router-dom";

// passing setCurrentId for updating a post with the current id
const Post = ({ post, setCurrentId }) => {
  const classes = useStyles();
  // init the dispatch to be able to delete a post by its id
  const dispatch = useDispatch();
  // getting the logged user
  const user = JSON.parse(localStorage.getItem("profile"));
  // enablinhg navigation to the post details
  const navigate = useNavigate();
  // State for implementing showing the like to the user while this like action is still being handled by the BE
  const [likes, setLikes] = useState(post?.likes);

  // code cleaning, putting a frequiently user expression into a variable
  const userId = user?.result?.googleId || user?.result?._id;
  // adding a const for checking whether the current user like a post, boolean
  const hasLikedPost = likes.find((like) => like === userId);

  // enabling Quick Likes onClick for the like button
  const handleLike = async () => {
    dispatch(likePost(post._id));

    // checking if the current user liked the post
    if (hasLikedPost) {
      setLikes(
        // filtering out the current user's like. Because if the user already liked - next action is unlike
        post.likes.filter((id) => id !== userId)
      );
    } else {
      // else, the user wants to like the post, so adding the user's like ot the current likes
      setLikes([...post.likes, userId]);
    }
  };

  // creating the Post sub-component Likes to deal with displaying the like number and also considering the grammer of like/likes
  const Likes = () => {
    // checking if any likes
    if (likes.length > 0) {
      // checking if the current user likes a given post
      return hasLikedPost ? (
        <>
          <ThumbUpAltIcon fontSize="small" />
          &nbsp;
          {likes.length > 2
            ? `You and ${likes.length - 1} others`
            : `${likes.length} like${likes.length > 1 ? "s" : ""}`}
        </>
      ) : (
        <>
          <ThumbUpAltOutlined fontSize="small" />
          &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
        </>
      );
    }

    // if no likes for the post
    return (
      <>
        <ThumbUpAltOutlined fontSize="small" />
        &nbsp;Like
      </>
    );
  };

  // function for openning the post details, aka navigating to a specific URL containing the post details
  const openPost = (e) => {
    navigate(`/posts/${post._id}`);
  };

  return (
    <Card className={classes.card} raised elevation={6}>
      <ButtonBase
        component="span"
        className={classes.cardAction}
        onClick={openPost}
      >
        <CardMedia
          className={classes.media}
          image={post.selectedFile}
          title={post.title}
        />
        <div className={classes.overlay}>
          <Typography variant="h6">{post.name}</Typography>
          <Typography variant="body2">
            {moment(post.createdAt).fromNow()}
          </Typography>
        </div>
        {(user?.result?.googleId === post?.creator ||
          user?.result?._id === post?.creator) && (
          <div className={classes.overlay2}>
            {/*onClick={() => setCurrentId(post._id)} to change currentId in Forms and App */}
            <Button
              style={{ color: "white" }}
              size="small"
              onClick={() => setCurrentId(post._id)}
            >
              <MoreHorizIcon fontSize="medium" />
            </Button>
          </div>
        )}
        <div className={classes.details}>
          <Typography variant="body2" color="textSecondary">
            {post.tags.map((tag) => `#${tag} `)}
          </Typography>
        </div>
        <Typography className={classes.title} variant="h5" gutterBottom>
          {post.title}
        </Typography>
        <CardContent>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            gutterBottom
          >
            {post.message}
          </Typography>
        </CardContent>
      </ButtonBase>
      <CardActions className={classes.cardActions}>
        <Button
          size="small"
          color="primary"
          disabled={!user?.result}
          // Changing () => dispatch(deletePost(post._id)) to handleLike to implement Quick Likes
          onClick={handleLike}
        >
          <Likes />
        </Button>
        {/* Showing the delete button only if the user is the creator of the post */}
        {(user?.result?.googleId === post?.creator ||
          user?.result?._id === post?.creator) && (
          <Button
            size="small"
            color="primary"
            onClick={() => dispatch(deletePost(post._id))}
          >
            <DeleteIcon fontSize="small" />
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;
