import express from "express";
const router = express.Router(); // creating the instance of route
// import loginController from '../controllers/loginController.js';
import { verifyToken } from "../Middlewares/verifyToken.js";
import {
  loginUsers,
  signupUsers,
  logoutUsers,
} from "../Controllers/loginController.js";

router.post("/login", loginUsers); // post route for the login and implementing loginUser function

// Route for user signup
router.post("/signup", signupUsers); // post route for the signup and implementing the signup function

// Route for user logout
router.post("/logout", logoutUsers); // post route for the logout and implementing the logout function
export default router;
