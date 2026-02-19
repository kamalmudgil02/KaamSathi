'use server';

import prisma from '@/lib/prisma';
import { Worker } from '@prisma/client';

export async function getWorkers(category?: string): Promise<Worker[]> {
    try {
        const where = category ? { category } : {};
        const workers = await prisma.worker.findMany({
            where,
            orderBy: {
                rating: 'desc',
            },
        });
        return workers;
    } catch (error) {
        console.error('Failed to fetch workers:', error);
        return [];
    }
}

export async function getWorkerById(id: string): Promise<Worker | null> {
    try {
        const worker = await prisma.worker.findUnique({
            where: { id },
        });
        return worker;
    } catch (error) {
        console.error(`Failed to fetch worker with id ${id}:`, error);
        return null;
    }
}
