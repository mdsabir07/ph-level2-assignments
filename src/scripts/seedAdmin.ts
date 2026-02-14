import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";

async function seedAdmin() {
    try {
        console.log("***** Admin seeding started...");
        const adminData = {
            name: "Admin2 Saheb",
            email: "admin2@admin.com",
            role: UserRole.ADMIN,
            password: "admin123password"
        }
        console.log("Checking admin exist or not...");
        // Check user exist on db or not
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        });
        if (existingUser) {
            throw new Error("User already exist!!")
        }

        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "http://localhost:4000"
            },
            body: JSON.stringify(adminData)
        });



        if (signUpAdmin.ok) {
            console.log("***** admin created successfully!");
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            });
            console.log("Email verification status updated..");
        }
        console.log("*** SUCCESS!!..");
    } catch (error) {
        console.error(error);
    }
}

seedAdmin();