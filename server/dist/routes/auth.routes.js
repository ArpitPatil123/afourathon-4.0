import { Router } from "express";
import { registerDriver } from "../controllers/auth.controller.js";
const router = Router();
// Register a new user
router.post("/register", registerDriver);
// Login a user
export default router;
