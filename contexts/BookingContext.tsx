'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking, Worker } from '@/types';

interface BookingContextType {
    selectedWorker: Worker | null;
    setSelectedWorker: (worker: Worker | null) => void;
    bookings: Booking[];
    addBooking: (booking: Booking) => void;
    isBookingModalOpen: boolean;
    openBookingModal: (worker: Worker) => void;
    closeBookingModal: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const openBookingModal = (worker: Worker) => {
        setSelectedWorker(worker);
        setIsBookingModalOpen(true);
    };

    const closeBookingModal = () => {
        setIsBookingModalOpen(false);
        setTimeout(() => setSelectedWorker(null), 300); // Wait for animation
    };

    const addBooking = (booking: Booking) => {
        setBookings(prev => [...prev, booking]);
        // In production, this would also call your API
    };

    return (
        <BookingContext.Provider
            value={{
                selectedWorker,
                setSelectedWorker,
                bookings,
                addBooking,
                isBookingModalOpen,
                openBookingModal,
                closeBookingModal,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
}
