import React, { useState } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import logo from "../assets/logo.png";
import bg from "../assets/bg.png";
import api from '@/utils/axios';

const AuthPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/v1/login", {
                email,
                password
            });
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="min-h-screen flex">
            {/* Left side - Login Form */}
            <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900">Masuk</h1>
                        <p className="text-gray-500">
                            Masukkan email dan kata sandi Anda untuk masuk!
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-primer focus:border-primer"
                                    placeholder="mail@example.com"
                                    required
                                />
                                <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-primer focus:border-primer"
                                    placeholder="Min. 8 characters"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-gray-400"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            <div className="flex justify-end">
                                <a href="#" className="text-sm text-primer hover:underline">
                                    Lupa password?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-primer text-white rounded-lg hover:bg-primer/90 transition-colors"
                        >
                            Masuk
                        </button>
                    </form>
                </div>
            </div>

            <div
                className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-8"
                style={{
                    backgroundImage: `url(${bg})`,

                }}
            >
                <div className="text-center text-white space-y-6 z-10">
                    <div className="flex justify-center">
                        <img src={logo} alt="MetroWise Logo" className="h-20 w-auto" />
                    </div>
                    <h2 className="text-4xl font-bold">MetroWise</h2>
                    <p className="max-w-md">
                        Sistem pendukung keputusan pemilihan manajer proyek berdasarkan KPI dengan metode VIKOR
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;