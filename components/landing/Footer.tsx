import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-3 text-center sm:flex-row sm:px-6">
        <p className="text-xs text-slate-500 sm:text-sm">
          © 2026{" "}
          <span className="font-semibold text-slate-700">
            GJU Smart Connect
          </span>
          . All Rights Reserved.
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
          <span>Developed by</span>

          <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 bg-clip-text font-bold text-transparent">
            Manish Kushwaha
          </span>

          <span className="hidden sm:inline text-slate-400">|</span>

          <span className="hidden sm:inline">
            B.Tech Information Technology
          </span>
        </div>
      </div>
    </footer>
  );
}