import { Request, Response } from "express";
import { authServices } from "./auth.service";

// SignUp user 
const signUp = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Log the incoming request body
        console.log('Request body:', req.body);

        const { name, email, password, phone } = req.body;

        const result = await authServices.signUp(name, email, password, phone);
        if (result === null) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        res.status(201).json({
            success: true,
            message: "User created successfully!",
            data: result.user
        });
    } catch (error: any) {
        console.error("Error during sign-up:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

// SignIn user 
const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const result = await authServices.signIn(email, password);

        if (!result) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        res.status(200).json({
            success: true,
            message: "Login successful!",
            data: result
        });
    } catch (error: any) {
        console.error('Error during login:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const authControllers = {
    signUp,
    signIn
}