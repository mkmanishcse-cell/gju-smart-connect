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

  const pageTitle =
    getPageTitle(pathname, portal);
const currentDate = new Intl.DateTimeFormat("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date());

  function openNotifications() {

    if (portal === "admin") {

      router.push(
        "/admin/recent-activity"
      );

      return;

    }

    if (portal === "teacher") {

      router.push(
        "/teachers/recent-activity"
      );

      return;

    }

    router.push(
      "/students/announcements"
    );

  }

  return (

    <header
      className="
        sticky
        top-0
        z-30

        flex
        h-16
        items-center
        justify-between

        border-b
        border-slate-200

        bg-blue-200
        backdrop-blur

        px-6

        shadow-sm
      "
    >

      {/* Left */}

      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        <button

          onClick={onMenuClick}

          className="
            flex
            h-11
            w-11
            items-center
            justify-center

            rounded-xl

            border
            border-slate-200

            bg-blue-400

            transition

            hover:bg-blue-300
          "

        >

          <Menu size={22} />

        </button>

        <div>

          <h1
            className="
              text-xl
              font-bold
              text-slate-800
            "
          >

            {pageTitle}

          </h1>

           <p
    className="
      mt-1
      text-sm
      font-medium
      text-slate-800
    "
  >
    {currentDate}
  </p>

        </div>

      </div>

      {/* Right */}

      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        {/* Notification */}

        <button

          onClick={openNotifications}

          className="
            relative

            flex
            h-11
            w-11

            items-center
            justify-center

            rounded-xl

            border
            border-slate-200

            bg-white

            transition

            hover:bg-slate-100
          "

        >

          <Bell size={20} />

          <span
            className="
              absolute
              right-3
              top-3

              h-2.5
              w-2.5

              rounded-full

              bg-red-500
            "
          />

        </button>

        {/* User */}

        <div
          className="
            flex
            items-center
            gap-3

            rounded-xl

            border
            border-slate-200

            bg-white

            px-3
            py-2
          "
        >

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-full

              bg-blue-600

              font-bold
              text-white
            "
          >

            {userName.charAt(0).toUpperCase()}

          </div>

          <div
            className="
              hidden
              md:block
            "
          >

            <h3
              className="
                font-semibold
                text-slate-800
              "
            >

              {userName}

            </h3>

            <p
              className="
                text-xs
                text-green-600
              "
            >

              ● Online

            </p>

          </div>

        </div>

      </div>

    </header>

  );

}