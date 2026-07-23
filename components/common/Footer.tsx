"use client";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-blue-200 bg-gradient-to-r from-blue-100 via-white to-indigo-100">
      <div className="mx-auto max-w-7xl px-0 py-5 text-center sm:px-6 sm:py-6">
        <p className="text-xs font-medium tracking-wide text-slate-600 whitespace-nowrap sm:text-sm">
          © 2026{" "}
          <span className="font-bold text-slate-800">
            GJU Smart Connect
          </span>
          . All Rights Reserved.
        </p>

        <div className="mt-2 flex flex-col items-center">
          <p className="text-xs font-semibold text-slate-700 sm:text-base">
            Developed by
          </p>

          <p className="mt-0.5 text-xs font-semibold text-slate-700 whitespace-nowrap sm:text-base">
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 bg-clip-text font-bold text-transparent">
              Manish Kushwaha
            </span>
            <span className="mx-2 text-slate-400">|</span>
            <span className="font-medium text-slate-600">
              B.Tech Information Technology
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}