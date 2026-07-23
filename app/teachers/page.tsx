"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Footer from "@/components/common/Footer";

import {
  GraduationCap,
  BookMarked,
  ClipboardCheck,
  BarChart3,
  Bell,
  FileText,
  Sparkles,
  Clock,
} from "lucide-react";

import {
  getTeacherRecentActivities,
  formatActivityTime,
} from "@/lib/activity";

import type { ActivityItem } from "@/lib/activity";

export default function TeacherDashboard() {
  const [teacherName, setTeacherName] = useState("");
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const session = sessionStorage.getItem("user");
      if (!session) return;

      const teacher = JSON.parse(session);
      setTeacherName(teacher.teacher_name);

      const recent = await getTeacherRecentActivities(teacher.id);
      setActivities(recent);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function getActivityIcon(type: ActivityItem["type"]) {
    switch (type) {
      case "announcement":
        return <Bell size={20} className="text-blue-600" />;
      case "assignment":
        return <FileText size={20} className="text-pink-600" />;
      case "attendance":
        return <ClipboardCheck size={20} className="text-green-600" />;
      case "marks":
        return <BarChart3 size={20} className="text-purple-600" />;
      default:
        return <BookMarked size={20} className="text-orange-500" />;
    }
  }

  return (
    <ProtectedRoute role="teacher">
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-8 sm:py-8">
          {/* ================= HERO ================= */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 p-4 text-white shadow-xl sm:rounded-3xl sm:p-8 sm:shadow-2xl">
            <div className="absolute -right-12 -top-12 hidden opacity-10 sm:block">
              <GraduationCap size={220} />
            </div>

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
              <div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Sparkles size={18} />
                  <span className="text-xs font-semibold uppercase tracking-[2px] sm:text-sm sm:tracking-[3px]">
                    Teacher Portal
                  </span>
                </div>

                <h1 className="mt-3 text-2xl font-extrabold sm:mt-4 sm:text-4xl lg:text-5xl">
                  Welcome Back
                </h1>

                <h2 className="mt-1 text-lg font-bold sm:mt-2 sm:text-2xl lg:text-3xl">
                  {teacherName}
                </h2>

                <p className="mt-2 max-w-2xl text-sm text-blue-100 sm:mt-3 sm:text-lg">
                  Manage attendance, marks, assignments and announcements from
                  one smart dashboard.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="min-w-0 rounded-xl bg-white/15 p-3 backdrop-blur sm:rounded-2xl sm:p-5">
                  <p className="text-xs opacity-80 sm:text-sm">Status</p>
                  <h3 className="mt-1 text-base font-bold sm:mt-2 sm:text-2xl">
                    Active
                  </h3>
                </div>

                <div className="min-w-0 rounded-xl bg-white/15 p-3 backdrop-blur sm:rounded-2xl sm:p-5">
                  <p className="text-xs opacity-80 sm:text-sm">Portal</p>
                  <h3 className="mt-1 text-base font-bold sm:mt-2 sm:text-2xl">
                    Teacher
                  </h3>
                </div>

                <div className="min-w-0 rounded-xl bg-white/15 p-3 backdrop-blur sm:rounded-2xl sm:p-5">
                  <p className="text-xs opacity-80 sm:text-sm">
                    Academic Year
                  </p>
                  <h3 className="mt-1 text-base font-bold sm:mt-2 sm:text-2xl">
                    2026
                  </h3>
                </div>

                <div className="min-w-0 rounded-xl bg-white/15 p-3 backdrop-blur sm:rounded-2xl sm:p-5">
                  <p className="text-xs opacity-80 sm:text-sm">Role</p>
                  <h3 className="mt-1 text-base font-bold sm:mt-2 sm:text-2xl">
                    Faculty
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* ================= DASHBOARD MODULES ================= */}
          <div className="mt-6 grid gap-3 sm:mt-10 sm:gap-7 sm:grid-cols-2 xl:grid-cols-3">
            <DashboardCard
              href="/teachers/join-subject"
              title="Join Subject"
              description="Join available university subjects."
              icon={<BookMarked size={32} />}
              gradient="from-blue-600 via-indigo-600 to-cyan-500"
            />

            <DashboardCard
              href="/teachers/my-subjects"
              title="My Subjects"
              description="View and manage joined subjects."
              icon={<GraduationCap size={32} />}
              gradient="from-green-600 via-emerald-500 to-lime-400"
            />

            <DashboardCard
              href="/teachers/attendance"
              title="Attendance"
              description="Track student attendance."
              icon={<ClipboardCheck size={32} />}
              gradient="from-orange-500 via-amber-500 to-yellow-400"
            />

            <DashboardCard
              href="/teachers/marks"
              title="Marks"
              description="Manage internal assessment."
              icon={<BarChart3 size={32} />}
              gradient="from-purple-600 via-fuchsia-500 to-pink-500"
            />

            <DashboardCard
              href="/teachers/assignments"
              title="Assignments"
              description="Create and manage assignments."
              icon={<FileText size={32} />}
              gradient="from-pink-500 via-rose-500 to-red-500"
            />

            <DashboardCard
              href="/teachers/announcements"
              title="Announcements"
              description="Notify all students instantly."
              icon={<Bell size={32} />}
              gradient="from-slate-700 via-slate-600 to-slate-500"
            />
          </div>

          {/* ================= RECENT ACTIVITY ================= */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white/60 p-4 shadow-sm sm:mt-10 sm:rounded-3xl sm:p-8">
            <div className="relative flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 sm:text-2xl">
                  Recent Activity
                </h2>
                <p className="mt-1 text-xs text-slate-500 sm:text-base">
                  Latest activities from your teaching portal.
                </p>
              </div>

              <Link
                href="/teachers/recent-activity"
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
              >
                View All
              </Link>
            </div>

            <div className="pt-4 sm:pt-6">
              {loading ? (
                <div className="py-12 text-center text-slate-500">
                  Loading...
                </div>
              ) : activities.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center">
                  <Clock size={40} className="mx-auto mb-4 text-slate-300" />
                  <p className="font-semibold text-slate-500">
                    No Recent Activity
                  </p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-4">
                  {activities.slice(0, 3).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 p-3 transition hover:border-blue-200 hover:bg-blue-50 sm:gap-3 sm:rounded-2xl sm:p-5"
                    >
                      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <div className="shrink-0 rounded-xl bg-slate-100 p-2 sm:rounded-2xl sm:p-3">
                          {getActivityIcon(activity.type)}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-slate-800 sm:text-base">
                            {activity.title}
                          </h3>
                          <p className="truncate text-xs text-slate-500 sm:text-sm">
                            {activity.subtitle}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 text-xs font-semibold text-slate-500 sm:text-sm">
                        {formatActivityTime(activity.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Footer />
        </div>
      </main>
    </ProtectedRoute>
  );
}

/* =========================================================
   DASHBOARD CARD
========================================================= */

function DashboardCard({
  href,
  title,
  description,
  icon,
  gradient,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <Link href={href}>
      <div
        className={`group cursor-pointer rounded-2xl bg-gradient-to-br ${gradient} p-4 text-white shadow-lg transition-all duration-300 active:scale-[0.98] hover:-translate-y-1 hover:shadow-2xl sm:rounded-3xl sm:p-7 sm:shadow-xl`}
      >
        <div className="transition-transform duration-300 group-hover:rotate-12">
          {icon}
        </div>

        <h2 className="mt-3 text-lg font-bold sm:mt-6 sm:text-3xl">
          {title}
        </h2>

        <p className="mt-1 text-xs text-white/80 sm:mt-3 sm:text-base">
          {description}
        </p>
      </div>
    </Link>
  );
}