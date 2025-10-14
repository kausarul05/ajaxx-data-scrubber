import Sidebar from "@/app/components/Dashboard/Sidebar/Sidebar";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Dashboard | Create Next App",
  description: "Dashboard section",
};



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar/>
        
        {/* Main Content */}
        <div className="flex-1 ">
          {children}
        </div>
      </div>
    </main>
  );
}