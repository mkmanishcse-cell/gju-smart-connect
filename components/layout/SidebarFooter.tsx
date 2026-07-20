"use client";

import { LogOut, Info } from "lucide-react";

import { SidebarFooterProps } from "./types";

export default function SidebarFooter({
  onLogout,
}: SidebarFooterProps) {
  return (
    <div className="border-t border-slate-200 bg-white p-3">

      {/* Logout */}

      <button
        onClick={onLogout}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-3
          rounded-xl
          border
          border-black
          bg-red-500
          px-3
          py-2
          font-medium
          text-white
          transition-all
          duration-200
          hover:border-black
          hover:bg-red-400
          active:scale-[0.98]
        "
      >

        <LogOut size={18} />

        Logout

      </button>

      {/* About */}

         
        </div>

  );
}