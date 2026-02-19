'use server';

import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';

// Simulated email sender
async function sendEmail(to: string, subject: string, text: string) {
    console.log(`
    ========================================
    EMAIL SIMULATION
    To: ${to}
    Subject: ${subject}
    Body:
    ${text}
    ========================================
    `);
    // In production, use Resend, SendGrid, etc.
    return true;
}

export async function forgotPassword(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Return success even if user not found to prevent enumeration
            return { success: true, message: 'If an account exists, a reset link has been sent.' };
        }

        // Generate token
        const token = randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 3600000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: token,
                resetTokenExpiry: expiry,
            },
        });

        // Send email
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
        await sendEmail(
            email,
            'Reset your password - KaamSaathi',
            `Click here to reset your password: ${resetLink}`
        );

        return { success: true, message: 'If an account exists, a reset link has been sent.' };
    } catch (error: any) {
        console.error('Forgot password error:', error);
        return { success: false, error: 'Something went wrong. Please try again.' };
    }
}

export async function resetPassword(token: string, newPassword: string) {
    try {
        // Find user with valid token
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            return { success: false, error: 'Invalid or expired reset token.' };
        }

        // Update password (using simple hash for MVP as per auth.ts)
        // Note: Ideally import hash function from auth.ts or utils
        // For now, duplicating simple hash to avoid circular deps or refactoring
        const crypto = require('crypto');
        const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return { success: true, message: 'Password reset successfully. You can now login.' };
    } catch (error: any) {
        console.error('Reset password error:', error);
        return { success: false, error: 'Failed to reset password.' };
    }
}
