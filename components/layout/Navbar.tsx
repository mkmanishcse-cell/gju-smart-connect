"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const menus = [
  { title: "🏠 Home", href: "#home" },
  { title: "🎓 Portals", href: "#portals" },
  { title: "✨ Features", href: "#features" },
  { title: "📊 Statistics", href: "#statistics" },
  { title: "ℹ️ About", href: "#about" },
  { title: "📞 Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-2 pt-2 sm:px-4 sm:pt-4">
          <div className="rounded-2xl border border-slate-200 bg-white/90 shadow-xl backdrop-blur-xl">

            <div className="flex items-center justify-between px-4 py-3">

              {/* Logo */}
              <a
                href="#home"
                className="flex items-center gap-3"
                onClick={() => setMenuOpen(false)}
              >
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={48}
                  height={48}
                  priority
                  className="h-10 w-10 rounded-full sm:h-12 sm:w-12"
                />

                <div>
                  <h2 className="text-sm font-bold text-slate-900 sm:text-lg">
                    GJU Smart Connect
                  </h2>

                  <p className="hidden text-xs text-slate-500 sm:block">
                    Smart Academic Portal
                  </p>
                </div>
              </a>

              {/* Desktop Menu */}
              <nav className="hidden items-center gap-2 lg:flex">
                {menus.map((menu) => (
                  <a
                    key={menu.title}
                    href={menu.href}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-md"
                  >
                    {menu.title}
                  </a>
                ))}
              </nav>

              {/* Mobile Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle Menu"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-100 lg:hidden"
              >
                {menuOpen ? (
                  <X size={22} />
                ) : (
                  <Menu size={22} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          menuOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed left-0 right-0 top-20 z-50 mx-3 rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 lg:hidden ${
          menuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-5 pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex flex-col p-3">

          {menus.map((menu) => (
            <a
              key={menu.title}
              href={menu.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-blue-600 hover:text-white"
            >
              {menu.title}
            </a>
          ))}

        </nav>
      </div>
    </>
  );
}