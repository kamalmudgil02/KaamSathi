'use server';

import prisma from '@/lib/prisma';

export async function getBookingSlots(email: string, role: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) return { success: false, error: 'User not found', bookings: [] };

        let bookings = [];

        if (role === 'customer') {
            bookings = await prisma.booking.findMany({
                where: { customerId: user.id },
                orderBy: { startDate: 'desc' },
            });
        } else if (role === 'partner') {
            // Find worker profile
            const worker = await prisma.worker.findUnique({
                where: { userId: user.id },
            });

            if (worker) {
                bookings = await prisma.booking.findMany({
                    where: { workerId: worker.id },
                    orderBy: { startDate: 'desc' },
                });
            }
        }

        return { success: true, bookings };
    } catch (error: any) {
        console.error('Error fetching bookings:', error);
        return { success: false, error: error.message, bookings: [] };
    }
}
