'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import { User, Mail, Phone, Shield, Globe, Bell, Moon, Save } from 'lucide-react';
import Link from 'next/link';

import { useTheme } from 'next-themes';

export default function ProfilePage() {
    const { user, isAuthenticated, updateProfile } = useAuth();
    const { t, language, toggleLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        role: ''
    });

    // Initialize form data when user is loaded
    React.useEffect(() => {
        setMounted(true);
        if (user) {
            setFormData({
                name: user.name,
                phone: user.phone || '',
                email: user.email,
                role: user.role
            });
        }
    }, [user]);

    const handleSave = async () => {
        if (user) {
            await updateProfile({
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                role: formData.role as any // Type cast if needed, or update AuthContext types
            });
            setIsEditing(false);
        }
    };

    if (!mounted) {
        return null;
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 dark:text-white">Please login to view profile</h2>
                    <Link href="/" className="text-primary-600 hover:underline">Return Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
            <Navbar />

            <main className="container-custom py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-8">{t('profile.title')}</h1>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Profile Info Column */}
                        <div className="md:col-span-2 space-y-8">
                            {/* Personal Details Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 border border-neutral-100 dark:border-neutral-700 transition-colors duration-300"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
                                        <User className="w-5 h-5 text-primary-500" />
                                        {t('profile.details')}
                                    </h2>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="text-primary-600 dark:text-primary-400 font-medium text-sm hover:underline"
                                    >
                                        {isEditing ? 'Cancel' : t('profile.edit')}
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                {t('auth.name')}
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full p-2 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white"
                                                />
                                            ) : (
                                                <div className="text-neutral-800 dark:text-white font-medium text-lg border-b border-neutral-100 dark:border-neutral-700 pb-2">
                                                    {user.name}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                {t('profile.role')}
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={formData.role}
                                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                    className="w-full p-2 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white capitalize"
                                                />
                                            ) : (
                                                <div className="text-neutral-800 dark:text-white font-medium text-lg border-b border-neutral-100 dark:border-neutral-700 pb-2 capitalize">
                                                    {user.role}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                {t('auth.email')}
                                            </label>
                                            {isEditing ? (
                                                <div className="flex items-center gap-3">
                                                    <Mail className="w-4 h-4 text-neutral-400" />
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full p-2 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white"
                                                    />
                                                </div>

                                            ) : (
                                                <div className="flex items-center gap-3 text-neutral-800 dark:text-white border-b border-neutral-100 dark:border-neutral-700 pb-2">
                                                    <Mail className="w-4 h-4 text-neutral-400" />
                                                    {user.email}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                {t('auth.phone')}
                                            </label>
                                            {isEditing ? (
                                                <div className="flex items-center gap-3">
                                                    <Phone className="w-4 h-4 text-neutral-400" />
                                                    <input
                                                        type="text"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full p-2 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 text-neutral-800 dark:text-white border-b border-neutral-100 dark:border-neutral-700 pb-2">
                                                    <Phone className="w-4 h-4 text-neutral-400" />
                                                    {user.phone || 'Not provided'}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons when Editing */}
                                    {isEditing && (
                                        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-700">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg font-medium transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Settings Column */}
                        <div className="space-y-8">
                            {/* Settings Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 border border-neutral-100 dark:border-neutral-700 transition-colors duration-300"
                            >
                                <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-6 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-secondary-500" />
                                    {t('profile.settings')}
                                </h2>

                                <div className="space-y-6">
                                    {/* Language Toggle */}
                                    <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-700">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                                                <Globe className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-neutral-700 dark:text-neutral-200">{t('profile.language')}</span>
                                        </div>
                                        <button
                                            onClick={toggleLanguage}
                                            className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-full font-medium text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                                        >
                                            {language === 'en' ? 'English' : 'हिंदी'}
                                        </button>
                                    </div>

                                    {/* Notifications Toggle */}
                                    <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-700">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                                                <Bell className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-neutral-700 dark:text-neutral-200">{t('settings.notifications')}</span>
                                        </div>
                                        <button
                                            onClick={() => setNotifications(!notifications)}
                                            className={`w-11 h-6 rounded-full relative transition-colors ${notifications ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-600'}`}
                                        >
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    {/* Theme Toggle */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                                <Moon className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-neutral-700 dark:text-neutral-200">{t('settings.theme')}</span>
                                        </div>
                                        <button
                                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                            className={`w-11 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-600'}`}
                                        >
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Save Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSave}
                                className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-bold font-lg shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                {t('profile.save')}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
