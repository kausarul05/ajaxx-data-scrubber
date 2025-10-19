"use client";

import { useState, useEffect } from "react";
import { X, Mail, Lock, Eye, EyeOff } from "lucide-react";

type Props = {
    onClose: () => void;
    onSwitchToRegister: () => void;
    setActiveModal: (value: "login" | "register" | "forgotPassword") => void;
};


export default function LoginModal({ onClose, onSwitchToRegister, setActiveModal }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const handleOpenForgetPasswordModal = () => {
        setActiveModal("forgotPassword"); // switch control to Navbar
    };


    const handleLogin = () => {
        // Login logic here
        console.log("Login submitted");
        onClose();
    };

    return (
        <div className="h-screen fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />

            <div className="relative bg-[#0A2131] text-white rounded-2xl w-full max-w-[550px] mx-auto drop-shadow-sm drop-shadow-[#0ABF9D66]">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 cursor-pointer text-white p-1"
                >
                    <X size={24} />
                </button>

                <div className="md:p-8 p-4">
                    <h2 className="text-2xl font-semibold text-white mb-3">Login</h2>
                    <p className="text-[#E5E5E5] font-medium mb-8">Let's login into your account first</p>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400  w-5 h-5" />
                                <input
                                    type="email"
                                    placeholder="Enter your Email"
                                    className="w-full p-3 pl-10 bg-[#0D314B] border border-[#007ED6] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="w-full p-3 pl-10 bg-[#0D314B] border border-[#007ED6] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <label className="flex items-center">
                                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                <span className="ml-2 text-xs text-white">Remember Me</span>
                            </label>
                            <button onClick={() => handleOpenForgetPasswordModal()} className="text-sm text-[#EB4335] cursor-pointer">Forget Password?</button>
                        </div>

                        <button
                            onClick={handleLogin}
                            className="w-full bg-[#007ED6] text-white py-3 rounded-lg font-bold cursor-pointer  transition-colors"
                        >
                            Login
                        </button>

                        <button className="w-full bg-[#0D314B] border border-[#007ED6] text-white py-3 rounded-lg font-semibold drop-shadow-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                        <div className=" text-sm text-white">
                            Don't have an account?{" "}
                            <button
                                onClick={onSwitchToRegister}
                                className="text-[#0ABF9D] font-medium cursor-pointer"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}