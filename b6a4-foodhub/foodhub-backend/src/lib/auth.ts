import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import config from "../config/index.js";

export const auth = betterAuth({
    baseURL: config.better_auth_url,
    basePath: "/api/v1/auth",
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
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
}) as any;

// Handle provider profile creation after user registration
auth.hooks?.register?.add?.(async (user: any) => {
    if (user.role === 'PROVIDER') {
        try {
            await prisma.providerProfile.create({
                data: {
                    userId: user.id,
                    businessName: `${user.name || 'New'}'s Kitchen`,
                    address: "Update your address",
                    contactNumber: "000-000-0000",
                },
            });
        } catch (error) {
            console.error('Failed to create provider profile:', error);
        }
    }
});