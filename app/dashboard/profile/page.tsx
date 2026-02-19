'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import { User, Mail, Phone, Shield, Globe, Bell, Moon, Save, Zap, Calendar, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { getWorkerSettings, toggleQuickResponse } from '@/actions/worker';
import { getBookingSlots } from '@/actions/booking';
import { Booking } from '@/types';

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
        role: '',
        photo: ''
    });

    const [quickResponse, setQuickResponse] = useState(false);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    // Initialize form data when user is loaded
    useEffect(() => {
        setMounted(true);
        if (user) {
            setFormData({
                name: user.name,
                phone: user.phone || '',
                email: user.email,
                role: user.role,
                photo: user.photo || '' // Default or empty
            });

            // Fetch bookings
            getBookingSlots(user.email, user.role).then(res => {
                if (res.success) setBookings(res.bookings as any); // Cast for type mismatch if slightly off
                setLoadingBookings(false);
            });

            // Fetch worker settings if partner
            if (user.role === 'partner') {
                getWorkerSettings(user.email).then(res => {
                    if (res.success && res.settings) {
                        setQuickResponse(res.settings.quickResponse);
                    }
                });
            }
        }
    }, [user]);

    const handleSave = async () => {
        if (user) {
            await updateProfile({
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                role: formData.role as any,
                photo: formData.photo
            });
            setIsEditing(false);
        }
    };

    const handleToggleQuickResponse = async () => {
        if (!user) return;
        const newStatus = !quickResponse;
        setQuickResponse(newStatus); // Optimistic update
        const res = await toggleQuickResponse(user.email, newStatus);
        if (!res.success) {
            setQuickResponse(!newStatus); // Revert on failure
            // Show toast/error?
        }
    };

    if (!mounted) return null;

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
                    className="max-w-5xl mx-auto"
                >
                    <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-8">{t('profile.title')}</h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column: Profile & Settings */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Personal Details Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 border border-neutral-100 dark:border-neutral-700"
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

                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Profile Picture Section */}
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-neutral-700 shadow-lg">
                                            <img
                                                src={isEditing ? formData.photo : (user.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`)}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    // Fallback if image fails
                                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                                                }}
                                            />
                                        </div>
                                        {isEditing && (
                                            <div className="w-full max-w-xs">
                                                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                    Profile Photo URL
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.photo}
                                                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                                                    placeholder="https://..."
                                                    className="w-full p-2 text-sm border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white"
                                                />
                                                <p className="text-[10px] text-neutral-400 mt-1">
                                                    Paste a direct image URL.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Details Form */}
                                    <div className="flex-1 space-y-6">
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
                                                <div className="text-neutral-800 dark:text-white font-medium text-lg border-b border-neutral-100 dark:border-neutral-700 pb-2 capitalize">
                                                    {user.role}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                    {t('auth.email')}
                                                </label>
                                                <div className="flex items-center gap-3 text-neutral-800 dark:text-white border-b border-neutral-100 dark:border-neutral-700 pb-2">
                                                    <Mail className="w-4 h-4 text-neutral-400" />
                                                    {user.email}
                                                </div>
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

                                        {isEditing && (
                                            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-700">
                                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg font-medium transition-colors">Cancel</button>
                                                <button onClick={handleSave} className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30">Save Changes</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Booking Slots View */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 border border-neutral-100 dark:border-neutral-700"
                            >
                                <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-6 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary-500" />
                                    {user.role === 'customer' ? 'My Bookings' : 'Booking Slots'}
                                </h2>

                                {loadingBookings ? (
                                    <div className="text-center py-8 text-neutral-500">Loading bookings...</div>
                                ) : bookings.length > 0 ? (
                                    <div className="space-y-4">
                                        {bookings.map((booking) => (
                                            <div key={booking.id} className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-bold text-neutral-800 dark:text-white">{booking.category}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(booking.startDate).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {booking.address}
                                                    </div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {booking.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                                        <p>No bookings found.</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Right Column: Settings */}
                        <div className="space-y-8">
                            {/* Worker Settings (Partners Only) */}
                            {user.role === 'partner' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 border border-neutral-100 dark:border-neutral-700 bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/10 dark:to-neutral-800"
                                >
                                    <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-6 flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-yellow-500" />
                                        Worker Settings
                                    </h2>

                                    <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-700">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-neutral-800 dark:text-white">Quick Response</div>
                                                <div className="text-xs text-neutral-500">Enable urgent Availability</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleToggleQuickResponse}
                                            className={`w-11 h-6 rounded-full relative transition-colors ${quickResponse ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                                        >
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${quickResponse ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* App Settings */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6 border border-neutral-100 dark:border-neutral-700"
                            >
                                <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-6 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-secondary-500" />
                                    {t('profile.settings')}
                                </h2>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-700">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                                                <Globe className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-neutral-700 dark:text-neutral-200">{t('profile.language')}</span>
                                        </div>
                                        <button onClick={toggleLanguage} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-full font-medium text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors">
                                            {language === 'en' ? 'English' : 'हिंदी'}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-700">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                                                <Bell className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-neutral-700 dark:text-neutral-200">{t('settings.notifications')}</span>
                                        </div>
                                        <button onClick={() => setNotifications(!notifications)} className={`w-11 h-6 rounded-full relative transition-colors ${notifications ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-600'}`}>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                                <Moon className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-neutral-700 dark:text-neutral-200">{t('settings.theme')}</span>
                                        </div>
                                        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`w-11 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary-500' : 'bg-neutral-200 dark:bg-neutral-600'}`}>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
