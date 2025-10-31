"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { FileText, Search, ShieldCheck, X } from "lucide-react";
import supportBannar from "@/../public/images/support.png"
import { apiRequest } from "../lib/api";
import { toast } from "react-toastify";


export default function Support() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    Subject: "",
    Description: ""
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!formData.Subject.trim()) {
      setMessage("Please enter a subject.");
      return;
    }

    if (!formData.Description.trim()) {
      setMessage("Please enter a description.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await apiRequest("POST", "/service/ContactUs/", {
        email: formData.email,
        Subject: formData.Subject,
        Description: formData.Description
      });

      toast.success("Message sent successfully!");
      setFormData({ email: "", Subject: "", Description: "" });
      
      // Close modal after successful submission
      setTimeout(() => {
        setIsModalOpen(false);
        setMessage("");
      }, 2000);
    } catch (error: any) {
      setMessage(error.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ email: "", Subject: "", Description: "" });
    setMessage("");
  };

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
                whileHover="hover"
                className="border border-[#007ED6] p-4 sm:p-5 md:p-6 rounded-xl cursor-pointer"
              >
                <FileText className='mx-auto mb-3 sm:mb-4 md:mb-4.5 text-[#007ED6] w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12' />
                <h4 className="font-semibold mb-2 text-sm sm:text-base md:text-lg">How it works</h4>
                <p className="text-xs sm:text-sm md:text-base">How AJAXX DATA SCRUBBER works.</p>
              </motion.div>

              <motion.div
                whileHover="hover"
                className="border border-[#007ED6] p-4 sm:p-5 md:p-6 rounded-xl cursor-pointer"
              >
                <Search className='mx-auto mb-3 sm:mb-4 md:mb-4.5 text-[#007ED6] w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12' />
                <h4 className="font-semibold mb-2 text-sm sm:text-base md:text-lg">My account</h4>
                <p className="text-xs sm:text-sm md:text-base">How to make changes to your AJAXX account.</p>
              </motion.div>

              <motion.div
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
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center sm:text-left">
            Can&apos;t not find what you need?
          </h2>

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
          className="fixed inset-0 bg-transparent backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 drop-shadow-xl drop-shadow-[#0ABF9D66]"
          onClick={closeModal}
        >
          <motion.div
            className="bg-[#0A2A3D] border border-[#007ED6] rounded-xl w-full max-w-[90vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl py-6 sm:py-8 md:py-12 lg:py-[72px] px-4 sm:px-6 md:px-8 lg:px-12 mx-2 sm:mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
              <h3 className="text-xl font-bold">Contact Us</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={24} className="sm:w-6 sm:h-6 md:w-8 md:h-8" />
              </button>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes("successfully") ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                {message}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="mb-4 sm:mb-5">
                <label className="block text-sm font-semibold mb-2">Your email address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#0D314B] border border-[#007ED6] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007ED6] text-sm sm:text-base"
                />
                <small className="text-[#B0B0B0] font-medium text-xs sm:text-sm">Make sure to double-check your email before submitting the form</small>
              </div>

              <div className="mb-4 sm:mb-5">
                <label className="block text-sm font-semibold mb-2">Subject</label>
                <input
                  type="text"
                  name="Subject"
                  placeholder="Enter your Subject"
                  value={formData.Subject}
                  onChange={handleInputChange}
                  className="w-full bg-[#0D314B] border border-[#007ED6] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007ED6] text-sm sm:text-base"
                />
              </div>

              <div className="mb-4 sm:mb-5">
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  name="Description"
                  placeholder="Enter your description..."
                  rows={3}
                  value={formData.Description}
                  onChange={handleInputChange}
                  className="w-full bg-[#0D314B] border border-[#007ED6] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007ED6] text-sm sm:text-base resize-none"
                />
                <small className="text-[#B0B0B0] font-medium text-xs sm:text-sm">Please enter the details of your request. A member of our support staff will respond as soon as possible</small>
              </div>

              <div className="flex gap-3 mt-6 sm:mt-7 md:mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#007ED6] text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold hover:bg-[#0066B3] disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}