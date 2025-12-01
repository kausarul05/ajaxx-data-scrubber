"use client";

import { CircleCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { apiRequest } from '@/app/lib/api';
import Link from "next/link";
import { easeInOut, easeOut, backOut } from "framer-motion";

interface Product {
    id: number;
    title: string;
    description: string;
    old_price: string;
    new_price: string;
    billing_cycle: string;
    add_link: string;
    created_at: string;
    dynamic_discount_percentage: number;
}

interface ApiResponse<T = unknown> {
    results?: T[];
    data?: {
        data?: T[];
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const ref = useRef(null);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const response = await apiRequest<ApiResponse<Product[]>>(
                    "GET",
                    "/product/api/Product-all/",
                    null,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`
                        }
                    }
                );

                let productsData: Product[] = [];

                // Type guard to check if response is an object
                if (response && typeof response === 'object') {
                    const apiResponse = response as ApiResponse<Product[]>;

                    // Check different possible response structures
                    if (Array.isArray(apiResponse)) {
                        // If the response is directly an array
                        productsData = apiResponse;
                    } else if (Array.isArray(apiResponse.results)) {
                        // If response has 'results' array
                        // Flatten if it's an array of arrays
                        productsData = Array.isArray(apiResponse.results[0])
                            ? (apiResponse.results as Product[][]).flat()
                            : (apiResponse.results as unknown[]).flat() as Product[];
                    } else if (apiResponse.data && Array.isArray(apiResponse.data)) {
                        // If response has 'data' as array
                        productsData = apiResponse.data;
                    } else if (apiResponse.data && apiResponse.data.data && Array.isArray(apiResponse.data.data)) {
                        // If response has nested 'data.data' as array
                        productsData = (apiResponse.data.data as Product[][]).flat();
                    } else if (apiResponse.data && typeof apiResponse.data === 'object' && 'data' in apiResponse.data) {
                        // Additional check for nested data structure
                        const nestedData = (apiResponse.data as Record<string, unknown>).data;
                        if (Array.isArray(nestedData)) {
                            productsData = nestedData;
                        }
                    }
                }

                setProducts(productsData);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Map API data to your pricing plan structure
    const getPricingPlans = () => {
        if (!products || products.length === 0) {
            return [];
        }

        return products.slice(0, 4).map((product) => {
            // Calculate discount amount
            const oldPrice = parseFloat(product.old_price) || 0;
            const newPrice = parseFloat(product.new_price) || 0;
            const discountAmount = oldPrice - newPrice;

            // Format prices with US$ prefix
            const formattedOldPrice = `US$ ${product.old_price}`;
            const formattedNewPrice = `US$ ${product.new_price}`;
            const formattedDiscount = `US$ ${Math.abs(discountAmount).toFixed(0)} OFF*`;

            // Split description into features (using new lines)
            const features = product.description ?
                product.description.split('\n').filter(feature => feature.trim() !== '') :
                ["Premium protection features", "Secure data monitoring"];

            return {
                id: product.id,
                name: product.title || "Unnamed Product",
                oldPrice: formattedOldPrice,
                discount: formattedDiscount,
                price: formattedNewPrice,
                duration: product.billing_cycle === "monthly" ? "month" : "year",
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
                delayChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 60, scale: 0.9, rotateY: -15 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateY: 0,
            transition: { duration: 0.8, ease: easeInOut },
        },
        hover: {
            y: -10,
            scale: 1.02,
            rotateY: 5,
            boxShadow: "0 20px 40px rgba(0, 126, 214, 0.3)",
            transition: { duration: 0.4, ease: easeOut },
        },
        tap: { scale: 0.98, y: -2, transition: { duration: 0.2 } },
    };

    const featureVariants = {
        hidden: { opacity: 0, x: -30, scale: 0.8 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                delay: i * 0.1 + 0.5,
                duration: 0.5,
                ease: backOut,
            },
        }),
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.8 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { delay: 1, duration: 0.6, ease: easeOut },
        },
        hover: {
            scale: 1.05,
            backgroundColor: "#0068b3",
            boxShadow: "0 10px 25px rgba(0, 126, 214, 0.4)",
            transition: { duration: 0.3, ease: easeInOut },
        },
        tap: { scale: 0.95, transition: { duration: 0.1 } },
    };

    const titleVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
    };

    const priceVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { delay: 0.3, duration: 0.5, ease: backOut },
        },
    };

    if (loading) {
        return (
            <div className="pt-[100px] bg-[#0A2131] text-white pb-20">
                <section className="bg-custom section-gap md:section-gap-sm text-white">
                    <div className="text-center mb-14">
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-3">
                            Our Featured <span className="text-[#007ED6]">Products</span>
                        </h3>
                        <p className="text-gray-300 text-sm sm:text-base">
                            Explore our latest and most popular products — carefully selected
                            for quality and value.
                        </p>
                    </div>
                    <div className="flex justify-center items-center">
                        <p>Loading products...</p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="pt-[100px] bg-[#0A2131] text-white pb-20">
            <motion.section
                ref={ref}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="bg-custom section-gap md:section-gap-sm text-white"
            >
                {/* Header */}
                <motion.div variants={titleVariants} className="text-center mb-14">
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-3">
                        Our Featured <span className="text-[#007ED6]">Products</span>
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base">
                        Explore our latest and most popular products — carefully selected
                        for quality and value.
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {pricingPlans.length === 0 ? (
                        <div className="col-span-4 text-center py-12">
                            <p className="text-gray-300">No products available at the moment.</p>
                        </div>
                    ) : (
                        pricingPlans.map((plan, index) => (
                            <motion.div
                                key={plan.id || index}
                                variants={cardVariants}
                                whileHover="hover"
                                whileTap="tap"
                                className="border border-[#007ED6] rounded-xl p-8 text-center cursor-pointer relative overflow-hidden flex flex-col justify-between bg-[#092B41]"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-[#007ED6] to-transparent opacity-0"
                                    whileHover={{ opacity: 0.1 }}
                                    transition={{ duration: 0.3 }}
                                />

                                {/* Title */}
                                <motion.div
                                    variants={titleVariants}
                                    className="relative z-10 mb-4"
                                >
                                    <h4 className="text-xl font-semibold text-white">
                                        {plan.name}
                                        <span className="text-[#007ED6]"> Plus</span>
                                    </h4>
                                </motion.div>

                                {/* Price Info */}
                                <motion.div
                                    variants={priceVariants}
                                    className="relative z-10"
                                >
                                    <p className="text-white text-sm mb-4">
                                        <span className="line-through">{plan.oldPrice}</span>{" "}
                                        <span className="text-[#007ED6] font-medium">
                                            {plan.discount}
                                        </span>
                                    </p>
                                    <p className="text-[#007ED6] text-3xl font-bold mb-1">
                                        {plan.price}
                                        <span className="text-gray-300 text-sm font-normal">
                                            /{plan.duration}
                                        </span>
                                    </p>
                                </motion.div>

                                {/* Features */}
                                <ul className="text-left mt-5 mb-8 space-y-3 relative z-10">
                                    {plan.features.map((feature, i) => (
                                        <motion.li
                                            key={i}
                                            custom={i}
                                            variants={featureVariants}
                                            className="flex items-start text-sm text-gray-200 gap-3"
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.2 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <CircleCheck
                                                    size={16}
                                                    className="text-[#007ED6] mt-[2px] flex-shrink-0"
                                                />
                                            </motion.div>
                                            <span>{feature}</span>
                                        </motion.li>
                                    ))}
                                </ul>

                                {/* Button */}
                                <motion.button
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    className="w-full bg-[#007ED6] text-white font-semibold py-3 rounded-md relative z-10"
                                >
                                    <Link href={products[index]?.add_link || "#"} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                        BUY NOW
                                    </Link>
                                </motion.button>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.section>
        </div>
    );
}