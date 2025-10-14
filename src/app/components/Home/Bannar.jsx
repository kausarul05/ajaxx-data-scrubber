"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import banner from "@/../public/images/bannar.png.jpg";


export default function Banner() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className='pt-[60px] bg-custom'>
            <motion.section
                ref={ref}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
                className="flex flex-col gap-12 md:gap-24 lg:gap-34 md:flex-row items-center justify-between  lg:section-gap md:section-gap section-gap z-10 overflow-hidden"
            >
                {/* Text Content */}
                <div className="md:w-1/2 space-y-6">
                    <motion.h2
                        variants={itemVariants}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] xl:text-[72px] font-semibold text-white md:leading-20"
                    >
                        Take back control of your personal data
                    </motion.h2>

                    <motion.div variants={itemVariants}>
                        <motion.p
                            variants={itemVariants}
                            className="text-white text-base md:text-lg lg:text-xl w-full md:w-10/12 lg:w-9/12 mt-4 mb-8"
                        >
                            AJAXX data scrubber makes it quick, easy and safe to remove your sensitive personal data online.
                        </motion.p>

                        <motion.button
                            variants={itemVariants}
                            whileHover={{
                                scale: 1.05,
                                backgroundColor: "#0066b3"
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#007ED6] px-8 py-4 rounded-lg text-white font-medium cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Start Sign Up
                        </motion.button>
                    </motion.div>
                </div>

                {/* Image */}
                <motion.div
                    variants={imageVariants}
                    className="md:w-1/2 lg:mt-10 md:mt-0 w-full "
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Image
                            src={banner}
                            alt="Data security protection illustration"
                            width={600}
                            height={400}
                            className="w-full h-auto object-cover rounded-2xl"
                            priority
                            placeholder="blur"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                        />
                    </motion.div>
                </motion.div>
            </motion.section>
        </div>
    );
}