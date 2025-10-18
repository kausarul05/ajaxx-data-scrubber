'use client'

import Image from 'next/image';
import React, { useState, useEffect } from 'react'
import logo from "@/../public/images/logo.png"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LoginModal from '../components/Modal/LoginModal';
import RegisterModal from '../components/Modal/RegisterModal';

function Navbar() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const [activeModal, setActiveModal] = useState<"login" | "register" | null>(null);

    const pathname = usePathname();

    const menuItems = [
        {
            link: "/",
            route: "Home"
        },
        {
            link: "/pricing",
            route: "Pricing"
        },
        {
            link: "/support",
            route: "Support"
        },
        {
            link: "/dashboard",
            route: "Dashboard"
        }
    ];

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when clicking on a link
    const handleMenuItemClick = (index: number): void => {
        setActiveIndex(index);
        setIsMenuOpen(false);
    };

    return (
        <div className={`text-white bg-[#0A3740] lg:px-[140px] md:px-[80px] px-6 drop-shadow-lg drop-shadow-[#007ED680] py-2.5 sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0A3740]/95 backdrop-blur-sm' : ''
            }`}>
            <nav className="flex justify-between items-center relative">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex-shrink-0 transition-transform hover:scale-105 duration-200"
                >
                    <Image
                        src={logo}
                        alt="logo"
                        className=""
                        priority
                    />
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden lg:flex gap-2">
                    {menuItems.map((item, index) => (
                        <li
                            key={index}
                            className={`cursor-pointer px-6 py-3 rounded font-medium text-sm transition-all duration-300 transform hover:scale-105 ${pathname === item.link
                                ? "bg-[#007ED6] text-white shadow-lg shadow-[#007ED6]/50"
                                : "hover:bg-[#007ED6]/20 hover:text-white/90"
                                }`}
                        >
                            <Link href={item.link}>
                                {item.route}
                            </Link>
                        </li>
                    ))}
                </ul>



                {/* Desktop Auth Buttons */}
                <ul className="hidden lg:flex gap-6 items-center font-medium text-sm">
                    <li
                        onClick={() => setActiveModal("login")}
                        className="hover:text-blue-300 cursor-pointer border border-[#007ED6] py-2 px-6 rounded-lg transition-all duration-300 hover:bg-[#007ED6]/10 hover:border-[#007ED6]/80 hover:scale-105"
                    >
                        Sign In
                    </li>
                    <li
                        onClick={() => setActiveModal("register")}
                        className="bg-[#007ED6] px-6 py-2 rounded hover:bg-[#007ED6]/90 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#007ED6]/40"
                    >
                        Sign Up
                    </li>
                </ul>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden flex flex-col justify-center items-center w-10 h-10 transition-all duration-300"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`bg-white h-0.5 w-6 rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'
                        }`} />
                    <span className={`bg-white h-0.5 w-6 rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'
                        }`} />
                    <span className={`bg-white h-0.5 w-6 rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'
                        }`} />
                </button>

                {/* Mobile Menu Overlay - FIXED */}
                <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ease-in-out ${isMenuOpen
                    ? 'opacity-100 visible'
                    : 'opacity-0 invisible'
                    }`}>
                    {/* Background Overlay */}
                    <div
                        className={`absolute inset-0 bg-black transition-opacity duration-500 ${isMenuOpen ? 'opacity-70' : 'opacity-0'}`}
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Menu Content */}
                    <div className={`absolute top-0 left-0 w-full min-h-screen bg-[#0A3740] transition-transform duration-500 ease-in-out ${isMenuOpen
                        ? 'translate-y-0'
                        : '-translate-y-full'
                        }`}>
                        <div className="flex flex-col items-center justify-center h-full space-y-8 pt-20 pb-10">
                            {/* Mobile Navigation Items */}
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.link}
                                    onClick={() => handleMenuItemClick(index)}
                                    className={`text-2xl font-semibold py-4 px-8 rounded-lg transition-all duration-500 transform hover:scale-110 ${activeIndex === index
                                        ? "bg-[#007ED6] text-white shadow-2xl shadow-[#007ED6]/50 scale-110"
                                        : "text-white/80 hover:text-white hover:bg-[#007ED6]/30"
                                        }`}
                                >
                                    {item.route}
                                </Link>
                            ))}

                            {/* Mobile Auth Buttons */}
                            <div className="flex flex-col gap-6 mt-8 w-64">
                                <button className="hover:text-blue-300 cursor-pointer border-2 border-[#007ED6] py-4 px-8 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-[#007ED6]/10 hover:border-[#007ED6]/80 hover:scale-105">
                                    Sign In
                                </button>
                                <button className="bg-[#007ED6] px-8 py-4 rounded-xl hover:bg-[#007ED6]/90 cursor-pointer text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#007ED6]/40">
                                    Sign Up
                                </button>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="absolute top-8 right-6 text-white text-2xl p-2 hover:bg-white/10 rounded-full transition-all duration-300 z-50"
                                aria-label="Close menu"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
                {/* Modals */}
                {activeModal === "login" && (
                    <LoginModal
                        onClose={() => setActiveModal(null)}
                        onSwitchToRegister={() => setActiveModal("register")}
                    />
                )}

                {activeModal === "register" && (
                    <RegisterModal
                        onClose={() => setActiveModal(null)}
                        onSwitchToLogin={() => setActiveModal("login")}
                    />
                )}
            </nav>
        </div>
    )
}

export default Navbar