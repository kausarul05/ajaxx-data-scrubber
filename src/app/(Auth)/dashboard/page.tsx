'use client'

import React, { useState, useEffect } from "react";
import {
    Eye,
    Trash2,
    X,
    Facebook,
    ShoppingBag,
    Instagram,
    Music2,
    Linkedin,
    Download,
    ExternalLink,
    FileText,
    Info,
    Plus,
    Search
} from "lucide-react";
import { toast } from "react-toastify";

type ServiceData = {
    fullName: string;
    email: string;
    phone: string;
    creationDate: string;
    time: string;
};

type Service = {
    id: number;
    name: string;
    icon: string;
    data: ServiceData;
};

type PlanData = {
    id: number;
    title: string;
    Description: string;
    price: string;
    billing_cycle: string;
    features: Array<{
        id: number;
        description: string;
    }>;
};

type SubscriptionData = {
    plan: PlanData;
    starts_at: string;
    expires_at: string;
    status: string;
    plan_uuid: string;
};

type ApiResponse = {
    success: boolean;
    message: string;
    data: SubscriptionData;
};

// Types based on your API response
type ScanResponse = {
    member_uuid: string;
    scans: Scan[];
    screenshots: ScreenshotGroup[];
    message: string;
};

type Scan = {
    scan_id: string;
    status: string;
    is_primary_scan: boolean;
    created_at: string;
    scheduled_for: string | null;
    report_pdf: string;
};

type ScreenshotGroup = {
    scan_id: string;
    screenshots: Screenshot[];
};

type Screenshot = {
    scan_id: string;
    databroker_uuid: string;
    databroker_name: string;
    databroker_data: {
        has_name_data: boolean;
        has_relative_data: boolean;
        has_address_data: boolean;
        has_email_data: boolean;
        has_phone_data: boolean;
        has_company_data: boolean;
    };
    image: string;
    thumbnail: string | null;
    url: string;
    removal_status: number;
    removal_status_description: string;
    exposure_status: number;
    exposure_status_description: string;
    search_type: string;
};

type CustomRemovalItem = {
    issue_id: string;
    status: string;
    exposed_url: string;
    submitted_at: string;
    databroker: string | null;
    data_exposure_image: string;
};

type CustomRemovalsResponse = {
    items: CustomRemovalItem[];
    count: number;
};

// Type for member data API response
type MemberDataResponse = {
    success: boolean;
    data: {
        uuid: string;
        email: string;
        first_name: string;
        last_name: string;
        middle_name: string;
        city: string;
        country: string;
        state: string;
        birthday_day: number;
        birthday_month: number;
        birthday_year: number;
        plan: string;
        postpone_scan: number;
        group_tag: string | null;
        address_line1: string;
        address_line2: string;
        zipcode: string;
        optery_response: {
            uuid: string;
        };
        status_code: number;
        is_success: boolean;
        created_at: string;
        updated_at: string;
    };
};

