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
import { getWorkers } from '@/actions/getWorkers';
import { ServiceCategory } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function WorkersPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const { t } = useLanguage();
    const category = params.category as string; // prisma stores category as string

    const [workers, setWorkers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'customer') {
            router.push('/login/customer');
        }
    }, [isAuthenticated, user, router]);

    useEffect(() => {
        const fetchData = async () => {
            if (category) {
                try {
                    setLoading(true);
                    // Pass category to server action. We need to cast it to string because useParams can return string | string[]
                    const data = await getWorkers(Array.isArray(category) ? category[0] : category);
                    setWorkers(data);
                } catch (error) {
                    console.error('Error fetching workers:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [category]);

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
                            <span className="font-medium">{loading ? 'Loading...' : `${workers.length} workers available`}</span>
                            <span>•</span>
                            <span>Verified professionals</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {/* 
                            LottiePlayer expects specific animation names. 
                            If category name from DB doesn't match exactly update the component or mapping. 
                            For now passing category as is. 
                        */}
                        <LottiePlayer animationName={category as ServiceCategory} className="w-full max-w-md mx-auto" />
                    </motion.div>
                </div>

                {/* Workers List */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                        </div>
                    ) : workers.length === 0 ? (
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
