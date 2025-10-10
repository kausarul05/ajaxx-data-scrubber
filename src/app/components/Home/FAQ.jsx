"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

// ✅ Step 1: FAQ data (you can move this to a separate file if needed)
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
    return (
        <section className="bg-custom section-gap text-white">
            <h2 className="text-3xl font-bold text-center mb-10">
                Frequently Asked Questions
            </h2>

            <Accordion.Root type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                    <Accordion.Item
                        key={index}
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
                ))}
            </Accordion.Root>
        </section>
    );
}
