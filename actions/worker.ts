'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getWorkerSettings(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) return { success: false, error: 'User not found' };

        // Find worker profile linked to this user
        // Note: Logic to link user to worker is needed. For now, we search by userId if available, or name match?
        // Since we JUST added userId, it's likely null for existing workers.
        // We need a way to link them. For now, let's assume if role is 'partner', we look for a worker with userId = user.id

        const worker = await prisma.worker.findUnique({
            where: { userId: user.id },
        });

        if (!worker) {
            return { success: false, error: 'Worker profile not found' };
        }

        return {
            success: true,
            settings: {
                quickResponse: worker.quickResponse,
                available: worker.available
            }
        };
    } catch (error: any) {
        console.error('Error fetching worker settings:', error);
        return { success: false, error: error.message };
    }
}

export async function toggleQuickResponse(email: string, status: boolean) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) return { success: false, error: 'User not found' };

        // Link User to Worker if not linked (Self-healing for now? or explicit step?)
        // Let's try to update.

        let worker = await prisma.worker.findUnique({
            where: { userId: user.id },
        });

        // Loophole: If worker exists but userId is null?
        // We'll skip complex linking for this MVP step and assume create/signup will handle it later.
        // But wait, the user wants this to work NOW.

        if (!worker) {
            // Try to find by name for backward compatibility during this transitioning phase?
            // Or just fail.
            // Let's Create a worker stub if not exists? No, that's dangerous.
            return { success: false, error: 'Worker profile not linked. Please contacting support.' };
        }

        await prisma.worker.update({
            where: { id: worker.id },
            data: { quickResponse: status },
        });

        revalidatePath('/dashboard/profile');
        return { success: true };
    } catch (error: any) {
        console.error('Error toggling quick response:', error);
        return { success: false, error: error.message };
    }
}
