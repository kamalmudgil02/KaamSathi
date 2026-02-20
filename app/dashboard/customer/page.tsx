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
    const [expanded, setExpanded] = useState<number | null>(null);
    const router = useRouter();

    const guarantees = [
        {
            icon: '✅',
            title: '100% Satisfaction',
            badge: 'Guaranteed',
            badgeColor: 'bg-green-100 text-green-700',
            desc: "Not happy with the work? We'll make it right.",
            details: "If you're not satisfied with the completed work, contact us within 24 hours and we'll either send a replacement worker at no extra cost, or issue a full refund. No questions asked.",
            action: { label: 'Contact Support', fn: () => window.open('mailto:support@kaamsathi.com', '_blank') },
        },
        {
            icon: '🛡️',
            title: 'Insured Workers',
            badge: 'Protected',
            badgeColor: 'bg-blue-100 text-blue-700',
            desc: 'All professionals are insured against damages.',
            details: 'Every worker on KaamSathi carries third-party liability insurance. If any accidental damage occurs during the job, you are fully covered up to ₹5,00,000 per incident.',
            action: { label: 'View Insurance Policy', fn: () => window.open('mailto:support@kaamsathi.com?subject=Insurance Policy', '_blank') },
        },
        {
            icon: '⭐',
            title: 'Rated & Reviewed',
            badge: 'Transparent',
            badgeColor: 'bg-yellow-100 text-yellow-700',
            desc: 'Read real customer reviews before booking.',
            details: 'Every review on KaamSathi is from a verified booking — no fake reviews. Workers cannot edit or delete reviews. Low-rated workers are automatically suspended for review.',
            action: { label: 'Browse Top Rated', fn: () => { onClose(); router.push('/workers/electrician'); } },
        },
        {
            icon: '📞',
            title: '24/7 Support',
            badge: 'Always Available',
            badgeColor: 'bg-purple-100 text-purple-700',
            desc: 'Our support team is available round the clock.',
            details: 'Reach us anytime via email at support@kaamsathi.com or call +91-800-KAAMSATHI. Average response time is under 10 minutes during business hours.',
            action: { label: 'Contact Now', fn: () => window.open('mailto:support@kaamsathi.com', '_blank') },
        },
    ];

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
                    className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 max-h-[90vh] overflow-y-auto"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-full">
                        <X className="w-5 h-5 text-neutral-500" />
                    </button>
                    <div className="text-center mb-6">
                        <div className="text-5xl mb-3">💯</div>
                        <h2 className="text-2xl font-bold text-neutral-800">Quality Guaranteed</h2>
                        <p className="text-neutral-600 mt-2">Our commitment to you — tap to learn more</p>
                    </div>

                    <div className="space-y-3">
                        {guarantees.map((item, i) => (
                            <motion.div
                                key={i}
                                layout
                                onClick={() => setExpanded(expanded === i ? null : i)}
                                className="border-2 border-neutral-100 hover:border-green-200 rounded-xl overflow-hidden cursor-pointer transition-colors"
                            >
                                <div className="flex items-center gap-3 p-3">
                                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-semibold text-neutral-800">{item.title}</h4>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                                                {item.badge}
                                            </span>
                                        </div>
                                        <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: expanded === i ? 90 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex-shrink-0"
                                    >
                                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                                    </motion.div>
                                </div>

                                <AnimatePresence>
                                    {expanded === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 pb-4 bg-green-50 border-t border-green-100">
                                                <p className="text-sm text-neutral-700 pt-3 leading-relaxed">{item.details}</p>
                                                <div className="flex justify-end mt-3">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); item.action.fn(); }}
                                                        className="text-xs font-medium bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
                                                    >
                                                        {item.action.label} →
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-5 btn-primary"
                    >
                        Got it!
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}


