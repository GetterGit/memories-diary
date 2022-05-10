// importing useState for keeping track of the current id for post editing purposes
import React, { useState, useEffect } from "react";
// importing AppBar, TextField, Button to implementing pagination
import {
  Container,
  Grow,
  Grid,
  Paper,
  AppBar,
  TextField,
  Button,
} from "@material-ui/core";
// importing useNavigate and useLocation for implementing pagination
import { useNavigate, useLocation } from "react-router-dom";
// importing ChipInput for implementing pagination
// ChipInput is a normal input but works great for tags
import ChipInput from "material-ui-chip-input";
import Posts from "../Posts/Posts";
import Form from "../Form/Form";
// when Redux is set, we need to dispatch the get posts action
// useDispatch allows for dispatching any action
import { useDispatch } from "react-redux";
// getPosts as an action to dispatch in useEffect
// getPostsBySearch for getting posts by search terms
import { getPosts, getPostsBySearch } from "../../actions/posts";
import useStyles from "./styles";
// importing Pagination for navigating users to chosen posts
import Pagination from "../Pagination";

// setting up URL search params to know which page we are currently on and what search term we are looking for
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  // useState for tracking the current id for post updating
  // default null if no id is selected
  const [currentId, setCurrentId] = useState(null);
  // classes allow us to match the UI to what we set in ./styles
  const classes = useStyles();
  //defining the dispatch, useDispatch() is a hook
  const dispatch = useDispatch();
  // using useQuery() as a hook
  const query = useQuery();
  // navigate for implementing pagination
  const navigate = useNavigate();
  // below is going to read the current URL and say whether we have a page param in there. If yes, then this page param is gonna poulate the page variable
  // if no page param is found, then the user must be on the 1st page
  const page = query.get("page") || 1;
  // implementing similar to page to search query
  const searchQuery = query.get("searchQuery");

  // adding state for managing the search fields
  const [search, setSearch] = useState("");
  // adding state for tags
  const [tags, setTags] = useState([]);

  // function for searching by hitting Enter
  const handleKeyPress = (e) => {
    // 13 is the keyCode of Enter
    if (e.keyCode === 13) {
      searchPost();
    }
  };

  // function for adding tags
  // spreading previous tags in the Tag array and adding the new tag passed as a function param
  const handleAdd = (tag) => setTags([...tags, tag]);

  // function for deleting tags
  // only keeping the tags which are not equal to tagToDelete
  const handleDelete = (tagToDelete) =>
    setTags(tags.filter((tag) => tag !== tagToDelete));

  // function for searching matching posts based on provided text input and tags
  const searchPost = () => {
    // trimming to remove empty spaces
    if (search.trim() || tags) {
      // we need to provide a search query object to the action to dispatch, and that object will contain searchTerm and tags renderred into String
      dispatch(getPostsBySearch({ search, tags: tags.join(",") }));
      // when we've got the posts found from the BE, we push the user to the URL of respective search
      navigate(
        `/posts/search?searchQuery=${search || "none"}&tags=${tags.join(",")}`
      );
    } else {
      // if no searchTerm is provided, redirecting users to Home
      navigate("/");
    }
  };

  return (
    // lg = large
    // Grow provides a simple animation
    // xs and sm are the adaptations for diffent device sizes (values are given in the number of spaces)
    <Grow in>
      <Container maxWidth="xl">
        <Grid
          className={classes.gridContainer}
          container
          justifyContent="space-between"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} sm={6} md={9}>
            {/*passing the setter methods for the current id*/}
            <Posts setCurrentId={setCurrentId} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar
              className={classes.appBarSearch}
              position="static"
              color="inherit"
            >
              {/*text field to serve as our search*/}
              <TextField
                name="search"
                variant="outlined"
                label="Search Memories"
                onKeyPress={handleKeyPress}
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {/*also adding a search by tags*/}
              <ChipInput
                style={{ margin: "10px 0" }}
                value={tags}
                onAdd={handleAdd}
                onDelete={handleDelete}
                label="Search Tags"
                variant="outlined"
              />
              <Button
                onClick={searchPost}
                className={classes.searchButton}
                variant="contained"
              >
                Search
              </Button>
            </AppBar>
            {/*passing the current id to Form + setter methods for that id*/}
            <Form currentId={currentId} setCurrentId={setCurrentId} />
            {/*showing pagination only if not searching by text or tags*/}
            {!searchQuery && !tags.length && (
              <Paper className={classes.pagination} elevation={6}>
                {/* Removed useEffect with getPosts() because we will not be fetching posts from Home anymore. We'll rather pass our page to the Pagination component as a prop*/}
                <Pagination page={page} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
