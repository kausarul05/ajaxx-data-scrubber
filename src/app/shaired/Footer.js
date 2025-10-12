import logo from '@/../public/images/logo.png'
import { Facebook, Linkedin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#0A3740] text-white py-12">
      <div className="px-[140px] pt-[80px]">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-8  ">
          {/* Logo + Description */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={logo}
                alt="AJAXX Logo"
                // className="w-12 h-12"
              />
              {/* <h2 className="text-xl font-bold">AJAXX<br />DATA SCRUBBER</h2> */}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              AJAXX Data Scrubber helps you find and remove your personal
              information from data brokers.
            </p>
          </div>

          {/* Home */}
          <div>
            <h3 className="font-semibold mb-4">Home</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#">Overview</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Login</a></li>
            </ul>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="font-semibold mb-4">Pricing</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#">Basic</a></li>
              <li><a href="#">Silver</a></li>
              <li><a href="#">Gold</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Social</h3>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-[#007ED6] rounded-full"
              >
                {/* <FaFacebookF className="text-[#007ED6]" /> */}
                <Facebook />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-[#007ED6] rounded-full"
              >
                {/* <FaLinkedinIn className="text-[#007ED6]" /> */}
                <Linkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-gray-300">
          <p>© 2025. AJAXX DATA SCRUBBER. ALL RIGHTS RESERVED.</p>
          <a href="#" className="underline hover:text-white">
            Terms & Conditions
          </a>
        </div>
      </div>
    </footer>
  );
}