export default function Page() {
    const [clicked, setClicked] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [showServices, setShowServices] = useState(false);
    const [selectedService, setSelectedService] = useState<Screenshot | null>(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        middle_name: "",
        city: "",
        country: "",
        state: "",
        birthday_day: "",
        birthday_month: "",
        birthday_year: "",
        plan: "",
        postpone_scan: "",
        group_tag: "",
        address_line1: "",
        address_line2: "",
        zipcode: ""
    });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [planLoading, setPlanLoading] = useState(true);
    const [currentPlan, setCurrentPlan] = useState<SubscriptionData | null>(null);
    const [scanData, setScanData] = useState<ScanResponse | null>(null);
    const [scanLoading, setScanLoading] = useState(false);
    const [memberData, setMemberData] = useState<MemberDataResponse | null>(null);
    const [checkingMemberData, setCheckingMemberData] = useState(false);
    const [userEmail, setUserEmail] = useState(""); // Store logged in user's email

    const [showCustomRemovalModal, setShowCustomRemovalModal] = useState(false);
    const [customRemovals, setCustomRemovals] = useState<CustomRemovalItem[]>([]);
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

    const [memberUUID, setMemberUUID] = useState("")

    // Get user email from localStorage or auth token when component mounts
    // Get user email from localStorage or auth token when component mounts
    useEffect(() => {
        const getUserEmail = () => {
            // Get email from localStorage userInfo
            const userInfo = localStorage.getItem("userData");
            // console.log(userInfo?.email)
            if (userInfo) {
                try {
                    const user = JSON.parse(userInfo);
                    // console.log(user?.email)
                    if (user.email) {
                        setUserEmail(user.email);
                        setFormData(prev => ({ ...prev, email: user.email }));
                    }
                } catch (error) {
                    console.error("Error parsing user info:", error);
                }
            }

            // If no user info in localStorage, try auth token or other sources
            const token = localStorage.getItem("authToken");
            if (token && !userEmail) {
                // You might need to decode JWT token or call user profile API
                // For now, we'll set a placeholder
                // setUserEmail("user@example.com"); // Replace with actual logic
                setFormData(prev => ({ ...prev, email: "user@example.com" }));
            }
        };

        getUserEmail();
        checkMemberData();
    }, [memberUUID]);

    // Check member data from API - ALWAYS check the API regardless of localStorage
    // Check member data from API - ALWAYS check the API regardless of localStorage
    const checkMemberData = async () => {
        try {
            setCheckingMemberData(true);

            // Get user email from localStorage
            const userInfo = localStorage.getItem("userData");
            if (!userInfo) {
                console.log("No user info found in localStorage");
                setMemberData(null);
                setFormSubmitted(false);
                return;
            }

            const user = JSON.parse(userInfo);
            const userEmail = user.email;

            if (!userEmail) {
                console.log("No email found in user info");
                setMemberData(null);
                setFormSubmitted(false);
                return;
            }

            // Use email from localStorage in the API endpoint
            const response = await fetch(`http://10.10.10.46:8000/data/api/optery-members/${userEmail}/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (response.ok) {
                const data: MemberDataResponse = await response.json();
                if (data.success && data.data) {
                    setMemberData(data);
                    setFormSubmitted(true); // Mark form as submitted since data exists
                    setMemberUUID(data?.data?.uuid)
                    console.log("Member data found in API:", data.data);
                    return; // Data exists, don't show form
                }
            } else if (response.status === 404) {
                console.log("No member data found in API - will show form when GO is clicked");
                setMemberData(null);
                setFormSubmitted(false);
            }

            // If API returned 404 or no data, we need to show form
            setMemberData(null);
            setFormSubmitted(false);

        } catch (error) {
            console.error("Error checking member data:", error);
            setMemberData(null);
            setFormSubmitted(false);
        } finally {
            setCheckingMemberData(false);
        }
    };

    // Fetch custom removals when modal opens
    useEffect(() => {
        if (showCustomRemovalModal) {
            fetchCustomRemovals();
        }
    }, [showCustomRemovalModal]);

    const fetchCustomRemovals = async () => {
        const memberUuid = localStorage.getItem("uuid");
        if (!memberUuid) {
            toast.error("No member UUID found.");
            return;
        }

        try {
            setCustomRemovalsLoading(true);
            const response = await fetch(`http://10.10.10.46:8000/data/optery/custom-removals/?member_uuid=${memberUUID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: CustomRemovalsResponse = await response.json();
            setCustomRemovals(data.items);
        } catch (error) {
            console.error("Error fetching custom removals:", error);
            toast.error("Failed to load custom removal requests.");
        } finally {
            setCustomRemovalsLoading(false);
        }
    };

    const handleRemove = (databrokerUuid: string, databrokerName: string) => {
        setShowCustomRemovalModal(true);
    };

    const handleSubmitRemoval = async (e: React.FormEvent) => {
        e.preventDefault();

        const memberUuid = localStorage.getItem("uuid");
        if (!memberUuid) {
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

            // If we have a dragged image URL, we need to handle it differently
            if (draggedImage && proofFile.size === 0) {
                // For URL-based images, we might need to download it first or send the URL
                // For now, let's try to fetch it with proper headers
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
                        // If fetch fails, fall back to sending the URL in additional info
                        formData.append("proof_of_exposure", proofFile);
                        formData.append("image_url", draggedImage);
                    }
                } catch (fetchError) {
                    console.error('Error fetching image:', fetchError);
                    // Fallback: send the original file and add URL to additional info
                    formData.append("proof_of_exposure", proofFile);
                    const updatedInfo = removalFormData.additional_information +
                        `\n\nImage Source URL: ${draggedImage}`;
                    formData.set("additional_information", updatedInfo);
                }
            } else {
                // Regular file upload
                formData.append("proof_of_exposure", proofFile);
            }

            const response = await fetch(`http://10.10.10.46:8000/data/custom-removal/?member_uuid=${memberUUID}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
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

        } catch (error) {
            console.error("Error submitting removal request:", error);
            toast.error("Failed to submit removal request. Please try again.");
        } finally {
            setSubmittingRemoval(false);
        }
    };

    const handleRemovalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRemovalFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Check file type and size
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file (JPG or PNG).");
                return;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB
                toast.error("File size must be less than 10MB.");
                return;
            }
            setProofFile(file);
        }
    };

    const downloadImage = async (imageUrl: string, filename: string) => {
        try {
            // Try direct download first
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

            // Fallback: Open in new tab for manual download
            // toast.info('Opening image in new tab for manual download...');
            const newTab = window.open(imageUrl, '_blank');
            if (!newTab) {
                toast.error('Please allow popups to download the image');
            }
        }
    };

    // Fetch current subscription plan on component mount
    useEffect(() => {
        const fetchCurrentPlan = async () => {
            try {
                setPlanLoading(true);
                const response = await fetch("http://10.10.10.46:8000/payment/payments/current-subscription/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: ApiResponse = await response.json();

                if (data.success && data.data) {
                    setCurrentPlan(data.data);
                    setFormData(prev => ({
                        ...prev,
                        plan: data.data.plan_uuid
                    }));
                }
            } catch (error) {
                console.error("Error fetching current plan:", error);
                alert("Failed to load current subscription plan.");
            } finally {
                setPlanLoading(false);
            }
        };

        fetchCurrentPlan();
    }, []);

    // Function to get the icon component based on databroker name
    const getServiceIcon = (databrokerName: string, size: number = 20) => {
        const name = databrokerName.toLowerCase();

        if (name.includes('facebook') || name.includes('people') || name.includes('search')) {
            return <Facebook size={size} className="text-blue-500" />;
        } else if (name.includes('amazon') || name.includes('shopping')) {
            return <ShoppingBag size={size} className="text-orange-500" />;
        } else if (name.includes('instagram') || name.includes('social')) {
            return <Instagram size={size} className="text-pink-500" />;
        } else if (name.includes('tiktok') || name.includes('music')) {
            return <Music2 size={size} className="text-black" />;
        } else if (name.includes('linkedin') || name.includes('professional')) {
            return <Linkedin size={size} className="text-blue-600" />;
        } else if (name.includes('google')) {
            return (
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-green-500 rounded flex items-center justify-center text-white font-bold text-xs">
                    G
                </div>
            );
        } else if (name.includes('bing')) {
            return (
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-500 rounded flex items-center justify-center text-white font-bold text-xs">
                    B
                </div>
            );
        } else {
            return (
                <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded flex items-center justify-center text-white font-bold text-xs">
                    {databrokerName.charAt(0)}
                </div>
            );
        }
    };

    // Function to get status badge color
    const getStatusBadge = (status: any) => {
        const statusString = String(status || "submitted").toLowerCase();

        const statusConfig: { [key: string]: { color: string; bgColor: string } } = {
            "submitted": { color: "text-blue-400", bgColor: "bg-blue-500/20 border-blue-500/30" },
            "in progress": { color: "text-yellow-400", bgColor: "bg-yellow-500/20 border-yellow-500/30" },
            "in_progress": { color: "text-yellow-400", bgColor: "bg-yellow-500/20 border-yellow-500/30" },
            "progress": { color: "text-yellow-400", bgColor: "bg-yellow-500/20 border-yellow-500/30" },
            // For "All" tab, you might still see completed/rejected, but they won't show in "In Process"
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

    // Function to get data type badges
    const getDataBadges = (databrokerData: any) => {
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

    const handleClick = async () => {
        // ALWAYS check the API first, regardless of localStorage
        if (!memberData) {
            // If no member data exists in API, show the form modal
            setShowFormModal(true);
            return;
        }

        // If member data exists, start the scan process
        await startDataScan();
    };

    const startDataScan = async () => {
        // const memberUuid = localStorage.getItem("uuid");

        // if (!memberUuid) {
        //     toast.error("No member UUID found. Please submit the form first.");
        //     return;
        // }

        try {
            setScanLoading(true);
            setClicked(true);
            setScanning(true);

            // Call the data scans API
            const response = await fetch(`http://10.10.10.46:8000/data/optery/data-scans/?member_uuid=${memberUUID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const scanResult: ScanResponse = await response.json();
            setScanData(scanResult);

            // Simulate scanning process
            setTimeout(() => setClicked(false), 800);

            setTimeout(() => {
                setScanning(false);
                setShowServices(true);
                toast.success("Scan completed successfully!");
            }, 2000);

        } catch (error) {
            console.error("Error starting data scan:", error);
            toast.error("Failed to start scan. Please try again.");
            setScanning(false);
            setClicked(false);
        } finally {
            setScanLoading(false);
        }
    };

    const handleFileSelect = (file: File) => {
        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error("Please select a valid image file (JPG, PNG, or WebP).");
            return;
        }

        // Check file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be less than 10MB.");
            return;
        }

        setProofFile(file);
        toast.success("Image uploaded successfully!");
    };

    const getFilteredRemovals = () => {
        if (!customRemovals || !Array.isArray(customRemovals)) return [];

        return customRemovals.filter(item => {
            if (!item || !item.status) return false;

            const status = String(item.status).toLowerCase().trim();

            switch (activeRemovalTab) {
                case 'in-progress':
                    // Show both "submitted" and "in progress" statuses in "In Process" tab
                    return status.includes("progress") || status.includes("in_progress") ||
                        status === "in progress" || status === "submitted";
                default:
                    return true; // 'all' tab shows everything
            }
        });
    };

    // Handle drag start from left side images
    const handleDragStart = (e: React.DragEvent, imageUrl: string) => {
        e.dataTransfer.setData('text/plain', imageUrl);
        setDraggedImage(imageUrl);
    };

    // Handle drag over on right side drop zone
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    // Handle drop on right side - Simplified version
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

    const handleImageUrlSelect = (imageUrl: string) => {
        // Create a mock file object from the URL
        const fileName = imageUrl.split('/').pop()?.split('?')[0] || 'screenshot.png';

        // Create a simple file-like object
        const mockFile = new File([], fileName, {
            type: 'image/png',
            lastModified: new Date().getTime()
        });

        // Store both the file and the original URL
        setProofFile(mockFile);

        // Store the image URL separately for display
        setDraggedImage(imageUrl);

        toast.success("Image added from existing request!");
    };

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simple validation
        if (!formData.email || !formData.first_name) {
            alert("Please fill required fields!");
            setLoading(false);
            return;
        }

        try {
            // Prepare payload according to API requirements
            const payload = {
                email: userEmail,
                first_name: formData.first_name,
                last_name: formData.last_name,
                middle_name: formData.middle_name,
                city: formData.city,
                country: formData.country,
                state: formData.state,
                birthday_day: formData.birthday_day ? parseInt(formData.birthday_day) : null,
                birthday_month: formData.birthday_month ? parseInt(formData.birthday_month) : null,
                birthday_year: formData.birthday_year ? parseInt(formData.birthday_year) : null,
                plan: formData.plan,
                postpone_scan: formData.postpone_scan ? parseInt(formData.postpone_scan)  : "",
                group_tag: null,
                address_line1: formData.address_line1,
                address_line2: formData.address_line2,
                zip_code: formData.zipcode
            };

            const response = await fetch("http://10.10.10.46:8000/data/optery/members/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            console.log(result?.data?.member_uuid)
            if (result) {
                setFormSubmitted(true);
                setShowFormModal(false);
                localStorage.setItem("uuid", result?.data?.member_uuid);
                setMemberData(result); // Update member data state
                toast.success("Member added successfully! You can now start the scan.");

                // Start scan automatically after form submission
                await startDataScan();
            } else {
                toast.error(`Failed to add member: ${result.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to submit form. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleView = (screenshot: Screenshot) => {
        setSelectedService(screenshot);
    };

    const closeModal = () => {
        setSelectedService(null);
    };

    const closeFormModal = () => {
        setShowFormModal(false);
    };

    const downloadReport = () => {
        if (scanData?.scans[0]?.report_pdf) {
            window.open(scanData.scans[0].report_pdf, '_blank');
        } else {
            toast.error("No report available for download");
        }
    };

    // Get all screenshots from the API response
    const allScreenshots = scanData?.screenshots?.flatMap(group => group.screenshots) || [];

    return (
        <div className="min-h-screen bg-[#0A2131] flex p-4 sm:p-6 lg:p-8">
            <div className="bg-[#0E2A3F] w-full rounded-xl p-4 sm:p-6 lg:p-10 shadow-xl">
                {/* Scan Section */}
                <h1 className="text-white text-lg mb-6 lg:mb-8 font-medium text-center lg:text-left">Scan Your Email</h1>

                <div className="flex justify-center mb-8 lg:mb-10">
                    <div
                        onClick={handleClick}
                        className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-full flex items-center justify-center cursor-pointer group"
                    >
                        {/* Cyber Grid Background */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30">
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(34,211,238,0.1)_50%),linear-gradient(transparent_50%,rgba(34,211,238,0.1)_50%)] bg-[size:20px_20px] rounded-full" />
                        </div>

                        {/* Scanning Wave Effect */}
                        {scanning && (
                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent animate-scan-wave" />
                            </div>
                        )}

                        {/* Digital Pulse Rings */}
                        {clicked && (
                            <>
                                <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-digital-pulse-1" />
                                <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-digital-pulse-2" />
                                <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-digital-pulse-3" />
                            </>
                        )}

                        {/* Binary Rain Effect */}
                        {scanning && (
                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                {[...Array(8)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute text-cyan-400/60 text-xs font-mono animate-binary-fall"
                                        style={{
                                            left: `${20 + i * 10}%`,
                                            animationDelay: `${i * 0.2}s`,
                                        }}
                                    >
                                        {Math.random() > 0.5 ? '1' : '0'}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Main Button with Glitch Effect */}
                        <div className={`
              relative z-10 w-32 h-32 sm:w-44 sm:h-44 rounded-full 
              flex items-center justify-center 
              bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600
              shadow-[0_0_50px_rgba(34,211,238,0.3)]
              transition-all duration-500
              ${clicked ? 'scale-95 shadow-[0_0_80px_rgba(34,211,238,0.6)]' : 'group-hover:scale-105'}
              overflow-hidden
            `}>
                            {/* Glitch Text Effect */}
                            <span className={`
                text-white text-2xl sm:text-4xl font-bold font-mono relative
                ${scanning ? 'animate-glitch' : ''}
              `}>
                                <span className="absolute top-0 left-0 text-cyan-300 animate-glitch-1">GO</span>
                                <span className="absolute top-0 left-0 text-blue-300 animate-glitch-2">GO</span>
                                GO
                            </span>

                            {/* LED Border */}
                            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-led-glow" />
                        </div>

                        {/* Hover Energy Field */}
                        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/0 group-hover:border-cyan-400/30 transition-all duration-500 group-hover:animate-spin-slow" />
                    </div>
                </div>

                {/* Services List - Animated Entry */}
                {showServices && (
                    <div className="space-y-4 animate-services-appear">
                        <div className="text-center mb-6">
                            <h2 className="text-cyan-400 text-lg font-mono animate-text-glow">
                                SCAN COMPLETE
                            </h2>
                            <p className="text-gray-400 text-sm mt-2">
                                Found {allScreenshots.length} data broker exposures
                            </p>
                        </div>

                        {allScreenshots.map((screenshot, index) => (
                            <div
                                key={screenshot.databroker_uuid}
                                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-[#0B2233] border border-[#0F3A52] rounded-lg py-4 px-4 sm:px-6 transform transition-all duration-500 hover:scale-[1.02] hover:border-cyan-500/30"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    animation: 'service-slide-in 0.6s ease-out forwards',
                                    opacity: 0,
                                    transform: 'translateX(-50px)'
                                }}
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-8 h-8 rounded flex items-center justify-center">
                                        {getServiceIcon(screenshot.databroker_name)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <span className="text-white font-medium">
                                                {screenshot.databroker_name}
                                            </span>
                                            {getStatusBadge(screenshot.exposure_status, screenshot.exposure_status_description)}
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {getDataBadges(screenshot.databroker_data)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 sm:gap-3 justify-end">
                                    <button
                                        onClick={() => handleView(screenshot)}
                                        className="flex items-center gap-2 bg-[#0ABF9D] text-white text-sm px-3 sm:px-4 py-1.5 rounded-md transition-all duration-300 transform hover:scale-105"
                                    >
                                        <Eye size={16} />
                                        <span className="hidden sm:inline">View</span>
                                    </button>
                                    <button
                                        onClick={() => handleRemove(screenshot.databroker_uuid, screenshot.databroker_name)}
                                        className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm px-3 sm:px-4 py-1.5 rounded-md transition-all duration-300 transform hover:scale-105"
                                    >
                                        <Trash2 size={16} />
                                        <span className="hidden sm:inline">Remove</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Scan Prompt - Only show when services are hidden */}
                {!showServices && !scanning && (
                    <div className="text-center mt-6 lg:mt-8 animate-pulse">
                        <p className="text-cyan-400/70 text-sm font-mono">
                            {memberData ? "CLICK TO START SCAN" : "CLICK TO SCAN YOUR ACCOUNT"}
                        </p>
                        {memberData && (
                            <p className="text-green-400 text-xs mt-1">
                                Member data found! Ready to scan.
                            </p>
                        )}
                    </div>
                )}

                {/* Scanning Status */}
                {scanning && (
                    <div className="text-center mt-6 lg:mt-8">
                        <div className="flex justify-center items-center gap-3 mb-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                            <p className="text-cyan-400 text-sm font-mono">
                                {scanLoading ? "INITIATING SCAN..." : "SCANNING IN PROGRESS..."}
                            </p>
                        </div>
                        <div className="w-48 h-1 bg-gray-700 rounded-full mx-auto overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 animate-scan-progress"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* View Modal for Screenshot Details */}
            {selectedService && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 sm:p-6 z-50 animate-modal-fade-in">
                    <div className="bg-[#0E2A3F] border border-cyan-500/30 rounded-xl p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-modal-slide-up">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                                    {getServiceIcon(selectedService.databroker_name, 32)}
                                </div>
                                <div>
                                    <h3 className="text-white text-xl font-semibold">{selectedService.databroker_name}</h3>
                                    {getStatusBadge(selectedService.exposure_status, selectedService.exposure_status_description)}
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
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
                                <div className="border border-[#0F3A52] rounded-lg overflow-hidden">
                                    <img
                                        src={selectedService.image}
                                        alt={`${selectedService.databroker_name} screenshot`}
                                        className="w-full h-auto object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400/0B2233/0ABF9D?text=Screenshot+Not+Available';
                                        }}
                                    />
                                </div>
                                <a
                                    href={selectedService.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                    <ExternalLink size={16} />
                                    Visit Source Website
                                </a>
                            </div>

                            {/* Data Details */}
                            <div className="space-y-4">
                                <h4 className="text-white font-medium">Exposed Data</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className={`p-3 rounded-lg border ${selectedService.databroker_data.has_name_data ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}`}>
                                        <p className="text-sm text-gray-400">Name Data</p>
                                        <p className={`font-medium ${selectedService.databroker_data.has_name_data ? 'text-red-400' : 'text-green-400'}`}>
                                            {selectedService.databroker_data.has_name_data ? 'Exposed' : 'Safe'}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg border ${selectedService.databroker_data.has_address_data ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}`}>
                                        <p className="text-sm text-gray-400">Address Data</p>
                                        <p className={`font-medium ${selectedService.databroker_data.has_address_data ? 'text-red-400' : 'text-green-400'}`}>
                                            {selectedService.databroker_data.has_address_data ? 'Exposed' : 'Safe'}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg border ${selectedService.databroker_data.has_email_data ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}`}>
                                        <p className="text-sm text-gray-400">Email Data</p>
                                        <p className={`font-medium ${selectedService.databroker_data.has_email_data ? 'text-red-400' : 'text-green-400'}`}>
                                            {selectedService.databroker_data.has_email_data ? 'Exposed' : 'Safe'}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg border ${selectedService.databroker_data.has_phone_data ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}`}>
                                        <p className="text-sm text-gray-400">Phone Data</p>
                                        <p className={`font-medium ${selectedService.databroker_data.has_phone_data ? 'text-red-400' : 'text-green-400'}`}>
                                            {selectedService.databroker_data.has_phone_data ? 'Exposed' : 'Safe'}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg border ${selectedService.databroker_data.has_relative_data ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}`}>
                                        <p className="text-sm text-gray-400">Relative Data</p>
                                        <p className={`font-medium ${selectedService.databroker_data.has_relative_data ? 'text-red-400' : 'text-green-400'}`}>
                                            {selectedService.databroker_data.has_relative_data ? 'Exposed' : 'Safe'}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg border ${selectedService.databroker_data.has_company_data ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}`}>
                                        <p className="text-sm text-gray-400">Company Data</p>
                                        <p className={`font-medium ${selectedService.databroker_data.has_company_data ? 'text-red-400' : 'text-green-400'}`}>
                                            {selectedService.databroker_data.has_company_data ? 'Exposed' : 'Safe'}
                                        </p>
                                    </div>
                                </div>

                                {/* Removal Status */}
                                <div className="p-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10">
                                    <h5 className="text-cyan-400 font-medium mb-2">Removal Status</h5>
                                    <p className="text-white text-sm">
                                        {selectedService.removal_status_description || "Not yet requested"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Modal - Only show if member data doesn't exist in API */}
            {showFormModal && !memberData && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-modal-fade-in">
                    <div className="bg-[#0E2A3F] border border-cyan-400/40 rounded-xl p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto shadow-2xl animate-modal-slide-up">
                        {/* Header with Close Button */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-white text-xl font-semibold">User Information Form</h2>
                            <button
                                onClick={closeFormModal}
                                className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmitForm} className="space-y-4 text-white">
                            <div>
                                <label className="block text-sm font-medium mb-2">Email *</label>
                                <input
                                    name="email"
                                    value={userEmail}
                                    onChange={handleInputChange}
                                    readOnly
                                    className="w-full p-3 bg-[#0B2233] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors cursor-not-allowed opacity-70"
                                    placeholder="johndoe@example.com"
                                    required
                                />
                                <small className="text-gray-400 text-xs mt-1">
                                    Email is automatically filled from your account and cannot be changed
                                </small>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">First Name *</label>
                                    <input
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-[#0B2233] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Last Name</label>
                                    <input
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-[#0B2233] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Middle Name</label>
                                <input
                                    name="middle_name"
                                    value={formData.middle_name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-[#0B2233] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">City</label>
                                    <input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-[#0B2233] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Country</label>
                                    <input
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-[#0B2233] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">State</label>
                                <input
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-[#0B2233] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                                />
                            </div>

                            {/* Birthday */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Birthday</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <input
                                            type="number"
                                            name="birthday_day"
                                            value={formData.birthday_day}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-[#0B2233] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                                            placeholder="Day"
                                            min="1"
                                            max="31"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            name="birthday_month"
                                            value={formData.birthday_month}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-[#0B2233] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                                            placeholder="Month"
                                            min="1"
                                            max="12"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            name="birthday_year"
                                            value={formData.birthday_year}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-[#0B2233] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                                            placeholder="Year"
                                            min="1900"
                                            max="2024"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Plan ID</label>
                                <input
                                    name="plan"
                                    value={formData.plan}
                                    readOnly
                                    className="w-full p-3 bg-[#0B2233] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors cursor-not-allowed opacity-70"
                                    placeholder={planLoading ? "Loading..." : "No active plan"}
                                />
                                {currentPlan && (
                                    <p className="text-cyan-400 text-xs mt-1">
                                        Active Plan: {currentPlan.plan.title} (${currentPlan.plan.price}/{currentPlan.plan.billing_cycle})
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Postpone Scan (days)</label>
                                <input
                                    type="number"
                                    name="postpone_scan"
                                    value={formData.postpone_scan}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-[#0B2233] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                                    placeholder="0 for immediate scan"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Group Tag</label>
                                <input
                                    name="group_tag"
                                    value={formData.group_tag}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-[#0B2233] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                                    placeholder="Family-A"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Address Line 1</label>
                                <input
                                    name="address_line1"
                                    value={formData.address_line1}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-[#0B2233] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Address Line 2</label>
                                <input
                                    name="address_line2"
                                    value={formData.address_line2}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-[#0B2233] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Zip Code</label>
                                <input
                                    name="zipcode"
                                    value={formData.zipcode}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-[#0B2233] border border-cyan-400/40 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || planLoading}
                                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform mt-4 ${loading || planLoading
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 hover:scale-[1.02]"
                                    }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Submitting...
                                    </span>
                                ) : (
                                    "Submit & Start Scan"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Removal Modal */}
            {showCustomRemovalModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-modal-fade-in">
                    <div className="bg-[#0E2A3F] border border-cyan-500/30 rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-modal-slide-up">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-white text-2xl font-bold">Custom Removals</h2>
                                <p className="text-gray-400 text-sm mt-1">
                                    Submit custom requests for additional data broker profiles not covered by your plan
                                </p>
                            </div>
                            <button
                                onClick={closeCustomRemovalModal}
                                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Side - Existing Requests */}
                            <div className="space-y-6">
                                <div className="bg-[#0B2233] border border-[#0F3A52] rounded-lg p-6">
                                    <h3 className="text-white text-lg font-semibold mb-4">Your requests</h3>

                                    {/* Status Filters */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <button
                                            onClick={() => setActiveRemovalTab('all')}
                                            className={`text-sm font-medium pb-1 px-2 transition-colors ${activeRemovalTab === 'all'
                                                ? 'text-cyan-400 border-b-2 border-cyan-400'
                                                : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            All ({customRemovals?.length || 0})
                                        </button>
                                        <button
                                            onClick={() => setActiveRemovalTab('in-progress')}
                                            className={`text-sm font-medium pb-1 px-2 transition-colors ${activeRemovalTab === 'in-progress'
                                                ? 'text-cyan-400 border-b-2 border-cyan-400'
                                                : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            In Process ({customRemovals?.filter(item => {
                                                if (!item?.status) return false;
                                                const status = String(item.status).toLowerCase();
                                                return status.includes("progress") || status.includes("in_progress") || status === "in progress" || status === "submitted";
                                            }).length || 0})
                                        </button>
                                    </div>

                                    {/* Requests List */}
                                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                                        {customRemovalsLoading ? (
                                            <div className="flex justify-center py-8">
                                                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        ) : !getFilteredRemovals() || getFilteredRemovals().length === 0 ? (
                                            <div className="text-center py-8 text-gray-400">
                                                <FileText size={48} className="mx-auto mb-3 opacity-50" />
                                                <p>No {activeRemovalTab !== 'all' ? 'in process' : ''} removal requests found</p>
                                            </div>
                                        ) : (
                                            getFilteredRemovals().map((item) => (
                                                item && item.issue_id ? (
                                                    <div key={item.issue_id} className="border border-[#0F3A52] rounded-lg p-4 hover:border-cyan-500/30 transition-colors">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-cyan-400 font-mono text-sm"><span className="font-semibold">ID:</span>{item.issue_id}</span>
                                                            {getStatusBadge(item.status)}
                                                        </div>
                                                        <p className="text-white text-sm mb-2 break-words"><span className="font-semibold">Exposed URL:</span> {item.exposed_url}</p>
                                                        <p className="text-gray-400 text-xs">
                                                            Submitted: {item.submitted_at ? new Date(item.submitted_at).toLocaleDateString() : 'Unknown date'}
                                                        </p>
                                                        {item.data_exposure_image && (
                                                            <div className="mt-3 p-3 bg-[#0A1E2E] rounded-lg border border-[#0F3A52]">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-cyan-400 text-sm font-medium">Proof Image</span>
                                                                    <div className="flex gap-2">
                                                                        {/* Download Button */}
                                                                        <button
                                                                            onClick={() => downloadImage(item.data_exposure_image, `proof-${item.issue_id}.png`)}
                                                                            className="flex items-center gap-1 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-xs px-2 py-1 rounded border border-cyan-500/30 transition-colors"
                                                                            title="Download image"
                                                                        >
                                                                            <Download size={12} />
                                                                            Download
                                                                        </button>
                                                                        {/* View Button */}
                                                                        <button
                                                                            onClick={() => window.open(item.data_exposure_image, '_blank')}
                                                                            className="flex items-center gap-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-xs px-2 py-1 rounded border border-blue-500/30 transition-colors"
                                                                            title="View image"
                                                                        >
                                                                            <Eye size={12} />
                                                                            View
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <img
                                                                    src={item.data_exposure_image}
                                                                    alt="Exposure proof"
                                                                    className="w-full h-32 object-contain rounded border border-[#0F3A52] bg-black/20"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x120/0B2233/0ABF9D?text=Image+Not+Available';
                                                                    }}
                                                                />
                                                                <p className="text-cyan-400 text-xs mt-2 text-center">
                                                                    ↓ Download image first, then drag & drop local file ↓
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : null
                                            )).filter(Boolean)
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Submit New Request */}
                            <div className="bg-[#0B2233] border border-[#0F3A52] rounded-lg p-6">
                                <h3 className="text-white text-lg font-semibold mb-6 flex items-center gap-2">
                                    <Plus size={20} />
                                    Submit Exposed Link
                                </h3>

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
                                    </div>

                                    {/* Proof of Exposure */}
                                    {/* Proof of Exposure - Local File Upload Only */}
                                    <div>
                                        <label className="block text-white text-sm font-medium mb-2">
                                            Proof of your data exposure *
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
                                                        <div className="w-20 h-20 relative">
                                                            <img
                                                                src={URL.createObjectURL(proofFile)}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover rounded-lg border border-cyan-400/30"
                                                            />
                                                            <div className="absolute inset-0 bg-green-400/20 rounded-lg flex items-center justify-center">
                                                                <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="text-green-400 font-medium">Image uploaded successfully!</span>
                                                        <span className="text-gray-400 text-sm">{proofFile.name}</span>
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
                                                            <span className="text-cyan-400 font-medium block">Upload proof image</span>
                                                            <span className="text-gray-400 text-sm block mt-1">Drag & drop local file or click to select</span>
                                                            <div className="mt-3 p-2 bg-cyan-400/10 rounded border border-cyan-400/20">
                                                                <p className="text-cyan-400 text-xs font-medium">How to use:</p>
                                                                <ol className="text-gray-400 text-xs text-left mt-1 space-y-1">
                                                                    <li>1. Click "Download" on left side image</li>
                                                                    <li>2. Save image to your computer</li>
                                                                    <li>3. Drag & drop the saved file here</li>
                                                                </ol>
                                                            </div>
                                                        </div>
                                                        {isDragOver && (
                                                            <span className="text-cyan-400 text-sm animate-pulse mt-2">Drop local image file here...</span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

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
                                            placeholder="Add additional information"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={submittingRemoval}
                                        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform ${submittingRemoval
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
                                            "Submit"
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cyber Animation Styles */}
            <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes scan-wave {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }

        @keyframes digital-pulse-1 {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        @keyframes digital-pulse-2 {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        @keyframes digital-pulse-3 {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.6); opacity: 0; }
        }

        @keyframes binary-fall {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(400%); opacity: 0; }
        }

        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        @keyframes glitch-1 {
          0% { clip-path: inset(0 0 0 0); }
          20% { clip-path: inset(20% 0 60% 0); }
          40% { clip-path: inset(80% 0 20% 0); }
          60% { clip-path: inset(40% 0 40% 0); }
          80% { clip-path: inset(60% 0 20% 0); }
          100% { clip-path: inset(0 0 0 0); }
        }

        @keyframes glitch-2 {
          0% { clip-path: inset(0 0 0 0); }
          20% { clip-path: inset(60% 0 20% 0); }
          40% { clip-path: inset(20% 0 60% 0); }
          60% { clip-path: inset(80% 0 20% 0); }
          80% { clip-path: inset(40% 0 40% 0); }
          100% { clip-path: inset(0 0 0 0); }
        }

        @keyframes led-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes services-appear {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes service-slide-in {
          0% { opacity: 0; transform: translateX(-50px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 5px rgba(34, 211, 238, 0.5); }
          50% { text-shadow: 0 0 20px rgba(34, 211, 238, 0.8), 0 0 30px rgba(34, 211, 238, 0.6); }
        }

        @keyframes scan-progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        @keyframes modal-fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes modal-slide-up {
          0% { opacity: 0; transform: translateY(30px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-scan-wave {
          animation: scan-wave 2s linear infinite;
        }

        .animate-digital-pulse-1 {
          animation: digital-pulse-1 1s ease-out;
        }

        .animate-digital-pulse-2 {
          animation: digital-pulse-2 1s ease-out 0.2s;
        }

        .animate-digital-pulse-3 {
          animation: digital-pulse-3 1s ease-out 0.4s;
        }

        .animate-binary-fall {
          animation: binary-fall 1.5s linear infinite;
        }

        .animate-glitch {
          animation: glitch 0.3s linear infinite;
        }

        .animate-glitch-1 {
          animation: glitch-1 0.5s linear infinite;
        }

        .animate-glitch-2 {
          animation: glitch-2 0.7s linear infinite;
        }

        .animate-led-glow {
          animation: led-glow 1s ease-in-out infinite;
        }

        .animate-services-appear {
          animation: services-appear 0.8s ease-out forwards;
        }

        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }

        .animate-scan-progress {
          animation: scan-progress 2s ease-in-out forwards;
        }

        .animate-modal-fade-in {
          animation: modal-fade-in 0.3s ease-out forwards;
        }

        .animate-modal-slide-up {
          animation: modal-slide-up 0.4s ease-out forwards;
        }
      `}</style>
        </div>
    );
}