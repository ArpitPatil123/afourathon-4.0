import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
const router = Router();
// Register a new user
router.post("/register", registerUser);
// Login a user
router.post("/login", loginUser);
export default router;
