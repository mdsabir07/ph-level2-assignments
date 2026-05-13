import { Router } from "express";
import { createMeal } from "./meal.controller.js";

const router = Router();

router.post("/create-meal", createMeal);

export const mealRoutes = router;