"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    MoreVertical,
    Download,
    X,
    Facebook,
    ShoppingBag,
    Instagram,
    Music2,
    Linkedin,
    Youtube,
    FileText,
    Eye,
    Trash2
} from "lucide-react";
import jsPDF from "jspdf";
import { apiRequest } from "@/app/lib/api";
import Image from 'next/image';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import axios from 'axios';

interface DatabrokerData {
    has_name_data: boolean;
    has_relative_data: boolean;
    has_address_data: boolean;
    has_email_data: boolean;
    has_phone_data: boolean;
    has_company_data: boolean;
}

interface ScreenshotData {
    scan_id: string;
    databroker_uuid: string;
    databroker_name: string;
    databroker_data: DatabrokerData;
    image: string;
    thumbnail: string | null;
    url: string;
    removal_status: number;
    removal_status_description: string;
    exposure_status: number;
    exposure_status_description: string;
    search_type: string;
}

interface ScanData {
    scan_id: string;
    status: string;
    is_primary_scan: boolean;
    created_at: string;
    scheduled_for: string | null;
    report_pdf: string | null;
}

interface HistoryItem {
    id: number;
    member_uuid?: string;
    email: string;
    scan_id: string;
    raw_scan_data: ScanData[];
    raw_screenshot_data: ScreenshotData[];
    created_at: string;
}

