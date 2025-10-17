'use client'


import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function ChangePassword() {
    const [showOld, setShowOld] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    console.log(showOld)

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
                                    type={showOld ? "text" : "password"}
                                    id="old_password"
                                    placeholder="Input your old password"
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg"
                                />
                                <div
                                    onClick={() => setShowOld(!showOld)}
                                    className='absolute right-5 top-5 cursor-pointer text-[#64748B]'>

                                    {showOld ? <EyeOff /> : <Eye />}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold" htmlFor="new_password">New Password</label>
                            <div className='relative'>
                                <input
                                    type={showNew ? "text" : "password"}
                                    id="new_password"
                                    placeholder="Input your new password"
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg"
                                />
                                <div
                                    onClick={() => setShowNew(!showNew)}
                                    className='absolute right-5 top-5 cursor-pointer text-[#64748B]'>

                                    {showNew ? <EyeOff /> : <Eye />}
                                </div>
                            </div>
                            <small className='text-gray-300 mt-2'>Min 8 Characters with a combination of letters and numbers</small>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold" htmlFor="confirm_password">Confirmation New Password</label>
                            <div className='relative'>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    id="confirm_password"
                                    placeholder="confirmation your new password"
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg"
                                />
                                <div
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className='absolute right-5 top-5 cursor-pointer text-[#64748B]'>

                                    {showConfirm ? <EyeOff /> : <Eye />}
                                </div>
                            </div>
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
