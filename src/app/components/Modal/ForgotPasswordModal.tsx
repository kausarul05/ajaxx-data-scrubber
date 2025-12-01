"use client";

import { useState, useEffect } from "react";
import { X, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/api";
import { toast } from "react-toastify";

type Props = {
  onClose: () => void;
};

type ForgotPasswordStep = "email" | "verification" | "newPassword" | "success";

export default function ForgotPasswordModal({ onClose }: Props) {
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
    if (currentStep === "verification" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [currentStep, countdown]);

  useEffect(() => {
    if (currentStep === "success") {
      const timer = setTimeout(() => {
        onClose();
        router.push("/dashboard");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, router, onClose]);

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      // First call forgot password
      // await apiRequest("POST", "/auth/forgot-password/", { email });
      
      // Then automatically call resend OTP
      await apiRequest("POST", "/accounts/resend_otp/", { email });

      setCurrentStep("verification");
      setCountdown(59);
      setCanResend(false);
    } catch (error) {
      setMessage((error instanceof Error ? error.message : String(error)) || "Failed to send verification code.");
    } finally {
      setLoading(false);
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
      // Verify OTP with the correct endpoint and payload
      await apiRequest("POST", "/accounts/verify_otp/", {
        email: email,
        otp: code
      });
      setCurrentStep("newPassword");
    } catch (error) {
      // setMessage(error.message || "Invalid verification code.");
      setMessage((error instanceof Error ? error.message : String(error)) || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("Please enter both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await apiRequest("POST", "/accounts/forgot-password/", {
        email,
        password: newPassword,
        confirm_password: confirmPassword
      });
      toast.success("Password reset successfully!");
      setCurrentStep("success");
    } catch (error) {
      setMessage((error instanceof Error ? error.message : String(error)) || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (canResend) {
      setLoading(true);
      setMessage("");
      try {
        await apiRequest("POST", "/auth/resend-otp/", { email });
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

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && verificationCode[index] === "" && index > 0) {
      const prevInput = document.getElementById(`verification-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "email":
        return "Forgot Password";
      case "verification":
        return "Verification Code";
      case "newPassword":
        return "Create New Password";
      case "success":
        return "Successful!";
      default:
        return "Forgot Password";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case "email":
        return "Enter your email, we will send a verification code to your email.";
      case "verification":
        return "Enter the verification code that we have sent to your Email";
      case "newPassword":
        return "Your password must be different from previous used password.";
      case "success":
      default:
        return "";
    }
  };

  return (
    <div className="h-screen fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-[#0A2131] text-white rounded-2xl w-full max-w-[480px] mx-auto shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-gray-700 hover:bg-gray-600 rounded-full p-2 cursor-pointer text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {/* Back Button for steps after email */}
          {currentStep !== "email" && currentStep !== "success" && (
            <button
              onClick={() => {
                setCurrentStep("email");
                setMessage("");
              }}
              className="flex items-center gap-2 text-[#0ABF9D] mb-4 cursor-pointer hover:text-[#08a386] transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}

          {/* Step Title and Description */}
          <h2 className="text-2xl font-semibold text-white mb-3">
            {getStepTitle()}
          </h2>
          <p className="text-[#E5E5E5] font-medium mb-8">
            {getStepDescription()}
          </p>

          {/* Error/Success Message */}
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes("successfully") ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
              {message}
            </div>
          )}

          {/* Step 1: Email Input */}
          {currentStep === "email" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 pl-10 bg-[#0D314B] border border-[#007ED6] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={handleEmailSubmit}
                disabled={loading}
                className="w-full bg-[#007ED6] text-white py-3 rounded-lg font-bold cursor-pointer hover:bg-[#0066b3] disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Sending..." : "Continue"}
              </button>
            </div>
          )}

          {/* Step 2: Verification Code */}
          {currentStep === "verification" && (
            <div className="space-y-6">
              <div>
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

          {/* Step 3: New Password */}
          {currentStep === "newPassword" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 pl-10 bg-[#0D314B] border border-[#007ED6] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Confirm Password
                </label>
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleNewPasswordSubmit}
                disabled={loading}
                className="w-full bg-[#007ED6] text-white py-3 rounded-lg font-bold cursor-pointer hover:bg-[#0066b3] disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Resetting..." : "Continue"}
              </button>
            </div>
          )}

          {/* Step 4: Success */}
          {currentStep === "success" && (
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
                Your password has been changed successfully.
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