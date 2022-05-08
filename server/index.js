import exress from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

// first, init the App
const app = exress();
// init dotenv
dotenv.config();

// using express middleware to connect the routes to the App

// now, we can use different methods on this App instance
// setting the limit for images we will be sending
app.use(bodyParser.json({ limit: "30mb", extended: true }));
// setting up bodyParser to be sending requests properly
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// setting up the starting path for all routes inside posts.js
app.use("/posts", postRoutes);
// routes for the users
app.use("/user", userRoutes);

// using MongoDB Atlas
const PORT = process.env.PORT;

// mongoose.connect returns a promise
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
