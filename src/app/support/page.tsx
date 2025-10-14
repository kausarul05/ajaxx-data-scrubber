"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Mail, User, Database, FileText, Search, ShieldCheck, X } from "lucide-react";
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <section className="bg-custom">
      <div className="h-[572px]">
        <Image
          src={supportBannar}
          alt="Support"
          className="w-full h-full object-fill"
        />
      </div>

      <div className="pt-[60px]">
        <motion.section
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="bg-custom text-center lg:section-gap md:section-gap section-gap"
        >
          <div className=''>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className=" border border-[#007ED6] p-6 rounded-xl cursor-pointer"
              >
                <FileText className='mx-auto mb-4.5 text-[#007ED6] w-10 h-10 sm:w-12 sm:h-12' />
                <h4 className="font-semibold mb-2 text-base sm:text-lg">How it works</h4>
                <p className="text-sm sm:text-base">How "AJAXX DATA SCRUBBER works.</p>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className=" border border-[#007ED6] p-6 rounded-xl cursor-pointer"
              >
                <Search className='mx-auto mb-4.5 text-[#007ED6] w-10 h-10 sm:w-12 sm:h-12' />
                <h4 className="font-semibold mb-2 text-base sm:text-lg">My account</h4>
                <p className="text-sm sm:text-base">How to make changes to your AJAXX account.</p>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className=" border border-[#007ED6] p-6 rounded-xl cursor-pointer"
              >
                <ShieldCheck className='mx-auto mb-4.5 text-[#007ED6] w-10 h-10 sm:w-12 sm:h-12' />
                <h4 className="font-semibold mb-2 text-base sm:text-lg">Subscriptions</h4>
                <p className="text-sm sm:text-base">Learn more about managing payments and your subscription.</p>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>

      <div className="lg:section-gap md:section-gap section-gap">
        <div className="flex justify-between items-center border border-[#007ED6] rounded-xl p-7 bg-[#092B41]">
          <h2 className="text-2xl font-semibold">Can't find what you need?</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#007ED6] py-4 px-6.5 rounded-lg font-bold drop-shadow-2xl drop-shadow-[#007ACF14] cursor-pointer"
          >
            Contact us
          </button>
        </div>
      </div>

      {/* Contact Us Modal */}
      {isModalOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          className="fixed inset-0 bg-transparent backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            variants={modalVariants}
            className="bg-[#0A2A3D] border border-[#007ED6] rounded-xl max-w-5xl  py-[72px] px-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold"></h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={32} />
              </button>
            </div>

            <form className="space-y-4">
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-2">Your email address</label>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="w-full bg-[#0D314B] border border-[#007ED6] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007ED6]"
                />
                <small className="text-[#B0B0B0] font-medium">Make sure to double-check your emall before subrotting the form</small>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold mb-2">Address</label>
                <input
                  type="text"
                  placeholder="Enter your Email"
                  className="w-full bg-[#0D314B] border border-[#007ED6] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007ED6]"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  placeholder="Enter your phone online."
                  rows={3}
                  className="w-full bg-[#0D314B] border border-[#007ED6] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007ED6]"
                />
                <small className="text-[#B0B0B0] font-medium">Please enter the details of your request. A member of our support start will respond as soon as possible</small>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-[#007ED6] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#0066B3] transition-colors"
                >
                  Submit
                </button>
                {/* <button
                  type="button"
                  className="flex-1 bg-[#007ED6] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#0066B3] transition-colors"
                >
                  Submit to get home
                </button> */}
              </div>

              {/* <div className="text-center text-sm text-gray-400 mt-4">
                <p>Send an email to contact us at</p>
                <p>yourwebsite.com</p>
              </div> */}
            </form>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}