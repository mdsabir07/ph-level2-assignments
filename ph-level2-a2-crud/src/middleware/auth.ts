import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

// Custom JWT Payload type definition
interface MainJwtPayload extends jwt.JwtPayload {
    id: number;
    role: string;
}

const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get authorization Headers
            const authHeader = req.headers.authorization;

            // Check if the authorization header exists and follows the 'Bearer token' format
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    message: "Authorization header is missing or in the wrong format. Please, provide a Bearer token."
                });
            };
            // Extract the token by splitting the string at 'Bearer '
            const token = authHeader.split(" ")[1];

            if(!token){
                return  res.status(401).json({
                    message: "Access denied. No token provided."
                });
            }

            // Verify the token using the secret
            const decoded = jwt.verify(token, config.jwtSecret as string) as MainJwtPayload;

            // attach decoded user
            req.user = decoded;

            // Check if the user's role is authorized to access the resource
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({
                    message: "Forbidden: you don't have the required permissions!"
                });
            }

            next();
        } catch (error: any) {
            // Handle errors (e.g., expired token, invalid token)
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token has expired. Please log in again." });
            }
            return res.status(401).json({
                success: false,
                message: error.message || "Unauthorized access."
            });
        }
    }
}
export default auth;