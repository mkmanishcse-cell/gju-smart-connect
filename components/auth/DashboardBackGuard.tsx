"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

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

/**
 * Put this INSIDE the portal's layout.tsx (TeacherLayout, StudentLayout,
 * AdminLayout), wrapping the sidebar + main content.
 *
 * Why the layout and not the dashboard page:
 * Layouts stay mounted the whole time the user is inside a portal
 * (navigating between /teachers, /teachers/attendance, /teachers/marks
 * etc does NOT unmount the layout). That means this component's
 * popstate listener is always attached - no gaps, no "it stops working
 * after visiting another page" problem.
 *
 * Why it only fires on the dashboard:
 * We track the last known pathname in a ref. When a Back/Forward event
 * (popstate) happens, we check what page the user was ACTUALLY on right
 * before that navigation. If it was the dashboard route for this role
 * (e.g. "/teachers"), we clear the session and show the dialog. If they
 * were on any other page (attendance, marks, etc), we do nothing and let
 * normal Back/Forward behave as usual.
 */
export default function DashboardBackGuard({ role, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const lastPathRef = useRef(pathname);
  const [showLoginAgain, setShowLoginAgain] = useState(false);

  // Keep track of the most recently visited path
  useEffect(() => {
    lastPathRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    function handlePopState() {
      const dashboardPath = DASHBOARD_PATH[role];

      if (lastPathRef.current === dashboardPath) {
        // The user was on the dashboard and just pressed Back/Forward.
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("role");

        setShowLoginAgain(true);

        // Keep them visually on the dashboard URL instead of letting
        // the browser carry them to whatever page was behind it.
        router.replace(dashboardPath);
      }
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [role, router]);

  function goToLogin() {
    router.replace(`/login?role=${role}`);
  }

  return (
    <>
      {children}

      {showLoginAgain && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-2xl">
            <h2 className="text-xl font-bold text-slate-800">
              Session Ended
            </h2>

            <p className="mt-3 text-slate-500">
              For your security, please log in again to continue.
            </p>

            <button
              onClick={goToLogin}
              className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Login Again
            </button>
          </div>
        </div>
      )}
    </>
  );
}