// pages/profile.tsx
import React from 'react'
import profile from "@/../public/images/profile.jpg"
import Image from 'next/image'

export default function Profile() {
    return (
        <div className="bg-[#0A2131] flex items-center justify-center p-8">
            <div className="bg-[#0D314B] text-white rounded-lg p-8 w-full">
                {/* Header */}
                <h2 className="text-white text-lg font-medium mb-6">Profile Information</h2>
                <div className="border-b border-[#007ED6] mb-6"></div>
                <div className="flex mb-6">
                    <Image
                        src={profile}
                        alt="Profile"
                        className="w-24 h-24 rounded-xl object-cover"
                    />
                </div>

                <form>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold" htmlFor="displayName">Display Name</label>
                            <input
                                type="text"
                                id="displayName"
                                placeholder="Enter Your Display Name"
                                className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="demo@gmail.com"
                                className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg"
                            />
                        </div>

                        <div className='flex justify-between gap-6'>
                            <div className='w-full'>
                                <label className="block text-sm font-semibold" htmlFor="country">Country</label>
                                <select
                                    id="country"
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg"
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
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg"
                                >
                                    <option>Select Your City</option>
                                    <option>New York</option>
                                    <option>Los Angeles</option>
                                    <option>Chicago</option>
                                </select>
                            </div>
                        </div>

                        <div className='flex justify-between gap-6'>
                            <div className='w-full'>
                                <label className="block text-sm font-semibold" htmlFor="province">Province</label>
                                <select
                                    id="province"
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg"
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
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg"
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
                                className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg"
                            ></textarea>
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                className="py-4 px-14 bg-[#007ED6] text-white font-semibold text-sm rounded-lg hover:bg-[#007ED6] transition duration-300 cursor-pointer"
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
