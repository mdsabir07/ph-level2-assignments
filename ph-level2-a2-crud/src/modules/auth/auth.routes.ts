import express from "express";
import { authControllers } from "./auth.controller";

const router = express.Router();
// Sing up user
router.post("/signup", authControllers.signUp);

// SignIn user
router.post("/signin", authControllers.signIn);

export const authRoutes = router;