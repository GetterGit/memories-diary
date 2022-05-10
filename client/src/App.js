import React from "react";
import { Container } from "@material-ui/core";
// making our App multipage using Router
// importing Redirect for making pagination work
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";
import PostDetails from "./components/PostDetails/PostDetails";

/* 
1. For post editing purposes, we need to keep track of the current id. 
2. We need to do it in App.js because we have to share the state of the current id between Posts and Form, and App.js is the only parent component for both Posts and Form
  */

const App = () => {
  // checking whether the user is logged in to render Auth accordingly
  const user = JSON.parse(localStorage.getItem("profile"));

  return (
    <BrowserRouter>
      <Container maxwidth="xl">
        <Navbar />
        <Routes>
          {/* Implementing a callback function returning Navigate (instead of directly redirecting the user to Home) in order to implement pagination. 
          Below the user is automatically redirected to '/posts' if goes to '/' */}
          <Route path="/" exact element={<Navigate to="/posts" />} />
          <Route path="/posts" exact element={<Home />} />
          <Route path="/posts/search" exact element={<Home />} />
          {/* Below is the post details path defined by the dynamic id */}
          <Route path="/posts/:id" element={<PostDetails />} />
          {/* Rendering Auth only if the user is logged in */}
          <Route
            path="/auth"
            exact
            element={!user ? <Auth /> : <Navigate to="/posts" />}
          />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;
