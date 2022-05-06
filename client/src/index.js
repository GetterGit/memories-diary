import React from "react";
import ReactDOM from "react-dom";
// initializing Redux
// Provider will keep track of that store which is the global state that can be accessed from anywhere inside of the App including both parent and child components
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import reducers from "./reducers";

import App from "./App";
import "./index.css";

// setting up Redux
const store = createStore(reducers, compose(applyMiddleware(thunk)));

// now, wrapping App in Provider after the store variable is successfully created
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
