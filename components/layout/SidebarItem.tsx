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
      className={`
        group
        relative

        flex
        items-center
        justify-between

        rounded-xl

        px-4
        py-3

        transition-all
        duration-200

        ${
          active
            ? "bg-blue-600 shadow-lg"
            : "hover:bg-slate-800"
        }
      `}
    >

      {/* Left */}

      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        <Icon
          size={21}
          className="text-white transition"
        />

        <span
          className="
            text-sm
            font-medium
            text-white
          "
        >
          {menu.name}
        </span>

      </div>

      {/* Arrow */}

      <ChevronRight
        size={18}
        className={`
          text-white
          transition-all
          duration-200

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