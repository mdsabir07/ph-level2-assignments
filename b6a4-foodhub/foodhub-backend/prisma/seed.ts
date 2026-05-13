import { prisma } from '../src/lib/prisma.js';
import bcrypt from 'bcrypt';


async function main() {
    // hash the password for the Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Upsert the Admin (prevents duplicate on re-run)
    await prisma.user.upsert({
        where: { email: 'admin@foodhub.com' },
        update: {

        },
        create: {
            name: 'Admin',
            email: 'admin@foodhub.com',
            password: hashedPassword,
            role: 'ADMIN'
        },
    });

    // Seed categories
    const categories = ['Burgers', 'Pizza', 'Sushi', 'Desserts', 'Healthy'];
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { name: cat },
            update: {},
            create: { name: cat },
        });

        console.log('✅ Seed data (Admin & Categories) inserted successfully');
    }

    main()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        })
}