'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Translations } from '@/types';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: string) => string;
}

const translations: Translations = {
    // Navigation
    'nav.home': { en: 'Home', hi: 'होम' },
    'nav.services': { en: 'Services', hi: 'सेवाएं' },
    'nav.bookings': { en: 'My Bookings', hi: 'मेरी बुकिंग' },
    'nav.profile': { en: 'Profile', hi: 'प्रोफ़ाइल' },
    'nav.logout': { en: 'Logout', hi: 'लॉग आउट' },

    // Landing Page
    'landing.title': { en: 'KaamSaathi', hi: 'कामसाथी' },
    'landing.subtitle': { en: 'Your Trusted Local Labour Partner', hi: 'आपका विश्वसनीय स्थानीय श्रमिक साथी' },
    'landing.description': { en: 'Connect with skilled workers in your area for all your home service needs', hi: 'अपने घर की सभी सेवा आवश्यकताओं के लिए अपने क्षेत्र में कुशल कर्मचारियों से जुड़ें' },
    'landing.customer': { en: 'Login as Customer', hi: 'ग्राहक के रूप में लॉगिन करें' },
    'landing.partner': { en: 'Login as Partner', hi: 'साथी के रूप में लॉगिन करें' },

    // Auth
    'auth.login': { en: 'Login', hi: 'लॉगिन' },
    'auth.signup': { en: 'Sign Up', hi: 'साइन अप' },
    'auth.email': { en: 'Email', hi: 'ईमेल' },
    'auth.password': { en: 'Password', hi: 'पासवर्ड' },
    'auth.name': { en: 'Full Name', hi: 'पूरा नाम' },
    'auth.phone': { en: 'Phone Number', hi: 'फ़ोन नंबर' },
    'auth.noAccount': { en: "Don't have an account?", hi: 'खाता नहीं है?' },
    'auth.haveAccount': { en: 'Already have an account?', hi: 'पहले से खाता है?' },
    'auth.customerTitle': { en: 'Customer Login', hi: 'ग्राहक लॉगिन' },
    'auth.partnerTitle': { en: 'Partner Login', hi: 'साथी लॉगिन' },

    // Dashboard
    'dashboard.welcome': { en: 'Welcome back', hi: 'वापसी पर स्वागत है' },
    'dashboard.selectService': { en: 'Select a Service', hi: 'एक सेवा चुनें' },
    'dashboard.categories': { en: 'Service Categories', hi: 'सेवा श्रेणियां' },

    // Services
    'service.electrician': { en: 'Electrician', hi: 'इलेक्ट्रीशियन' },
    'service.builder': { en: 'Builder', hi: 'राजमिस्त्री' },
    'service.plumber': { en: 'Plumber', hi: 'प्लंबर' },
    'service.carpenter': { en: 'Carpenter', hi: 'बढ़ई' },
    'service.whitewasher': { en: 'Whitewasher', hi: 'पुताई वाला' },

    'service.electrician.desc': { en: 'Electrical repairs and installations', hi: 'विद्युत मरम्मत और स्थापना' },
    'service.builder.desc': { en: 'Construction and masonry work', hi: 'निर्माण और राजगीरी का काम' },
    'service.plumber.desc': { en: 'Plumbing repairs and installations', hi: 'प्लंबिंग मरम्मत और स्थापना' },
    'service.carpenter.desc': { en: 'Woodwork and furniture', hi: 'लकड़ी का काम और फर्नीचर' },
    'service.whitewasher.desc': { en: 'Painting and whitewashing', hi: 'पेंटिंग और सफेदी' },

    // Workers
    'worker.available': { en: 'Available', hi: 'उपलब्ध' },
    'worker.unavailable': { en: 'Unavailable', hi: 'अनुपलब्ध' },
    'worker.perDay': { en: 'per day', hi: 'प्रति दिन' },
    'worker.experience': { en: 'years experience', hi: 'वर्ष अनुभव' },
    'worker.reviews': { en: 'reviews', hi: 'समीक्षाएं' },
    'worker.bookNow': { en: 'Book Now', hi: 'अभी बुक करें' },
    'worker.viewDetails': { en: 'View Details', hi: 'विवरण देखें' },

    // Booking
    'booking.title': { en: 'Book Worker', hi: 'कर्मचारी बुक करें' },
    'booking.selectDate': { en: 'Select Start Date', hi: 'प्रारंभ तिथि चुनें' },
    'booking.address': { en: 'Service Address', hi: 'सेवा पता' },
    'booking.days': { en: 'Number of Days', hi: 'दिनों की संख्या' },
    'booking.total': { en: 'Total Amount', hi: 'कुल राशि' },
    'booking.confirm': { en: 'Confirm Booking', hi: 'बुकिंग की पुष्टि करें' },
    'booking.cancel': { en: 'Cancel', hi: 'रद्द करें' },
    'booking.success': { en: 'Booking Confirmed!', hi: 'बुकिंग की पुष्टि हो गई!' },

    // Common
    'common.search': { en: 'Search', hi: 'खोजें' },
    'common.filter': { en: 'Filter', hi: 'फ़िल्टर' },
    'common.sort': { en: 'Sort', hi: 'क्रमबद्ध करें' },
    'common.loading': { en: 'Loading...', hi: 'लोड हो रहा है...' },
    'common.error': { en: 'Something went wrong', hi: 'कुछ गलत हो गया' },
    'common.close': { en: 'Close', hi: 'बंद करें' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        const storedLang = localStorage.getItem('kaamsaathi_language') as Language;
        if (storedLang) {
            setLanguage(storedLang);
        }
    }, []);

    const toggleLanguage = () => {
        const newLang: Language = language === 'en' ? 'hi' : 'en';
        setLanguage(newLang);
        localStorage.setItem('kaamsaathi_language', newLang);
    };

    const t = (key: string): string => {
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
