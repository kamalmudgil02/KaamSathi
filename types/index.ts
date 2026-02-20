// User Types
export type UserRole = 'customer' | 'partner';

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    photo?: string;
}

// Service Categories
export type ServiceCategory =
    | 'electrician'
    | 'builder'
    | 'plumber'
    | 'carpenter'
    | 'whitewasher';

export interface ServiceCategoryInfo {
    id: ServiceCategory;
    name: string;
    nameHi: string;
    icon: string;
    description: string;
    descriptionHi: string;
}

// Worker Types
export interface Worker {
    id: string;
    name: string;
    photo: string;
    category: ServiceCategory;
    rating: number;
    reviewCount: number;
    dailyWage: number;
    experience: number; // in years
    location: string;
    available: boolean;
    quickResponse: boolean;
    skills: string[];
    description: string;
    descriptionHi: string;
    userId?: string;
}

// Booking Types
export interface Booking {
    id: string;
    customerId: string;
    workerId: string;
    workerName: string;
    workerPhoto: string;
    category: ServiceCategory;
    startDate: string;
    endDate?: string;
    address: string;
    dailyWage: number;
    totalDays: number;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
    createdAt: string;
}

// Language Types
export type Language = 'en' | 'hi';

export interface Translations {
    [key: string]: {
        en: string;
        hi: string;
    };
}
