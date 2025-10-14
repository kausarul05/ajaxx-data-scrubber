"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { Mail, User, Database, FileText, Search, ShieldCheck } from "lucide-react";
import supportBannar from "@/../public/images/support.png"

export default function Support() {
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
            {/* <motion.h3
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 md:mb-14"
            >
              How Data Guardian Works
            </motion.h3> */}
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
        <div className="flex justify-between border border-[#007ED6] rounded-xl p-7">
          <h2>Can't find what you need?</h2>
          <button>Contact us</button>
        </div>
      </div>

    </section>
  );
}
