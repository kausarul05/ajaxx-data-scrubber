"use client";

import { LayoutDashboard, History, Star, User, Lock, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/history", icon: History, label: "History" },
    { href: "/dashboard/review", icon: Star, label: "Review" },
    { href: "/dashboard/edit-profile", icon: User, label: "Edit Profile" },
    { href: "/dashboard/change-password", icon: Lock, label: "Change Password" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Mobile Header with Red Background */}
      <div className="lg:hidden fixed top-23 left-0 right-0 bg-[#0C2A44] text-white z-50 h-16 flex items-center justify-between px-4">
        {/* 3-line Menu Button */}
        <button
          className="p-2 rounded"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>

        {/* Page Title */}
        <h1 className="text-lg font-semibold">
          {menuItems.find(item => item.href === pathname)?.label || 'Dashboard'}
        </h1>

        {/* Spacer for balance */}
        <div className="w-10"></div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - YOUR EXACT ORIGINAL DESIGN */}
      <aside className={`
        w-[300px] bg-[#0D314B] text-white py-14 px-8
        fixed lg:static inset-y-0 left-0
        transform transition-transform duration-300 ease-in-out
        z-40 top-23
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:mt-0 mt-16
      `}>
        {/* YOUR EXACT ORIGINAL SIDEBAR CONTENT */}
        <ul className="space-y-2">
          {menuItems.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}>
              <li
                className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors ${
                  pathname === href
                    ? "bg-[#007ED6] text-white font-semibold"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon size={20} />
                {label}
              </li>
            </Link>
          ))}
        </ul>

        <div className="mt-8 flex items-center gap-3 hover:bg-red-600 p-4 rounded-lg cursor-pointer transition-colors">
          <LogOut size={20} />
          Logout
        </div>
      </aside>

      {/* Main content - YOUR EXACT ORIGINAL */}
      <main className="flex-1 overflow-y-auto lg:ml-0 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}