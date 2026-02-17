'use client';

import React from 'react';
import { Worker } from '@/types';
import { motion } from 'framer-motion';
import { Star, MapPin, Briefcase, IndianRupee } from 'lucide-react';
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
                            <h3 className="text-xl font-bold text-neutral-800">{worker.name}</h3>

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

                    {/* Book Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openBookingModal(worker)}
                        disabled={!worker.available}
                        className={`mt-4 w-full sm:w-auto px-6 py-2 rounded-lg font-medium transition-all ${worker.available
                                ? 'btn-primary'
                                : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                            }`}
                    >
                        {worker.available ? t('worker.bookNow') : t('worker.unavailable')}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
