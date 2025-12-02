"use client";

import { useState, useEffect } from "react";
import { X, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/api";

type Props = {
    onClose: () => void;
    onSwitchToLogin: () => void;
};

interface ApiError extends Error {
    data?: {
        email?: string[];
        [key: string]: unknown;
    };
    response?: {
        data?: {
            email?: string[];
            [key: string]: unknown;
        };
    };
}


export default function RegisterModal({ onClose, onSwitchToLogin }: Props) {
    const [step, setStep] = useState<number>(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
    const [countdown, setCountdown] = useState(59);
    const [canResend, setCanResend] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    // Countdown timer for resend code
    useEffect(() => {
        if (step === 2 && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanResend(true);
        }
    }, [step, countdown]);

    useEffect(() => {
        if (step === 3) {
            const timer = setTimeout(() => {
                onClose();
                onSwitchToLogin()
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [step, router, onClose]);

    const handleRegister = async () => {
        if (!email.trim()) {
            setMessage("Please enter your email.");
            return;
        }

        if (!password || !confirmPassword) {
            setMessage("Please enter both password fields.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setMessage("Password must be at least 8 characters long.");
            return;
        }

        setLoading(true);
        setMessage("");
        try {
            // Register API call
            await apiRequest("POST", "/accounts/register/", {
                email: email,
                password: password,
                confirm_password: confirmPassword
            });

            // After successful registration, automatically resend OTP
            await apiRequest("POST", "/accounts/resend_otp/", {
                email: email
            });

            setStep(2);
            setCountdown(59);
            setCanResend(false);
        } catch (error: unknown) {
            const apiError = error as ApiError;

            // Check both possible error structures
            if (apiError.response?.data?.email?.[0]) {
                setMessage(apiError.response.data.email[0]);
            } else if (apiError.data?.email?.[0]) {
                setMessage(apiError.data.email[0]);
            } else if (apiError instanceof Error) {
                setMessage(apiError.message);
            } else {
                setMessage("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationCodeChange = (value: string, index: number) => {
        if (/^\d?$/.test(value)) {
            const newCode = [...verificationCode];
            newCode[index] = value;
            setVerificationCode(newCode);

            // Auto-focus next input
            if (value !== "" && index < 3) {
                const nextInput = document.getElementById(`verification-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleResendCode = async () => {
        if (canResend) {
            setLoading(true);
            setMessage("");
            try {
                await apiRequest("POST", "/accounts/resend_otp/", { email });
                setCountdown(59);
                setCanResend(false);
                setMessage("Verification code sent successfully!");
            } catch (error) {
                setMessage((error instanceof Error ? error.message : String(error)) || "Failed to resend code.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && verificationCode[index] === "" && index > 0) {
            const prevInput = document.getElementById(`verification-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleVerificationSubmit = async () => {
        const code = verificationCode.join("");
        if (code.length !== 4) {
            setMessage("Please enter the complete verification code.");
            return;
        }

        setLoading(true);
        setMessage("");
        try {
            // Verify OTP
            await apiRequest("POST", "/accounts/verify_otp/", {
                email: email,
                otp: code
            });
            setStep(3);
        } catch (error) {
            setMessage((error instanceof Error ? error.message : String(error)) || "Invalid verification code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />

            <div className="relative bg-[#0A2131] text-white rounded-2xl w-full max-w-[550px] mx-auto drop-shadow-sm drop-shadow-[#0ABF9D66]">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-white p-1"
                >
                    <X size={24} />
                </button>

                <div className="md:p-8 p-4">
                    {/* Error/Success Message */}
                    {message && (
                        <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes("successfully") ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                            {message}
                        </div>
                    )}

                    {step === 1 && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Register</h2>
                            <p className="text-white mb-6">Let&apos;s create new account</p>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-white mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            placeholder="Enter your Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
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
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full p-3 pl-10 bg-[#0D314B] border border-[#007ED6] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <small className="text-gray-500 text-xs mt-1">
                                        Min 8 Characters with a combination of letters and numbers
                                    </small>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-white mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full p-3 pl-10 bg-[#0D314B] border border-[#007ED6] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleRegister}
                                    disabled={loading}
                                    className="w-full bg-[#007ED6] text-white py-3 rounded-lg font-bold cursor-pointer hover:bg-[#0066b3] disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? "Registering..." : "Register"}
                                </button>

                                {/* <button className="w-full bg-[#0D314B] border border-[#007ED6] text-white py-3 rounded-lg font-semibold drop-shadow-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </button> */}

                                <div className="text-sm text-white">
                                    Already have an account?{" "}
                                    <button
                                        onClick={onSwitchToLogin}
                                        className="text-[#0ABF9D] font-medium cursor-pointer"
                                    >
                                        Sign In
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-semibold text-white mb-3">
                                    Verification Code
                                </h2>
                                <p className="text-[#E5E5E5] font-medium mb-8 w-2/3">
                                    Enter the verification code that we have sent to your Email
                                </p>
                                <div className="flex gap-3 justify-center">
                                    {verificationCode.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`verification-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleVerificationCodeChange(e.target.value, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            className="w-14 h-14 bg-[#0D314B] border border-[#007ED6] rounded-lg text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="text-center">
                                <span className="text-sm text-[#E5E5E5]">
                                    Didn&apos;t receive the code?{" "}
                                    <button
                                        onClick={handleResendCode}
                                        disabled={!canResend || loading}
                                        className={`font-medium cursor-pointer ${canResend && !loading
                                            ? "text-[#0ABF9D] hover:text-[#08a386]"
                                            : "text-gray-500 cursor-not-allowed"
                                            } transition-colors`}
                                    >
                                        {canResend ? "Resend code" : `Resend code at 00:${countdown.toString().padStart(2, '0')}`}
                                    </button>
                                </span>
                            </div>

                            <button
                                onClick={handleVerificationSubmit}
                                disabled={verificationCode.some(digit => digit === "") || loading}
                                className="w-full bg-[#007ED6] text-white py-3 rounded-lg font-bold cursor-pointer hover:bg-[#0066b3] disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? "Verifying..." : "Continue"}
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
                            {/* Blue outlined check icon */}
                            <div className="w-20 h-20 flex items-center justify-center mb-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    className="w-20 h-20 text-[#007ED6]"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="20"
                                >
                                    <circle cx="256" cy="256" r="200" stroke="#007ED6" strokeWidth="20" fill="none" />
                                    <path
                                        stroke="#007ED6"
                                        strokeWidth="20"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M176 260l50 50 110-110"
                                    />
                                </svg>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-semibold text-white">Successful!</h2>

                            {/* Description */}
                            <p className="text-[#E5E5E5] text-sm">
                                Your account has been created successfully.
                            </p>

                            {/* Loading spinner */}
                            <div className="mt-6 flex justify-center">
                                <div className="w-8 h-8 border-4 border-t-[#007ED6] border-[#0A2131] rounded-full animate-spin" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}