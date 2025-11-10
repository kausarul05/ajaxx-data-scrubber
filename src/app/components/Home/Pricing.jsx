"use client";

import { CircleCheck, CircleX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { apiRequest } from '@/app/lib/api';
import { toast } from 'react-toastify';

export default function Pricing() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                setLoading(true);
                const response = await apiRequest("GET", "/payment/subscriptions");
                console.log("API Response:", response); // Debug log

                if (response.data) {
                    setSubscriptions(response.data);
                } else {
                    console.error("Unexpected API response structure:", response);
                    setSubscriptions([]);
                }
            } catch (error) {
                console.error('Failed to fetch subscriptions:', error);
                setSubscriptions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    // Handle Buy Now click
    const handleBuyNow = async (subscriptionId, planName) => {

        if(!localStorage.getItem("authToken")){
            toast.error("Please log in to proceed with the purchase.");
            return;
        }
        
        try {
            setProcessing(planName);
            console.log("localStorage", localStorage.getItem("authToken"))
            const response = await apiRequest(
                "POST", 
                "/payment/payments/create-checkout-session/", 
                {
                    subscription_id: subscriptionId,
                    token : localStorage.getItem("authToken")
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`
                    }
                }
            );

            console.log("Checkout Session Response:", response); // Debug log

            if (response.data) {
                // Redirect to Stripe checkout
                // window.location.href = response.data.checkout_url;
                window.open(response.data.checkout_url, "_blank");
            } else {
                console.error("Invalid checkout response:", response);
                alert("Failed to create checkout session. Please try again.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Error processing payment. Please try again.");
        } finally {
            setProcessing(null);
        }
    };

    // Map API data to your pricing plan structure
    const getPricingPlans = () => {
        if (!subscriptions || subscriptions.length === 0) {
            // Return empty array if no data from API - don't show any plans
            return [];
        }

        // Map API data to your existing structure
        return subscriptions.slice(0, 4).map((subscription, index) => {
            const planNames = ["Basic", "Silver", "Gold", "Annual Plan"];

            // Use actual features from API
            const apiFeatures = subscription.features || [];
            const features = apiFeatures.map(feature => ({
                text: feature.description,
                available: true // All features from API are available
            }));

            return {
                id: subscription.id, // Include subscription ID for checkout
                name: planNames[index] || subscription.title,
                duration: subscription.billing_cycle === "monthly" ? "month" : "year",
                des: subscription.Description || "Premium protection plan",
                price: `$${subscription.price}`,
                features: features
            };
        });
    };

    const pricingPlans = getPricingPlans();

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
            y: 60,
            scale: 0.9,
            rotateY: -15
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateY: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        },
        hover: {
            y: -10,
            scale: 1.02,
            rotateY: 5,
            boxShadow: "0 20px 40px rgba(0, 126, 214, 0.3)",
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        tap: {
            scale: 0.98,
            y: -2,
            transition: {
                duration: 0.2
            }
        }
    };

    const featureVariants = {
        hidden: {
            opacity: 0,
            x: -30,
            scale: 0.8
        },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                delay: i * 0.1 + 0.5,
                duration: 0.5,
                ease: "backOut"
            }
        })
    };

    const buttonVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: 1,
                duration: 0.6,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.05,
            backgroundColor: "#0068b3",
            boxShadow: "0 10px 25px rgba(0, 126, 214, 0.4)",
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        tap: {
            scale: 0.95,
            transition: {
                duration: 0.1
            }
        }
    };

    const priceVariants = {
        hidden: {
            opacity: 0,
            scale: 0.5
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delay: 0.3,
                duration: 0.5,
                ease: "backOut"
            }
        }
    };

    if (loading) {
        return (
            <section
                ref={ref}
                className="bg-custom section-gap md:section-gap-sm text-white"
            >
                <div className='w-full mx-auto px-4 sm:px-6 lg:px-0'>
                    <div className='mb-10 md:mb-14 text-center'>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-3">
                            Transparent <span className='text-[#007ED6]'>Pricing</span> Plans
                        </h3>
                        <p className='text-sm sm:text-base text-gray-300'>
                            Choose a plan that fits your privacy needs, no hidden fees
                        </p>
                    </div>
                    <div className="flex justify-center items-center">
                        <p>Loading pricing plans...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            ref={ref}
            className="bg-custom section-gap md:section-gap-sm text-white"
        >
            <div className='w-full mx-auto px-4 sm:px-6 lg:px-0'>
                {/* Fixed: Remove motion from header to ensure it always shows */}
                <div className='mb-10 md:mb-14 text-center'>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-3">
                        Transparent <span className='text-[#007ED6]'>Pricing</span> Plans
                    </h3>
                    <p className='text-sm sm:text-base text-gray-300'>
                        Choose a plan that fits your privacy needs, no hidden fees
                    </p>
                </div>

                {pricingPlans.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-300">No pricing plans available at the moment.</p>
                    </div>
                ) : (
                    <motion.div
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 text-white"
                    >
                        {pricingPlans.map((plan, index) => (
                            <motion.div
                                key={plan.name + index}
                                variants={cardVariants}
                                whileHover="hover"
                                whileTap="tap"
                                custom={index}
                                className="border border-[#007ED6] p-6 sm:p-8 rounded-xl cursor-pointer bg-[#092B41] relative overflow-hidden"
                            >
                                {/* Animated background effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-[#007ED6] to-transparent opacity-0"
                                    whileHover={{ opacity: 0.1 }}
                                    transition={{ duration: 0.3 }}
                                />

                                {/* Title */}
                                <div className='flex gap-2 items-baseline mb-3 flex-wrap relative z-10'>
                                    <h4
                                        className={`font-semibold text-xl sm:text-2xl ${plan.name === "Silver" || plan.name === "Gold" || plan.name === "Annual Plan"
                                            ? "text-[#007ED6]"
                                            : "text-white"
                                            }`}
                                    >
                                        {plan.name}
                                    </h4>
                                    <h4 className={`font-semibold text-xl sm:text-2xl ${plan.name === "Annual Plan" ? 'text-[#007ED6]' : 'text-white'}`}>
                                        Protection
                                    </h4>
                                </div>

                                {/* Description */}
                                <p className="text-xs sm:text-sm mb-4 sm:mb-6 text-gray-300 relative z-10">
                                    {plan.des}
                                </p>

                                {/* Price */}
                                <motion.p
                                    variants={priceVariants}
                                    initial="hidden"
                                    animate={isInView ? "visible" : "hidden"}
                                    className="text-sm font-bold mb-4 sm:mb-6 relative z-10"
                                >
                                    <span className="text-2xl sm:text-3xl text-[#007ED6]">{plan.price}</span> /{plan.duration}
                                </motion.p>

                                {/* Features */}
                                <ul className="text-left mb-6 sm:mb-8 space-y-3 sm:space-y-4 relative z-10 min-h-52">
                                    {plan.features.map((feature, i) => (
                                        <motion.li
                                            key={i}
                                            custom={i}
                                            variants={featureVariants}
                                            initial="hidden"
                                            animate={isInView ? "visible" : "hidden"}
                                            className="flex items-center gap-3 text-xs sm:text-sm text-white"
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.2 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <CircleCheck size={14} className="text-[#007ED6] flex-shrink-0" />
                                            </motion.div>
                                            <span>{feature.text}</span>
                                        </motion.li>
                                    ))}
                                </ul>

                                {/* Button */}
                                <motion.button
                                    variants={buttonVariants}
                                    initial="hidden"
                                    animate={isInView ? "visible" : "hidden"}
                                    whileHover="hover"
                                    whileTap="tap"
                                    onClick={() => handleBuyNow(plan.id, plan.name)}
                                    disabled={processing === plan.name}
                                    className={`w-full px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-xs sm:text-sm relative z-10 transition-all duration-300 ${
                                        processing === plan.name 
                                            ? 'bg-gray-600 cursor-not-allowed' 
                                            : 'bg-[#007ED6] hover:bg-[#0068b3]'
                                    }`}
                                >
                                    {processing === plan.name ? 'Processing...' : 'BUY NOW'}
                                </motion.button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    )
}