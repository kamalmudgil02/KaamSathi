import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Clearing database...');
        // Delete in order to respect foreign keys if any (Booking depends on User/Worker)
        await prisma.booking.deleteMany({});
        console.log('Deleted all bookings.');

        await prisma.user.deleteMany({});
        console.log('Deleted all users (logins/signups).');

        await prisma.worker.deleteMany({});
        console.log('Deleted all workers.');

        console.log('Database cleared successfully.');
    } catch (error) {
        console.error('Error clearing database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
