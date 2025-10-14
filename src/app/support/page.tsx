"use client";

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Support() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="bg-custom text-white section-gap">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-8">Contact us</h1>
          
          {/* Checkbox Section */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="w-6 h-6 border-2 border-white rounded"></div>
            <div className="w-6 h-6 border-2 border-white rounded bg-white"></div>
            <div className="w-6 h-6 border-2 border-white rounded bg-white"></div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white mb-12"></div>
        </motion.div>

        {/* Three Columns Section */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-2xl font-semibold mb-4">How it works</h3>
            <p className="text-gray-300">How future books constantly works.</p>
          </motion.div>

          {/* My account */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h3 className="text-2xl font-semibold mb-4">My account</h3>
            <p className="text-gray-300">How to make changes to your ALMA website.</p>
          </motion.div>

          {/* Subscriptions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <h3 className="text-2xl font-semibold mb-4">Subscriptions</h3>
            <p className="text-gray-300">Learn more about managing your past subscription.</p>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          {/* Divider */}
          <div className="w-full h-px bg-white mb-12"></div>
          
          <h2 className="text-2xl font-semibold mb-6">Can't find what you need?</h2>
          <h3 className="text-3xl font-bold">Contact us</h3>
        </motion.div>
      </div>
    </section>
  );
}