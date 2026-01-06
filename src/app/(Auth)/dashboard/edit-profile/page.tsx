'use client'

import React, { useRef, useState, useEffect } from 'react'
import profile from "@/../public/images/profile.jpg"
import Image from 'next/image'
import { Pencil, Trash2, AlertTriangle } from 'lucide-react'
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
    fullname: string;
    profile_picture: string | null;
    Country: string | null;
    City: string | null;
    Province: string | null;
    Gender: string | null;
    Bio: string | null;
}

// Define the API response structure based on your apiRequest function
interface ApiResponse<T = unknown> {
    data?: T;
    message?: string;
    status?: number;
    [key: string]: unknown;
}

export default function Profile() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string>(profile.src);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [userEmail, setUserEmail] = useState("")
    const [userId, setUserId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        Country: "",
        City: "",
        Province: "",
        Gender: "",
        Bio: ""
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Remove accessToken state and get it directly when needed
    const [availableOptions, setAvailableOptions] = useState({
        countries: ["USA", "Canada", "India"],
        cities: ["New York", "Los Angeles", "Chicago"],
        provinces: ["California", "Ontario", "Maharashtra"],
        genders: ["male", "female", "Other"]
    });

    const getAccessToken = (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("authToken");
        }
        return null;
    };

    // Fetch profile data on component mount
    useEffect(() => {
        fetchProfileData();
        const userInfo = localStorage.getItem("userData");

        // Add null check before parsing
        if (userInfo) {
            try {
                const userInfoObj = JSON.parse(userInfo);
                setUserEmail(userInfoObj?.email || "");
                setUserId(userInfoObj?.id || null);
            } catch (error) {
                console.error("Error parsing user data:", error);
                setUserEmail("");
                setUserId(null);
            }
        } else {
            setUserEmail("");
            setUserId(null);
        }
    }, []);

    const fetchProfileData = async () => {
        const token = getAccessToken();
        console.log("Token in fetchProfileData:", token);

        if (!token) {
            setMessage("No authentication token found");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await apiRequest<ProfileData>("GET", "/accounts/profile/", null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Handle different response structures
            let profileData: ProfileData;

            // Check if response has data property (wrapped response)
            if (response && typeof response === 'object' && 'data' in response) {
                const apiResponse = response as ApiResponse<ProfileData>;
                profileData = apiResponse.data || (response as unknown as ProfileData);
            } else {
                // Direct ProfileData response
                profileData = response as unknown as ProfileData;
            }

            console.log("Profile Data:", profileData);

            if (!profileData || typeof profileData !== 'object') {
                throw new Error("No valid data received from API");
            }

            // Safely extract data with fallbacks
            setFormData({
                fullname: profileData?.fullname,
                email: profileData.user?.email || "",
                Country: profileData.Country || "",
                City: profileData.City || "",
                Province: profileData.Province || "",
                Gender: profileData.Gender || "",
                Bio: profileData.Bio || ""
            });

            // Update available options with data from API
            setAvailableOptions(prev => ({
                countries: [...new Set([...prev.countries, profileData.Country || ""])].filter(Boolean),
                cities: [...new Set([...prev.cities, profileData.City || ""])].filter(Boolean),
                provinces: [...new Set([...prev.provinces, profileData.Province || ""])].filter(Boolean),
                genders: [...new Set([...prev.genders, profileData.Gender || ""])].filter(Boolean)
            }));

            if (profileData.profile_picture) {
                setPreview(profileData.profile_picture);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            setMessage((error instanceof Error ? error.message : String(error)) || "Failed to load profile data.");
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
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Create local preview
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
            setSelectedFile(file); // Store the file for later upload

            // Optional: Auto-upload image when selected
            await uploadProfilePicture(file);

        } catch (error) {
            setMessage((error instanceof Error ? error.message : String(error)) || "Failed to upload profile picture.");
            // If upload fails, revert to original picture
            await fetchProfileData();
        }
    };

    const uploadProfilePicture = async (file: File) => {
        const token = getAccessToken();
        if (!token) {
            setMessage("No authentication token found");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('profile_picture', file);

            // Only send profile_picture, keep other fields as they are
            await apiRequest("PATCH", "/accounts/profile/update/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setMessage("Profile picture updated successfully!");

            // Refresh to get updated picture URL from server
            await fetchProfileData();

        } catch (error) {
            throw error; // Re-throw to handle in caller
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

        const token = getAccessToken();
        if (!token) {
            setMessage("No authentication token found");
            return;
        }

        setSaving(true);
        setMessage("");

        try {
            // Create FormData to combine both profile data and profile picture
            const formDataToSend = new FormData();

            // Append all form data fields
            formDataToSend.append('fullname', formData.fullname);
            // formDataToSend.append('Country', formData.Country);
            // formDataToSend.append('City', formData.City);
            // formDataToSend.append('Province', formData.Province);
            formDataToSend.append('Gender', formData.Gender);
            formDataToSend.append('Bio', formData.Bio);

            // Append profile picture if selected
            if (selectedFile) {
                formDataToSend.append('profile_picture', selectedFile);
            }

            // Send single PATCH request with FormData
            await apiRequest("PATCH", "/accounts/profile/update/", formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Don't set Content-Type for FormData - browser will set it automatically with boundary
                }
            });

            setMessage("Profile updated successfully!");
            setSelectedFile(null); // Reset after successful upload

            // Refresh profile data
            await fetchProfileData();

        } catch (error) {
            setMessage((error instanceof Error ? error.message : String(error)) || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!userId) {
            setDeleteError("User ID not found");
            return;
        }

        setDeleting(true);
        setDeleteError("");

        try {
            const token = getAccessToken();
            if (!token) {
                setDeleteError("Authentication token not found");
                return;
            }

            await apiRequest("DELETE", `/accounts/admin/delete-user/${userId}/`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            // Clear local storage and redirect to login
            localStorage.clear();
            window.location.href = '/';

        } catch (error: unknown) {
            console.error("Error deleting account:", error);
             const errorMessage = error instanceof Error 
                ? error.message 
                : "Failed to delete account. Please try again.";
            setDeleteError(errorMessage || "Failed to delete account. Please try again.");
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const confirmDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteError("");
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
        <>
            <div className="bg-[#0A2131] flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="bg-[#0D314B] text-white rounded-lg p-4 sm:p-6 lg:p-8 w-full">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <h2 className="text-white text-lg font-medium">Profile Information</h2>
                        <button
                            type="button"
                            onClick={confirmDeleteAccount}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-600/30 rounded-lg transition-colors duration-200"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Delete Account</span>
                        </button>
                    </div>
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
                                    value={userEmail}
                                    onChange={handleInputChange}
                                    readOnly
                                    disabled
                                    className="w-full mt-2 p-3 bg-[#0D314B] border border-[#007ED6] text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <small className="text-gray-400 text-xs">Email cannot be changed</small>
                            </div>

                            <div className='flex flex-col sm:flex-row justify-between gap-4 sm:gap-6'>
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

                            <div className="mt-6 sm:mt-8 flex gap-4">
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

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#0D314B] border border-red-600/30 rounded-xl p-6 max-w-md w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-600/20 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Delete Account</h3>
                                <p className="text-sm text-gray-400">This action cannot be undone</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <p className="text-red-300">
                                Are you sure you want to delete your account? This action will:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5"></div>
                                    <span>Permanently delete all your data</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5"></div>
                                    <span>Cancel any active subscriptions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5"></div>
                                    <span>Remove all your files and data</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5"></div>
                                    <span>This action cannot be undone</span>
                                </li>
                            </ul>
                        </div>

                        {deleteError && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-300 text-sm">{deleteError}</p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={closeDeleteModal}
                                className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleting}
                                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-red-800 disabled:cursor-not-allowed"
                            >
                                {deleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Delete Account
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-xs text-gray-400 mt-4 text-center">
                            You will be logged out immediately after deletion
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}