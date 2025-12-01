"use client";

import logo from '@/../public/images/logo.png'
import { Facebook, Linkedin } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <footer ref={ref} className="bg-[#0A3740] text-white py-12">
      <div className="px-4 sm:px-6 lg:px-[140px] pt-12 md:pt-[80px]">
        {/* Top Section */}
        <motion.div 
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8"
        >
          {/* Logo + Description */}
          <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={logo}
                alt="AJAXX Logo"
                // className="w-12 h-12"
              />
              {/* <h2 className="text-xl font-bold">AJAXX<br />DATA SCRUBBER</h2> */}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              AJAXX Data Scrubber helps you find and remove your personal
              information from data brokers.
            </p>
          </motion.div>

          {/* Home */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-4">Home</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Overview</a></li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Pollicy</Link></li>
              {/* <li><a href="#" className="hover:text-white transition-colors">Login</a></li> */}
            </ul>
          </motion.div>

          {/* Pricing */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-4">Pricing</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Basic</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Silver</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gold</a></li>
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-4">Social</h3>
            <div className="flex items-center gap-4">
              <motion.a
                whileHover={{ scale: 1.1, backgroundColor: "#007ED6" }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-[#007ED6] rounded-full hover:bg-[#007ED6] transition-colors"
              >
                <Facebook size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, backgroundColor: "#007ED6" }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-[#007ED6] rounded-full hover:bg-[#007ED6] transition-colors"
              >
                <Linkedin size={18} />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-gray-300"
        >
          <p>© 2025. AJAXX DATA SCRUBBER. ALL RIGHTS RESERVED.</p>
          <a href="#" className="underline hover:text-white transition-colors">
            Terms & Conditions
          </a>
        </motion.div>
      </div>
    </footer>
  );
}