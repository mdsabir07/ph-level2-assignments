// assinment link: https://github.com/Apollo-Level2-Web-Dev/B6A4/blob/main/2-FoodHub.md

backend live: https://dishmarket-backend.onrender.com
https://dashboard.render.com/
frontend live: https://dishmarket-psi.vercel.app/
https://vercel.com/sabirs-projects-9eb3df7f/dishmarket/DnZKjFYPZ1GcnXNHR9ehmhF3DbfJ

/* going to use prisma with postgresql, follow the instructions here:
https://www.prisma.io/docs/prisma-orm/quickstart/postgresql

Initialize a TypeScript project:
pnpm init
pnpm add typescript tsx @types/node --save-dev
pnpm dlx tsc --init Or pnpm tsc --init

OR

npm init
npm install typescript tsx @types/node --save-dev
npx tsc --init
*/

// # update pnpm version: pnpm add -g pnpm

/* 2. Install required dependencies
pnpm add prisma @types/pg --save-dev
pnpm add @prisma/client @prisma/adapter-pg pg dotenv

OR

npm install prisma @types/pg --save-dev
npm install @prisma/client @prisma/adapter-pg pg dotenv
*/

/*
3. Configure ESM support
Update tsconfig.json for ESM compatibility:
remove all codes in tsconfig.json and replace with the following:
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2023",
    "strict": true,
    "esModuleInterop": true,
    "ignoreDeprecations": "6.0"
  }
}

Update package.json to enable ESM:
{
  "type": "module"
}
*/

/*
4. Initialize Prisma ORM
pnpm dlx prisma
pnpm dlx prisma init --datasource-provider postgresql --output ../generated/prisma

OR

npx prisma

Next, set up your Prisma ORM project by creating your Prisma Schema file with the following command:
npx prisma init --output ../generated/prisma
*/

/* # Now conncet postgresql database to prisma, open the .env file and update the DATABASE_URL with your postgresql connection string, for example: from neon display: 'block',
https://console.neon.tech/
*/

// Now install express and cors
// pnpm add express cors

// now refine the tsconfig.json file to include the following:
// {
//   "compilerOptions": {
//     "module": "ESNext",
//     "moduleResolution": "bundler",
//     "target": "ES2023",
//     "strict": true,
//     "esModuleInterop": true,
//     "ignoreDeprecations": "6.0",
//     "outDir": "./dist"
//   },
//   "include": ["src/**/*.ts", "prisma.config.ts"],
//   "exclude": ["node_modules", "dist", "generated"]
// }

/*
# Now integrate with database, follow the steps below:

DATABASE_URL="postgresql://neondb_owner:npg_56SpuHtwaneo@ep-misty-firefly-atzui2ws-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connect_timeout=30"

DIRECT_URL="postgresql://neondb_owner:npg_56SpuHtwaneo@ep-misty-firefly-atzui2ws.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require"

*/

/*
5. Define your data models
Open the generated Prisma schema file (e.g., prisma/schema.prisma) and define your data models. For example:

prisma/schema.prisma

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User { 
  id    Int     @id @default(autoincrement()) 
  email String  @unique
  name  String?
  posts Post[]
} 

model Post { 
  id        Int     @id @default(autoincrement()) 
  title     String
  content   String?
  published Boolean @default(false) 
  author    User    @relation(fields: [authorId], references: [id]) 
  authorId  Int
} 
  */

/*
 6. create and apply migrations
 npx prisma migrate dev --name init
 This command creates the database tables based on your schema.

Now run the following command to generate the Prisma Client:
npx prisma generate
*/



/*
7. Instantiate Prisma Client
lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
*/

/*
create prisma connector file: src/server.ts
import { prisma } from "./lib/prisma";

async function main() {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");
    } catch (error) {
        console.error("Error in main function: ", error);
    }
}

create app.ts file to run the server: src/app.ts
import express from "express"; need to install express and cors
pnpm add -D @types/express
*/

/*
8. Write modules (e.g., meals, users, orders) and implement CRUD operations using Prisma Client in your Express routes.

meal.service.ts
import { prisma } from "../../lib/prisma";

export class MealService {
    // Create a new meal (Provider Feature)
    async createMeal(mealData: {
        name: string;
        description: string;
        price: number;
        image?: string;
        categoryId: string;
        userId: string;
    }) {
        const { categoryId, userId } = mealData;

        const [category, user] = await Promise.all([
            prisma.category.findUnique({
                where: { id: categoryId },
                select: { id: true },
            }),
            prisma.user.findUnique({
                where: { id: userId },
                select: { id: true },
            }),
        ]);

        if (!category || !user) {
            throw new Error("Invalid categoryId or userId. Make sure the referenced category and user exist.");
        }

        return await prisma.meal.create({
            data: mealData,
        });
    }

    // Get all meals with optional filters (Public Feature)
    async getAllMeals(filters: {
        categoryId?: string | undefined;
        isAvailable?: boolean | undefined;
        search?: string | undefined;
    }) {
        const { categoryId, isAvailable, search } = filters;

        return await prisma.meal.findMany({
            where: {
                ...(categoryId && { categoryId }),
                ...(isAvailable !== undefined && { isAvailable }),
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { description: { contains: search, mode: "insensitive" } },
                    ],
                }),
            },
            include: {
                category: {
                    select: {
                        name: true, slug: true
                    },
                },
            },
        });
    }

    // Get a specific meal by ID (Public Feature)
    async getMealById(id: string) {
        return await prisma.meal.findUnique({
            where: { id },
            include: {
                category: true,
                provider: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }
}

meal.controller.ts
meal.router.ts

than test the API using Postman or any other API testing tool.
http://localhost:4000/api/meals
http://localhost:4000/api/meals?available=true&search=pepperoni
http://localhost:4000/api/meals/bgft1ktzvk9i5vwes7js81uc
*/


// # Now going integrate better auth
https://better-auth.com/docs/installation
install: pnpm add better-auth

created necessary schema (custom scheam as per the project requirements), than apply migration command: pnpm prisma migrate dev --name init_better_auth_tables
 
 
/*
want to sync the DB:
npx prisma db push
*/