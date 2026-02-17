'use client';

import React from 'react';
import Link from 'next/link';
import { ServiceCategory } from '@/types';
import { motion } from 'framer-motion';
import {
    Zap,
    Hammer,
    Wrench,
    Drill,
    PaintBucket
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceCategoryProps {
    category: ServiceCategory;
}

const categoryIcons = {
    electrician: Zap,
    builder: Hammer,
    plumber: Wrench,
    carpenter: Drill,
    whitewasher: PaintBucket,
};

const categoryColors = {
    electrician: 'from-yellow-400 to-orange-500',
    builder: 'from-orange-400 to-red-500',
    plumber: 'from-blue-400 to-cyan-500',
    carpenter: 'from-amber-400 to-yellow-600',
    whitewasher: 'from-purple-400 to-pink-500',
};

export default function ServiceCategoryCard({ category }: ServiceCategoryProps) {
    const { t } = useLanguage();
    const Icon = categoryIcons[category];

    return (
        <Link href={`/workers/${category}`}>
            <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="min-w-[200px] h-[240px] cursor-pointer"
            >
                <div className="card h-full flex flex-col items-center justify-center space-y-4 hover:shadow-2xl">
                    {/* Icon with gradient background */}
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${categoryColors[category]} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-10 h-10 text-white" />
                    </div>

                    {/* Category Name */}
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-neutral-800">
                            {t(`service.${category}`)}
                        </h3>
                        <p className="text-sm text-neutral-600 mt-2 px-2">
                            {t(`service.${category}.desc`)}
                        </p>
                    </div>

                    {/* Arrow indicator */}
                    <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-primary-600 font-medium text-sm"
                    >
                        View Workers →
                    </motion.div>
                </div>
            </motion.div>
        </Link>
    );
}
