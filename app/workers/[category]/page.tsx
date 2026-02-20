'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import WorkerCard from '@/components/WorkerCard';
import BookingModal from '@/components/BookingModal';
import LottiePlayer from '@/components/LottiePlayer';
import { getWorkers } from '@/actions/getWorkers';
import { ServiceCategory } from '@/types';
import { ArrowLeft, Zap, X } from 'lucide-react';
import Link from 'next/link';

export default function WorkersPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated, user } = useAuth();
    const { t } = useLanguage();
    const category = params.category as string;

    const [workers, setWorkers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [quickResponseFilter, setQuickResponseFilter] = useState(
        searchParams.get('quickResponse') === 'true'
    );

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

    const displayedWorkers = quickResponseFilter
        ? workers.filter(w => w.quickResponse === true)
        : workers;

    const quickCount = workers.filter(w => w.quickResponse === true).length;

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
                <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
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
                            <span className="font-medium">
                                {loading ? 'Loading...' : `${displayedWorkers.length} workers available`}
                            </span>
                            <span>•</span>
                            <span>Verified professionals</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <LottiePlayer animationName={category as ServiceCategory} className="w-full max-w-md mx-auto" />
                    </motion.div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setQuickResponseFilter(!quickResponseFilter)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm border-2 transition-all duration-200 ${quickResponseFilter
                                ? 'bg-yellow-400 border-yellow-500 text-yellow-900 shadow-md'
                                : 'bg-white border-neutral-200 text-neutral-600 hover:border-yellow-400 hover:text-yellow-600'
                            }`}
                    >
                        <Zap className="w-4 h-4" />
                        <span>Quick Response</span>
                        {quickCount > 0 && (
                            <span className={`px-1.5 py-0.5 text-xs rounded-full font-bold ${quickResponseFilter ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {quickCount}
                            </span>
                        )}
                        {quickResponseFilter && <X className="w-3 h-3 ml-1" />}
                    </motion.button>
                </div>

                {/* Workers List */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                        </div>
                    ) : displayedWorkers.length === 0 ? (
                        <div className="card text-center py-12">
                            <div className="text-6xl mb-4">
                                {quickResponseFilter ? '⚡' : '😔'}
                            </div>
                            <p className="text-xl text-neutral-600">
                                {quickResponseFilter
                                    ? 'No workers with Quick Response available right now'
                                    : 'No workers available in this category'
                                }
                            </p>
                            {quickResponseFilter && (
                                <button
                                    onClick={() => setQuickResponseFilter(false)}
                                    className="mt-4 text-primary-600 underline text-sm"
                                >
                                    Show all workers
                                </button>
                            )}
                        </div>
                    ) : (
                        displayedWorkers.map((worker, index) => (
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
