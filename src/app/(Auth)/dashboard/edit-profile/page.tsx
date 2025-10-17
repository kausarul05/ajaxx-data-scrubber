'use client'

import React, { useRef, useState } from 'react'
import profile from "@/../public/images/profile.jpg"
import Image from 'next/image'
import { Pencil } from 'lucide-react'

export default function Profile() {

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string>(profile.src);

    // Open file selector
    const handleEditClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handle image change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        }
    };

    return (
        <div className="bg-[#0A2131] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-[#0D314B] text-white rounded-lg p-4 sm:p-6 lg:p-8 w-full">
                {/* Header */}
                <h2 className="text-white text-lg font-medium mb-4 sm:mb-6">Profile Information</h2>
                <div className="border-b border-[#007ED6] mb-4 sm:mb-6"></div>
                
                {/* Profile Image */}
                <div className="flex mb-4 sm:mb-6">
                    <div className="relative">
                        <Image
                            src={preview}
                            alt="Profile"
                            width={96}
                            height={96}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover"
                        />

                        {/* Edit Icon */}
                        <div
                            onClick={handleEditClick}
                            className="absolute right-[-8px] sm:right-[-10px] bottom-0 bg-gray-600 p-1.5 sm:p-2 rounded-full cursor-pointer hover:bg-gray-700 transition"
                        >
                            <Pencil size={16} className="sm:w-5 sm:h-5" color="white" />
                        </div>

                        {/* Hidden file input */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                <form>
                    <div className="space-y-4 sm:space-y-6">
                        <div>
                            <label className="block text-sm font-semibold" htmlFor="displayName">Display Name</label>
                            <input
                                type="text"
                                id="displayName"
                                placeholder="Enter Your Display Name"
                                className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="demo@gmail.com"
                                className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg text-sm"
                            />
                        </div>

                        <div className='flex flex-col sm:flex-row justify-between gap-4 sm:gap-6'>
                            <div className='w-full'>
                                <label className="block text-sm font-semibold" htmlFor="country">Country</label>
                                <select
                                    id="country"
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg text-sm"
                                >
                                    <option>Select Your Country</option>
                                    <option>USA</option>
                                    <option>Canada</option>
                                    <option>India</option>
                                </select>
                            </div>

                            <div className='w-full'>
                                <label className="block text-sm font-semibold" htmlFor="city">City</label>
                                <select
                                    id="city"
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg text-sm"
                                >
                                    <option>Select Your City</option>
                                    <option>New York</option>
                                    <option>Los Angeles</option>
                                    <option>Chicago</option>
                                </select>
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row justify-between gap-4 sm:gap-6'>
                            <div className='w-full'>
                                <label className="block text-sm font-semibold" htmlFor="province">Province</label>
                                <select
                                    id="province"
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg text-sm"
                                >
                                    <option>Select Your Province</option>
                                    <option>California</option>
                                    <option>Ontario</option>
                                    <option>Maharashtra</option>
                                </select>
                            </div>

                            <div className='w-full'>
                                <label className="block text-sm font-semibold" htmlFor="gender">Gender</label>
                                <select
                                    id="gender"
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg text-sm"
                                >
                                    <option>Select Your Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold" htmlFor="bio">Bio</label>
                            <textarea
                                id="bio"
                                placeholder="Enter Your Bio"
                                className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg text-sm"
                            ></textarea>
                        </div>

                        <div className="mt-6 sm:mt-8">
                            <button
                                type="submit"
                                className="py-3 sm:py-4 px-8 sm:px-14 bg-[#007ED6] text-white font-semibold text-sm rounded-lg hover:bg-[#007ED6] transition duration-300 cursor-pointer w-full sm:w-auto"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}