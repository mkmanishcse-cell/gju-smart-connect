"use client";

import Link from "next/link";
import {
  ClipboardCheck,
  BarChart3,
  BookOpen,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "My Subjects",
    subtitle: "Open all enrolled subjects",
    href: "/students/my-subjects",
    icon: BookOpen,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    topGradient: "from-yellow-400 via-amber-500 to-orange-600",
    bg: "bg-amber-200",
    iconColor: "text-amber-700",
    border: "border-amber-200",
    cardBg: "from-amber-50 via-white to-orange-100",
  },
  {
    title: "Attendance",
    subtitle: "View attendance records",
    href: "/students/attendance",
    icon: ClipboardCheck,
    gradient: "from-emerald-500 via-green-600 to-teal-600",
    topGradient: "from-emerald-400 via-green-500 to-teal-600",
    bg: "bg-emerald-200",
    iconColor: "text-emerald-700",
    border: "border-emerald-200",
    cardBg: "from-emerald-50 via-white to-emerald-100",
  },
  {
    title: "Marks",
    subtitle: "View internal assessment",
    href: "/students/marks",
    icon: BarChart3,
    gradient: "from-cyan-500 via-blue-600 to-indigo-600",
    topGradient: "from-cyan-400 via-blue-500 to-indigo-600",
    bg: "bg-blue-200",
    iconColor: "text-blue-700",
    border: "border-blue-200",
    cardBg: "from-blue-50 via-white to-indigo-100",
  },
];

export default function QuickActions() {
  return (
    <section className="mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Quick Actions
        </h2>
        <p className="mt-1 text-slate-500">
          Frequently used modules
        </p>
      </div>

      {/* 3 equal width cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.title} href={item.href} className="group">
              <div
                className={`relative overflow-hidden rounded-[26px] border ${item.border} bg-gradient-to-br ${item.cardBg} shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                {/* Background Glow */}
                <div
                  className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${item.gradient} opacity-10 blur-3xl`}
                />

                {/* Top Gradient */}
                <div
                  className={`absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r ${item.topGradient}`}
                />

                <div className="relative p-5">
                  {/* Icon */}
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg} shadow`}
                  >
                    <Icon size={26} className={item.iconColor} />
                  </div>

                  {/* Title */}
                  <h2 className="mt-5 text-xl font-bold text-slate-800">
                    {item.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.subtitle}
                  </p>

                  {/* Bottom */}
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-500">
                      Open Module
                    </span>

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r ${item.gradient} shadow transition-all duration-300 group-hover:translate-x-1 group-hover:scale-105`}
                    >
                      <ArrowRight size={18} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}