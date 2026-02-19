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
        return { success: true, bookings };
    } catch (error: any) {
        console.error('Error fetching bookings:', error);
        return { success: false, error: error.message, bookings: [] };
    }
}

export async function createBooking(data: {
    customerId: string;
    workerId: string;
    workerName: string;
    workerPhoto: string;
    category: string;
    startDate: string; // ISO string or date string
    address: string;
    dailyWage: number;
    totalDays: number;
    totalAmount: number;
}) {
    try {
        const booking = await prisma.booking.create({
            data: {
                customerId: data.customerId,
                workerId: data.workerId,
                workerName: data.workerName,
                workerPhoto: data.workerPhoto,
                category: data.category,
                startDate: new Date(data.startDate),
                address: data.address,
                dailyWage: data.dailyWage,
                totalDays: data.totalDays,
                totalAmount: data.totalAmount,
                status: 'pending', // Default status
            },
        });

        // Revalidate relevant paths
        // Assuming we might have a bookings page or profile page
        // accessing revalidatePath might require importing it if not already there
        // But we can just rely on client update for now or add import if needed.

        return { success: true, booking };
    } catch (error: any) {
        console.error('Error creating booking:', error);
        return { success: false, error: error.message || 'Failed to create booking' };
    }
} catch (error: any) {
    console.error('Error fetching bookings:', error);
    return { success: false, error: error.message, bookings: [] };
}
}
