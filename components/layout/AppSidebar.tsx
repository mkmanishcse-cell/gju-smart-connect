"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import SidebarHeader from "./SidebarHeader";
import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";

import { AppSidebarProps } from "./types";

export default function AppSidebar({
  title,
  portal,
  menus,
  userName = "User",
  isOpen,
  onClose,
  logoutPath = "/",
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const drawerRef = useRef<HTMLDivElement>(null);

  /* --------------------------
      Lock Body Scroll (mobile only)
  ---------------------------*/
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    document.body.style.overflow = isOpen && !isDesktop ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  /* --------------------------
      ESC Close
  ---------------------------*/
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  /* --------------------------
      Outside Click (mobile only)
  ---------------------------*/
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!drawerRef.current) return;

      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (isDesktop) return;

      if (!drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  /* --------------------------
      Logout
  ---------------------------*/
  function logout() {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("role");

    router.push(logoutPath);
  }

  return (
    <>
      {/* Overlay — mobile/tablet only, desktop sidebar is always visible */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`
          fixed inset-0 z-40
          bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          
          ${isOpen ? "visible opacity-100" : "invisible opacity-0"}
        `}
      />

      {/* Drawer / Persistent sidebar */}
      <aside
        ref={drawerRef}
        aria-label={`${title} sidebar navigation`}
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-screen w-72 max-w-[85vw]
          flex-col overflow-hidden
          bg-slate-800 shadow-2xl
          transition-transform duration-300
         
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <SidebarHeader userName={userName} title={title} onClose={onClose} />

        {/* Navigation */}
        <div
          className="
            flex-1 overflow-y-auto
            px-2 py-3
            sm:px-3 sm:py-4
            scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900
          "
        >
          <nav className="space-y-1.5 sm:space-y-2">
            {menus.map((menu) => {
              const currentPath = pathname.replace(/\/$/, "");
              const menuPath = menu.href.replace(/\/$/, "");

              let active = false;

              // Dashboard
              if (menuPath === `/${portal}s` || menuPath === `/${portal}`) {
                active = currentPath === menuPath;
              }
              // Other Menus
              else {
                active =
                  currentPath === menuPath ||
                  currentPath.startsWith(menuPath + "/");
              }

              return (
                <SidebarItem
                  key={menu.href}
                  menu={menu}
                  active={active}
                  onClick={onClose}
                />
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <SidebarFooter onLogout={logout} />
      </aside>
    </>
  );
}