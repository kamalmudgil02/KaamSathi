'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Lock, User, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function CustomerLoginPage() {
    const router = useRouter();
    const { login, signup } = useAuth();
    const { t } = useLanguage();

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });

    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        let success = false;
        try {
            if (isLogin) {
                success = await login(formData.email, formData.password, 'customer');
            } else {
                success = await signup(formData.name, formData.email, formData.password, formData.phone, 'customer');
            }

            if (success) {
                router.push('/dashboard/customer');
            } else {
                setError(isLogin ? 'Invalid email or password.' : 'Signup failed. Email might be in use.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            <Navbar />

            <div className="container-custom py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto"
                >
                    <div className="card">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-neutral-800 mb-2">
                                {t('auth.customerTitle')}
                            </h1>
                            <p className="text-neutral-600">
                                {isLogin ? 'Welcome back!' : 'Create your account'}
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center border border-red-200">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                        <User className="w-4 h-4" />
                                        {t('auth.name')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        required={!isLogin}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                    <Mail className="w-4 h-4" />
                                    {t('auth.email')}
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                        <Phone className="w-4 h-4" />
                                        {t('auth.phone')}
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="input-field"
                                        required={!isLogin}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                                    <Lock className="w-4 h-4" />
                                    {t('auth.password')}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full btn-primary"
                            >
                                {isLogin ? t('auth.login') : t('auth.signup')}
                            </motion.button>
                        </form>

                        {/* Toggle Login/Signup */}
                        <div className="mt-6 text-center">
                            <p className="text-neutral-600">
                                {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}
                            </p>
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-primary-600 font-medium hover:underline mt-2"
                            >
                                {isLogin ? t('auth.signup') : t('auth.login')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
