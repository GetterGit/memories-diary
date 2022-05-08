// all routes related to users
import express from "express";

import { signin, signup } from "../controllers/users.js";

const router = express.Router();

// sending the form details to the BE
router.post("/signin", signin);
router.post("/signup", signup);

export default router;
