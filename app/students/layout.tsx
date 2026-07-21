"use client";

import { useState } from "react";

import AppSidebar from "@/components/layout/AppSidebar";
import TopBar from "@/components/layout/TopBar";
import DashboardBackGuard from "@/components/auth/DashboardBackGuard";

import useUser from "@/hooks/useUser";

import { studentMenus } from "@/constants/student-menu";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userName } = useUser();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DashboardBackGuard role="student">
      <div className="flex h-screen overflow-hidden bg-slate-100">
        {/* Sidebar */}
        <AppSidebar
          title="Student Portal"
          portal="student"
          menus={studentMenus}
          userName={userName}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          {/* Top Bar */}
          <TopBar
            portal="student"
            userName={userName}
            onMenuClick={() => setSidebarOpen(true)}
          />

          {/* Page */}
          <main className="flex-1 overflow-y-auto bg-slate-100 p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="w-full max-w-[1600px] mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </DashboardBackGuard>
  );
}