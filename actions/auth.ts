'use server';

import prisma from '@/lib/prisma';
import { User, UserRole } from '@/types';
import { revalidatePath } from 'next/cache';

// Simple password hashing (in production, use bcrypt/argon2)
const hashPassword = (pass: string) => Buffer.from(pass).toString('base64');

export type AuthResult = {
    success: boolean;
    user?: User;
    error?: string;
};

export async function login(email: string, password: string, role: UserRole): Promise<AuthResult> {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) return { success: false, error: 'User not found.' };

        // Check password
        if (user.password !== hashPassword(password)) return { success: false, error: 'Invalid password.' };

        // Check role (optional)
        if (user.role !== role) return { success: false, error: 'Invalid role for this user.' };

        // Return user without password
        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role as UserRole,
                phone: user.phone || '', // Handle null
                photo: user.photo || undefined,
            }
        };
    } catch (error: any) {
        console.error('Login error:', error);
        return { success: false, error: error.message || 'Database connection failed.' };
    }
}

export async function signup(
    name: string,
    email: string,
    password: string,
    phone: string,
    role: UserRole
): Promise<AuthResult> {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) return { success: false, error: 'Email already registered.' };

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword(password),
                phone,
                role,
                photo: '/placeholder-worker.jpg', // Default photo
            },
        });

        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role as UserRole,
                phone: user.phone || '',
                photo: user.photo || undefined,
            }
        };
    } catch (error: any) {
        console.error('Signup error:', error);
        return { success: false, error: error.message || 'Signup failed. Please try again.' };
    }
}

export async function updateProfile(email: string, data: Partial<User>): Promise<AuthResult> {
    try {
        // Start a transaction to ensure consistency if we need to update multiple tables
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { email },
                data: {
                    ...data,
                    updatedAt: new Date(),
                },
            });

            // If user is a partner and photo is updated, sync with Worker profile
            if (user.role === 'partner' && data.photo) {
                // Find worker linked to this user
                const worker = await tx.worker.findUnique({
                    where: { userId: user.id } as any,
                });

                if (worker) {
                    await tx.worker.update({
                        where: { id: worker.id },
                        data: { photo: data.photo },
                    });
                }
            }

            return user;
        });

        return {
            success: true,
            user: {
                id: result.id,
                name: result.name,
                email: result.email,
                role: result.role as UserRole,
                phone: result.phone || '',
                photo: result.photo || undefined,
            }
        };
    } catch (error: any) {
        console.error('Update profile error:', error);
        return { success: false, error: error.message || 'Update failed.' };
    }
}
