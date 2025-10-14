import {
    LayoutDashboard,
    History,
    Star,
    User,
    Lock,
    LogOut
} from "lucide-react";
import React from 'react'

export default function Sidebar() {
    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboards", active: true },
        { icon: History, label: "History", active: false },
        { icon: Star, label: "Review", active: false },
        { icon: User, label: "Edit Profile", active: false },
        { icon: Lock, label: "Change Password", active: false },
    ];
    return (
        <div className="w-[336px] bg-gray-800 text-white py-14 px-10">
            {/* <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                <LayoutDashboard className="text-blue-400" />
                Dashboard
            </h2> */}
            <ul className="space-y-1">
                {menuItems.map((item, index) => {   
                    const Icon = item.icon;
                    return (
                        <li
                            key={index}
                            className={`flex items-center gap-2 p-5 rounded-lg cursor-pointer transition-colors  ${item.active
                                ? 'bg-[#007ED6] text-white font-semibold'
                                : 'hover:bg-gray-700'
                                }`}
                        >
                            <Icon size={20} />
                            {item.label}
                        </li>
                    );
                })}
                <li className="flex items-center gap-3 hover:bg-red-600 p-3 rounded cursor-pointer transition-colors mt-8">
                    <LogOut size={20} />
                    Logout
                </li>
            </ul>
        </div>
    )
}
