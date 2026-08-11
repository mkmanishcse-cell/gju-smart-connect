"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type Role = "admin" | "teacher" | "student";

type Props = {
  role: Role;
  children: React.ReactNode;
};

const DASHBOARD_PATH: Record<Role, string> = {
  admin: "/admin",
  teacher: "/teachers",
  student: "/students",
};

export default function DashboardBackGuard({
  role,
  children,
}: Props) {
  const pathname = usePathname();

  const dashboardPath = DASHBOARD_PATH[role];

  const currentPathRef = useRef(pathname);
  const handlingRef = useRef(false);

  /* =========================================
     TRACK CURRENT PATH
  ========================================= */

  useEffect(() => {
    currentPathRef.current = pathname;
  }, [pathname]);

  /* =========================================
     HANDLE BROWSER BACK
  ========================================= */

  useEffect(() => {
    function handlePopState() {
      if (handlingRef.current) {
        return;
      }

      /*
       * Browser jis URL par ja raha hai
       * usko directly check karo.
       */

      const destination =
        window.location.pathname;

      /*
       * Agar user kisi inner page par hai,
       * Back ko bilkul normal rehne do.
       *
       * Example:
       *
       * /teachers/marks
       *       ↓ Back
       * /teachers
       */

      if (
        currentPathRef.current !==
        dashboardPath
      ) {
        return;
      }

      /*
       * Agar dashboard se bahar ja raha hai,
       * session end karo.
       *
       * Example:
       *
       * /teachers
       *       ↓ Back
       * /login
       */

      if (destination !== dashboardPath) {
        handlingRef.current = true;

        /* Clear logged-in session */

        sessionStorage.removeItem("user");
        sessionStorage.removeItem("role");

        /* Tell login page */

        sessionStorage.setItem(
          "sessionEnded",
          "true"
        );

        /*
         * IMPORTANT:
         *
         * pushState current history ke baad
         * NEW login entry banata hai.
         *
         * Isse old forward history discard ho jati hai.
         */

        window.history.pushState(
          {},
          "",
          `/login?role=${role}`
        );

        /*
         * Reload login page.
         */

        window.location.reload();
      }
    }

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, [dashboardPath, role]);

  return <>{children}</>;
}