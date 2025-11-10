'use client'

import React, { useRef, useState, useEffect } from 'react'
import profile from "@/../public/images/profile.jpg"
import Image from 'next/image'
import { Pencil } from 'lucide-react'
import { apiRequest } from '@/app/lib/api'

interface User {
    id: number;
    fullname: string;
    email: string;
    date_joined: string;
}

interface ProfileData {
    id: number;
    user: User;
    profile_picture: string | null;
    Country: string | null;
    City: string | null;
    Province: string | null;
    Gender: string | null;
    Bio: string | null;
}

export default function Profile() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string>(profile.src);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const accessToken = localStorage.getItem("authToken");
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        Country: "",
        City: "",
        Province: "",
        Gender: "",
        Bio: ""
    });

    // Available options for dropdowns
    const [availableOptions, setAvailableOptions] = useState({
        countries: ["USA", "Canada", "India"],
        cities: ["New York", "Los Angeles", "Chicago"],
        provinces: ["California", "Ontario", "Maharashtra"],
        genders: ["male", "female", "Other"]
    });

    // Fetch profile data on component mount
    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const data: ProfileData = await apiRequest("GET", "/accounts/profile/", null, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            console.log("API Response:", data); // Debug log

            // Update available options with values from API
            setAvailableOptions(prev => ({
                countries: [...new Set([...prev.countries, data.Country || ""])].filter(Boolean),
                cities: [...new Set([...prev.cities, data.City || ""])].filter(Boolean),
                provinces: [...new Set([...prev.provinces, data.Province || ""])].filter(Boolean),
                genders: [...new Set([...prev.genders, data.Gender || ""])].filter(Boolean)
            }));

            // Set form data with API response
            setFormData({
                fullname: data.user.fullname || "",
                email: data.user.email || "",
                Country: data.Country || "",
                City: data.City || "",
                Province: data.Province || "",
                Gender: data.Gender || "",
                Bio: data.Bio || ""
            });

            // console.log("Form Data Set:", { // Debug log
            //     fullname: data.user.fullname || "",
            //     Country: data.Country || "",
            //     City: data.City || "",
            //     Province: data.Province || "",
            //     Gender: data.Gender || "",
            //     Bio: data.Bio || ""
            // });

            // Set profile picture if available
            if (data.profile_picture) {
                setPreview(data.profile_picture);
            }
        } catch (error: any) {
            setMessage(error.message || "Failed to load profile data.");
        } finally {
            setLoading(false);
        }
    };

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
            // Here you would typically upload the image to the server
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        try {
            await apiRequest("PATCH", "/accounts/profile/update/", {
                fullname: formData.fullname,
                Country: formData.Country,
                City: formData.City,
                Province: formData.Province,
                Gender: formData.Gender,
                Bio: formData.Bio
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            setMessage("Profile updated successfully!");

            // Refresh profile data to get latest from server
            await fetchProfileData();
        } catch (error: any) {
            setMessage(error.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#0A2131] flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen">
                <div className="bg-[#0D314B] text-white rounded-lg p-4 sm:p-6 lg:p-8 w-full max-w-2xl">
                    <div className="flex justify-center items-center h-40">
                        <div className="w-8 h-8 border-4 border-t-[#007ED6] border-[#0A2131] rounded-full animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0A2131] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-[#0D314B] text-white rounded-lg p-4 sm:p-6 lg:p-8 w-full">
                {/* Header */}
                <h2 className="text-white text-lg font-medium mb-4 sm:mb-6">Profile Information</h2>
                <div className="border-b border-[#007ED6] mb-4 sm:mb-6"></div>

                {/* Message Display */}
                {message && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes("successfully") ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                        {message}
                    </div>
                )}

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

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 sm:space-y-6">
                        <div>
                            <label className="block text-sm font-semibold" htmlFor="fullname">Display Name</label>
                            <input
                                type="text"
                                id="fullname"
                                placeholder="Enter Your Display Name"
                                value={formData.fullname}
                                onChange={handleInputChange}
                                className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                // placeholder="demo@gmail.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled
                                className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <small className="text-gray-400 text-xs">Email cannot be changed</small>
                        </div>

                        <div className='flex flex-col sm:flex-row justify-between gap-4 sm:gap-6'>
                            <div className='w-full'>
                                <label className="block text-sm font-semibold" htmlFor="Country">Country</label>
                                <select
                                    id="Country"
                                    value={formData.Country}
                                    onChange={handleInputChange}
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg text-sm"
                                >
                                    <option value="">Select Your Country</option>
                                    {availableOptions.countries.map(country => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                    {/* Add custom option if value doesn't exist in list */}
                                    {formData.Country && !availableOptions.countries.includes(formData.Country) && (
                                        <option value={formData.Country}>{formData.Country}</option>
                                    )}
                                </select>
                            </div>

                            <div className='w-full'>
                                <label className="block text-sm font-semibold" htmlFor="City">City</label>
                                <select
                                    id="City"
                                    value={formData.City}
                                    onChange={handleInputChange}
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg text-sm"
                                >
                                    <option value="">Select Your City</option>
                                    {availableOptions.cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                    {/* Add custom option if value doesn't exist in list */}
                                    {formData.City && !availableOptions.cities.includes(formData.City) && (
                                        <option value={formData.City}>{formData.City}</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row justify-between gap-4 sm:gap-6'>
                            <div className='w-full'>
                                <label className="block text-sm font-semibold" htmlFor="Province">Province</label>
                                <select
                                    id="Province"
                                    value={formData.Province}
                                    onChange={handleInputChange}
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg text-sm"
                                >
                                    <option value="">Select Your Province</option>
                                    {availableOptions.provinces.map(province => (
                                        <option key={province} value={province}>{province}</option>
                                    ))}
                                    {/* Add custom option if value doesn't exist in list */}
                                    {formData.Province && !availableOptions.provinces.includes(formData.Province) && (
                                        <option value={formData.Province}>{formData.Province}</option>
                                    )}
                                </select>
                            </div>

                            <div className='w-full'>
                                <label className="block text-sm font-semibold" htmlFor="Gender">Gender</label>
                                <select
                                    id="Gender"
                                    value={formData.Gender}
                                    onChange={handleInputChange}
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg text-sm"
                                >
                                    <option value="">Select Your Gender</option>
                                    {availableOptions.genders.map(gender => (
                                        <option key={gender} value={gender}>{gender}</option>
                                    ))}
                                    {/* Add custom option if value doesn't exist in list */}
                                    {formData.Gender && !availableOptions.genders.includes(formData.Gender) && (
                                        <option value={formData.Gender}>{formData.Gender}</option>
                                    )}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold" htmlFor="Bio">Bio</label>
                            <textarea
                                id="Bio"
                                placeholder="Enter Your Bio"
                                value={formData.Bio}
                                onChange={handleInputChange}
                                className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg text-sm"
                            ></textarea>
                        </div>

                        <div className="mt-6 sm:mt-8">
                            <button
                                type="submit"
                                disabled={saving}
                                className="py-3 sm:py-4 px-8 sm:px-14 bg-[#007ED6] text-white font-semibold text-sm rounded-lg hover:bg-[#0066b3] disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-300 cursor-pointer w-full sm:w-auto"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}