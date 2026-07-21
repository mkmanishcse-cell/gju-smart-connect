"use client";

import { X } from "lucide-react";

import { SidebarHeaderProps } from "./types";

export default function SidebarHeader({
  userName,
  title,
  onClose,
}: SidebarHeaderProps) {
  return (
    <div
      className="
        flex items-center justify-between
        border-b border-slate-700
        bg-slate-800
        px-4 py-3
        sm:px-5 sm:py-4
      "
    >
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Avatar */}
        <div
          className="
            flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center
            rounded-full bg-blue-600
            text-sm sm:text-base font-bold text-white
          "
        >
          {userName.charAt(0).toUpperCase()}
        </div>

        {/* User */}
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-white">
            {userName}
          </h2>

          <div className="mt-0.5 flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full bg-green-500"
            />
            <p className="truncate text-xs text-slate-300">{title}</p>
          </div>
        </div>
      </div>

      {/* Close — mobile/tablet only, desktop sidebar stays open */}
      <button
        onClick={onClose}
        aria-label="Close sidebar"
        className="
          shrink-0 rounded-lg p-2
          text-slate-300
          transition hover:bg-slate-700 hover:text-white
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        
        "
      >
        <X size={20} />
      </button>
    </div>
  );
}