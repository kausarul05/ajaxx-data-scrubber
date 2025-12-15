"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { apiRequest } from "@/app/lib/api";
import { toast } from "react-toastify";

// Type for FAQ item
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch FAQs from API
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Remove the pageSize parameter since this is the public FAQ section
        const response = await apiRequest<{
          count?: number;
          next?: string | null;
          previous?: string | null;
          results?: FAQItem[];
        }>(
          "GET",
          `/service/faq/`,
          // null,
          // {
          //   headers: {
          //     Authorization: `Bearer ${localStorage.getItem("authToken")}`
          //   }
          // }
        );

        console.log("API Response:", response);

        // Handle the response based on its structure
        if (response && typeof response === 'object') {
          // Option 1: Direct response structure (no data wrapper)
          if ('results' in response && Array.isArray(response.results)) {
            // Filter only published FAQs for the public section
            const publishedFAQs = response.results.filter(faq => faq.is_published);
            setFaqs(publishedFAQs);
          }
          // Option 2: API response wrapped in data property
          else if ('data' in response && response.data && typeof response.data === 'object' && 'results' in response.data && Array.isArray(response.data.results)) {
            // Filter only published FAQs for the public section
            const publishedFAQs = response.data.results.filter(faq => faq.is_published);
            setFaqs(publishedFAQs);
          }
          // Option 3: If response is directly an array
          else if (Array.isArray(response)) {
            // Filter only published FAQs for the public section
            const publishedFAQs = response.filter(faq => faq.is_published);
            setFaqs(publishedFAQs);
          } else {
            console.warn("Unexpected API response structure:", response);
            setFaqs([]);
            setError("Invalid API response format");
          }
        } else {
          setFaqs([]);
          setError("Failed to load FAQs");
        }
        
      } catch (err) {
        console.error('Failed to fetch FAQs:', err);
        setError('Failed to load FAQs. Please try again later.');
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

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
          <p>We&apos;ve compiled the most common questions to help you get started.</p>
        </motion.div>

        {loading && (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-2">Loading FAQs...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-10">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {faqs.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400">No FAQs available at the moment.</p>
              </div>
            ) : (
              <Accordion.Root type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                  >
                    <Accordion.Item
                      value={`faq-${faq.id}`}
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
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}