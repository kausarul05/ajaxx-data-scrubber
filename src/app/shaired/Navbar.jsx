'use client'

import Image from 'next/image';
import React, { useState } from 'react'
import logo from "@/../public/images/logo.png"
import Link from 'next/link';

function Navbar() {
    const [activeIndex, setActiveIndex] = useState(0);

    const menuItems = ["Home", "Pricing", "Support", "Dashboard"];
    return (
        <div className="text-white bg-[#0A3740] lg:px-[140px] md:px-[80px] px-10 drop-shadow-lg drop-shadow-[#007ED680] py-2.5">
            <nav className="flex justify-between items-center z-10 relative">
                <Link href="/">
                    <Image
                        src={logo}
                        alt="background"
                        objectFit="cover"
                        className="w-38 h-14 relative"
                    />
                </Link>
                <ul className='flex gap-2'>
                    {menuItems.map((item, index) => (
                        <li
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`cursor-pointer px-9 py-3 rounded font-medium text-sm ${activeIndex === index ? "bg-[#007ED6] text-white" : ""
                                }`}
                        >
                            {item}
                        </li>
                    ))}
                </ul>

                <ul className="flex gap-6 items-center font-medium text-sm">
                    <li className="hover:text-blue-500 cursor-pointer border border-[#007ED6] py-2 px-7 rounded-lg">Sign In</li>
                    <li className="bg-[#007ED6] px-7 py-2 rounded hover:bg-[#007ED6] cursor-pointer">Sign Up</li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar
