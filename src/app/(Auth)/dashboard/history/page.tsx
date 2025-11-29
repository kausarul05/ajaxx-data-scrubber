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
    FileText
} from "lucide-react";
import jsPDF from "jspdf";
import { apiRequest } from "@/app/lib/api";

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
    member_uuid: string;
    scan_id: string;
    raw_scan_data: ScanData[];
    raw_screenshot_data: ScreenshotData[];
    created_at: string;
}

interface ApiResponse {
    history: HistoryItem[];
}

export default function HistoryPage() {
    const [selectedRange, setSelectedRange] = useState("3 DAYS History");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ScreenshotData | null>(null);
    const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Fetch history data from API
    useEffect(() => {
        const fetchHistoryData = async () => {
            const userInfo = localStorage.getItem("userData")
           const user = JSON.parse(userInfo);
            try {
                setLoading(true);
                setError(null);
                const data: ApiResponse = await apiRequest(
                    "GET", 
                    `/data/optery/history/${user?.email}`
                );
                setHistoryData(data.history);
            } catch (err) {
                setError("Failed to load history data");
                console.error("Error fetching history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistoryData();
    }, []);

    // Close modal when clicking outside or pressing Escape key
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setModalOpen(false);
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setModalOpen(false);
            }
        };

        if (modalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [modalOpen]);

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

    const removeFromHistory = (itemToRemove: ScreenshotData) => {
        if (!itemToRemove) return;

        // Remove the specific screenshot from history
        setHistoryData(prevData => 
            prevData.map(historyItem => ({
                ...historyItem,
                raw_screenshot_data: historyItem.raw_screenshot_data.filter(
                    item => item.databroker_uuid !== itemToRemove.databroker_uuid
                )
            })).filter(historyItem => historyItem.raw_screenshot_data.length > 0)
        );
        
        setModalOpen(false);
    };

    const getServiceIcon = (brokerName: string, size: number = 20) => {
        // Map broker names to icons based on your existing logic
        const lowerName = brokerName.toLowerCase();
        
        if (lowerName.includes('facebook') || lowerName.includes('google')) {
            return lowerName.includes('google') ? 
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">G</div> :
                <Facebook size={size} className="text-blue-500" />;
        } else if (lowerName.includes('amazon')) {
            return <ShoppingBag size={size} className="text-orange-500" />;
        } else if (lowerName.includes('instagram')) {
            return <Instagram size={size} className="text-pink-500" />;
        } else if (lowerName.includes('tiktok')) {
            return <Music2 size={size} className="text-black" />;
        } else if (lowerName.includes('linkedin')) {
            return <Linkedin size={size} className="text-blue-600" />;
        } else if (lowerName.includes('youtube')) {
            return <Youtube size={size} className="text-red-500" />;
        } else {
            return <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">
                {brokerName.charAt(0)}
            </div>;
        }
    };

    const getServiceDomain = (brokerName: string) => {
        // Extract domain from URL or use broker name
        if (selectedItem?.url) {
            try {
                const url = new URL(selectedItem.url);
                return url.hostname;
            } catch {
                return `${brokerName.toLowerCase().replace(/\s+/g, '')}.com`;
            }
        }
        return `${brokerName.toLowerCase().replace(/\s+/g, '')}.com`;
    };

    const handleMoreClick = (e: React.MouseEvent, item: ScreenshotData) => {
        e.stopPropagation();
        setSelectedItem(item);
        setModalOpen(true);
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
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-[#007ED6] hover:bg-[#026bb7] px-4 py-2 rounded-md transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A2131] p-4 sm:p-6 lg:p-8 text-white">
            <div className="bg-[#0C2A44] p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-9 gap-4">
                    <h1 className="text-lg font-medium">Scan History</h1>

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
                            No scan history found
                        </div>
                    ) : (
                        historyData.map((historyItem) => (
                            <div key={historyItem.id}>
                                <div className="flex flex-col sm:flex-row sm:gap-5 sm:items-center mb-4 gap-2">
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

                                <div className="space-y-3 sm:space-y-4">
                                    {historyItem.raw_screenshot_data.map((screenshot, index) => (
                                        <div
                                            key={`${screenshot.databroker_uuid}-${index}`}
                                            className="flex justify-between items-center bg-[#0E3654]/40 rounded-lg px-3 sm:px-4 py-3 transition hover:bg-[#114065]/50 relative"
                                        >
                                            <div className="flex items-center gap-3">
                                                {getServiceIcon(screenshot.databroker_name)}
                                                <div>
                                                    <span className="text-sm font-bold block capitalize">
                                                        {screenshot.databroker_name}
                                                    </span>
                                                    <span className={`text-xs ${
                                                        screenshot.exposure_status === 10 ? 
                                                        'text-red-400' : 'text-green-400'
                                                    }`}>
                                                        {screenshot.exposure_status_description}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <MoreVertical
                                                    className="text-gray-300 cursor-pointer hover:text-white"
                                                    size={18}
                                                    onClick={(e) => handleMoreClick(e, screenshot)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal Overlay */}
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
                                    {getServiceDomain(selectedItem.databroker_name)}
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
                                onClick={() => downloadSingleItemPDF(selectedItem)}
                                className="w-full text-left px-4 py-3 cursor-pointer rounded-lg flex items-center gap-3 text-white transition-colors"
                            >
                                <FileText size={18} className="text-white" />
                                <span>Download PDF</span>
                            </button>
                            <button
                                onClick={() => removeFromHistory(selectedItem)}
                                className="w-full text-left px-4 py-3 cursor-pointer rounded-lg flex items-center gap-3 text-red-600 transition-colors"
                            >
                                <X size={18} />
                                <span>Remove from history</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}