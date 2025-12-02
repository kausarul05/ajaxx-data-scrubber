import React from 'react'

export default function page() {
    return (
        <div className="lg:px-[140px] pt-8 md:pt-[40px] bg-custom">
            <div className="w-full bg-custom ">

                {/* Header Section */}
                <div className="">
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-white">Privacy Policy</h1>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8">

                    {/* Page 1 */}
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-blue-500">1. Overview</h2>
                            {/* <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">Page 1</span> */}
                        </div>

                        <div className="space-y-6">
                            <p className="text-white leading-relaxed">
                                At Fortress Apps LLC, we are committed to protecting your privacy. This Privacy Policy
                                explains how we collect, use, disclose, and safeguard your personal information when you
                                use our website, ajaxxdatascrubber.com, and our services.
                            </p>

                            <p className="text-white leading-relaxed">
                                By using our services, you consent to the practices described in this policy.
                            </p>
                        </div>

                        <h2 className="text-xl font-semibold text-blue-500 mt-10 mb-4">2. Information We Collect</h2>
                        <p className="text-white mb-4 leading-relaxed">
                            We collect personal information necessary to fulfill our services, including:
                        </p>

                        <ul className="list-disc pl-5 space-y-2 text-white mb-6">
                            <li>Full name</li>
                            <li>Email address</li>
                            <li>Phone number (optional)</li>
                            <li>Home address</li>
                            <li>IP address</li>
                            <li>Payment information (processed via Stripe — we do not store payment details)</li>
                            <li>Any other information you voluntarily submit</li>
                        </ul>

                        <p className="text-white leading-relaxed">
                            We also collect technical data such as browser type, device type, pages visited, and cookies.
                        </p>

                        <h2 className="text-xl font-semibold text-blue-500 mt-10 mb-4">3. How We Use Your Information</h2>
                        <p className="text-white mb-4 leading-relaxed">We use your information to:</p>

                        <ul className="list-disc pl-5 space-y-2 text-white">
                            <li>Submit opt-out or deletion requests</li>
                            <li>Verify your identity</li>
                            <li>Send status updates</li>
                            <li>Process payments</li>
                            <li>Improve services</li>
                            <li>Respond to support requests</li>
                        </ul>
                    </div>

                    {/* Page 2 */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-blue-500">4. How We Share Your Information</h2>
                            {/* <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">Page 2</span> */}
                        </div>

                        <p className="text-white mb-4 leading-relaxed">We may share your data with:</p>

                        <ul className="list-disc pl-5 space-y-2 text-white mb-4">
                            <li>Data brokers (to submit requests)</li>
                            <li>Service providers (e.g., Stripe, hosting)</li>
                            <li>Legal authorities (if required)</li>
                        </ul>

                        <p className="text-white font-medium italic mb-6">
                            We do not sell your personal information.
                        </p>

                        <div className="space-y-10">
                            <div>
                                <h2 className="text-xl font-semibold text-blue-500 mb-4">5. Data Retention</h2>
                                <p className="text-white leading-relaxed">
                                    We retain data as long as necessary to fulfill services, comply with legal obligations, and maintain logs for up to 12 months.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-blue-500 mb-4">6. Your Rights</h2>
                                <p className="text-white mb-4 leading-relaxed">You have the right to:</p>
                                <ul className="list-disc pl-5 space-y-2 text-white mb-4">
                                    <li>Access your data</li>
                                    <li>Correct inaccuracies</li>
                                    <li>Request deletion</li>
                                    <li>Withdraw consent</li>
                                </ul>
                                <p className="text-white">
                                    To make a request, email <span className="text-blue-600 font-medium">privacy@ajaxxdatascrubber.com</span>
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-blue-500 mb-4">7. Security of Your Information</h2>
                                <p className="text-white leading-relaxed">
                                    We use SSL encryption and access controls. However, no system is 100% secure.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-blue-500 mb-4">8. Cookies and Tracking Technologies</h2>
                                <p className="text-white leading-relaxed">
                                    We use cookies for functionality and analytics. You can disable cookies in your browser settings.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-blue-500 mb-4">9. Children&apos;s Privacy</h2>
                                <p className="text-white leading-relaxed">
                                    Our services are not intended for individuals under 13. We do not knowingly collect data from children.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-blue-500 mb-4">10. Third-Party Links</h2>
                                <p className="text-white leading-relaxed">
                                    We are not responsible for the privacy practices of third-party websites linked from our platform.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-blue-500 mb-4">11. Changes to This Policy</h2>
                                <p className="text-white leading-relaxed">
                                    We may update this policy. Changes will be posted on this page with a new effective date.
                                </p>
                            </div>

                            <div className="">
                                <h2 className="text-xl font-semibold text-blue-500 mb-4">12. Contact Us</h2>
                                <p className="text-white font-medium mb-2">Fortress Apps LLC</p>
                                <p className="text-white mb-1">1585 N. State Route 50, Suite 1006</p>
                                <p className="text-white mb-3">Bourbonnais, IL 60914</p>
                                <p className="text-white">
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
