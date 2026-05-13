// routes/index.ts
import { Router } from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth.js"; // Path to your Better Auth config

const router = Router();

// This mounts Better Auth at /api/v1/auth/*
router.all(/\/auth\/.*/, toNodeHandler(auth));

// Other routes (e.g., router.use('/meals', mealRoutes)) would go here

export default router;