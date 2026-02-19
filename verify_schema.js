const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // Try to select the new field. If it doesn't exist in DB but exists in Client, 
        // it might throw only when hitting the DB if the column is missing.
        // Or we can try to findFirst.
        const user = await prisma.user.findFirst({
            select: {
                id: true,
                resetToken: true
            }
        });
        console.log('Verification Successful: resetToken field is queryable.');
    } catch (e) {
        console.error('Verification Failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
