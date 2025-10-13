"use client";

import { CircleCheck, CircleX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const pricingPlans = [
    {
        name: "Basic",
        des: "All features included to keep your personal data safe.",
        price: "$10",
        features: [
            { text: "Identities: up to 10", available: true },
            { text: "Scans / month: 10", available: true },
            { text: "Automated Data Removal", available: false },
            { text: "PDF export: Unlimited", available: false },
            { text: "Support (24–48h)", available: true },
        ],
    },
    {
        name: "Silver",
        des: "All features included to keep your personal data safe.",
        price: "$20",
        features: [
            { text: "Identities: up to 20", available: true },
            { text: "Scans / month: 20", available: true },
            { text: "Automated Data Removal", available: true },
            { text: "PDF export: 20", available: true },
            { text: "Support (24–48h)", available: true },
        ],
    },
    {
        name: "Gold",
        des: "All features included to keep your personal data safe.",
        price: "$30",
        features: [
            { text: "Identities: Unlimited", available: true },
            { text: "Scans / month: Unlimited", available: true },
            { text: "Automated Data Removal", available: true },
            { text: "PDF export: Unlimited", available: true },
            { text: "Support (24–48h)", available: true },
        ],
    },
];

export default function Pricing() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

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

    const titleVariants = {
        hidden: { 
            opacity: 0, 
            y: 20 
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

    return (
        <motion.section 
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="bg-custom section-gap md:section-gap-sm"
        >
            <div className='w-full md:w-10/12 lg:w-8/12 mx-auto px-4 sm:px-6 lg:px-0'>
                <motion.div 
                    variants={titleVariants}
                    className='mb-10 md:mb-14 text-center'
                >
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-3">
                        Transparent <span className='text-[#007ED6]'>Pricing</span> Plans
                    </h3>
                    <p className='text-sm sm:text-base text-gray-300'>
                        Choose a plan that fits your privacy needs, no hidden fees
                    </p>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-white">
                    {pricingPlans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
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
                            <motion.div 
                                variants={titleVariants}
                                className='flex gap-2 items-baseline mb-3 flex-wrap relative z-10'
                            >
                                <h4
                                    className={`font-semibold text-xl sm:text-2xl ${plan.name === "Silver" || plan.name === "Gold"
                                        ? "text-[#007ED6]"
                                        : "text-white"
                                        }`}
                                >
                                    {plan.name}
                                </h4>
                                <h4 className={`font-semibold text-xl sm:text-2xl ${plan.name === "Gold" ? 'text-[#007ED6]' : 'text-white'}`}>
                                    Protection
                                </h4>
                            </motion.div>

                            {/* Description */}
                            <motion.p 
                                variants={titleVariants}
                                className="text-xs sm:text-sm mb-4 sm:mb-6 text-gray-300 relative z-10"
                            >
                                {plan.des}
                            </motion.p>

                            {/* Price */}
                            <motion.p 
                                variants={priceVariants}
                                className="text-sm font-bold mb-4 sm:mb-6 relative z-10"
                            >
                                <span className="text-2xl sm:text-3xl text-[#007ED6]">{plan.price}</span> /month
                            </motion.p>

                            {/* Features */}
                            <ul className="text-left mb-6 sm:mb-8 space-y-3 sm:space-y-4 relative z-10">
                                {plan.features.map((feature, i) => (
                                    <motion.li
                                        key={i}
                                        custom={i}
                                        variants={featureVariants}
                                        initial="hidden"
                                        animate={isInView ? "visible" : "hidden"}
                                        className={`flex items-center gap-3 text-xs sm:text-sm ${feature.available ? "text-white" : "text-[#B0B0B0]"
                                            }`}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {feature.available ? (
                                                <CircleCheck size={14} className="text-[#007ED6] flex-shrink-0" />
                                            ) : (
                                                <CircleX size={14} className="text-[#EB4335] flex-shrink-0" />
                                            )}
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
                                className="w-full bg-[#007ED6] px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-xs sm:text-sm relative z-10"
                            >
                                Purchase Now
                            </motion.button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    )
}