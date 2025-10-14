"use client";

import { FileText, Search, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function HowWork() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.7,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.section 
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="bg-custom text-center section-gap"
        >
            <div className='w-full md:w-10/12 lg:w-8/12 mx-auto px-4 sm:px-6 lg:px-0 text-white'>
                <motion.h3 
                    variants={itemVariants}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 md:mb-14"
                >
                    How Data Guardian Works
                </motion.h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
                    <motion.div 
                        variants={cardVariants}
                        whileHover="hover"
                        className="bg-[#092B41] border border-[#007ED6] p-6 rounded-xl cursor-pointer"
                    >
                        <FileText className='mx-auto mb-4.5 text-[#007ED6] w-10 h-10 sm:w-12 sm:h-12'/>
                        <h4 className="font-semibold mb-2 text-base sm:text-lg">Input Your Info</h4>
                        <p className="text-sm sm:text-base">Enter your email, and more</p>
                    </motion.div>
                    
                    <motion.div 
                        variants={cardVariants}
                        whileHover="hover"
                        className="bg-[#092B41] border border-[#007ED6] p-6 rounded-xl cursor-pointer"
                    >
                        <Search className='mx-auto mb-4.5 text-[#007ED6] w-10 h-10 sm:w-12 sm:h-12'/>
                        <h4 className="font-semibold mb-2 text-base sm:text-lg">Scan the Web</h4>
                        <p className="text-sm sm:text-base">Our advanced engine helps locate where your personal info is being used online</p>
                    </motion.div>
                    
                    <motion.div 
                        variants={cardVariants}
                        whileHover="hover"
                        className="bg-[#092B41] border border-[#007ED6] p-6 rounded-xl cursor-pointer"
                    >
                        <ShieldCheck className='mx-auto mb-4.5 text-[#007ED6] w-10 h-10 sm:w-12 sm:h-12'/>
                        <h4 className="font-semibold mb-2 text-base sm:text-lg">Remove Your Data</h4>
                        <p className="text-sm sm:text-base">Request automatic removal</p>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    )
}