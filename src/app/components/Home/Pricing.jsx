import { CircleCheck, CircleX } from 'lucide-react';
import React from 'react'

const pricingPlans = [
    {
        name: "Basic",
        des: "All features included to keep your personal data safe.",
        price: "$10",
        features: [
            { text: "Identities: up to 10", available: true },
            { text: "Scans / month: 10", available: true },
            { text: "Automated Data Removal", available: false },
            { text: "PDF export: Unlimited", available: false },
            { text: "Support (24–48h)", available: true },
        ],
    },
    {
        name: "Silver",
        des: "All features included to keep your personal data safe.",
        price: "$20",
        features: [
            { text: "Identities: up to 20", available: true },
            { text: "Scans / month: 20", available: true },
            { text: "Automated Data Removal", available: true },
            { text: "PDF export: 20", available: true },
            { text: "Support (24–48h)", available: true },
        ],
    },
    {
        name: "Gold",
        des: "All features included to keep your personal data safe.",
        price: "$30",
        features: [
            { text: "Identities: Unlimited", available: true },
            { text: "Scans / month: Unlimited", available: true },
            { text: "Automated Data Removal", available: true },
            { text: "PDF export: Unlimited", available: true },
            { text: "Support (24–48h)", available: true },
        ],
    },
];


export default function Pricing() {
    return (
        <section className="bg-custom section-gap md:section-gap-sm">
            <div className='w-8/12 mx-auto'>
                <div className='mb-14 text-center'>
                    <h3 className="text-5xl font-semibold mb-3">Transparent <span className='text-[#007ED6]'>Pricing</span> Plans</h3>
                    <p className='text-base'>Choose a plan that fits your privacy needs, no hidden fees</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-white">
                    {pricingPlans.map((plan) => (
                        <div
                            key={plan.name}
                            className="border border-[#007ED6] p-8 rounded-xl hover:scale-105 transition-transform cursor-pointer"
                        >
                            {/* Title */}
                            <div className='flex gap-2 items-baseline mb-3'>
                                <h4
                                    className={`font-semibold mb-3 text-2xl ${plan.name === "Silver"
                                        ? "text-[#007ED6]"
                                        : plan.name === "Gold"
                                            ? "text-[#007ED6]"
                                            : "text-white"
                                        }`}
                                >
                                    {plan.name}
                                </h4>
                                <h4 className={`font-semibold mb-3 text-2xl ${plan.name === "Gold" ? 'text-[#007ED6]' : ''}`}>Protection</h4>
                            </div>

                            {/* Description */}
                            <p className="text-sm mb-6 text-gray-300">{plan.des}</p>

                            {/* Price */}
                            <p className="text-sm font-bold mb-6">
                                <span className="text-3xl text-[#007ED6]">{plan.price}</span> /month
                            </p>

                            {/* Features */}
                            <ul className="text-left mb-8">
                                {plan.features.map((feature, i) => (
                                    <li
                                        key={i}
                                        className={`flex items-center mb-4 gap-3 text-sm ${feature.available ? "text-white" : "text-[#B0B0B0]"
                                            }`}
                                    >
                                        {feature.available ? (
                                            <CircleCheck size={16} className="text-[#007ED6]" />
                                        ) : (
                                            <CircleX size={16} className="text-[#EB4335]" />
                                        )}
                                        {feature.text}
                                    </li>
                                ))}
                            </ul>

                            {/* Button */}
                            <button className="w-full bg-[#007ED6] px-6 py-3 rounded-lg hover:bg-[#0068b3] font-bold text-sm">
                                Purchase Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
