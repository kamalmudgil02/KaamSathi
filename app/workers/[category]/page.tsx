'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import WorkerCard from '@/components/WorkerCard';
import BookingModal from '@/components/BookingModal';
import LottiePlayer from '@/components/LottiePlayer';
import { getWorkersByCategory } from '@/data/mockData';
import { ServiceCategory } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function WorkersPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const { t } = useLanguage();
    const category = params.category as ServiceCategory;

    const [workers, setWorkers] = useState(getWorkersByCategory(category));

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
                {/* Back Button */}
                <Link href="/dashboard/customer">
                    <motion.button
                        whileHover={{ x: -5 }}
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Dashboard</span>
                    </motion.button>
                </Link>

                {/* Header with Lottie Animation */}
                <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
                            {t(`service.${category}`)}
                        </h1>
                        <p className="text-lg text-neutral-600 mb-4">
                            {t(`service.${category}.desc`)}
                        </p>
                        <div className="flex items-center gap-4 text-neutral-600">
                            <span className="font-medium">{workers.length} workers available</span>
                            <span>•</span>
                            <span>Verified professionals</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <LottiePlayer animationName={category} className="w-full max-w-md mx-auto" />
                    </motion.div>
                </div>

                {/* Workers List */}
                <div className="space-y-6">
                    {workers.length === 0 ? (
                        <div className="card text-center py-12">
                            <div className="text-6xl mb-4">😔</div>
                            <p className="text-xl text-neutral-600">No workers available in this category</p>
                        </div>
                    ) : (
                        workers.map((worker, index) => (
                            <motion.div
                                key={worker.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <WorkerCard worker={worker} />
                            </motion.div>
                        ))
                    )}
                </div>
            </main>

            {/* Booking Modal */}
            <BookingModal />
        </div>
    );
}