export default function HistoryPage() {
    const [selectedRange, setSelectedRange] = useState("3 DAYS History");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ScreenshotData | null>(null);
    const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showScanDetailsModal, setShowScanDetailsModal] = useState(false);
    const [selectedScreenshot, setSelectedScreenshot] = useState<ScreenshotData | null>(null);
    const [deletingItem, setDeletingItem] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [showCustomRemovalModal, setShowCustomRemovalModal] = useState(false);
    const [customRemovals, setCustomRemovals] = useState<any[]>([]);
    const [customRemovalsLoading, setCustomRemovalsLoading] = useState(false);
    const [submittingRemoval, setSubmittingRemoval] = useState(false);
    const [removalFormData, setRemovalFormData] = useState({
        exposed_url: "",
        search_engine_url: "",
        search_keywords: "",
        additional_information: ""
    });
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [draggedImage, setDraggedImage] = useState<string | null>(null);
    const [activeRemovalTab, setActiveRemovalTab] = useState<'all' | 'in-progress'>('all');
    const [memberUUID, setMemberUUID] = useState("");
    const [selectedScreenshotForRemoval, setSelectedScreenshotForRemoval] = useState<ScreenshotData | null>(null);
    const router = useRouter();


    useEffect(() => {
        const userInfo = localStorage.getItem("userData");
        if (userInfo) {
            try {
                const user = JSON.parse(userInfo);
                // Get member UUID from localStorage or from your API
                const storedUUID = localStorage.getItem("uuid");
                if (storedUUID) {
                    setMemberUUID(storedUUID);
                }
            } catch (error) {
                console.error("Error parsing user info:", error);
            }
        }
    }, []);

    // Add the handleRemove function
    const handleRemove = () => {
        setShowCustomRemovalModal(true);
    };

    const downloadScreenshotAsFile = async (imageUrl: string, databrokerName: string): Promise<File | null> => {
        try {
            // Create a clean filename from databroker name
            const cleanName = databrokerName
                .replace(/[^a-zA-Z0-9]/g, '_')
                .toLowerCase()
                .substring(0, 30);
            const filename = `${cleanName}_screenshot.png`;

            // Fetch the image with CORS mode
            const response = await fetch(imageUrl, {
                method: 'GET',
                mode: 'cors',
                credentials: 'omit',
                headers: {
                    'Accept': 'image/*'
                }
            });

            if (response.ok) {
                const blob = await response.blob();

                // Create a File object from the blob
                const file = new File([blob], filename, {
                    type: blob.type || 'image/png',
                    lastModified: Date.now()
                });

                toast.success(`Screenshot downloaded as ${filename}`);
                return file;
            } else {
                throw new Error('Failed to download image');
            }
        } catch (error) {
            console.error('Error downloading screenshot:', error);
            toast.error('Could not auto-download screenshot. Please upload manually.');
            return null;
        }
    };

    // Add the custom removal fetch function (similar to your dashboard)
    const fetchCustomRemovals = useCallback(async () => {
        if (!memberUUID) {
            toast.error("No member UUID found.");
            return;
        }

        try {
            setCustomRemovalsLoading(true);
            const token = localStorage.getItem("authToken");

            const response = await apiRequest<any>(
                "GET",
                `/data/optery/custom-removals/?member_uuid=${memberUUID}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response && typeof response === 'object' && 'items' in response && Array.isArray(response.items)) {
                setCustomRemovals(response.items);
            } else {
                console.error("Invalid response structure:", response);
                toast.error("Failed to load custom removal requests: Invalid response format");
            }
        } catch (error) {
            console.error("Error fetching custom removals:", error);
            toast.error("Failed to load custom removal requests.");
        } finally {
            setCustomRemovalsLoading(false);
        }
    }, [memberUUID]);

    useEffect(() => {
        if (showCustomRemovalModal && memberUUID) {
            fetchCustomRemovals();
        }
    }, [showCustomRemovalModal, memberUUID, fetchCustomRemovals]);

    // Add the submit removal function (similar to your dashboard)
    const handleSubmitRemoval = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!memberUUID) {
            toast.error("No member UUID found.");
            return;
        }

        if (!removalFormData.exposed_url) {
            toast.error("Please provide the exposed URL.");
            return;
        }

        if (!proofFile) {
            toast.error("Please provide proof of exposure.");
            return;
        }

        try {
            setSubmittingRemoval(true);

            const formData = new FormData();
            formData.append("exposed_url", removalFormData.exposed_url);
            formData.append("search_engine_url", removalFormData.search_engine_url);
            formData.append("search_keywords", removalFormData.search_keywords);
            formData.append("additional_information", removalFormData.additional_information);

            if (draggedImage && proofFile.size === 0) {
                try {
                    const response = await fetch(draggedImage, {
                        method: 'GET',
                        headers: {
                            'Accept': 'image/*',
                        },
                        mode: 'cors'
                    });

                    if (response.ok) {
                        const blob = await response.blob();
                        const actualFile = new File([blob], proofFile.name, {
                            type: blob.type,
                            lastModified: new Date().getTime()
                        });
                        formData.append("proof_of_exposure", actualFile);
                    } else {
                        formData.append("proof_of_exposure", proofFile);
                        formData.append("image_url", draggedImage);
                    }
                } catch (fetchError) {
                    console.error('Error fetching image:', fetchError);
                    formData.append("proof_of_exposure", proofFile);
                    const updatedInfo = removalFormData.additional_information +
                        `\n\nImage Source URL: ${draggedImage}`;
                    formData.set("additional_information", updatedInfo);
                }
            } else {
                formData.append("proof_of_exposure", proofFile);
            }

            const token = localStorage.getItem("authToken");
            const baseURL = 'https://backend.ajaxxdatascrubber.com';

            const response = await axios.post(
                `${baseURL}/data/custom-removal/?member_uuid=${memberUUID}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data) {
                toast.success("Custom removal request submitted successfully!");

                // Reset form
                setRemovalFormData({
                    exposed_url: "",
                    search_engine_url: "",
                    search_keywords: "",
                    additional_information: ""
                });
                setProofFile(null);
                setDraggedImage(null);

                // Refresh the list
                fetchCustomRemovals();
            } else {
                throw new Error('No response data received');
            }

        } catch (error: any) {
            console.error("Error submitting removal request:", error);
            toast.error(`Failed to submit removal request: ${error.message}`);
        } finally {
            setSubmittingRemoval(false);
        }
    };

    // Add the input change handler
    const handleRemovalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRemovalFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Add the file select handler
    const handleFileSelect = (file: File) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error("Please select a valid image file (JPG, PNG, or WebP).");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be less than 10MB.");
            return;
        }

        setProofFile(file);
        toast.success("Image uploaded successfully!");
    };

    // Add the drag and drop handlers
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                handleFileSelect(file);
            } else {
                toast.error("Please drop an image file (JPG, PNG, WebP)");
            }
        }
    };

    // Add the filtered removals function
    const getFilteredRemovals = () => {
        if (!customRemovals || !Array.isArray(customRemovals)) return [];

        return customRemovals.filter(item => {
            if (!item || !item.status) return false;

            const status = String(item.status).toLowerCase().trim();

            switch (activeRemovalTab) {
                case 'in-progress':
                    return status.includes("progress") || status.includes("in_progress") ||
                        status === "in progress" || status === "submitted";
                default:
                    return true;
            }
        });
    };

    // Add the getStatusBadge function for custom removals
    const getCustomStatusBadge = (status: string | number) => {
        const statusString = String(status || "submitted").toLowerCase();

        const statusConfig: { [key: string]: { color: string; bgColor: string } } = {
            "submitted": { color: "text-blue-400", bgColor: "bg-blue-500/20 border-blue-500/30" },
            "in progress": { color: "text-yellow-400", bgColor: "bg-yellow-500/20 border-yellow-500/30" },
            "in_progress": { color: "text-yellow-400", bgColor: "bg-yellow-500/20 border-yellow-500/30" },
            "progress": { color: "text-yellow-400", bgColor: "bg-yellow-500/20 border-yellow-500/30" },
            "removed": { color: "text-green-400", bgColor: "bg-green-500/20 border-green-500/30" },
            "completed": { color: "text-green-400", bgColor: "bg-green-500/20 border-green-500/30" },
            "rejected": { color: "text-red-400", bgColor: "bg-red-500/20 border-red-500/30" }
        };

        const config = statusConfig[statusString] || statusConfig["submitted"];

        return (
            <span className={`${config.bgColor} ${config.color} text-xs px-2 py-1 rounded-full border capitalize`}>
                {statusString === 'in_progress' ? 'In Process' : statusString.replace('_', ' ')}
            </span>
        );
    };

    // Add the image download function
    const downloadImage = async (imageUrl: string, filename: string) => {
        try {
            const response = await fetch(imageUrl, {
                method: 'GET',
                mode: 'cors',
                credentials: 'omit'
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                toast.success(`Image downloaded as ${filename}`);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error downloading image:', error);
            const newTab = window.open(imageUrl, '_blank');
            if (!newTab) {
                toast.error('Please allow popups to download the image');
            }
        }
    };


    // Fetch history data from API
    const fetchHistoryData = async () => {
        const userInfo = localStorage.getItem("userData");
        if (!userInfo) {
            setError("User data not found");
            setLoading(false);
            return;
        }

        try {
            const user = JSON.parse(userInfo);
            setLoading(true);
            setError(null);

            // Make the API request - the response is directly an array
            const response = await apiRequest<HistoryItem[]>(
                "GET",
                `/data/optery/history/${user?.email}/`
            );

            console.log("API Response:", response);

            // Handle the response based on its structure
            let data: HistoryItem[] = [];

            if (Array.isArray(response)) {
                // Response is directly an array
                data = response;
            } else if (response && typeof response === 'object') {
                // Check if response has a data property
                if ('data' in response && Array.isArray(response.data)) {
                    data = response.data as HistoryItem[];
                }
                // Check if response has a history property (old structure)
                else if ('history' in response && Array.isArray(response.history)) {
                    data = response.history as HistoryItem[];
                }
                // Check if response is the success wrapper
                else if ('success' in response && response.success && 'data' in response) {
                    if (Array.isArray(response.data)) {
                        data = response.data as HistoryItem[];
                    }
                }
            }

            // Ensure each item has raw_screenshot_data as an array
            const processedData = data.map(item => ({
                ...item,
                raw_screenshot_data: Array.isArray(item.raw_screenshot_data)
                    ? item.raw_screenshot_data
                    : []
            }));

            console.log("Processed history data:", processedData);
            setHistoryData(processedData);

        } catch (err) {
            setError("Failed to load history data");
            console.error("Error fetching history:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistoryData();
    }, []);

    // Close modal when clicking outside or pressing Escape key
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setModalOpen(false);
                setShowScanDetailsModal(false);
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setModalOpen(false);
                setShowScanDetailsModal(false);
            }
        };

        if (modalOpen || showScanDetailsModal) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [modalOpen, showScanDetailsModal]);

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format time for display
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Get service icon
    const getServiceIcon = (brokerName: string, size: number = 20) => {
        const lowerName = brokerName.toLowerCase();

        if (lowerName.includes('facebook') || lowerName.includes('people') || lowerName.includes('search')) {
            return <Facebook size={size} className="text-blue-500" />;
        } else if (lowerName.includes('amazon') || lowerName.includes('shopping')) {
            return <ShoppingBag size={size} className="text-orange-500" />;
        } else if (lowerName.includes('instagram') || lowerName.includes('social')) {
            return <Instagram size={size} className="text-pink-500" />;
        } else if (lowerName.includes('tiktok') || lowerName.includes('music')) {
            return <Music2 size={size} className="text-black" />;
        } else if (lowerName.includes('linkedin') || lowerName.includes('professional')) {
            return <Linkedin size={size} className="text-blue-600" />;
        } else if (lowerName.includes('youtube')) {
            return <Youtube size={size} className="text-red-500" />;
        } else if (lowerName.includes('google')) {
            return (
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-green-500 rounded flex items-center justify-center text-white font-bold text-xs">
                    G
                </div>
            );
        } else if (lowerName.includes('bing')) {
            return (
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-500 rounded flex items-center justify-center text-white font-bold text-xs">
                    B
                </div>
            );
        } else {
            return (
                <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded flex items-center justify-center text-white font-bold text-xs">
                    {brokerName.charAt(0)}
                </div>
            );
        }
    };

    const getStatusBadge = (status: number) => {
        const isExposed = status === 10;
        return (
            <span className={`text-xs px-2 py-1 rounded-full border ${isExposed ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
                {isExposed ? 'Exposed' : 'Safe'}
            </span>
        );
    };

    const getDataBadges = (databrokerData: DatabrokerData) => {
        const badges = [];
        if (databrokerData.has_name_data) badges.push("Name");
        if (databrokerData.has_address_data) badges.push("Address");
        if (databrokerData.has_email_data) badges.push("Email");
        if (databrokerData.has_phone_data) badges.push("Phone");
        if (databrokerData.has_relative_data) badges.push("Relatives");
        if (databrokerData.has_company_data) badges.push("Company");

        return badges.map((badge, index) => (
            <span
                key={index}
                className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full border border-cyan-500/30"
            >
                {badge}
            </span>
        ));
    };

    // Function to delete a specific screenshot from history
    const deleteScreenshot = async (databrokerUuid: string, scanId: string) => {
        if (!databrokerUuid || !scanId) return;

        try {
            setDeletingItem(databrokerUuid);

            // Call API to delete the screenshot
            const token = localStorage.getItem("authToken");

            const response = await apiRequest(
                "DELETE",
                `/data/optery/screenshot/${databrokerUuid}/`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.success) {
                toast.success("Removed successfully!");

                // Remove from local state
                setHistoryData(prevData =>
                    prevData.map(historyItem => {
                        if (historyItem.scan_id === scanId) {
                            return {
                                ...historyItem,
                                raw_screenshot_data: historyItem.raw_screenshot_data.filter(
                                    item => item.databroker_uuid !== databrokerUuid
                                )
                            };
                        }
                        return historyItem;
                    }).filter(historyItem => historyItem.raw_screenshot_data.length > 0)
                );

                // Close modal if open
                setModalOpen(false);
                setShowScanDetailsModal(false);
            } else {
                toast.error("Failed to remove. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting screenshot:", error);
            toast.error("Failed to remove. Please try again.");
        } finally {
            setDeletingItem(null);
        }
    };

    // Function to delete entire scan history
    const deleteScanHistory = async (scanId: string) => {
        if (!scanId) return;

        try {
            setDeletingItem(scanId);

            // Call API to delete the scan history
            const token = localStorage.getItem("authToken");

            const response = await apiRequest(
                "DELETE",
                `/data/optery/history/${scanId}/`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.success) {
                toast.success("Scan history removed successfully!");

                // Remove from local state
                setHistoryData(prevData =>
                    prevData.filter(item => item.scan_id !== scanId)
                );
            } else {
                toast.error("Failed to remove scan history. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting scan history:", error);
            toast.error("Failed to remove scan history. Please try again.");
        } finally {
            setDeletingItem(null);
        }
    };

    const handleView = (screenshot: ScreenshotData) => {
        setSelectedScreenshot(screenshot);
        setShowScanDetailsModal(true);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text("Full History Report", 20, 20);

        let y = 30;
        historyData.forEach((historyItem) => {
            doc.setFontSize(12);
            doc.text(`${formatDate(historyItem.created_at)} - ${formatTime(historyItem.created_at)}`, 20, y);
            y += 8;

            historyItem.raw_screenshot_data.forEach((screenshot) => {
                doc.text(`- ${screenshot.databroker_name} (${screenshot.exposure_status_description})`, 25, y);
                y += 8;
            });
            y += 5;
        });

        doc.save("history.pdf");
    };

    const downloadSingleItemPDF = (item: ScreenshotData) => {
        if (!item) return;

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Data Broker Report", 20, 20);

        doc.setFontSize(12);
        doc.text(`Broker: ${item.databroker_name}`, 20, 40);
        doc.text(`Status: ${item.exposure_status_description}`, 20, 50);
        doc.text(`URL: ${item.url}`, 20, 60);
        doc.text(`Scan ID: ${item.scan_id}`, 20, 70);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 80);

        // Add data exposure information
        doc.text("Exposed Data:", 20, 95);
        let dataY = 105;
        Object.entries(item.databroker_data).forEach(([key, value]) => {
            if (value) {
                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                doc.text(`• ${formattedKey}`, 25, dataY);
                dataY += 8;
            }
        });

        doc.save(`${item.databroker_name}_report.pdf`);
        setModalOpen(false);
    };

    const handleMoreClick = (e: React.MouseEvent, item: ScreenshotData, scanId: string) => {
        e.stopPropagation();
        setSelectedItem(item);
        setModalOpen(true);
    };

    // Go back to dashboard
    const goToDashboard = () => {
        router.push('/dashboard');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A2131] p-4 sm:p-6 lg:p-8 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Loading history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0A2131] p-4 sm:p-6 lg:p-8 text-white flex items-center justify-center">
                <div className="text-center text-red-400">
                    <p>{error}</p>
                    <button
                        onClick={() => fetchHistoryData()}
                        className="mt-4 bg-[#007ED6] hover:bg-[#026bb7] px-4 py-2 rounded-md transition mr-2"
                    >
                        Retry
                    </button>
                    <button
                        onClick={goToDashboard}
                        className="mt-4 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-md transition"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    console.log("historyData", historyData);

    return (
        <div className="min-h-screen bg-[#0A2131] p-4 sm:p-6 lg:p-8 text-white">
            <div className="bg-[#0C2A44] p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-9 gap-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-medium">Scan History</h1>
                        <button
                            onClick={goToDashboard}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm px-3 py-1.5 rounded-md transition"
                        >
                            Back to Scan
                        </button>

                        <button
                            onClick={handleRemove}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm px-3 py-1.5 rounded-md transition"
                        >
                            Request Custom Removal
                        </button>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-4 lg:pr-20">
                        {/* Dropdown */}
                        {/* <div className="relative">
                            <select
                                value={selectedRange}
                                onChange={(e) => setSelectedRange(e.target.value)}
                                className="bg-[#007ED6] text-white text-sm px-3 sm:px-4 py-2 rounded-md outline-none cursor-pointer"
                            >
                                <option>3 DAYS History</option>
                                <option>7 DAYS History</option>
                                <option>30 DAYS History</option>
                            </select>
                        </div> */}

                        {/* Download button */}
                        <button
                            onClick={downloadPDF}
                            className="bg-[#007ED6] hover:bg-[#026bb7] p-2 sm:p-2 rounded-md transition"
                            disabled={historyData.length === 0}
                        >
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                {/* History list */}
                <div className="space-y-6 lg:space-y-8 px-0 sm:px-4 lg:px-20">
                    {historyData.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <p className="mb-4">No scan history found</p>
                            <button
                                onClick={goToDashboard}
                                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md transition"
                            >
                                Start a New Scan
                            </button>
                        </div>
                    ) : (
                        historyData.map((historyItem) => (
                            <div key={historyItem.id} className="border border-[#0F3A52] rounded-lg p-4">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                                    <div className="flex flex-col sm:flex-row sm:gap-5 sm:items-center">
                                        <h2 className="text-lg sm:text-xl font-semibold">
                                            {formatDate(historyItem.created_at)}
                                        </h2>
                                        <p className="text-sm font-medium">
                                            {formatTime(historyItem.created_at)}
                                        </p>
                                        {/* <p className="text-sm text-gray-400">
                                            Scan ID: {historyItem.scan_id}
                                        </p> */}
                                    </div>
                                    <button
                                        onClick={() => deleteScanHistory(historyItem.scan_id)}
                                        disabled={deletingItem === historyItem.scan_id}
                                        className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm px-3 py-1.5 rounded-md transition-all duration-300 disabled:opacity-50"
                                    >
                                        {deletingItem === historyItem.scan_id ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 size={16} />
                                                Delete Scan
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    {historyItem.raw_screenshot_data && historyItem.raw_screenshot_data.length > 0 ? (
                                        historyItem.raw_screenshot_data.map((screenshot, index) => (
                                            <div
                                                key={`${screenshot.databroker_uuid || index}-${index}`}
                                                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0E3654]/40 rounded-lg px-4 py-3 transition hover:bg-[#114065]/50 gap-3"
                                            >
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="w-8 h-8 rounded flex items-center justify-center">
                                                        {getServiceIcon(screenshot.databroker_name)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                                            <span className="text-white font-medium">
                                                                {screenshot.databroker_name}
                                                            </span>
                                                            {getStatusBadge(screenshot.exposure_status)}
                                                        </div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {getDataBadges(screenshot.databroker_data)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 self-end sm:self-center">
                                                    <button
                                                        onClick={() => handleView(screenshot)}
                                                        className="flex items-center gap-2 bg-[#0ABF9D] text-white text-sm px-3 py-1.5 rounded-md transition-all duration-300"
                                                    >
                                                        <Eye size={16} />
                                                        <span>View</span>
                                                    </button>
                                                    {/* <button
                                                        onClick={() => deleteScreenshot(screenshot.databroker_uuid, historyItem.scan_id)}
                                                        disabled={deletingItem === screenshot.databroker_uuid}
                                                        className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm px-3 py-1.5 rounded-md transition-all duration-300 disabled:opacity-50"
                                                    >
                                                        {deletingItem === screenshot.databroker_uuid ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                Deleting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Trash2 size={16} />
                                                                <span>Delete</span>
                                                            </>
                                                        )}
                                                    </button> */}
                                                    <button
                                                        onClick={(e) => handleMoreClick(e, screenshot, historyItem.scan_id)}
                                                        className="flex items-center gap-2 bg-gray-600 text-white text-sm px-3 py-1.5 rounded-md transition-all duration-300"
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-gray-400">
                                            No screenshot data available for this scan
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal Overlay for History Items */}
            {modalOpen && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    {/* Modal Content */}
                    <div
                        ref={modalRef}
                        className="bg-[#0A2131] text-white rounded-xl shadow-2xl w-full max-w-sm mx-4 border border-gray-200 transform transition-all"
                    >
                        {/* Header with icon and title */}
                        <div className="flex items-center gap-3 p-5 pb-4 border-b border-gray-200">
                            {getServiceIcon(selectedItem.databroker_name, 28)}
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg capitalize">
                                    {selectedItem.databroker_name}
                                </h3>
                                <p className="text-sm text-white">
                                    {selectedItem.url ? new URL(selectedItem.url).hostname : selectedItem.databroker_name.toLowerCase()}
                                </p>
                                <p className={`text-xs ${selectedItem.exposure_status === 10 ?
                                    'text-red-400' : 'text-green-400'
                                    }`}>
                                    {selectedItem.exposure_status_description}
                                </p>
                            </div>
                            {/* Close button */}
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-white hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Menu items */}
                        <div className="p-2">
                            <button
                                onClick={() => {
                                    handleView(selectedItem);
                                    setModalOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 cursor-pointer rounded-lg flex items-center gap-3 text-white transition-colors hover:bg-gray-800"
                            >
                                <Eye size={18} className="text-white" />
                                <span>View Details</span>
                            </button>
                            <button
                                onClick={() => downloadSingleItemPDF(selectedItem)}
                                className="w-full text-left px-4 py-3 cursor-pointer rounded-lg flex items-center gap-3 text-white transition-colors hover:bg-gray-800"
                            >
                                <FileText size={18} className="text-white" />
                                <span>Download PDF</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal for Screenshot Details */}
            {showScanDetailsModal && selectedScreenshot && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 sm:p-6 z-50">
                    <div ref={modalRef} className="bg-[#0E2A3F] border border-cyan-500/30 rounded-xl p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                                    {getServiceIcon(selectedScreenshot.databroker_name, 32)}
                                </div>
                                <div>
                                    <h3 className="text-white text-xl font-semibold">{selectedScreenshot.databroker_name}</h3>
                                    {getStatusBadge(selectedScreenshot.exposure_status)}
                                </div>
                            </div>
                            <button
                                onClick={() => setShowScanDetailsModal(false)}
                                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Screenshot Image */}
                            <div className="space-y-4">
                                <h4 className="text-white font-medium">Screenshot</h4>
                                <div className="border border-[#0F3A52] rounded-lg overflow-hidden relative w-full h-64">
                                    <Image
                                        src={selectedScreenshot.image || '/placeholder-image.png'}
                                        alt={`${selectedScreenshot.databroker_name} screenshot`}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://via.placeholder.com/600x400/0B2233/0ABF9D?text=Screenshot+Not+Available';
                                        }}
                                    />
                                </div>
                                <a
                                    href={selectedScreenshot.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                    <Eye size={16} />
                                    Visit Source Website
                                </a>
                            </div>

                            {/* Data Details */}
                            <div className="space-y-4">
                                <h4 className="text-white font-medium">Exposed Data</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className={`p-3 rounded-lg border ${selectedScreenshot.databroker_data.has_name_data ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}`}>
                                        <p className="text-sm text-gray-400">Name Data</p>
                                        <p className={`font-medium ${selectedScreenshot.databroker_data.has_name_data ? 'text-red-400' : 'text-green-400'}`}>
                                            {selectedScreenshot.databroker_data.has_name_data ? 'Exposed' : 'Safe'}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg border ${selectedScreenshot.databroker_data.has_address_data ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}`}>
                                        <p className="text-sm text-gray-400">Address Data</p>
                                        <p className={`font-medium ${selectedScreenshot.databroker_data.has_address_data ? 'text-red-400' : 'text-green-400'}`}>
                                            {selectedScreenshot.databroker_data.has_address_data ? 'Exposed' : 'Safe'}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg border ${selectedScreenshot.databroker_data.has_email_data ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}`}>
                                        <p className="text-sm text-gray-400">Email Data</p>
                                        <p className={`font-medium ${selectedScreenshot.databroker_data.has_email_data ? 'text-red-400' : 'text-green-400'}`}>
                                            {selectedScreenshot.databroker_data.has_email_data ? 'Exposed' : 'Safe'}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg border ${selectedScreenshot.databroker_data.has_phone_data ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}`}>
                                        <p className="text-sm text-gray-400">Phone Data</p>
                                        <p className={`font-medium ${selectedScreenshot.databroker_data.has_phone_data ? 'text-red-400' : 'text-green-400'}`}>
                                            {selectedScreenshot.databroker_data.has_phone_data ? 'Exposed' : 'Safe'}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg border ${selectedScreenshot.databroker_data.has_relative_data ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}`}>
                                        <p className="text-sm text-gray-400">Relative Data</p>
                                        <p className={`font-medium ${selectedScreenshot.databroker_data.has_relative_data ? 'text-red-400' : 'text-green-400'}`}>
                                            {selectedScreenshot.databroker_data.has_relative_data ? 'Exposed' : 'Safe'}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg border ${selectedScreenshot.databroker_data.has_company_data ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}`}>
                                        <p className="text-sm text-gray-400">Company Data</p>
                                        <p className={`font-medium ${selectedScreenshot.databroker_data.has_company_data ? 'text-red-400' : 'text-green-400'}`}>
                                            {selectedScreenshot.databroker_data.has_company_data ? 'Exposed' : 'Safe'}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => downloadSingleItemPDF(selectedScreenshot)}
                                        className="flex-1 bg-[#007ED6] hover:bg-[#026bb7] text-white py-2 px-4 rounded-md transition flex items-center justify-center gap-2"
                                    >
                                        <Download size={16} />
                                        Download PDF
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Find the scan ID from history data
                                            const historyItem = historyData.find(item =>
                                                item.raw_screenshot_data.some(s => s.databroker_uuid === selectedScreenshot.databroker_uuid)
                                            );
                                            if (historyItem) {
                                                deleteScreenshot(selectedScreenshot.databroker_uuid, historyItem.scan_id);
                                            }
                                        }}
                                        disabled={deletingItem === selectedScreenshot.databroker_uuid}
                                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {deletingItem === selectedScreenshot.databroker_uuid ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 size={16} />
                                                Delete
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showCustomRemovalModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-modal-fade-in">
                    <div className="bg-[#0E2A3F] border border-cyan-500/30 rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-modal-slide-up">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-white text-2xl font-bold">Custom Removals</h2>
                                <p className="text-gray-400 text-sm mt-1">
                                    Submit custom requests for data broker profiles found in your scans
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowCustomRemovalModal(false);
                                    setSelectedScreenshotForRemoval(null);
                                    setRemovalFormData({
                                        exposed_url: "",
                                        search_engine_url: "",
                                        search_keywords: "",
                                        additional_information: ""
                                    });
                                    setProofFile(null);
                                }}
                                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Side - All Scan Data */}
                            <div className="space-y-6">
                                <div className="bg-[#0B2233] border border-[#0F3A52] rounded-lg p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-white text-lg font-semibold">Your Scan Data</h3>
                                        <span className="text-cyan-400 text-sm">
                                            Click any item to auto-fill form
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4">
                                        Select any item from your scan history to auto-fill the removal request
                                    </p>

                                    {/* Scan Data List */}
                                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                        {historyData.length === 0 ? (
                                            <div className="text-center py-8 text-gray-400">
                                                <FileText size={48} className="mx-auto mb-3 opacity-50" />
                                                <p>No scan data found</p>
                                                <button
                                                    onClick={goToDashboard}
                                                    className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md transition"
                                                >
                                                    Start a New Scan
                                                </button>
                                            </div>
                                        ) : (
                                            historyData.map((historyItem) => (
                                                <div key={historyItem.id} className="border border-[#0F3A52] rounded-lg p-4">
                                                    {/* History Item Header */}
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div>
                                                            <h4 className="text-white font-medium">
                                                                Scan from {formatDate(historyItem.created_at)}
                                                            </h4>
                                                            <p className="text-gray-400 text-xs">
                                                                {formatTime(historyItem.created_at)}
                                                            </p>
                                                        </div>
                                                        <span className="text-cyan-400 text-sm">
                                                            {historyItem.raw_screenshot_data?.length || 0} items
                                                        </span>
                                                    </div>

                                                    {/* Screenshots List */}
                                                    <div className="space-y-3">
                                                        {historyItem.raw_screenshot_data && historyItem.raw_screenshot_data.length > 0 ? (
                                                            historyItem.raw_screenshot_data.map((screenshot) => (
                                                                <div
                                                                    key={screenshot.databroker_uuid}
                                                                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 group ${selectedScreenshotForRemoval?.databroker_uuid === screenshot.databroker_uuid
                                                                        ? 'border-cyan-400 bg-cyan-400/10'
                                                                        : 'border-[#0F3A52] bg-[#0A1E2E] hover:border-cyan-500/30 hover:bg-cyan-500/5'
                                                                        }`}
                                                                    onClick={async () => {
                                                                        // Set loading state for this item
                                                                        const loadingToast = toast.loading('Downloading screenshot...');

                                                                        try {
                                                                            // Set the selected screenshot
                                                                            setSelectedScreenshotForRemoval(screenshot);

                                                                            // Auto-fill the form with the selected screenshot data
                                                                            setRemovalFormData(prev => ({
                                                                                ...prev,
                                                                                exposed_url: screenshot.url || "",
                                                                                search_keywords: screenshot.databroker_name,
                                                                                additional_information: `Automatically generated from scan on ${formatDate(historyItem.created_at)}. Data broker: ${screenshot.databroker_name}. Exposed data: ${Object.entries(screenshot.databroker_data)
                                                                                    .filter(([_, value]) => value)
                                                                                    .map(([key]) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
                                                                                    .join(', ')}.`
                                                                            }));

                                                                            // Try to auto-download the screenshot as proof
                                                                            if (screenshot.image) {
                                                                                const downloadedFile = await downloadScreenshotAsFile(
                                                                                    screenshot.image,
                                                                                    screenshot.databroker_name
                                                                                );

                                                                                if (downloadedFile) {
                                                                                    setProofFile(downloadedFile);
                                                                                    toast.update(loadingToast, {
                                                                                        render: 'Screenshot auto-added as proof!',
                                                                                        type: 'success',
                                                                                        isLoading: false,
                                                                                        autoClose: 3000
                                                                                    });
                                                                                } else {
                                                                                    toast.update(loadingToast, {
                                                                                        render: 'Please upload proof image manually',
                                                                                        type: 'warning',
                                                                                        isLoading: false,
                                                                                        autoClose: 3000
                                                                                    });
                                                                                }
                                                                            } else {
                                                                                toast.update(loadingToast, {
                                                                                    render: 'No screenshot available. Please upload proof manually.',
                                                                                    type: 'warning',
                                                                                    isLoading: false,
                                                                                    autoClose: 3000
                                                                                });
                                                                            }
                                                                        } catch (error) {
                                                                            toast.update(loadingToast, {
                                                                                render: 'Error downloading screenshot. Please upload manually.',
                                                                                type: 'error',
                                                                                isLoading: false,
                                                                                autoClose: 3000
                                                                            });
                                                                        }
                                                                    }}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="relative">
                                                                            <div className="w-8 h-8 rounded flex items-center justify-center">
                                                                                {getServiceIcon(screenshot.databroker_name)}
                                                                            </div>
                                                                            {selectedScreenshotForRemoval?.databroker_uuid === screenshot.databroker_uuid && (
                                                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center">
                                                                                    <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                                    </svg>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                                                                <span className="text-white font-medium text-sm">
                                                                                    {screenshot.databroker_name}
                                                                                </span>
                                                                                {getStatusBadge(screenshot.exposure_status)}
                                                                            </div>
                                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                                {getDataBadges(screenshot.databroker_data)}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-gray-400 group-hover:text-cyan-400 transition-colors">
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                    {screenshot.image && (
                                                                        <p className="text-cyan-400 text-xs mt-2 flex items-center gap-1">
                                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                            </svg>
                                                                            Screenshot available - will auto-download on click
                                                                        </p>
                                                                    )}
                                                                    {screenshot.url && (
                                                                        <p className="text-gray-400 text-xs mt-1 truncate">
                                                                            URL: {screenshot.url}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-center py-4 text-gray-400 text-sm">
                                                                No screenshot data available for this scan
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Submit Removal Request */}
                            <div className="bg-[#0B2233] border border-[#0F3A52] rounded-lg p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                                        <Plus size={20} />
                                        Submit Removal Request
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedScreenshotForRemoval(null);
                                            setRemovalFormData({
                                                exposed_url: "",
                                                search_engine_url: "",
                                                search_keywords: "",
                                                additional_information: ""
                                            });
                                            setProofFile(null);
                                        }}
                                        className="text-gray-400 hover:text-white text-sm px-3 py-1 border border-gray-600 rounded hover:border-gray-400 transition"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                {/* Selected Item Info */}
                                {selectedScreenshotForRemoval && (
                                    <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-cyan-500/20">
                                                    {getServiceIcon(selectedScreenshotForRemoval.databroker_name, 20)}
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium">
                                                        {selectedScreenshotForRemoval.databroker_name}
                                                    </h4>
                                                    <p className="text-cyan-400 text-xs">
                                                        Selected for removal request
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedScreenshotForRemoval(null);
                                                    setRemovalFormData({
                                                        exposed_url: "",
                                                        search_engine_url: "",
                                                        search_keywords: "",
                                                        additional_information: ""
                                                    });
                                                    setProofFile(null);
                                                }}
                                                className="text-gray-400 hover:text-white p-1"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>

                                        {/* Auto-generated Info */}
                                        <div className="grid grid-cols-2 gap-3 mt-3">
                                            <div className="bg-[#0A1E2E] p-2 rounded border border-[#0F3A52]">
                                                <p className="text-gray-400 text-xs">Auto-filled URL</p>
                                                <p className="text-white text-sm truncate">{selectedScreenshotForRemoval.url || "No URL"}</p>
                                            </div>
                                            <div className="bg-[#0A1E2E] p-2 rounded border border-[#0F3A52]">
                                                <p className="text-gray-400 text-xs">Proof Status</p>
                                                <p className={`text-sm ${proofFile ? 'text-green-400' : 'text-yellow-400'}`}>
                                                    {proofFile ? 'Auto-added ✓' : 'Manual upload needed'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmitRemoval} className="space-y-4">
                                    {/* Exposed URL */}
                                    <div>
                                        <label className="block text-white text-sm font-medium mb-2">
                                            Exposed URL *
                                        </label>
                                        <input
                                            type="url"
                                            name="exposed_url"
                                            value={removalFormData.exposed_url}
                                            onChange={handleRemovalInputChange}
                                            className="w-full p-3 bg-[#0A1E2E] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors text-white"
                                            placeholder="Enter exposed URL here"
                                            required
                                        />
                                        {selectedScreenshotForRemoval && (
                                            <p className="text-cyan-400 text-xs mt-1">
                                                ✓ Auto-filled from selected item
                                            </p>
                                        )}
                                    </div>

                                    {/* Proof of Exposure */}
                                    <div>
                                        <label className="block text-white text-sm font-medium mb-2">
                                            Proof of your data exposure *
                                            {selectedScreenshotForRemoval && selectedScreenshotForRemoval.image && (
                                                <span className="text-cyan-400 text-xs ml-2">
                                                    (Auto-download attempted from screenshot)
                                                </span>
                                            )}
                                        </label>
                                        <div
                                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                                    ${isDragOver ? 'border-cyan-400 bg-cyan-400/20' : 'border-cyan-400/30 hover:border-cyan-400/50'}
                                    ${proofFile ? 'border-green-400 bg-green-400/10' : ''}
                                    min-h-[200px] flex items-center justify-center
                                `}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                setIsDragOver(true);
                                            }}
                                            onDragLeave={(e) => {
                                                e.preventDefault();
                                                setIsDragOver(false);
                                            }}
                                            onDrop={handleDrop}
                                            onClick={() => document.getElementById('proof-file')?.click()}
                                        >
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                                className="hidden"
                                                id="proof-file"
                                            />
                                            <div className="flex flex-col items-center gap-3">
                                                {proofFile ? (
                                                    <>
                                                        <div className="relative w-20 h-20">
                                                            <Image
                                                                src={URL.createObjectURL(proofFile)}
                                                                alt="Preview"
                                                                fill
                                                                className="object-cover rounded-lg border border-cyan-400/30"
                                                                sizes="80px"
                                                            />
                                                            <div className="absolute inset-0 bg-green-400/20 rounded-lg flex items-center justify-center">
                                                                <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="text-green-400 font-medium block">Proof image ready!</span>
                                                            <span className="text-gray-400 text-sm block">{proofFile.name}</span>
                                                            <span className="text-cyan-400 text-xs block mt-1">
                                                                {proofFile.size > 0 ? `${(proofFile.size / 1024).toFixed(1)} KB` : 'Size not available'}
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setProofFile(null);
                                                            }}
                                                            className="text-red-400 text-sm hover:text-red-300 transition-colors px-3 py-1 border border-red-400/30 rounded"
                                                        >
                                                            Remove Image
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FileText size={48} className="text-cyan-400 mb-2" />
                                                        <div className="text-center">
                                                            <span className="text-cyan-400 font-medium block">
                                                                {selectedScreenshotForRemoval ? 'Upload or auto-add proof' : 'Upload proof image'}
                                                            </span>
                                                            <span className="text-gray-400 text-sm block mt-1">
                                                                Drag & drop or click to select
                                                            </span>
                                                            {selectedScreenshotForRemoval && (
                                                                <div className="mt-3 p-3 bg-cyan-400/10 rounded border border-cyan-400/20">
                                                                    <p className="text-cyan-400 text-xs font-medium">Auto-Add Feature:</p>
                                                                    <p className="text-gray-400 text-xs text-left mt-1">
                                                                        Click any item on the left to auto-download its screenshot as proof.
                                                                        If auto-download fails, you can upload manually here.
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {isDragOver && (
                                                            <span className="text-cyan-400 text-sm animate-pulse mt-2">Drop local image file here...</span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Other form fields remain the same... */}
                                    {/* Search Engine URL */}
                                    <div>
                                        <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                                            <Search size={16} />
                                            Search engine results page URL (optional)
                                        </label>
                                        <input
                                            type="url"
                                            name="search_engine_url"
                                            value={removalFormData.search_engine_url}
                                            onChange={handleRemovalInputChange}
                                            className="w-full p-3 bg-[#0A1E2E] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors text-white"
                                            placeholder="Enter URL of the search engine"
                                        />
                                    </div>

                                    {/* Search Keywords */}
                                    <div>
                                        <label className="block text-white text-sm font-medium mb-2">
                                            Search keyword(s) used to locate profile (optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="search_keywords"
                                            value={removalFormData.search_keywords}
                                            onChange={handleRemovalInputChange}
                                            className="w-full p-3 bg-[#0A1E2E] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors text-white"
                                            placeholder="Add keywords from your search"
                                        />
                                    </div>

                                    {/* Additional Information */}
                                    <div>
                                        <label className="block text-white text-sm font-medium mb-2">
                                            Additional information (optional)
                                        </label>
                                        <textarea
                                            name="additional_information"
                                            value={removalFormData.additional_information}
                                            onChange={handleRemovalInputChange}
                                            rows={3}
                                            className="w-full p-3 bg-[#0A1E2E] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors text-white resize-none"
                                            placeholder="Add any additional information about this data broker exposure"
                                        />
                                        {selectedScreenshotForRemoval && (
                                            <p className="text-cyan-400 text-xs mt-1">
                                                ✓ Auto-generated description added
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={submittingRemoval || !removalFormData.exposed_url || !proofFile}
                                        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform ${submittingRemoval || !removalFormData.exposed_url || !proofFile
                                            ? "bg-gray-600 cursor-not-allowed"
                                            : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 hover:scale-[1.02]"
                                            } text-white`}
                                    >
                                        {submittingRemoval ? (
                                            <span className="flex items-center justify-center">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Submitting...
                                            </span>
                                        ) : (
                                            "Submit Removal Request"
                                        )}
                                    </button>

                                    {(!removalFormData.exposed_url || !proofFile) && (
                                        <p className="text-red-400 text-sm text-center">
                                            Please provide both exposed URL and proof image to submit
                                        </p>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}