import Image from 'next/image';
import React from 'react'


function Navbar() {
    return (
        <div>
            <div className="text-white">
                {/* Background */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/background.png"
                        alt="background"
                        layout="fill"
                        objectFit="cover"
                        className="opacity-30"
                    />
                </div>

                {/* Navbar */}
                <nav className="flex justify-between items-center p-6 z-10 relative">
                    <h1 className="text-2xl font-bold text-white">AJAXX</h1>
                    <ul className="flex gap-6">
                        <li className="hover:text-blue-500 cursor-pointer">Pricing</li>
                        <li className="hover:text-blue-500 cursor-pointer">Support</li>
                        <li className="hover:text-blue-500 cursor-pointer">Dashboard</li>
                        <li className="hover:text-blue-500 cursor-pointer">Sign In</li>
                        <li className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">Sign Up</li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Navbar
