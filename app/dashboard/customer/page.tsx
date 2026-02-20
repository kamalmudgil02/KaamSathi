'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import ServiceCategoryCard from '@/components/ServiceCategory';
import { ServiceCategory } from '@/types';
import { Zap, Shield, BadgeCheck, X, ChevronRight } from 'lucide-react';

const serviceCategories: ServiceCategory[] = [
    'electrician',
    'builder',
    'plumber',
    'carpenter',
    'whitewasher',
];

function GuaranteeModal({ onClose }: { onClose: () => void }) {
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-full">
                        <X className="w-5 h-5 text-neutral-500" />
                    </button>
                    <div className="text-center mb-6">
                        <div className="text-5xl mb-3">💯</div>
                        <h2 className="text-2xl font-bold text-neutral-800">Quality Guaranteed</h2>
                        <p className="text-neutral-600 mt-2">Our commitment to you</p>
                    </div>
                    <div className="space-y-4">
                        {[
                            { icon: '✅', title: '100% Satisfaction', desc: 'Not happy with the work? We\'ll make it right or refund your money.' },
                            { icon: '🛡️', title: 'Insured Workers', desc: 'All professionals are insured, protecting you from any damages.' },
                            { icon: '⭐', title: 'Rated & Reviewed', desc: 'Read real customer reviews before booking.' },
                            { icon: '📞', title: '24/7 Support', desc: 'Our support team is available around the clock to assist you.' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
                                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                                <div>
                                    <h4 className="font-semibold text-neutral-800">{item.title}</h4>
                                    <p className="text-sm text-neutral-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full mt-6 btn-primary"
                    >
                        Got it!
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function VerifiedModal({ onClose }: { onClose: () => void }) {
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-full">
                        <X className="w-5 h-5 text-neutral-500" />
                    </button>
                    <div className="text-center mb-6">
                        <div className="text-5xl mb-3">🛡️</div>
                        <h2 className="text-2xl font-bold text-neutral-800">Verified Professionals</h2>
                        <p className="text-neutral-600 mt-2">How we verify our workers</p>
                    </div>
                    <div className="space-y-4">
                        {[
                            { icon: '🪪', title: 'ID Verification', desc: 'Government-issued ID checked for every worker.' },
                            { icon: '🔍', title: 'Background Check', desc: 'Criminal background checks conducted before onboarding.' },
                            { icon: '🎓', title: 'Skills Assessment', desc: 'Workers are tested for their skills before listing.' },
                            { icon: '🏅', title: 'Rating System', desc: 'Continuous monitoring via customer ratings and reviews.' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                                <div>
                                    <h4 className="font-semibold text-neutral-800">{item.title}</h4>
                                    <p className="text-sm text-neutral-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Got it!
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default function CustomerDashboard() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { t } = useLanguage();
    const [showGuarantee, setShowGuarantee] = useState(false);
    const [showVerified, setShowVerified] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'customer') {
            router.push('/login/customer');
        }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || user?.role !== 'customer') {
        return null;
    }

    const handleQuickResponse = () => {
        // Navigate to electricians (most popular) with quick response filter
        router.push('/workers/electrician?quickResponse=true');
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            <Navbar />

            {showGuarantee && <GuaranteeModal onClose={() => setShowGuarantee(false)} />}
            {showVerified && <VerifiedModal onClose={() => setShowVerified(false)} />}

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

                {/* Feature Cards - Now Interactive */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid md:grid-cols-3 gap-6 mt-12"
                >
                    {/* Quick Response - navigates to workers with quick response filter */}
                    <motion.div
                        whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleQuickResponse}
                        className="card text-center cursor-pointer border-2 border-transparent hover:border-yellow-400 transition-all duration-200 group"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-4xl mb-3"
                        >
                            <Zap className="w-10 h-10 mx-auto text-yellow-500" />
                        </motion.div>
                        <h3 className="font-bold text-lg mb-2 text-neutral-800">Quick Response</h3>
                        <p className="text-sm text-neutral-600 mb-3">Workers respond within minutes</p>
                        <div className="flex items-center justify-center gap-1 text-sm font-medium text-yellow-600 group-hover:gap-2 transition-all">
                            <span>Find fast workers</span>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </motion.div>

                    {/* Verified Professionals - opens info modal */}
                    <motion.div
                        whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowVerified(true)}
                        className="card text-center cursor-pointer border-2 border-transparent hover:border-blue-400 transition-all duration-200 group"
                    >
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="mb-3"
                        >
                            <Shield className="w-10 h-10 mx-auto text-blue-500" />
                        </motion.div>
                        <h3 className="font-bold text-lg mb-2 text-neutral-800">Verified Professionals</h3>
                        <p className="text-sm text-neutral-600 mb-3">All workers are background verified</p>
                        <div className="flex items-center justify-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                            <span>Learn how we verify</span>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </motion.div>

                    {/* Quality Guaranteed - opens guarantee modal */}
                    <motion.div
                        whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowGuarantee(true)}
                        className="card text-center cursor-pointer border-2 border-transparent hover:border-green-400 transition-all duration-200 group"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="mb-3"
                        >
                            <BadgeCheck className="w-10 h-10 mx-auto text-green-500" />
                        </motion.div>
                        <h3 className="font-bold text-lg mb-2 text-neutral-800">Quality Guaranteed</h3>
                        <p className="text-sm text-neutral-600 mb-3">100% satisfaction or money back</p>
                        <div className="flex items-center justify-center gap-1 text-sm font-medium text-green-600 group-hover:gap-2 transition-all">
                            <span>See our guarantee</span>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}