function VerifiedModal({ onClose }: { onClose: () => void }) {
    const [expanded, setExpanded] = useState<number | null>(null);
    const router = useRouter();

    const steps = [
        {
            icon: '🪪',
            title: 'ID Verification',
            badge: 'Required',
            badgeColor: 'bg-blue-100 text-blue-700',
            desc: 'Government-issued ID checked for every worker.',
            details: 'Each worker submits their Aadhaar card, Voter ID, or Passport during registration. Our team manually reviews and validates the document within 24 hours before the worker is listed on the platform.',
            status: 'Active',
            statusColor: 'text-green-600',
            action: { label: 'View Verified Workers', fn: () => { onClose(); router.push('/workers/electrician'); } },
        },
        {
            icon: '🔍',
            title: 'Background Check',
            badge: 'Verified',
            badgeColor: 'bg-green-100 text-green-700',
            desc: 'Criminal background checks conducted before onboarding.',
            details: 'We partner with certified background verification agencies to run police record checks. Workers with any criminal history are immediately disqualified from the platform.',
            status: 'Active',
            statusColor: 'text-green-600',
            action: { label: 'Learn More', fn: () => window.open('https://kaamaarthiplatform.com/safety', '_blank') },
        },
        {
            icon: '🎓',
            title: 'Skills Assessment',
            badge: 'Tested',
            badgeColor: 'bg-purple-100 text-purple-700',
            desc: 'Workers are tested for their skills before listing.',
            details: 'Each worker goes through a practical skills test in their category — an electrician must demonstrate safe wiring, a plumber must pass leak-repair tests. Only those who score above 70% get listed.',
            status: 'Active',
            statusColor: 'text-green-600',
            action: { label: 'Browse Skilled Workers', fn: () => { onClose(); router.push('/workers/electrician'); } },
        },
        {
            icon: '🏅',
            title: 'Rating System',
            badge: 'Live',
            badgeColor: 'bg-yellow-100 text-yellow-700',
            desc: 'Continuous monitoring via customer ratings and reviews.',
            details: 'After every completed booking, customers can rate the worker from 1–5 stars and leave a review. Workers who drop below a 3.5 average rating face suspension. We review flagged workers within 48 hours.',
            status: 'Active',
            statusColor: 'text-green-600',
            action: { label: 'Rate a Worker', fn: () => { onClose(); router.push('/workers/electrician'); } },
        },
    ];

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
                    className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 max-h-[90vh] overflow-y-auto"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-full">
                        <X className="w-5 h-5 text-neutral-500" />
                    </button>
                    <div className="text-center mb-6">
                        <div className="text-5xl mb-3">🛡️</div>
                        <h2 className="text-2xl font-bold text-neutral-800">Verified Professionals</h2>
                        <p className="text-neutral-600 mt-2">How we verify our workers</p>
                        <div className="flex justify-center gap-1 mt-3">
                            {steps.map((_, i) => (
                                <div key={i} className="w-8 h-1.5 rounded-full bg-green-400" />
                            ))}
                        </div>
                        <p className="text-xs text-green-600 font-medium mt-1">All 4 checks passed ✓</p>
                    </div>

                    <div className="space-y-3">
                        {steps.map((item, i) => (
                            <motion.div
                                key={i}
                                layout
                                onClick={() => setExpanded(expanded === i ? null : i)}
                                className="border-2 border-neutral-100 hover:border-blue-200 rounded-xl overflow-hidden cursor-pointer transition-colors"
                            >
                                {/* Header row */}
                                <div className="flex items-center gap-3 p-3">
                                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-semibold text-neutral-800">{item.title}</h4>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                                                {item.badge}
                                            </span>
                                        </div>
                                        <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <span className="text-green-500 text-lg">✓</span>
                                        <motion.div
                                            animate={{ rotate: expanded === i ? 90 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronRight className="w-4 h-4 text-neutral-400" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Expanded details */}
                                <AnimatePresence>
                                    {expanded === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 pb-4 bg-blue-50 border-t border-blue-100">
                                                <p className="text-sm text-neutral-700 pt-3 leading-relaxed">{item.details}</p>
                                                <div className="flex items-center justify-between mt-3">
                                                    <span className={`text-xs font-semibold ${item.statusColor} flex items-center gap-1`}>
                                                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
                                                        {item.status}
                                                    </span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); item.action.fn(); }}
                                                        className="text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        {item.action.label} →
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
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
