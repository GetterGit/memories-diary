// useEffect to fetch posts any time the page changes
import React, { useEffect } from "react";
// dispatch required for fetching posts
// useSelector for selecting some things from our current state
import { useDispatch, useSelector } from "react-redux";
import { Pagination, PaginationItem } from "@material-ui/lab";
import { Link } from "react-router-dom";

// for getting posts when the page changes
import { getPosts } from "../actions/posts";

import userStyles from "./styles";

const Paginate = ({ page }) => {
  // using selector to get a num of pages from the posts object we are receiving from the BE
  const { numberOfPages } = useSelector((state) => state.posts);
  const classes = userStyles();
  // dispatch required for fetching posts
  const dispatch = useDispatch();

  // fetching posts any time the page changes
  useEffect(() => {
    if (page) {
      dispatch(getPosts(page));
    }
  }, [dispatch, page]);

  // count is the num of pages. We will have to dynamically fetch the num of pages depending on the num of posts we have
  return (
    <Pagination
      classes={{ ul: classes.ul }}
      count={numberOfPages}
      page={Number(page) || 1}
      variant="outlined"
      color="primary"
      /* 1. Passing an item as a prop 
      2. And then spreading this item to pass all the data from the item inside PaginationItem 
      3. Making PaginationItem a link and linking the user to some page which is fetched dynamically
        */
      renderItem={(item) => (
        <PaginationItem
          {...item}
          component={Link}
          to={`/posts?page=${item.page}`}
        />
      )}
    />
  );
};

export default Paginate;
