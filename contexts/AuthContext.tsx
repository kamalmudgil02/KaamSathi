'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { login as loginAction, signup as signupAction, updateProfile as updateProfileAction } from '@/actions/auth';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, role: UserRole) => Promise<boolean>;
    signup: (name: string, email: string, password: string, phone: string, role: UserRole) => Promise<boolean>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<boolean>;
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
        try {
            const user = await loginAction(email, password, role);
            if (user) {
                setUser(user);
                localStorage.setItem('kaamsaathi_user', JSON.stringify(user));
                return true;
            }
            return false;
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
        try {
            const user = await signupAction(name, email, password, phone, role);
            if (user) {
                setUser(user);
                localStorage.setItem('kaamsaathi_user', JSON.stringify(user));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Signup failed:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('kaamsaathi_user');
    };

    const updateProfile = async (data: Partial<User>): Promise<boolean> => {
        try {
            if (!user) return false;

            // We need email to identify the user in DB
            const updatedUser = await updateProfileAction(user.email, data);

            if (updatedUser) {
                setUser(updatedUser);
                localStorage.setItem('kaamsaathi_user', JSON.stringify(updatedUser));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Update profile failed:', error);
            return false;
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
