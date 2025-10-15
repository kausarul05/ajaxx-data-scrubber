"use client";

import { LayoutDashboard, History, Star, User, Lock, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/history", icon: History, label: "History" },
    { href: "/dashboard/review", icon: Star, label: "Review" },
    { href: "/dashboard/edit-profile", icon: User, label: "Edit Profile" },
    { href: "/dashboard/change-password", icon: Lock, label: "Change Password" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-[300px] bg-[#0D314B] text-white py-14 px-8">
        <ul className="space-y-2">
          {menuItems.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}>
              <li
                className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors ${
                  pathname === href
                    ? "bg-[#007ED6] text-white font-semibold"
                    : "hover:bg-gray-700"
                }`}
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

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
