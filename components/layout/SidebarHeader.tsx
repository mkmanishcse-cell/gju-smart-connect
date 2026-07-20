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
        flex
        items-center
        justify-between

        border-b
        border-slate-700

        bg-slate-800

        px-5
        py-4
      "
    >

      {/* Left */}

      <div className="flex items-center gap-3">

        {/* Avatar */}

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center

            rounded-full

            bg-blue-600

            text-base
            font-bold
            text-white
          "
        >

          {userName.charAt(0).toUpperCase()}

        </div>

        {/* User */}

        <div>

          <h2
            className="
              text-sm
              font-semibold
              text-white
            "
          >

            {userName}

          </h2>

          <div
            className="
              mt-0.5
              flex
              items-center
              gap-2
            "
          >

            <span
              className="
                h-2
                w-2
                rounded-full
                bg-green-500
              "
            />

            <p
              className="
                text-xs
                text-slate-300
              "
            >

              {title}

            </p>

          </div>

        </div>

      </div>

      {/* Close */}

      <button
        onClick={onClose}
        className="
          rounded-lg
          p-2

          text-slate-300

          transition

          hover:bg-slate-700
          hover:text-white
        "
      >

        <X size={20} />

      </button>

    </div>
  );
}