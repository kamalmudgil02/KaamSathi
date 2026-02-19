'use server';

import prisma from '@/lib/prisma';
import { Booking } from '@prisma/client';

export async function getBookingSlots(email: string, role: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) return { success: false, error: 'User not found', bookings: [] };

        let bookings: Booking[] = [];

        if (role === 'customer') {
            bookings = await prisma.booking.findMany({
                where: { customerId: user.id },
                orderBy: { startDate: 'desc' },
            });
        } else if (role === 'partner') {
            // Find worker profile
            // Use findFirst if findUnique complains about optional unique fields in some prisma versions,
            // but findUnique is correct for @unique.
            // We cast to any to bypass potential stale type definition issues if generation failed.
            const worker = await prisma.worker.findUnique({
                where: { userId: user.id } as any,
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
