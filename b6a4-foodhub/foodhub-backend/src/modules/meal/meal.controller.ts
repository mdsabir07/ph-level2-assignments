import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export const createMeal = async (req: Request, res: Response) => {
    try {
        const { name, description, price, categoryId, providerId, imageUrl } = req.body;
        const result = await prisma.meal.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                categoryId,
                providerId,
                imageUrl
            },
        });
        res.status(201).json({
            success: true,
            message: "Meal created successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Error creating meal",
            data: null,
        });
    }
}