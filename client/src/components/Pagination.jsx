import React from "react";
import { Pagination, PaginationItem } from "@material-ui/lab";
import { Link } from "react-router-dom";

import userStyles from "./styles";

const Paginate = () => {
  const classes = userStyles();

  // count is the num of pages. We will have to dynamically fetch the num of pages depending on the num of posts we have
  return (
    <Pagination
      classes={{ ul: classes.ul }}
      count={5}
      page={1}
      variant="outlined"
      color="primary"
      /* 1. Passing an item as a prop 
      2. And then spreading this item to pass all the data from the item inside PaginationItem 
      3. Making PaginationItem a link and linking the user to some page which is fetched dynamically
        */
      renderItem={(item) => (
        <PaginationItem {...item} component={Link} to={`/posts?page=${1}`} />
      )}
    />
  );
};

export default Paginate;
