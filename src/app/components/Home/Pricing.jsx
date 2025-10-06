import React from 'react'

const pricingPlans = [
    {
        name: "Basic Protection",
        price: "Free",
        features: [
            "Identities: up to 1",
            "Scans / month: 1",
            "Automated Data Removal",
            "PDF export (limited)",
            "Support (24-48h)",
        ],
    },
    {
        name: "Silver Protection",
        price: "$20 / month",
        features: [
            "Identities: up to 10",
            "Scans / month: 10",
            "Automated Data Removal",
            "PDF export x3",
            "Support (24-48h)",
        ],
    },
    {
        name: "Gold Protection",
        price: "$30 / month",
        features: [
            "Identities: Unlimited",
            "Scans / month: Unlimited",
            "Automated Data Removal",
            "PDF export x5",
            "Support (24-48h)",
        ],
    },
];


export default function Pricing() {
    return (
        <section className="text-center mt-20 px-6 md:px-20 z-10 relative">
            <h3 className="text-3xl font-bold mb-10">Pricing Transparent Everyone</h3>
            <div className="grid md:grid-cols-3 gap-8">
                {pricingPlans.map((plan) => (
                    <div key={plan.name} className="bg-gray-800 p-6 rounded-lg hover:scale-105 transition-transform">
                        <h4 className="font-semibold mb-4">{plan.name}</h4>
                        <p className="text-xl font-bold mb-4">{plan.price}</p>
                        <ul className="text-left mb-6">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="before:content-['•'] before:text-blue-500 before:mr-2">
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700">
                            Purchase Now
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}
