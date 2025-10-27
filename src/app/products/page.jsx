"use client";

import { CircleCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const pricingPlans = [
  {
    name: "Norton AntiVirus Plus",
    oldPrice: "US$ 29.99",
    discount: "US$ 10 OFF*",
    price: "US$24.99",
    duration: "month",
    features: [
      "10 PCs, Macs, tablets, or phones",
      "Antivirus, malware, ransomware, and hacking protection",
      "100% Virus Protection Promise²",
      "100GB Cloud Backup‡,4",
      "Password Manager",
      "VPN private internet connection",
      "Dark Web Monitoring§",
      "Parental Control‡",
    ],
  },
  {
    name: "Norton AntiVirus Plus",
    oldPrice: "US$ 29.99",
    discount: "US$ 10 OFF*",
    price: "US$24.99",
    duration: "month",
    features: [
      "10 PCs, Macs, tablets, or phones",
      "Antivirus, malware, ransomware, and hacking protection",
      "100% Virus Protection Promise²",
      "100GB Cloud Backup‡,4",
      "Password Manager",
      "VPN private internet connection",
      "Dark Web Monitoring§",
      "Parental Control‡",
    ],
  },
  {
    name: "Norton AntiVirus Plus",
    oldPrice: "US$ 29.99",
    discount: "US$ 10 OFF*",
    price: "US$24.99",
    duration: "month",
    features: [
      "10 PCs, Macs, tablets, or phones",
      "Antivirus, malware, ransomware, and hacking protection",
      "100% Virus Protection Promise²",
      "100GB Cloud Backup‡,4",
      "Password Manager",
      "VPN private internet connection",
      "Dark Web Monitoring§",
      "Parental Control‡",
    ],
  },
  {
    name: "Norton AntiVirus Plus",
    oldPrice: "US$ 29.99",
    discount: "US$ 10 OFF*",
    price: "US$24.99",
    duration: "month",
    features: [
      "10 PCs, Macs, tablets, or phones",
      "Antivirus, malware, ransomware, and hacking protection",
      "100% Virus Protection Promise²",
      "100GB Cloud Backup‡,4",
      "Password Manager",
      "VPN private internet connection",
      "Dark Web Monitoring§",
      "Parental Control‡",
    ],
  },
];

export default function Products() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

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
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    hover: {
      y: -10,
      scale: 1.02,
      rotateY: 5,
      boxShadow: "0 20px 40px rgba(0, 126, 214, 0.3)",
      transition: { duration: 0.4, ease: "easeOut" },
    },
    tap: { scale: 0.98, y: -2, transition: { duration: 0.2 } },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: i * 0.1 + 0.5,
        duration: 0.5,
        ease: "backOut",
      },
    }),
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: 1, duration: 0.6, ease: "easeOut" },
    },
    hover: {
      scale: 1.05,
      backgroundColor: "#0068b3",
      boxShadow: "0 10px 25px rgba(0, 126, 214, 0.4)",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const priceVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.3, duration: 0.5, ease: "backOut" },
    },
  };

  return (
    <div className="pt-[100px] bg-[#0A2131] text-white pb-20">
      <motion.section
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
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
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className="border border-[#007ED6] rounded-xl p-8 text-center cursor-pointer relative overflow-hidden flex flex-col justify-between"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#007ED6] to-transparent opacity-0"
                whileHover={{ opacity: 0.1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Title */}
              <motion.div
                variants={titleVariants}
                className="relative z-10 mb-2"
              >
                <h4 className="text-xl font-semibold text-white">
                  {plan.name.split(" ")[0]}{" "}
                  <span className="text-[#007ED6]">Plus</span>
                </h4>
              </motion.div>

              {/* Price Info */}
              <motion.div
                variants={priceVariants}
                className="relative z-10 mb-4"
              >
                <p className="text-gray-400 text-sm mb-1">
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
              <ul className="text-left mt-6 mb-8 space-y-3 relative z-10">
                {plan.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    custom={i}
                    variants={featureVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
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
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                whileHover="hover"
                whileTap="tap"
                className="w-full bg-[#007ED6] text-white font-semibold py-3 rounded-md relative z-10"
              >
                Buy Now
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
