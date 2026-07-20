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

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (

    <DashboardBackGuard role="teacher">

      <div
        className="
          flex
          h-screen
          overflow-hidden

          bg-slate-100
        "
      >

        {/* Sidebar */}

        <AppSidebar

          title="Teacher Portal"

          portal="teacher"

          menus={teacherMenus}

          userName={userName}

          isOpen={sidebarOpen}

          onClose={() =>
            setSidebarOpen(false)
          }

        />

        {/* Main */}

        <div
          className="
            flex
            flex-1
            flex-col

            overflow-hidden
          "
        >

          {/* Top Bar */}

          <TopBar

            portal="teacher"

            userName={userName}

            onMenuClick={() =>
              setSidebarOpen(true)
            }

          />

          {/* Content */}

          <main
            className="
              flex-1

              overflow-y-auto

              bg-slate-100

              p-6
            "
          >

            {children}

          </main>

        </div>

      </div>

    </DashboardBackGuard>

  );

}