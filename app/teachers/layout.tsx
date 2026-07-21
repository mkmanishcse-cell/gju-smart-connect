"use client";

import { useState } from "react";

import AppSidebar from "@/components/layout/AppSidebar";
import TopBar from "@/components/layout/TopBar";
import DashboardBackGuard from "@/components/auth/DashboardBackGuard";

import useUser from "@/hooks/useUser";

import { teacherMenus } from "@/constants/teacher-menu";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userName } = useUser();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DashboardBackGuard role="teacher">
      <div className="h-screen overflow-hidden bg-slate-100">
        {/* Sidebar — fixed positioned, offsets content via lg:pl-72 below */}
        <AppSidebar
          title="Teacher Portal"
          portal="teacher"
          menus={teacherMenus}
          userName={userName}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main — offset to sit beside the persistent desktop sidebar */}
        <div className="flex h-full flex-col overflow-hidden">
          {/* Top Bar */}
          <TopBar
            portal="teacher"
            userName={userName}
            onMenuClick={() => setSidebarOpen((prev) => !prev)}
          />

          {/* Content */}
          
 <main
  className="
    flex-1 overflow-y-auto
    bg-slate-100
    px-1 py-2
    sm:px-2 sm:py-3
    md:px-5 md:py-5
    lg:px-8 lg:py-8
  "
>

         
            {children}
          </main>
        </div>
      </div>
    </DashboardBackGuard>
  );
}