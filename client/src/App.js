import React from "react";
import { Container } from "@material-ui/core";
// making our App multipage using Router
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";

/* 
1. For post editing purposes, we need to keep track of the current id. 
2. We need to do it in App.js because we have to share the state of the current id between Posts and Form, and App.js is the only parent component for both Posts and Form
  */

const App = () => {
  return (
    <BrowserRouter>
      <Container maxwidth="lg">
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/auth" exact element={<Auth />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;
