"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { SidebarItemProps } from "./types";

export default function SidebarItem({
  menu,
  active,
  onClick,
}: SidebarItemProps) {
  const Icon = menu.icon;

  return (
    <Link
      href={menu.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`
        group relative
        flex items-center justify-between
        rounded-xl
        px-3 py-2.5 sm:px-4 sm:py-3
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
        ${active ? "bg-blue-600 shadow-lg" : "hover:bg-slate-800"}
      `}
    >
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <Icon size={20} className="shrink-0 text-white transition sm:h-[21px] sm:w-[21px]" />

        <span className="truncate text-sm font-medium text-white">
          {menu.name}
        </span>
      </div>

      {/* Arrow */}
      <ChevronRight
        size={18}
        aria-hidden="true"
        className={`
          shrink-0 text-white transition-all duration-200
          ${
            active
              ? "opacity-100"
              : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
          }
        `}
      />
    </Link>
  );
}