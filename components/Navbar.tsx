'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LogOut, User, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const { language, toggleLanguage, t } = useLanguage();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-white shadow-md sticky top-0 z-50"
        >
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={isAuthenticated ? `/dashboard/${user?.role}` : '/'}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center space-x-2"
                        >
                            <span className="text-2xl font-bold text-gradient">
                                {t('landing.title')}
                            </span>
                        </motion.div>
                    </Link>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Language Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleLanguage}
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                            aria-label="Toggle Language"
                        >
                            <Globe className="w-5 h-5 text-primary-600" />
                            <span className="font-medium text-neutral-700">
                                {language === 'en' ? 'हिं' : 'EN'}
                            </span>
                        </motion.button>

                        {/* User Menu */}
                        {isAuthenticated && user && (
                            <>
                                <Link href="/dashboard/profile">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="flex items-center space-x-2 px-3 py-2 bg-neutral-100 rounded-lg cursor-pointer hover:bg-neutral-200 transition-colors"
                                    >
                                        <User className="w-5 h-5 text-primary-600" />
                                        <span className="font-medium text-neutral-700">{user.name}</span>
                                    </motion.div>
                                </Link>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={logout}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>{t('nav.logout')}</span>
                                </motion.button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
