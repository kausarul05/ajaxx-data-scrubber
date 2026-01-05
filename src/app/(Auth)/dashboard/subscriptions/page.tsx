'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion';
import { apiRequest } from '@/app/lib/api';
import { CircleCheck, Loader2, AlertCircle, RefreshCw, CreditCard, Calendar, Shield, XCircle } from 'lucide-react';

type PlanData = {
    id: number;
    title: string;
    Description: string;
    billing_cycle: string;
    price: string;
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
    auto_renew: boolean;
};

export default function SubscriptionPage() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [currentSubscription, setCurrentSubscription] = useState<SubscriptionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [canceling, setCanceling] = useState(false);
    const [cancelError, setCancelError] = useState<string | null>(null);
    const [cancelSuccess, setCancelSuccess] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 40
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const featureVariants = {
        hidden: {
            opacity: 0,
            x: -20
        },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.1 + 0.3,
                duration: 0.4,
                ease: "easeOut"
            }
        })
    };

    const detailsVariants = {
        hidden: {
            opacity: 0,
            y: 20
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.4,
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("authToken");

                const data = await apiRequest<{ data: SubscriptionData }>(
                    "GET",
                    "/payment/payments/current-subscription/",
                    null,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setCurrentSubscription(data?.data);
            } catch (error) {
                console.error("Error fetching subscription: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscription();
    }, []);

    const handleCancelSubscription = async () => {
        if (!currentSubscription) return;

        const confirmMessage = `Are you sure you want to cancel your subscription?\n\nThis will:
✅ Stop all future auto-payments
✅ Allow you to use premium features until ${formatDate(currentSubscription.expires_at)}
✅ Prevent automatic renewal on the next billing date

You can always resubscribe later.`;

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            setCanceling(true);
            setCancelError(null);
            setCancelSuccess(false);

            const token = localStorage.getItem("authToken");
            
            const response = await apiRequest(
                "POST",
                "/payment/cancel-subscription/",
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.success) {
                setCancelSuccess(true);
                setCurrentSubscription(prev => prev ? {
                    ...prev,
                    status: 'cancelled',
                    auto_renew: false
                } : null);
            } else {
                throw new Error(response.message || "Failed to cancel subscription");
            }
        } catch (error: any) {
            console.error("Error cancelling subscription: ", error);
            setCancelError(error.message || "An error occurred while cancelling the subscription");
        } finally {
            setCanceling(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getNextBillingDate = () => {
        if (!currentSubscription) return null;
        const expiryDate = new Date(currentSubscription.expires_at);
        return expiryDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#007ED6]" />
            </div>
        );
    }

    if (!currentSubscription) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-white mb-4">No Active Subscription</h3>
                <p className="text-gray-400">You don't have an active subscription plan.</p>
            </div>
        );
    }

    const nextBillingDate = getNextBillingDate();

    return (
        <div className="p-4 md:p-6 mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Your Subscription</h2>
            
            <div ref={ref} className="space-y-8">
                {/* Main Subscription Card */}
                <motion.div
                    // initial="hidden"
                    // animate={isInView ? "visible" : "hidden"}
                    variants={cardVariants}
                    className="bg-gradient-to-br from-[#0F2D47] to-[#092B41] border border-[#1E3A5C] rounded-2xl p-8 shadow-xl"
                >
                    {/* Header with Plan Title and Status */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-2 bg-[#007ED6]/10 rounded-lg">
                                    <Shield className="w-6 h-6 text-[#007ED6]" />
                                </div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                                        {currentSubscription.plan.title}
                                    </h3>
                                    <p className="text-gray-400 mt-1">
                                        {currentSubscription.plan.Description}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4 md:mt-0">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-green-400 font-semibold">Active</span>
                            </div>
                            <div className="px-3 py-1.5 bg-[#007ED6]/20 rounded-full border border-[#007ED6]/30">
                                <span className="text-sm text-[#007ED6] font-medium flex items-center gap-1.5">
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Auto-Pay Enabled
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Plan Features */}
                        <div className="lg:col-span-2">
                            <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-[#007ED6] rounded-full"></span>
                                Plan Features
                            </h4>
                            
                            <ul className="space-y-4">
                                {currentSubscription.plan.features.map((feature, i) => (
                                    <motion.li
                                        key={feature.id}
                                        custom={i}
                                        variants={featureVariants}
                                        // initial="hidden"
                                        // animate={isInView ? "visible" : "hidden"}
                                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="p-1.5 bg-[#007ED6]/20 rounded-full mt-0.5">
                                            <CircleCheck className="w-4 h-4 text-[#007ED6]" />
                                        </div>
                                        <span className="text-white text-base">{feature.description}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Column - Price and Cancel */}
                        <div className="space-y-6">
                            <div className="p-6 rounded-xl bg-gradient-to-br from-[#0A2439] to-[#092B41] border border-[#1E3A5C]">
                                <div className="text-center mb-4">
                                    <span className="text-gray-400 text-sm">Current Price</span>
                                    <div className="flex items-baseline justify-center gap-2 mt-2">
                                        <span className="text-4xl font-bold text-white">${currentSubscription.plan.price}</span>
                                        <span className="text-gray-400">/{currentSubscription.plan.billing_cycle}</span>
                                    </div>
                                    <div className="mt-3 flex items-center justify-center gap-1.5">
                                        <CreditCard className="w-4 h-4 text-green-400" />
                                        <span className="text-green-400 text-sm">Auto-pay enabled</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-white/10">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Started:</span>
                                        <span className="text-white">{formatDate(currentSubscription.starts_at)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Renews on:</span>
                                        <span className="text-white font-medium">{nextBillingDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Cancel Subscription Section */}
                            <motion.div
                                variants={detailsVariants}
                                // initial="hidden"
                                // animate={isInView ? "visible" : "hidden"}
                                className="space-y-4"
                            >
                                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                    <div className="flex items-center gap-2 text-blue-300 mb-2">
                                        <RefreshCw className="w-4 h-4" />
                                        <span className="font-medium">Auto-Pay Subscription</span>
                                    </div>
                                    <p className="text-sm text-gray-300">
                                        Your subscription will automatically renew on {nextBillingDate}. 
                                        Cancel anytime to stop future charges.
                                    </p>
                                </div>

                                {/* CANCEL BUTTON - Made more prominent */}
                                {currentSubscription.status === 'active' && (
                                    <div className="border border-red-500/30 rounded-xl overflow-hidden bg-red-500/5">
                                        <div className="p-4 border-b border-red-500/20">
                                            <div className="flex items-center gap-2 text-red-400 mb-1">
                                                <XCircle className="w-5 h-5" />
                                                <span className="font-semibold">Cancel Subscription</span>
                                            </div>
                                            <p className="text-sm text-gray-300">
                                                Stop auto-payments and cancel your subscription
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleCancelSubscription}
                                            disabled={canceling}
                                            className="w-full px-6 py-4 font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
                                        >
                                            {canceling ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Cancelling Subscription...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-5 h-5" />
                                                    <span>Cancel Auto-Pay Subscription</span>
                                                </>
                                            )}
                                        </button>
                                        <div className="p-3 bg-red-500/10 border-t border-red-500/20">
                                            <p className="text-xs text-center text-red-300">
                                                You'll keep all premium features until {formatDate(currentSubscription.expires_at)}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Show message if already cancelled */}
                                {currentSubscription.status !== 'active' && (
                                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                                            <XCircle className="w-5 h-5" />
                                            <span className="font-medium">Subscription Cancelled</span>
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            Your subscription has been cancelled. You have access until {formatDate(currentSubscription.expires_at)}.
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Additional Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-[#0A2439] border border-[#1E3A5C] rounded-xl p-6"
                >
                    <h5 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#007ED6]" />
                        Subscription Details
                    </h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <span className="text-sm text-gray-400">Plan ID</span>
                            <div className="p-2 bg-[#0A1E2E] rounded border border-white/10">
                                <code className="text-xs text-gray-300 font-mono truncate block">
                                    {currentSubscription.plan_uuid}
                                </code>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <span className="text-sm text-gray-400">Billing Cycle</span>
                            <p className="text-white font-medium capitalize">{currentSubscription.plan.billing_cycle}</p>
                        </div>
                        
                        <div className="space-y-2">
                            <span className="text-sm text-gray-400">Subscription Status</span>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                    currentSubscription.status === 'active' ? 'bg-green-500' : 
                                    currentSubscription.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                                }`}></div>
                                <span className="text-white font-medium capitalize">{currentSubscription.status}</span>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <span className="text-sm text-gray-400">Auto-Renew</span>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                    currentSubscription.auto_renew ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                                <span className={`font-medium ${
                                    currentSubscription.auto_renew ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {currentSubscription.auto_renew ? 'Active' : 'Disabled'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    {cancelSuccess && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                        >
                            <div className="flex items-center gap-2 text-green-400 mb-1">
                                <CircleCheck className="w-4 h-4" />
                                <span className="font-medium">Auto-Pay Cancelled Successfully</span>
                            </div>
                            <p className="text-green-300 text-sm">
                                Future auto-payments have been stopped. You can use premium features until {formatDate(currentSubscription.expires_at)}.
                            </p>
                        </motion.div>
                    )}

                    {cancelError && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                        >
                            <div className="flex items-center gap-2 text-red-400 mb-1">
                                <AlertCircle className="w-4 h-4" />
                                <span className="font-medium">Cancellation Failed</span>
                            </div>
                            <p className="text-red-300 text-sm">
                                {cancelError}
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}