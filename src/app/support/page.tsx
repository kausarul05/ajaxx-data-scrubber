"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { FileText, Search, ShieldCheck, X } from "lucide-react";
import supportBannar from "@/../public/images/support.png"

export default function Support() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // const itemVariants = {
  //   hidden: { opacity: 0, y: 30 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 0.6,
  //       ease: "easeOut"
  //     }
  //   }
  // };

  // const cardVariants = {
  //   hidden: { opacity: 0, y: 40, scale: 0.95 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     scale: 1,
  //     transition: {
  //       duration: 0.7,
  //       ease: "easeOut"
  //     }
  //   },
  //   hover: {
  //     scale: 1.05,
  //     transition: {
  //       duration: 0.3,
  //       ease: "easeInOut"
  //     }
  //   }
  // };

  // const modalVariants = {
  //   hidden: { opacity: 0, scale: 0.8 },
  //   visible: { 
  //     opacity: 1, 
  //     scale: 1,
  //     transition: {
  //       duration: 0.3,
  //       ease: [0.42, 0, 0.58, 1] // cubic-bezier for easeOut
  //     }
  //   },
  //   exit: {
  //     opacity: 0,
  //     scale: 0.8,
  //     transition: {
  //       duration: 0.2,
  //       ease: [0.42, 0, 1, 1] // cubic-bezier for easeIn
  //     }
  //   }
  // };

  // const overlayVariants = {
  //   hidden: { opacity: 0 },
  //   visible: { 
  //     opacity: 1,
  //     transition: {
  //       duration: 0.3,
  //       ease: "easeOut"
  //     }
  //   },
  //   exit: {
  //     opacity: 0,
  //     transition: {
  //       duration: 0.2,
  //       ease: "easeIn"
  //     }
  //   }
  // };

  return (
    <section className="bg-custom text-white">
      {/* Banner Image - Responsive */}
      <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[572px]">
        <Image
          src={supportBannar}
          alt="Support"
          className="w-full h-full object-fill"
          priority
        />
      </div>

      {/* Cards Section - Responsive */}
      <div className="pt-[40px] md:pt-[50px] lg:pt-[60px]">
        <motion.section
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="bg-custom text-center lg:section-gap md:section-gap section-gap px-4 sm:px-6 lg:px-8"
        >
          <div className=''>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 max-w-7xl mx-auto">
              <motion.div
                // variants={cardVariants}
                whileHover="hover"
                className="border border-[#007ED6] p-4 sm:p-5 md:p-6 rounded-xl cursor-pointer"
              >
                <FileText className='mx-auto mb-3 sm:mb-4 md:mb-4.5 text-[#007ED6] w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12' />
                <h4 className="font-semibold mb-2 text-sm sm:text-base md:text-lg">How it works</h4>
                <p className="text-xs sm:text-sm md:text-base">How AJAXX DATA SCRUBBER works.</p>
              </motion.div>

              <motion.div
                // variants={cardVariants}
                whileHover="hover"
                className="border border-[#007ED6] p-4 sm:p-5 md:p-6 rounded-xl cursor-pointer"
              >
                <Search className='mx-auto mb-3 sm:mb-4 md:mb-4.5 text-[#007ED6] w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12' />
                <h4 className="font-semibold mb-2 text-sm sm:text-base md:text-lg">My account</h4>
                <p className="text-xs sm:text-sm md:text-base">How to make changes to your AJAXX account.</p>
              </motion.div>

              <motion.div
                // variants={cardVariants}
                whileHover="hover"
                className="border border-[#007ED6] p-4 sm:p-5 md:p-6 rounded-xl cursor-pointer"
              >
                <ShieldCheck className='mx-auto mb-3 sm:mb-4 md:mb-4.5 text-[#007ED6] w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12' />
                <h4 className="font-semibold mb-2 text-sm sm:text-base md:text-lg">Subscriptions</h4>
                <p className="text-xs sm:text-sm md:text-base">Learn more about managing payments and your subscription.</p>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Contact Section - Responsive */}
      <div className="lg:section-gap md:section-gap section-gap px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 border border-[#007ED6] rounded-xl p-4 sm:p-5 md:p-6 lg:p-7 bg-[#092B41] max-w-7xl mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center sm:text-left">Can not find what you need?</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#007ED6] py-3 px-5 sm:py-3 sm:px-5 md:py-4 md:px-6.5 rounded-lg font-bold drop-shadow-2xl drop-shadow-[#007ACF14] cursor-pointer w-full sm:w-auto text-sm sm:text-base"
          >
            Contact us
          </button>
        </div>
      </div>

      {/* Contact Us Modal - Responsive */}
      {isModalOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          // variants={overlayVariants}
          className="fixed inset-0 bg-transparent backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 drop-shadow-xl drop-shadow-[#0ABF9D66]"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            // variants={modalVariants}
            className="bg-[#0A2A3D] border border-[#007ED6] rounded-xl w-full max-w-[90vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl py-6 sm:py-8 md:py-12 lg:py-[72px] px-4 sm:px-6 md:px-8 lg:px-12 mx-2 sm:mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
              <h3 className="text-xl font-bold"></h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={24} className="sm:w-6 sm:h-6 md:w-8 md:h-8" />
              </button>
            </div>

            <form className="space-y-4">
              <div className="mb-4 sm:mb-5">
                <label className="block text-sm font-semibold mb-2">Your email address</label>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="w-full bg-[#0D314B] border border-[#007ED6] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007ED6] text-sm sm:text-base"
                />
                <small className="text-[#B0B0B0] font-medium text-xs sm:text-sm">Make sure to double-check your email before submitting the form</small>
              </div>

              <div className="mb-4 sm:mb-5">
                <label className="block text-sm font-semibold mb-2">Address</label>
                <input
                  type="text"
                  placeholder="Enter your Email"
                  className="w-full bg-[#0D314B] border border-[#007ED6] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007ED6] text-sm sm:text-base"
                />
              </div>

              <div className="mb-4 sm:mb-5">
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  placeholder="Enter your phone online."
                  rows={3}
                  className="w-full bg-[#0D314B] border border-[#007ED6] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007ED6] text-sm sm:text-base resize-none"
                />
                <small className="text-[#B0B0B0] font-medium text-xs sm:text-sm">Please enter the details of your request. A member of our support staff will respond as soon as possible</small>
              </div>

              <div className="flex gap-3 mt-6 sm:mt-7 md:mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-[#007ED6] text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold hover:bg-[#0066B3] transition-colors text-sm sm:text-base"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}