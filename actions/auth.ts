'use server';

import prisma from '@/lib/prisma';
import { User, UserRole } from '@/types';
import { revalidatePath } from 'next/cache';

// Simple password hashing (in production, use bcrypt/argon2)
const hashPassword = (pass: string) => Buffer.from(pass).toString('base64');

export async function login(email: string, password: string, role: UserRole): Promise<User | null> {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) return null;

        // Check password
        if (user.password !== hashPassword(password)) return null;

        // Check role (optional)
        if (user.role !== role) return null;

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
}

export async function signup(
    name: string,
    email: string,
    password: string,
    phone: string,
    role: UserRole
): Promise<User | null> {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) return null;

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

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
    } catch (error) {
        console.error('Signup error:', error);
        return null;
    }
}

export async function updateProfile(email: string, data: Partial<User>): Promise<User | null> {
    try {
        const user = await prisma.user.update({
            where: { email },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
    } catch (error) {
        console.error('Update profile error:', error);
        return null;
    }
}
