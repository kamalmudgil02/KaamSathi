'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, role: UserRole) => Promise<boolean>;
    signup: (name: string, email: string, password: string, phone: string, role: UserRole) => Promise<boolean>;
    logout: () => void;
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

    const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
        // Mock login - in production, this would call your API
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            const mockUser: User = {
                id: Math.random().toString(36).substr(2, 9),
                name: email.split('@')[0],
                email,
                phone: '+91 9876543210',
                role,
                photo: '/placeholder-worker.jpg',
            };

            setUser(mockUser);
            localStorage.setItem('kaamsaathi_user', JSON.stringify(mockUser));
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const signup = async (
        name: string,
        email: string,
        password: string,
        phone: string,
        role: UserRole
    ): Promise<boolean> => {
        // Mock signup - in production, this would call your API
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const mockUser: User = {
                id: Math.random().toString(36).substr(2, 9),
                name,
                email,
                phone,
                role,
                photo: '/placeholder-worker.jpg',
            };

            setUser(mockUser);
            localStorage.setItem('kaamsaathi_user', JSON.stringify(mockUser));
            return true;
        } catch (error) {
            console.error('Signup failed:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('kaamsaathi_user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                signup,
                logout,
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
