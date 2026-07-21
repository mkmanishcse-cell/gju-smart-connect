"use client";

import { LogOut } from "lucide-react";

import { SidebarFooterProps } from "./types";

export default function SidebarFooter({ onLogout }: SidebarFooterProps) {
  return (
    <div className="border-t border-slate-200 bg-white p-2.5 sm:p-3">
      <button
        onClick={onLogout}
        aria-label="Log out"
        className="
          flex w-full items-center justify-center gap-2 sm:gap-3
          rounded-xl border border-black
          bg-red-500
          px-3 py-2
          text-sm sm:text-base font-medium text-white
          transition-all duration-200
          hover:border-black hover:bg-red-400
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300
          active:scale-[0.98]
        "
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}