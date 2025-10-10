import { FileText, Search, ShieldCheck } from 'lucide-react'
import React from 'react'

export default function HowWork() {
    return (
        <section className="bg-custom text-center section-gap">
            <div className='w-8/12 mx-auto'>
                <h3 className="text-5xl font-bold mb-14">How Data Guardian Works</h3>
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="bg-[#092B41] border border-[#007ED6] p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform">
                        <FileText className='mx-auto mb-4.5 text-[#007ED6] w-12 h-12'/>
                        <h4 className="font-semibold mb-2 text-lg">Input Your Info</h4>
                        <p>Enter your email, and more</p>
                    </div>
                    <div className="bg-[#092B41] border border-[#007ED6] p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform">
                        <Search className='mx-auto mb-4.5 text-[#007ED6] w-12 h-12'/>
                        <h4 className="font-semibold mb-2 text-lg">Scan the Web</h4>
                        <p>Our advanced engine helps locate where your personal info is being used online</p>
                    </div>
                    <div className="bg-[#092B41] border border-[#007ED6] p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform">
                        <ShieldCheck className='mx-auto mb-4.5 text-[#007ED6] w-12 h-12'/>
                        <h4 className="font-semibold mb-2 text-lg">Remove Your Data</h4>
                        <p>Request automatic removal</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
