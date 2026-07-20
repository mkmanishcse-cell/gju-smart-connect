"use client";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-blue-200 bg-gradient-to-r from-blue-100 via-white to-indigo-100">

      <div className="mx-auto max-w-7xl px-6 py-6 text-center">

        <p className="text-sm font-medium tracking-wide text-slate-600">
          © 2026{" "}
          <span className="font-bold text-slate-800">
            GJU Smart Connect
          </span>
          . All Rights Reserved.
        </p>

        <p className="mt-2 text-base font-semibold text-slate-700">
          Developed by{" "}
          <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 bg-clip-text font-bold text-transparent">
            Manish Kushwaha
          </span>
          <span className="mx-2 text-slate-400">|</span>
          <span className="font-medium text-slate-600">
            B.Tech Information Technology
          </span>
        </p>

      </div>

    </footer>
  );
}