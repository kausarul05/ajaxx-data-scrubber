import React from 'react'

export default function page() {
    return (
        <div className="min-h-screen bg-white pt-8 lg:px-[140px] md:pt-[40px]">
            <div className="w-full mx-auto bg-white">

                {/* Header Section */}
                <div className=" text-black">
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Terms and Conditions</h1>
                    {/* <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm md:text-base">
                        <div>
                            <p className="font-semibold">Effective Date</p>
                            <p className="text-gray-300">10/20/2025</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <p className="font-semibold">Company Name</p>
                            <p className="text-gray-300">Fortress Apps LLC</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <p className="font-semibold">Website</p>
                            <p className="text-gray-300">https://www.ajaxxdatascrubber.com</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <p className="font-semibold">Contact</p>
                            <p className="text-gray-300">support@ajaxxdatascrub.com</p>
                        </div>
                    </div> */}
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8">

                    {/* Page 1 */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-blue-500">1. Acceptance of Terms</h2>
                            {/* <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">Page 1</span> */}
                        </div>

                        <div className="space-y-6">
                            <p className="text-gray-700 leading-relaxed">
                                By accessing or using ajaxxdatascrubber.com, you agree to be bound by these Terms and
                                Conditions ("Terms") and our Privacy Policy. If you do not agree, please do not use our
                                services.
                            </p>
                        </div>

                        <h2 className="text-xl font-semibold text-blue-500 mt-10 mb-4">2. About Us</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Fortress Apps LLC is a registered limited liability company based in Illinois, offering
                            personal data removal services from third-party data broker websites and databases.
                        </p>

                        <h2 className="text-xl font-semibold text-blue-500 mt-10 mb-4">3. Services Provided</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We help individuals identify and submit opt-out or deletion requests to data brokers who
                            collect, publish, or sell personal information online. The effectiveness of removals varies
                            depending on the broker's policies and legal obligations.
                        </p>

                        <h2 className="text-xl font-semibold text-blue-500 mt-10 mb-4">4. User Eligibility</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                            To use our services, you must:
                        </p>

                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li>Be at least 18 years of age</li>
                            <li>Provide accurate and truthful information</li>
                            <li>Be the data subject (or legally authorized to act on their behalf)</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-blue-500 mt-10 mb-4">5. User Responsibilities</h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">You agree not to:</p>

                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li>Submit false or fraudulent information</li>
                            <li>Use our services for unlawful purposes</li>
                            <li>Attempt to gain unauthorized access to systems or data</li>
                        </ul>
                    </div>

                    {/* Page 2 */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-blue-500">6. No Guarantees</h2>
                            {/* <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">Page 2</span> */}
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-10">
                            While we strive to successfully submit opt-out requests, we do not guarantee that all data brokers will comply, nor that your personal information will be permanently removed from the internet or remain removed.
                        </p>

                        <div className="space-y-10">
                            <div>
                                <h2 className="text-xl font-semibold text-blue-500 mb-4">7. Payment and Billing</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    Our services are provided on a [one-time / subscription] basis. Payments are processed securely through Stripe. By providing payment details, you authorize Fortress Apps LLC to charge you in accordance with your selected plan. We do not store your credit card details.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-blue-500 mb-4">8. Refund Policy</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    Refunds may be issued at our sole discretion, typically only in cases where services were not rendered due to technical failure on our part. Refund requests must be submitted within 14 days of purchase.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-blue-500 mb-4">9. Termination</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    We reserve the right to terminate or suspend your access to our services at any time, with or without cause, including violations of these Terms.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-blue-500 mb-4">10. Intellectual Property</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    All content on ajaxxdatascrubber.com — including logos, text, graphics, tools, and scripts — is the property of Fortress Apps LLC and may not be copied, distributed, or used without express written permission.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-blue-500 mb-4">11. Limitation of Liability</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    To the fullest extent permitted by law, Fortress Apps LLC shall not be liable for any direct, indirect, incidental, or consequential damages resulting from use or inability to use our services, errors or omissions in submitted data, or non-compliance by third-party data brokers.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-blue-500 mb-4">12. Changes to Terms</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    We reserve the right to update these Terms at any time. Changes will be posted on this page with an updated "Effective Date." Your continued use of the site and services constitutes acceptance of the revised Terms.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-blue-500 mb-4">13. Governing Law</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    These Terms shall be governed by and interpreted in accordance with the laws of the State of Illinois, without regard to conflict of law principles.
                                </p>
                            </div>

                            <div className="">
                                <h2 className="text-xl font-semibold text-blue-500 mb-4">14. Contact Us</h2>
                                <p className="text-gray-700 font-medium mb-2">Fortress Apps LLC</p>
                                <p className="text-gray-700 mb-1">1585 N. State Route 50, Suite 1006</p>
                                <p className="text-gray-700 mb-3">Bourbonnais, IL 60914</p>
                                <p className="text-gray-700">
                                    Email: <span className="text-blue-600 font-medium">support@ajaxxdatascrub.com</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                {/* <div className="border-t border-gray-200 bg-gray-50 p-4 text-center">
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} Fortress Apps LLC. All rights reserved.
                    </p>
                </div> */}
            </div>
        </div>
    )
}
