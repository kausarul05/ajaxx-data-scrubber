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
    const [selectedItemKey, setSelectedItemKey] = useState<string | null>(null);
    const moreVerticalRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
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

    // Close modal when clicking outside and update position on scroll
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setModalOpen(false);
            }
        };

        const updateModalPosition = () => {
            if (modalOpen && selectedItemKey && moreVerticalRefs.current[selectedItemKey]) {
                const buttonElement = moreVerticalRefs.current[selectedItemKey];
                if (buttonElement) {
                    // Force re-render by updating state (we'll use a dummy state)
                    setSelectedItem(prev => prev ? {...prev} : null);
                }
            }
        };

        if (modalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', updateModalPosition, true);
            window.addEventListener('resize', updateModalPosition);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', updateModalPosition, true);
            window.removeEventListener('resize', updateModalPosition);
        };
    }, [modalOpen, selectedItemKey]);

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

    const getModalPosition = () => {
        if (!selectedItemKey || !moreVerticalRefs.current[selectedItemKey]) {
            return { x: 0, y: 0 };
        }

        const buttonElement = moreVerticalRefs.current[selectedItemKey];
        if (!buttonElement) return { x: 0, y: 0 };

        const rect = buttonElement.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        
        // Position the modal to the LEFT of the 3 dots icon
        return {
            x: rect.left + scrollX - 270, // 270px to the left (modal width + padding)
            y: rect.top + scrollY - 10 // Align with the top of the icon
        };
    };

    const handleMoreClick = (e: React.MouseEvent, item: { name: string; icon: string }, itemKey: string) => {
        e.stopPropagation();
        
        const buttonElement = moreVerticalRefs.current[itemKey];
        if (buttonElement) {
            setSelectedItem(item);
            setSelectedItemKey(itemKey);
            setModalOpen(true);
        }
    };

    const modalPosition = getModalPosition();

    return (
        <div className="min-h-screen bg-[#0A2131] p-8 sm:p-8 text-white">
            <div className="bg-[#0C2A44] p-5 sm:p-8 rounded-2xl shadow-lg">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-9 gap-4">
                    <h1 className="text-lg font-medium">History</h1>

                    <div className="flex items-center gap-4 pr-20">
                        {/* Dropdown */}
                        <div className="relative">
                            <select
                                value={selectedRange}
                                onChange={(e) => setSelectedRange(e.target.value)}
                                className="bg-[#007ED6] text-white text-sm sm:text-sm px-4 py-2 rounded-md outline-none cursor-pointer"
                            >
                                <option>3 DAYS History</option>
                                <option>7 DAYS History</option>
                                <option>30 DAYS History</option>
                            </select>
                        </div>

                        {/* Download button */}
                        <button
                            onClick={downloadPDF}
                            className="bg-[#007ED6] hover:bg-[#026bb7] px-5.5 py-2 rounded-md transition"
                        >
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                {/* History list */}
                <div className="space-y-8 px-20">
                    {historyData.map((day, i) => (
                        <div key={i}>
                            <div className="flex gap-5 items-center mb-4">
                                <h2 className="text-xl font-semibold">{day.date}</h2>
                                <p className="text-sm font-medium">{day.time}</p>
                            </div>

                            <div className="space-y-4">
                                {day.items.map((item, j) => {
                                    const itemKey = `${i}-${j}-${item.name}`;
                                    return (
                                        <div
                                            key={j}
                                            className="flex justify-between items-center bg-[#0E3654]/40 rounded-lg px-4 py-3 transition hover:bg-[#114065]/50 relative"
                                        >
                                            <div className="flex items-center gap-3">
                                                {getServiceIcon(item.name)}
                                                <span className="text-sm sm:text-sm font-bold capitalize">{item.name}</span>
                                            </div>
                                            <div
                                                ref={el => { moreVerticalRefs.current[itemKey] = el; }}
                                                className="relative"
                                            >
                                                <MoreVertical
                                                    className="text-gray-300 cursor-pointer hover:text-white"
                                                    size={18}
                                                    onClick={(e) => handleMoreClick(e, item, itemKey)}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {modalOpen && selectedItem && (
                <div className="fixed inset-0 z-50">
                    {/* Modal Content */}
                    <div
                        ref={modalRef}
                        className="fixed bg-white text-gray-900 rounded-lg shadow-xl p-4 w-64 border border-gray-200 z-50"
                        style={{ 
                            top: `${modalPosition.y}px`, 
                            left: `${modalPosition.x}px`,
                        }}
                    >
                        {/* Header with icon and title */}
                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                            {getServiceIcon(selectedItem.name, 24)}
                            <div>
                                <h3 className="font-semibold text-sm capitalize">{selectedItem.name}</h3>
                                <p className="text-xs text-gray-500">{getServiceDomain(selectedItem.name)}</p>
                            </div>
                        </div>

                        {/* Menu items */}
                        <div className="space-y-1">
                            <button 
                                onClick={() => downloadSingleItemPDF(selectedItem)}
                                className="w-full text-left px-2 py-2 hover:bg-gray-100 rounded-md flex items-center gap-2 text-sm text-gray-700"
                            >
                                <FileText size={16} className="text-gray-500" />
                                Download PDF
                            </button>
                            <button
                                onClick={() => removeFromHistory(selectedItem)}
                                className="w-full text-left px-2 py-2 hover:bg-gray-100 rounded-md flex items-center gap-2 text-sm text-red-600"
                            >
                                <X size={16} />
                                Remove from history
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}