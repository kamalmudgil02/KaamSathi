'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Briefcase, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function HomePage() {
    const router = useRouter();
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            <Navbar />

            <main className="container-custom py-12 md:py-20">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <motion.h1
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl md:text-7xl font-bold text-gradient mb-6"
                    >
                        {t('landing.title')}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl md:text-3xl text-neutral-700 font-medium mb-4"
                    >
                        {t('landing.subtitle')}
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg text-neutral-600 max-w-2xl mx-auto"
                    >
                        {t('landing.description')}
                    </motion.p>
                </motion.div>

                {/* Login Options */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Customer Login */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        onClick={() => router.push('/login/customer')}
                        className="card cursor-pointer bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:shadow-2xl"
                    >
                        <div className="text-center p-8">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="mb-6"
                            >
                                <Users className="w-20 h-20 mx-auto" />
                            </motion.div>

                            <h2 className="text-3xl font-bold mb-4">
                                {t('landing.customer')}
                            </h2>

                            <p className="text-primary-100 mb-6">
                                Looking for skilled workers for your home services
                            </p>

                            <div className="flex items-center justify-center gap-2 text-lg font-medium">
                                <span>Get Started</span>
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Partner Login */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        onClick={() => router.push('/login/partner')}
                        className="card cursor-pointer bg-gradient-to-br from-secondary-500 to-secondary-600 text-white hover:shadow-2xl"
                    >
                        <div className="text-center p-8">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                                className="mb-6"
                            >
                                <Briefcase className="w-20 h-20 mx-auto" />
                            </motion.div>

                            <h2 className="text-3xl font-bold mb-4">
                                {t('landing.partner')}
                            </h2>

                            <p className="text-secondary-100 mb-6">
                                Join as a worker and find work opportunities
                            </p>

                            <div className="flex items-center justify-center gap-2 text-lg font-medium">
                                <span>Get Started</span>
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Features Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-20 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
                >
                    {[
                        { icon: '⚡', title: 'Quick Booking', titleHi: 'त्वरित बुकिंग', desc: 'Book workers in minutes', descHi: 'मिनटों में कर्मचारी बुक करें' },
                        { icon: '✓', title: 'Verified Workers', titleHi: 'सत्यापित कर्मचारी', desc: 'All workers are verified', descHi: 'सभी कर्मचारी सत्यापित हैं' },
                        { icon: '💰', title: 'Fair Pricing', titleHi: 'उचित मूल्य', desc: 'Transparent daily wages', descHi: 'पारदर्शी दैनिक मजदूरी' },
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="card text-center"
                        >
                            <div className="text-5xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-neutral-800 mb-2">{feature.title}</h3>
                            <p className="text-neutral-600">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </main>
        </div>
    );
}
