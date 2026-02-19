'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { login as loginAction, signup as signupAction, updateProfile as updateProfileAction } from '@/actions/auth';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
    signup: (name: string, email: string, password: string, phone: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = localStorage.getItem('kaamsaathi_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
        try {
            const result = await loginAction(email, password, role);
            if (result.success && result.user) {
                setUser(result.user);
                localStorage.setItem('kaamsaathi_user', JSON.stringify(result.user));
                return { success: true };
            }
            return { success: false, error: result.error || 'Login failed' };
        } catch (error: any) {
            console.error('Login failed:', error);
            return { success: false, error: error.message || 'Unexpected login error' };
        }
    };

    const signup = async (
        name: string,
        email: string,
        password: string,
        phone: string,
        role: UserRole
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            const result = await signupAction(name, email, password, phone, role);
            if (result.success && result.user) {
                setUser(result.user);
                localStorage.setItem('kaamsaathi_user', JSON.stringify(result.user));
                return { success: true };
            }
            return { success: false, error: result.error || 'Signup failed' };
        } catch (error: any) {
            console.error('Signup failed:', error);
            return { success: false, error: error.message || 'Unexpected signup error' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('kaamsaathi_user');
    };

    const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
        try {
            if (!user) return { success: false, error: 'No user logged in' };

            // We need email to identify the user in DB
            const result = await updateProfileAction(user.email, data);

            if (result.success && result.user) {
                setUser(result.user);
                localStorage.setItem('kaamsaathi_user', JSON.stringify(result.user));
                return { success: true };
            }
            return { success: false, error: result.error || 'Update failed' };
        } catch (error: any) {
            console.error('Update profile failed:', error);
            return { success: false, error: error.message || 'Unexpected update error' };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                signup,
                logout,
                updateProfile,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
