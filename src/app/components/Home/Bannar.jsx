import Image from 'next/image'
import React from 'react'
import banner from "@/../public/images/bannar.png"

export default function Bannar() {
    return (
        <section className="flex flex-col gap-36 md:flex-row items-center justify-between bg-custom lg:section-gap md:section-gap section-gap pt-20 z-10" >
            <div className="md:w-1/2 space-y-6">
                <h2 className="text-6xl md:text-8xl font-semibold text-[#FFFFFF]">
                    Take back control of your personal data
                </h2>
                <p className="text-[#FFFFFF] text-base md:text-base w-8/12 mt-4 mb-8">
                    AJAXX data scurubber makes it quick, easy and safe to remove your see and personal data online.
                </p>
                <button className="bg-[#007ED6] px-6 py-3 rounded hover:bg-[#007ED6] text-white cursor-pointer">
                    Start Sing Up
                </button>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 w-full">
                <Image
                    src={banner}
                    alt="data security"
                    width={500}
                    height={350}
                    className=" w-full h-auto object-cover rounded-2xl"
                />
            </div>
        </section>
    )
}


