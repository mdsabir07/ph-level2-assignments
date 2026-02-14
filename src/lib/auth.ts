import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verifyUrl = `${url}/verify-email?token=${token}`;
        // console.log("Verification URL:", verifyUrl);
        const info = await transporter.sendMail({
          from: '"ERD prisma" <prisma@ethereal.email>',
          to: user.email,
          subject: "Verify Your Email Address",
          html:
            `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f7;
                margin: 0;
                padding: 0;
              }
              .email-container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .email-header {
                background-color: #4a90e2;
                color: #ffffff;
                text-align: center;
                padding: 20px;
                font-size: 24px;
                font-weight: bold;
              }
              .email-body {
                padding: 30px;
                color: #333333;
                line-height: 1.6;
              }
              .email-body h2 {
                color: #4a90e2;
              }
              .verify-button {
                display: inline-block;
                padding: 12px 25px;
                margin: 20px 0;
                background-color: #4a90e2;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
              }
              .footer {
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #999999;
              }
              @media (max-width: 600px) {
                .email-container {
                  margin: 20px;
                }
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="email-header">
                ERD Prisma
              </div>
              <div class="email-body">
                <h2>Verify Your Email Address</h2>
                <p>Hello ${user.name || user.email},</p>
                <p>Thank you for signing up! Please click the button below to verify your email address:</p>
                <p style="text-align:center;">
                  <a href="${verifyUrl}" class="verify-button">Verify Email</a>
                </p>
                <p>If the button doesn’t work, copy and paste the following link into your browser:</p>
                <p style="word-break: break-word;"><a href="${verifyUrl}">${verifyUrl}</a></p>
                <p>Thank you,<br>The ERD Prisma Team</p>
              </div>
              <div class="footer">
                &copy; 2026 ERD Prisma. All rights reserved.
              </div>
            </div>
          </body>
          </html>
        `
        });
        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});