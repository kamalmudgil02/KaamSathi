'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import ServiceCategoryCard from '@/components/ServiceCategory';
import { ServiceCategory } from '@/types';

const serviceCategories: ServiceCategory[] = [
    'electrician',
    'builder',
    'plumber',
    'carpenter',
    'whitewasher',
];

export default function CustomerDashboard() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { t } = useLanguage();

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'customer') {
            router.push('/login/customer');
        }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || user?.role !== 'customer') {
        return null;
    }

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
                        {t('dashboard.welcome')}, {user.name}! 👋
                    </h1>
                    <p className="text-lg text-neutral-600">
                        {t('dashboard.selectService')}
                    </p>
                </motion.div>

                {/* Service Categories Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-neutral-800 mb-6">
                        {t('dashboard.categories')}
                    </h2>

                    {/* Horizontal Scrollable List */}
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                        >
                            {serviceCategories.map((category, index) => (
                                <motion.div
                                    key={category}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="snap-start"
                                >
                                    <ServiceCategoryCard category={category} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Info Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid md:grid-cols-3 gap-6 mt-12"
                >
                    <div className="card text-center">
                        <div className="text-4xl mb-3">⚡</div>
                        <h3 className="font-bold text-lg mb-2">Quick Response</h3>
                        <p className="text-sm text-neutral-600">Workers respond within minutes</p>
                    </div>

                    <div className="card text-center">
                        <div className="text-4xl mb-3">🛡️</div>
                        <h3 className="font-bold text-lg mb-2">Verified Professionals</h3>
                        <p className="text-sm text-neutral-600">All workers are background verified</p>
                    </div>

                    <div className="card text-center">
                        <div className="text-4xl mb-3">💯</div>
                        <h3 className="font-bold text-lg mb-2">Quality Guaranteed</h3>
                        <p className="text-sm text-neutral-600">100% satisfaction or money back</p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
