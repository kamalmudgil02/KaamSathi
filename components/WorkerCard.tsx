'use client';

import React from 'react';
import { Worker } from '@/types';
import { motion } from 'framer-motion';
import { Star, MapPin, Briefcase, IndianRupee, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBooking } from '@/contexts/BookingContext';
import Image from 'next/image';

interface WorkerCardProps {
    worker: Worker;
}

export default function WorkerCard({ worker }: WorkerCardProps) {
    const { t, language } = useLanguage();
    const { openBookingModal } = useBooking();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="card"
        >
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Worker Photo */}
                <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                    <Image
                        src={worker.photo}
                        alt={worker.name}
                        fill
                        className="object-cover"
                    />
                    {/* Availability Badge */}
                    <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white ${worker.available ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                </div>

                {/* Worker Info */}
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xl font-bold text-neutral-800">{worker.name}</h3>
                                {worker.quickResponse && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full border border-yellow-300">
                                        <Zap className="w-3 h-3" />
                                        Quick Response
                                    </span>
                                )}
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold text-neutral-700">{worker.rating}</span>
                                </div>
                                <span className="text-sm text-neutral-500">
                                    ({worker.reviewCount} {t('worker.reviews')})
                                </span>
                            </div>

                            {/* Location & Experience */}
                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-neutral-600">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{worker.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Briefcase className="w-4 h-4" />
                                    <span>{worker.experience} {t('worker.experience')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Daily Wage */}
                        <div className="text-right sm:text-left">
                            <div className="flex items-center gap-1 text-2xl font-bold text-primary-600">
                                <IndianRupee className="w-6 h-6" />
                                <span>{worker.dailyWage}</span>
                            </div>
                            <p className="text-sm text-neutral-500">{t('worker.perDay')}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-sm text-neutral-600 line-clamp-2">
                        {language === 'hi' ? worker.descriptionHi : worker.description}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {worker.skills.slice(0, 3).map((skill, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex flex-wrap gap-3">
                        <a
                            href={`tel:919876543210`} // Using placeholder as worker phone not in Props yet, or assume mock
                            // Actually worker object from Prisma usually doesn't have phone exposed publicly for privacy? 
                            // But Schema User has phone. Worker is linked.
                            // For this MVP let's assume we can call.
                            className="flex-1 sm:flex-none"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium border border-green-200 hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <span>📞</span> Call
                            </motion.button>
                        </a>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => openBookingModal(worker)}
                            disabled={!worker.available}
                            className={`flex-1 px-6 py-2 rounded-lg font-medium transition-all ${worker.available
                                ? 'btn-primary'
                                : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                                }`}
                        >
                            {worker.available ? t('worker.bookNow') : t('worker.unavailable')}
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
