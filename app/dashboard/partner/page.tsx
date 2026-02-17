'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBooking } from '@/contexts/BookingContext';
import Navbar from '@/components/Navbar';
import { IndianRupee, Calendar, MapPin } from 'lucide-react';

export default function PartnerDashboard() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { t } = useLanguage();
    const { bookings } = useBooking();

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'partner') {
            router.push('/login/partner');
        }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || user?.role !== 'partner') {
        return null;
    }

    // In production, this would fetch bookings for this specific worker
    const workerBookings = bookings.filter(b => b.workerId === user.id);

    return (
        <div className="min-h-screen bg-neutral-50">
            <Navbar />

            <main className="container-custom py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold text-neutral-800 mb-2">
                        Welcome, {user.name}! 👋
                    </h1>
                    <p className="text-lg text-neutral-600">
                        Manage your bookings and profile
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-neutral-600 mb-1">Total Bookings</p>
                                <p className="text-3xl font-bold text-primary-600">{workerBookings.length}</p>
                            </div>
                            <Calendar className="w-12 h-12 text-primary-300" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-neutral-600 mb-1">Total Earnings</p>
                                <div className="flex items-center gap-1">
                                    <IndianRupee className="w-6 h-6 text-secondary-600" />
                                    <p className="text-3xl font-bold text-secondary-600">
                                        {workerBookings.reduce((sum, b) => sum + b.totalAmount, 0)}
                                    </p>
                                </div>
                            </div>
                            <IndianRupee className="w-12 h-12 text-secondary-300" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-neutral-600 mb-1">Rating</p>
                                <p className="text-3xl font-bold text-accent-600">4.8 ⭐</p>
                            </div>
                            <div className="text-5xl">⭐</div>
                        </div>
                    </motion.div>
                </div>

                {/* Recent Bookings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-2xl font-bold text-neutral-800 mb-6">Recent Bookings</h2>

                    {workerBookings.length === 0 ? (
                        <div className="card text-center py-12">
                            <div className="text-6xl mb-4">📋</div>
                            <p className="text-xl text-neutral-600">No bookings yet</p>
                            <p className="text-neutral-500 mt-2">Your bookings will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {workerBookings.map((booking) => (
                                <div key={booking.id} className="card">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-neutral-800">
                                                Booking #{booking.id.slice(0, 8)}
                                            </h3>
                                            <div className="flex items-center gap-2 text-neutral-600 mt-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>{booking.totalDays} days</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-neutral-600 mt-1">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-sm">{booking.address}</span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-2xl font-bold text-primary-600">
                                                <IndianRupee className="w-6 h-6" />
                                                <span>{booking.totalAmount}</span>
                                            </div>
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-neutral-100 text-neutral-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
