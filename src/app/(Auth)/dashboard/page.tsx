'use client'

import React, { useState } from "react";
import {
    Eye,
    Trash2,
    X,
    Facebook,
    ShoppingBag,
    Instagram,
    Music2,
    Linkedin
} from "lucide-react";

type ServiceData = {
    fullName: string;
    email: string;
    phone: string;
    creationDate: string;
    time: string;
};

type Service = {
    id: number;
    name: string;
    icon: string;
    data: ServiceData;
};

export default function Page() {
    const [clicked, setClicked] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [showServices, setShowServices] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [services, setServices] = useState<Service[]>([
        {
            id: 1,
            name: "Facebook",
            icon: "facebook",
            data: {
                fullName: "Jane Cooper",
                email: "abc@example.com",
                phone: "(319) 555-0115",
                creationDate: "07/02/24",
                time: "7pm"
            }
        },
        {
            id: 2,
            name: "amazon",
            icon: "amazon",
            data: {
                fullName: "Jane Cooper",
                email: "abc@example.com",
                phone: "(319) 555-0115",
                creationDate: "07/02/24",
                time: "7pm"
            }
        },
        {
            id: 3,
            name: "Instagram",
            icon: "instagram",
            data: {
                fullName: "Jane Cooper",
                email: "abc@example.com",
                phone: "(319) 555-0115",
                creationDate: "07/02/24",
                time: "7pm"
            }
        },
        {
            id: 4,
            name: "TikTok",
            icon: "tiktok",
            data: {
                fullName: "Jane Cooper",
                email: "abc@example.com",
                phone: "(319) 555-0115",
                creationDate: "07/02/24",
                time: "7pm"
            }
        },
        {
            id: 5,
            name: "LinkedIn",
            icon: "linkedin",
            data: {
                fullName: "Jane Cooper",
                email: "abc@example.com",
                phone: "(319) 555-0115",
                creationDate: "07/02/24",
                time: "7pm"
            }
        },
    ]);

    // Function to get the icon component based on service name
    const getServiceIcon = (serviceName: string, size: number = 20) => {
        switch (serviceName.toLowerCase()) {
            case 'facebook':
                return <Facebook size={size} className="text-blue-500" />;
            case 'amazon':
                return <ShoppingBag size={size} className="text-orange-500" />;
            case 'instagram':
                return <Instagram size={size} className="text-pink-500" />;
            case 'tiktok':
                return <Music2 size={size} className="text-black" />;
            case 'linkedin':
                return <Linkedin size={size} className="text-blue-600" />;
            default:
                return <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">
                    {serviceName.charAt(0)}
                </div>;
        }
    };

    const handleClick = () => {
        setClicked(true);
        setScanning(true);

        setTimeout(() => {
            setClicked(false);
        }, 800);

        setTimeout(() => {
            setScanning(false);
            setShowServices(true);
        }, 2000);
    };

    const handleView = (service: Service) => {
        setSelectedService(service);
    };

    const handleRemove = (serviceId: number) => {
        setServices(prev => prev.filter(service => service.id !== serviceId));
    };

    const closeModal = () => {
        setSelectedService(null);
    };

    return (
        <div className="min-h-screen bg-[#0A2131] flex p-4 sm:p-6 lg:p-8">
            <div className="bg-[#0E2A3F] w-full rounded-xl p-4 sm:p-6 lg:p-10 shadow-xl">
                {/* Scan Section */}
                <h1 className="text-white text-lg mb-6 lg:mb-8 font-medium text-center lg:text-left">Scan Your Email</h1>

                <div className="flex justify-center mb-8 lg:mb-10">
                    <div
                        onClick={handleClick}
                        className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-full flex items-center justify-center cursor-pointer group"
                    >
                        {/* Cyber Grid Background */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30">
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(34,211,238,0.1)_50%),linear-gradient(transparent_50%,rgba(34,211,238,0.1)_50%)] bg-[size:20px_20px] rounded-full" />
                        </div>

                        {/* Scanning Wave Effect */}
                        {scanning && (
                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent animate-scan-wave" />
                            </div>
                        )}

                        {/* Digital Pulse Rings */}
                        {clicked && (
                            <>
                                <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-digital-pulse-1" />
                                <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-digital-pulse-2" />
                                <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-digital-pulse-3" />
                            </>
                        )}

                        {/* Binary Rain Effect */}
                        {scanning && (
                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                {[...Array(8)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute text-cyan-400/60 text-xs font-mono animate-binary-fall"
                                        style={{
                                            left: `${20 + i * 10}%`,
                                            animationDelay: `${i * 0.2}s`,
                                        }}
                                    >
                                        {Math.random() > 0.5 ? '1' : '0'}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Main Button with Glitch Effect */}
                        <div className={`
              relative z-10 w-32 h-32 sm:w-44 sm:h-44 rounded-full 
              flex items-center justify-center 
              bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600
              shadow-[0_0_50px_rgba(34,211,238,0.3)]
              transition-all duration-500
              ${clicked ? 'scale-95 shadow-[0_0_80px_rgba(34,211,238,0.6)]' : 'group-hover:scale-105'}
              overflow-hidden
            `}>
                            {/* Glitch Text Effect */}
                            <span className={`
                text-white text-2xl sm:text-4xl font-bold font-mono relative
                ${scanning ? 'animate-glitch' : ''}
              `}>
                                <span className="absolute top-0 left-0 text-cyan-300 animate-glitch-1">GO</span>
                                <span className="absolute top-0 left-0 text-blue-300 animate-glitch-2">GO</span>
                                GO
                            </span>

                            {/* LED Border */}
                            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-led-glow" />
                        </div>

                        {/* Hover Energy Field */}
                        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/0 group-hover:border-cyan-400/30 transition-all duration-500 group-hover:animate-spin-slow" />
                    </div>
                </div>

                {/* Services List - Animated Entry */}
                {showServices && (
                    <div className="space-y-4 animate-services-appear">
                        <div className="text-center mb-6">
                            <h2 className="text-cyan-400 text-lg font-mono animate-text-glow">
                                SCAN COMPLETE
                            </h2>
                            <p className="text-gray-400 text-sm mt-2">
                                Found {services.length} connected services
                            </p>
                        </div>

                        {services.map((service, index) => (
                            <div
                                key={service.id}
                                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-[#0B2233] border border-[#0F3A52] rounded-lg py-4 px-4 sm:px-6 transform transition-all duration-500 hover:scale-[1.02] hover:border-cyan-500/30"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    animation: 'service-slide-in 0.6s ease-out forwards',
                                    opacity: 0,
                                    transform: 'translateX(-50px)'
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded flex items-center justify-center">
                                        {getServiceIcon(service.name)}
                                    </div>
                                    <span className="text-white font-medium capitalize">
                                        {service.name}
                                    </span>
                                </div>
                                <div className="flex gap-2 sm:gap-3 justify-end">
                                    <button
                                        onClick={() => handleView(service)}
                                        className="flex items-center gap-2 bg-[#0ABF9D] text-white text-sm px-3 sm:px-4 py-1.5 rounded-md transition-all duration-300 transform hover:scale-105"
                                    >
                                        <Eye size={16} />
                                        <span className="hidden sm:inline">View</span>
                                    </button>
                                    <button
                                        onClick={() => handleRemove(service.id)}
                                        className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm px-3 sm:px-4 py-1.5 rounded-md transition-all duration-300 transform hover:scale-105"
                                    >
                                        <Trash2 size={16} />
                                        <span className="hidden sm:inline">Remove</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Scan Prompt - Only show when services are hidden */}
                {!showServices && !scanning && (
                    <div className="text-center mt-6 lg:mt-8 animate-pulse">
                        <p className="text-cyan-400/70 text-sm font-mono">
                            CLICK TO SCAN YOUR ACCOUNT
                        </p>
                    </div>
                )}

                {/* Scanning Status */}
                {scanning && (
                    <div className="text-center mt-6 lg:mt-8">
                        <div className="flex justify-center items-center gap-3 mb-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                            <p className="text-cyan-400 text-sm font-mono">SCANNING IN PROGRESS...</p>
                        </div>
                        <div className="w-48 h-1 bg-gray-700 rounded-full mx-auto overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 animate-scan-progress"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* View Modal */}
            {selectedService && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 sm:p-6 z-50 animate-modal-fade-in">
                    <div className="bg-[#0E2A3F] border border-cyan-500/30 rounded-xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-modal-slide-up">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                                    {getServiceIcon(selectedService.name, 32)}
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-[#0F3A52]">
                                <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                    <p className="text-white text-sm">Full name</p>
                                    <p className="text-white font-medium text-sm sm:text-base">{selectedService.data.fullName}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg border border-[#0F3A52]">
                                <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                    <p className="text-white text-sm">Email</p>
                                    <p className="text-white font-medium text-sm sm:text-base">{selectedService.data.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg border border-[#0F3A52]">
                                <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                    <p className="text-white text-sm">Phone number</p>
                                    <p className="text-white font-medium text-sm sm:text-base">{selectedService.data.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg border border-[#0F3A52]">
                                <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                    <p className="text-white text-sm">Account creation date</p>
                                    <p className="text-white font-medium text-sm sm:text-base">{selectedService.data.creationDate}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg border border-[#0F3A52]">
                                <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                    <p className="text-white text-sm">Time</p>
                                    <p className="text-white font-medium text-sm sm:text-base">{selectedService.data.time}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cyber Animation Styles */}
            <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes scan-wave {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }

        @keyframes digital-pulse-1 {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        @keyframes digital-pulse-2 {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        @keyframes digital-pulse-3 {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.6); opacity: 0; }
        }

        @keyframes binary-fall {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(400%); opacity: 0; }
        }

        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        @keyframes glitch-1 {
          0% { clip-path: inset(0 0 0 0); }
          20% { clip-path: inset(20% 0 60% 0); }
          40% { clip-path: inset(80% 0 20% 0); }
          60% { clip-path: inset(40% 0 40% 0); }
          80% { clip-path: inset(60% 0 20% 0); }
          100% { clip-path: inset(0 0 0 0); }
        }

        @keyframes glitch-2 {
          0% { clip-path: inset(0 0 0 0); }
          20% { clip-path: inset(60% 0 20% 0); }
          40% { clip-path: inset(20% 0 60% 0); }
          60% { clip-path: inset(80% 0 20% 0); }
          80% { clip-path: inset(40% 0 40% 0); }
          100% { clip-path: inset(0 0 0 0); }
        }

        @keyframes led-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes services-appear {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes service-slide-in {
          0% { opacity: 0; transform: translateX(-50px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 5px rgba(34, 211, 238, 0.5); }
          50% { text-shadow: 0 0 20px rgba(34, 211, 238, 0.8), 0 0 30px rgba(34, 211, 238, 0.6); }
        }

        @keyframes scan-progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        @keyframes modal-fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes modal-slide-up {
          0% { opacity: 0; transform: translateY(30px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-scan-wave {
          animation: scan-wave 2s linear infinite;
        }

        .animate-digital-pulse-1 {
          animation: digital-pulse-1 1s ease-out;
        }

        .animate-digital-pulse-2 {
          animation: digital-pulse-2 1s ease-out 0.2s;
        }

        .animate-digital-pulse-3 {
          animation: digital-pulse-3 1s ease-out 0.4s;
        }

        .animate-binary-fall {
          animation: binary-fall 1.5s linear infinite;
        }

        .animate-glitch {
          animation: glitch 0.3s linear infinite;
        }

        .animate-glitch-1 {
          animation: glitch-1 0.5s linear infinite;
        }

        .animate-glitch-2 {
          animation: glitch-2 0.7s linear infinite;
        }

        .animate-led-glow {
          animation: led-glow 1s ease-in-out infinite;
        }

        .animate-services-appear {
          animation: services-appear 0.8s ease-out forwards;
        }

        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }

        .animate-scan-progress {
          animation: scan-progress 2s ease-in-out forwards;
        }

        .animate-modal-fade-in {
          animation: modal-fade-in 0.3s ease-out forwards;
        }

        .animate-modal-slide-up {
          animation: modal-slide-up 0.4s ease-out forwards;
        }
      `}</style>
        </div>
    );
}