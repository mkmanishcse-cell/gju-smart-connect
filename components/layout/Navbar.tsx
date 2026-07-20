"use client";

import Image from "next/image";

const menus = [
  {
    title: "🏠 Home",
    href: "#home",
  },
  {
    title: "🎓 Portals",
    href: "#portals",
  },
  {
    title: "✨ Features",
    href: "#features",
  },
  {
    title: "📊 Statistics",
    href: "#statistics",
  },
  {
    title: "ℹ️ About",
    href: "#about",
  },
  {
    title: "📞 Contact",
    href: "#contact",
  },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      <div className="max-w-7xl mx-auto px-5 pt-5">

        <div className="backdrop-blur-xl bg-white/80 border border-slate-200 rounded-2xl shadow-xl">

          <div className="flex items-center justify-between px-8 py-4">

            {/* Logo */}

            <a
              href="#home"
              className="flex items-center gap-4"
            >

              <Image
                src="/logo.png"
                alt="GJU Logo"
                width={52}
                height={52}
                priority
              />

              <div>

                <h2 className="text-xl font-bold text-slate-900">

                  GJU Smart Connect

                </h2>

                <p className="text-sm text-slate-500">

                  Smart Academic Portal

                </p>

              </div>

            </a>

            {/* Navigation */}

            <nav className="hidden lg:flex items-center gap-2">

              {menus.map((menu) => (

                <a
                  key={menu.title}
                  href={menu.href}
                  className="px-5 py-3 rounded-xl font-semibold text-slate-700 transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-lg"
                >

                  {menu.title}

                </a>

              ))}

            </nav>

          </div>

        </div>

      </div>

    </header>
  );
}
