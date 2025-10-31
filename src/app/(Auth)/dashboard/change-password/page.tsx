'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { apiRequest } from '@/app/lib/api'

export default function ChangePassword() {
    const [showOld, setShowOld] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const accessToken = localStorage.getItem("authToken")
    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!formData.old_password || !formData.new_password || !formData.confirm_password) {
            setMessage("Please fill in all fields.")
            return
        }

        if (formData.new_password.length < 8) {
            setMessage("Password must be at least 8 characters long.")
            return
        }

        if (formData.new_password !== formData.confirm_password) {
            setMessage("New password and confirmation password do not match.")
            return
        }

        if (formData.old_password === formData.new_password) {
            setMessage("New password must be different from old password.")
            return
        }

        setLoading(true)
        setMessage("")
        try {
            await apiRequest("POST", "/accounts/change_pass/", {
                old_password: formData.old_password,
                new_password: formData.new_password,
                confirm_password: formData.confirm_password
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            setMessage("Password changed successfully!")
            
            // Clear form after successful submission
            setFormData({
                old_password: "",
                new_password: "",
                confirm_password: ""
            })
        } catch (error: any) {
            setMessage(error.message || "Failed to change password.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-[#0A2131] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-[#0D314B] text-white rounded-lg p-4 sm:p-6 lg:p-8 w-full">
                {/* Header */}
                <h2 className="text-white text-lg font-medium mb-4 sm:mb-6">Password</h2>
                <div className="border-b border-[#007ED6] mb-4 sm:mb-6"></div>

                {/* Message Display */}
                {message && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes("successfully") ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 sm:space-y-6">
                        <div>
                            <label className="block text-sm font-semibold" htmlFor="old_password">Old Password</label>
                            <div className='relative'>
                                <input
                                    type={showOld ? "text" : "password"}
                                    id="old_password"
                                    placeholder="Input your old password"
                                    value={formData.old_password}
                                    onChange={handleInputChange}
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg text-sm"
                                />
                                <div
                                    onClick={() => setShowOld(!showOld)}
                                    className='absolute right-3 sm:right-4 top-5 sm:top-5 cursor-pointer text-[#64748B]'
                                >
                                    {showOld ? <EyeOff size={20} className="sm:w-5 sm:h-5" /> : <Eye size={20} className="sm:w-5 sm:h-5" />}
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
                                    value={formData.new_password}
                                    onChange={handleInputChange}
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg text-sm"
                                />
                                <div
                                    onClick={() => setShowNew(!showNew)}
                                    className='absolute right-3 sm:right-4 top-5 sm:top-5 cursor-pointer text-[#64748B]'
                                >
                                    {showNew ? <EyeOff size={20} className="sm:w-5 sm:h-5" /> : <Eye size={20} className="sm:w-5 sm:h-5" />}
                                </div>
                            </div>
                            <small className='text-gray-300 mt-2 text-xs sm:text-sm'>Min 8 Characters with a combination of letters and numbers</small>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold" htmlFor="confirm_password">Confirmation New Password</label>
                            <div className='relative'>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    id="confirm_password"
                                    placeholder="confirmation your new password"
                                    value={formData.confirm_password}
                                    onChange={handleInputChange}
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg text-sm"
                                />
                                <div
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className='absolute right-3 sm:right-4 top-5 sm:top-5 cursor-pointer text-[#64748B]'
                                >
                                    {showConfirm ? <EyeOff size={20} className="sm:w-5 sm:h-5" /> : <Eye size={20} className="sm:w-5 sm:h-5" />}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 sm:mt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="py-3 sm:py-4 px-8 sm:px-14 bg-[#007ED6] text-white font-semibold text-sm rounded-lg hover:bg-[#0066b3] disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-300 cursor-pointer w-full sm:w-auto"
                            >
                                {loading ? "Changing..." : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}