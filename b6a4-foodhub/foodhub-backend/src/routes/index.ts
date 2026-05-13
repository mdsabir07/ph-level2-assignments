// routes/index.ts
import { Router } from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth.js"; // Path to your Better Auth config
import { mealRoutes } from '../modules/meal/meal.route.js';

const router = Router();

// This mounts Better Auth at /api/v1/auth/*
router.all(/\/auth\/.*/, toNodeHandler(auth));

// mealRoutes
router.use('/meals', mealRoutes);

export default router;