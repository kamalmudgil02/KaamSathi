'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, IndianRupee, CheckCircle } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Booking } from '@/types';
import Image from 'next/image';

export default function BookingModal() {
    const { selectedWorker, isBookingModalOpen, closeBookingModal, addBooking } = useBooking();
    const { t } = useLanguage();
    const { user } = useAuth();

    const [startDate, setStartDate] = useState('');
    const [address, setAddress] = useState('');
    const [days, setDays] = useState(1);
    const [isConfirmed, setIsConfirmed] = useState(false);

    if (!selectedWorker) return null;

    const totalAmount = selectedWorker.dailyWage * days;

    const handleConfirmBooking = () => {
        if (!startDate || !address || !user) return;

        const booking: Booking = {
            id: Math.random().toString(36).substr(2, 9),
            customerId: user.id,
            workerId: selectedWorker.id,
            workerName: selectedWorker.name,
            workerPhoto: selectedWorker.photo,
            category: selectedWorker.category,
            startDate,
            address,
            dailyWage: selectedWorker.dailyWage,
            totalDays: days,
            totalAmount,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        addBooking(booking);
        setIsConfirmed(true);

        // Close modal after showing success
        setTimeout(() => {
            closeBookingModal();
            setIsConfirmed(false);
            setStartDate('');
            setAddress('');
            setDays(1);
        }, 2000);
    };

    return (
        <AnimatePresence>
            {isBookingModalOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeBookingModal}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal - Blinkit Style Bottom Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
                    >
                        {isConfirmed ? (
                            // Success State
                            <div className="p-8 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', damping: 15 }}
                                >
                                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                                        {t('booking.success')}
                                    </h2>
                                    <p className="text-neutral-600">
                                        Your booking has been confirmed. The worker will contact you soon.
                                    </p>
                                </motion.div>
                            </div>
                        ) : (
                            // Booking Form
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-neutral-800">
                                        {t('booking.title')}
                                    </h2>
                                    <button
                                        onClick={closeBookingModal}
                                        className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Worker Info */}
                                <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl mb-6">
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={selectedWorker.photo}
                                            alt={selectedWorker.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{selectedWorker.name}</h3>
                                        <p className="text-sm text-neutral-600">
                                            {t(`service.${selectedWorker.category}`)}
                                        </p>
                                        <div className="flex items-center gap-1 text-primary-600 font-semibold mt-1">
                                            <IndianRupee className="w-4 h-4" />
                                            <span>{selectedWorker.dailyWage}</span>
                                            <span className="text-xs text-neutral-500">/ {t('worker.perDay')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-4">
                                    {/* Start Date */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                            <Calendar className="w-4 h-4" />
                                            {t('booking.selectDate')}
                                        </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="input-field"
                                            required
                                        />
                                    </div>

                                    {/* Number of Days */}
                                    <div>
                                        <label className="text-sm font-medium text-neutral-700 mb-2 block">
                                            {t('booking.days')}
                                        </label>
                                        <input
                                            type="number"
                                            value={days}
                                            onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                                            min="1"
                                            className="input-field"
                                            required
                                        />
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                            <MapPin className="w-4 h-4" />
                                            {t('booking.address')}
                                        </label>
                                        <textarea
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            rows={3}
                                            placeholder="Enter your complete address"
                                            className="input-field resize-none"
                                            required
                                        />
                                    </div>

                                    {/* Total Amount */}
                                    <div className="p-4 bg-primary-50 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-neutral-700">{t('booking.total')}</span>
                                            <div className="flex items-center gap-1 text-2xl font-bold text-primary-600">
                                                <IndianRupee className="w-6 h-6" />
                                                <span>{totalAmount}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-neutral-600 mt-1">
                                            ₹{selectedWorker.dailyWage} × {days} {days > 1 ? 'days' : 'day'}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={closeBookingModal}
                                        className="flex-1 px-6 py-3 border-2 border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
                                    >
                                        {t('booking.cancel')}
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleConfirmBooking}
                                        disabled={!startDate || !address}
                                        className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {t('booking.confirm')}
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
