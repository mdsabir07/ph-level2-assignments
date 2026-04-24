// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    // This is the URL of your Express API
    baseURL: process.env.BACKEND_URL || "http://localhost:5000",
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "CUSTOMER",
            },
        },
    },
    // For production security
    trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],
});