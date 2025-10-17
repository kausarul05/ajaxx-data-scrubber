'use client'


import React, { useRef, useState } from 'react'
import profile from "@/../public/images/profile.jpg"
import Image from 'next/image'
import { Eye, Pencil } from 'lucide-react'

export default function ChangePassword() {


    return (
        <div className="bg-[#0A2131] flex items-center justify-center p-8">
            <div className="bg-[#0D314B] text-white rounded-lg p-8 w-full">
                {/* Header */}
                <h2 className="text-white text-lg font-medium mb-6">Password</h2>
                <div className="border-b border-[#007ED6] mb-6"></div>

                <form>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold" htmlFor="old_password">Old Password</label>
                            <div className='relative'>
                                <input
                                    type="password"
                                    id="old_password"
                                    placeholder="Input your old password"
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg"
                                />
                                <div>
                                    <Eye className='absolute right-5 top-5 cursor-pointer' />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold" htmlFor="new_password">New Password</label>
                            <input
                                type="password"
                                id="new_password"
                                placeholder="confirmation your new password"
                                className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg"
                            />
                            <small className='text-gray-300 mt-2'>Min 8 Characters with a combination of letters and numbers</small>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold" htmlFor="confirm_password">Confirmation New Password</label>
                            <input
                                type="password"
                                id="confirm_password"
                                placeholder="Input your new password"
                                className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg"
                            />
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
