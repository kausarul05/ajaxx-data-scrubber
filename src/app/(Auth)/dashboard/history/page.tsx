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

export default function HistoryPage() {
    const [selectedRange, setSelectedRange] = useState("3 DAYS History");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ name: string; icon: string } | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const [historyData, setHistoryData] = useState([
        {
            date: "October, 06, 2025",
            time: "11:10 pm",
            items: [
                { name: "Facebook", icon: "/icons/facebook.png" },
                { name: "amazon", icon: "/icons/amazon.png" },
                { name: "Instagram", icon: "/icons/instagram.png" },
                { name: "TikTok", icon: "/icons/tiktok.png" },
                { name: "Linkedin", icon: "/icons/linkedin.png" },
                { name: "YouTube", icon: "/icons/youtube.png" },
            ],
        },
        {
            date: "November, 05, 2025",
            time: "11:10 pm",
            items: [
                { name: "Facebook", icon: "/icons/facebook.png" },
                { name: "amazon", icon: "/icons/amazon.png" },
                { name: "Instagram", icon: "/icons/instagram.png" },
                { name: "TikTok", icon: "/icons/tiktok.png" },
                { name: "Linkedin", icon: "/icons/linkedin.png" },
                { name: "YouTube", icon: "/icons/youtube.png" },
            ],
        },
    ]);

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
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [modalOpen]);

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text("Full History Report", 20, 20);

        let y = 30;
        historyData.forEach((day) => {
            doc.setFontSize(12);
            doc.text(`${day.date} - ${day.time}`, 20, y);
            y += 8;
            day.items.forEach((item) => {
                doc.text(`- ${item.name}`, 25, y);
                y += 8;
            });
            y += 5;
        });

        doc.save("history.pdf");
    };

    const downloadSingleItemPDF = (item: { name: string; icon: string }) => {
        if (!item) return;
        
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("History Item Report", 20, 20);
        
        doc.setFontSize(12);
        doc.text(`Service: ${item.name}`, 20, 40);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
        doc.text(`Time: ${new Date().toLocaleTimeString()}`, 20, 60);
        
        doc.save(`${item.name}_history.pdf`);
        setModalOpen(false);
    };

    const removeFromHistory = (itemToRemove: { name: string; icon: string }) => {
        if (!itemToRemove) return;

        // Remove the item from historyData
        setHistoryData(prevData => 
            prevData.map(day => ({
                ...day,
                items: day.items.filter(item => item.name !== itemToRemove.name)
            })).filter(day => day.items.length > 0) // Remove empty days
        );
        
        setModalOpen(false);
    };

    const getServiceIcon = (serviceName: string, size: number = 20) => {
        switch (serviceName.toLowerCase()) {
            case 'facebook':
                return <Facebook size={size} className="text-blue-500" />;
            case 'amazon':
                return <ShoppingBag size={size} className="text-orange-500" />;
            case 'instagram':
                return <Instagram size={size} className="text-pink-500" />;
            case 'tiktok':
                return <Music2 size={size} className="text-black" />;
            case 'linkedin':
                return <Linkedin size={size} className="text-blue-600" />;
            case 'youtube':
                return <Youtube size={size} className="text-red-500" />;
            default:
                return <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">
                    {serviceName.charAt(0)}
                </div>;
        }
    };

    const getServiceDomain = (serviceName: string) => {
        switch (serviceName.toLowerCase()) {
            case 'facebook':
                return 'facebook.com';
            case 'amazon':
                return 'amazon.com';
            case 'instagram':
                return 'instagram.com';
            case 'tiktok':
                return 'tiktok.com';
            case 'linkedin':
                return 'linkedin.com';
            case 'youtube':
                return 'youtube.com';
            default:
                return `${serviceName.toLowerCase()}.com`;
        }
    };

    const handleMoreClick = (e: React.MouseEvent, item: { name: string; icon: string }) => {
        e.stopPropagation();
        setSelectedItem(item);
        setModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#0A2131] p-4 sm:p-6 lg:p-8 text-white">
            <div className="bg-[#0C2A44] p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-9 gap-4">
                    <h1 className="text-lg font-medium">History</h1>

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
                        >
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                {/* History list */}
                <div className="space-y-6 lg:space-y-8 px-0 sm:px-4 lg:px-20">
                    {historyData.map((day, i) => (
                        <div key={i}>
                            <div className="flex flex-col sm:flex-row sm:gap-5 sm:items-center mb-4 gap-2">
                                <h2 className="text-lg sm:text-xl font-semibold">{day.date}</h2>
                                <p className="text-sm font-medium">{day.time}</p>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                {day.items.map((item, j) => (
                                    <div
                                        key={j}
                                        className="flex justify-between items-center bg-[#0E3654]/40 rounded-lg px-3 sm:px-4 py-3 transition hover:bg-[#114065]/50 relative"
                                    >
                                        <div className="flex items-center gap-3">
                                            {getServiceIcon(item.name)}
                                            <span className="text-sm font-bold capitalize">{item.name}</span>
                                        </div>
                                        <div className="relative">
                                            <MoreVertical
                                                className="text-gray-300 cursor-pointer hover:text-white"
                                                size={18}
                                                onClick={(e) => handleMoreClick(e, item)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Overlay */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    {/* Modal Content */}
                    <div
                        ref={modalRef}
                        className="bg-[#0A2131] text-white rounded-xl shadow-2xl w-full max-w-sm mx-4 border border-gray-200 transform transition-all"
                    >
                        {/* Header with icon and title */}
                        <div className="flex items-center gap-3 p-5 pb-4 border-b border-gray-200">
                            {selectedItem && getServiceIcon(selectedItem.name, 28)}
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg capitalize">
                                    {selectedItem?.name}
                                </h3>
                                <p className="text-sm text-white">
                                    {selectedItem && getServiceDomain(selectedItem.name)}
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
                                onClick={() => selectedItem && downloadSingleItemPDF(selectedItem)}
                                className="w-full text-left px-4 py-3 cursor-pointer rounded-lg flex items-center gap-3 text-white transition-colors"
                            >
                                <FileText size={18} className="text-white" />
                                <span>Download PDF</span>
                            </button>
                            <button
                                onClick={() => selectedItem && removeFromHistory(selectedItem)}
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