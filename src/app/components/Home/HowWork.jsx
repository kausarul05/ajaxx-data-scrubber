import React from 'react'

export default function HowWork() {
    return (
        <section className="text-center mt-20 px-6 md:px-20 z-10 relative">
            <h3 className="text-3xl font-bold mb-10">How Data Guardian Works</h3>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gray-800 p-6 rounded-lg hover:scale-105 transition-transform">
                    <h4 className="font-semibold mb-2">Input Your Info</h4>
                    <p>Enter your email, and more</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg hover:scale-105 transition-transform">
                    <h4 className="font-semibold mb-2">Scan the Web</h4>
                    <p>Our advanced engine helps locate where your personal info is being used online</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg hover:scale-105 transition-transform">
                    <h4 className="font-semibold mb-2">Remove Your Data</h4>
                    <p>Request automatic removal</p>
                </div>
            </div>
        </section>
    )
}
