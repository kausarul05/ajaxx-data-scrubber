import Image from 'next/image'
import React from 'react'

export default function Bannar() {
    return (
        < section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 mt-10 z-10 relative" >
            <div className="md:w-1/2 space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                    Take back control of your personal data
                </h2>
                <p className="text-gray-300">
                    AJAXX data scrubber makes it quick, easy and safe to remove your
                    own personal data online.
                </p>
                <button className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700">
                    Sign Up
                </button>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
                <Image
                    src="/images/background.png"
                    alt="data security"
                    width={500}
                    height={350}
                    className="rounded-xl shadow-lg"
                />
            </div>
        </section >
    )
}
