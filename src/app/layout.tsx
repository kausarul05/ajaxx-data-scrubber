import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from './shaired/Navbar';
import FooterWrapper from "./shaired/FooterWrapper";
import { ToastContainer } from 'react-toastify';
import { ModalProvider } from "./context/ModalContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ajaxxdatascrubber - Data Privacy Made Easy",
  description: "Ajaxxdatascrubber helps you protect your personal data by submitting opt-out and deletion requests to data brokers, ensuring your privacy online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ModalProvider>
          <Navbar />
          <FooterWrapper>{children}</FooterWrapper>

          <ToastContainer />
        </ModalProvider>
      </body>
    </html>
  );
}
