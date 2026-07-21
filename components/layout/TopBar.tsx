"use client";

import { Bell, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { getPageTitle } from "./PageTitle";
import { TopBarProps } from "./types";

export default function TopBar({
  portal,
  userName,
  onMenuClick,
}: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const pageTitle = getPageTitle(pathname, portal);

  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  function openNotifications() {
    if (portal === "admin") {
      router.push("/admin/recent-activity");
      return;
    }

    if (portal === "teacher") {
      router.push("/teachers/recent-activity");
      return;
    }

    router.push("/students/announcements");
  }

  return (
    <header
      className="
        sticky top-0 z-30
        flex h-14 sm:h-16 items-center justify-between
        border-b border-slate-200
        bg-blue-200 backdrop-blur
        px-3 sm:px-4 md:px-6
        shadow-sm
      "
    >
      {/* Left */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        {/* Hamburger — mobile/tablet only; desktop sidebar is always visible */}
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="
            flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center
            rounded-xl border border-slate-200
            bg-blue-400
            transition hover:bg-blue-300
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600
            
          "
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-base font-bold text-slate-800 sm:text-lg md:text-xl">
            {pageTitle}
          </h1>

          <p className="mt-0.5 hidden text-xs font-medium text-slate-800 sm:block sm:text-sm">
            {currentDate}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {/* Notification */}
        <button
          onClick={openNotifications}
          aria-label="View notifications"
          className="
            relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center
            rounded-xl border border-slate-200
            bg-white
            transition hover:bg-slate-100
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600
          "
        >
          <Bell size={18} className="sm:hidden" />
          <Bell size={20} className="hidden sm:block" />

          <span
            aria-hidden="true"
            className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 sm:right-3 sm:top-3 sm:h-2.5 sm:w-2.5"
          />
        </button>

        {/* User */}
        <div
          className="
            flex items-center gap-2 sm:gap-3
            rounded-xl border border-slate-200
            bg-white
            px-2 py-1.5 sm:px-3 sm:py-2
          "
        >
          <div
            className="
              flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center
              rounded-full bg-blue-600
              text-sm sm:text-base font-bold text-white
            "
          >
            {userName.charAt(0).toUpperCase()}
          </div>

          <div className="hidden md:block">
            <h3 className="font-semibold text-slate-800">{userName}</h3>
            <p className="text-xs text-green-600">● Online</p>
          </div>
        </div>
      </div>
    </header>
  );
}