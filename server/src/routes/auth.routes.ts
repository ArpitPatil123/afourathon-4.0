import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { validateEmail } from "../middlewares/validateEmail.js";

const router: Router = Router();

// Register a new user
router.post("/register", validateEmail, registerUser);

// Login a user
router.post("/login", validateEmail, loginUser);

export default router;
