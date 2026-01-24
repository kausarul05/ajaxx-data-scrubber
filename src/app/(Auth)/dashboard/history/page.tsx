"use client";

import { useState, useRef, useEffect } from "react";
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
    const router = useRouter();

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
                    </div>

                    <div className="flex items-center gap-3 lg:gap-4 lg:pr-20">
                        {/* Dropdown */}
                        <div className="relative">
                            <select
                                value={selectedRange}
                                onChange={(e) => setSelectedRange(e.target.value)}
                                className="bg-[#007ED6] text-white text-sm px-3 sm:px-4 py-2 rounded-md outline-none cursor-pointer"
                            >
                                <option>3 DAYS History</option>
                                <option>7 DAYS History</option>
                                <option>30 DAYS History</option>
                            </select>
                        </div>

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
                                        <p className="text-sm text-gray-400">
                                            Scan ID: {historyItem.scan_id}
                                        </p>
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
                                                    <button
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
                                                    </button>
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
                                <p className={`text-xs ${
                                    selectedItem.exposure_status === 10 ? 
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
        </div>
    );
}