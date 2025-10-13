"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const faqs = [
    {
        question: "What is included in the Basic Protection plan?",
        answer:
            "The Basic Protection plan includes limited scans and data removal options.",
    },
    {
        question: "Can I upgrade my plan anytime?",
        answer:
            "Yes, you can upgrade or downgrade your plan anytime without losing your data.",
    },
    {
        question: "Is there any refund policy?",
        answer:
            "Yes, we offer a full refund within the first 7 days of purchase if you're not satisfied.",
    },
    {
        question: "Do you provide customer support?",
        answer:
            "Yes, we provide 24/7 customer support through email and live chat.",
    },
    {
        question: "What is included in the Basic Protection plan?",
        answer:
            "The Basic Protection plan includes limited scans and data removal options.",
    },
    {
        question: "Can I upgrade my plan anytime?",
        answer:
            "Yes, you can upgrade or downgrade your plan anytime without losing your data.",
    },
    {
        question: "Is there any refund policy?",
        answer:
            "Yes, we offer a full refund within the first 7 days of purchase if you're not satisfied.",
    },
    {
        question: "Do you provide customer support?",
        answer:
            "Yes, we provide 24/7 customer support through email and live chat.",
    },
];

export default function FAQSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <section ref={ref} className="bg-custom lg:section-gap md:section-gap section-gap text-white">
            <div className="w-full px-4 sm:px-6 lg:px-0">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-[#007ED6] text-[40px] font-semibold mb-4">FAQs</h1>
                    <h2 className="text-3xl font-semibold mb-2">
                        Frequently Asked Questions
                    </h2>
                    <p>We've compiled the most common questions to help you get started.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Accordion.Root type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                            >
                                <Accordion.Item
                                    value={`faq-${index}`}
                                    className="bg-[#092B41] rounded-lg overflow-hidden"
                                >
                                    <Accordion.Header>
                                        <Accordion.Trigger className="w-full flex justify-between items-center px-5 py-4 font-semibold text-left bg-transparent text-white hover:bg-[#007ED6]/10 transition group">
                                            {faq.question}
                                            <ChevronDown className="transition-transform duration-300 group-data-[state=open]:rotate-180" />
                                        </Accordion.Trigger>
                                    </Accordion.Header>
                                    <Accordion.Content className="px-5 py-4 text-gray-300 border-t border-[#007ED6]">
                                        {faq.answer}
                                    </Accordion.Content>
                                </Accordion.Item>
                            </motion.div>
                        ))}
                    </Accordion.Root>
                </motion.div>
            </div>
        </section>
    );
}