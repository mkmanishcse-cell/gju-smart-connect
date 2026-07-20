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

import type {
  ActivityItem,
} from "@/lib/activity";

export default function TeacherDashboard() {

  const [teacherName, setTeacherName] =
    useState("");

  const [activities, setActivities] =
    useState<ActivityItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadDashboard();

  }, []);

  async function loadDashboard() {

    try {

      setLoading(true);

      const session =
        sessionStorage.getItem("user");

      if (!session) return;

      const teacher =
        JSON.parse(session);

      setTeacherName(
        teacher.teacher_name
      );

      const recent =
        await getTeacherRecentActivities(
          teacher.id
        );

      setActivities(recent);

    }

    catch (error) {

      console.log(error);

    }

    finally {

      setLoading(false);

    }

  }

  function getActivityIcon(
    type: ActivityItem["type"]
  ) {

    switch (type) {

      case "announcement":

        return (
          <Bell
            size={22}
            className="text-blue-600"
          />
        );

      case "assignment":

        return (
          <FileText
            size={22}
            className="text-pink-600"
          />
        );

      case "attendance":

        return (
          <ClipboardCheck
            size={22}
            className="text-green-600"
          />
        );

      case "marks":

        return (
          <BarChart3
            size={22}
            className="text-purple-600"
          />
        );

      default:

        return (
          <BookMarked
            size={22}
            className="text-orange-500"
          />
        );

    }

  }

  return (

<ProtectedRoute role="teacher">
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">

        {/* ================= HERO ================= */}

        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 p-5 sm:p-8 text-white shadow-2xl">

          <div className="absolute -right-12 -top-12 opacity-10 hidden sm:block">

            <GraduationCap size={220} />

          </div>

          <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

            <div>

              <div className="flex items-center gap-3">

                <Sparkles size={20} />

                <span className="text-xs sm:text-sm font-semibold uppercase tracking-[3px]">

                  Teacher Portal

                </span>

              </div>

              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold">

                Welcome Back

              </h1>

              <h2 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-bold">

                {teacherName}

              </h2>

              <p className="mt-3 max-w-2xl text-sm sm:text-lg text-blue-100">

                Manage attendance, marks,
                assignments and announcements
                from one smart dashboard.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">

              <div className="min-w-0 rounded-xl sm:rounded-2xl bg-white/15 p-3 sm:p-5 backdrop-blur">

                <p className="text-xs sm:text-sm opacity-80">

                  Status

                </p>

                <h3 className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold">

                  Active

                </h3>

              </div>

              <div className="min-w-0 rounded-xl sm:rounded-2xl bg-white/15 p-3 sm:p-5 backdrop-blur">

                <p className="text-xs sm:text-sm opacity-80">

                  Portal

                </p>

                <h3 className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold">

                  Teacher

                </h3>

              </div>

              <div className="rounded-xl sm:rounded-2xl bg-white/15 p-3 sm:p-5 backdrop-blur">

                <p className="text-xs sm:text-sm opacity-80">

                  Academic Year

                </p>

                <h3 className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold">

                  2026

                </h3>

              </div>

              <div className="rounded-xl sm:rounded-2xl bg-white/15 p-3 sm:p-5 backdrop-blur">

                <p className="text-xs sm:text-sm opacity-80">

                  Role

                </p>

                <h3 className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold">

                  Faculty

                </h3>

              </div>

            </div>

          </div>

        </div>
        {/* ================= DASHBOARD MODULES ================= */}

<div className="mt-8 sm:mt-10 grid gap-4 sm:gap-7 sm:grid-cols-2 xl:grid-cols-3">

  <DashboardCard
    href="/teachers/join-subject"
    title="Join Subject"
    description="Join available university subjects."
    icon={<BookMarked size={40} />}
    gradient="from-blue-600 via-indigo-600 to-cyan-500"
  />

  <DashboardCard
    href="/teachers/my-subjects"
    title="My Subjects"
    description="View and manage joined subjects."
    icon={<GraduationCap size={40} />}
    gradient="from-green-600 via-emerald-500 to-lime-400"
  />

  <DashboardCard
    href="/teachers/attendance"
    title="Attendance"
    description="Track student attendance."
    icon={<ClipboardCheck size={40} />}
    gradient="from-orange-500 via-amber-500 to-yellow-400"
  />

  <DashboardCard
    href="/teachers/marks"
    title="Marks"
    description="Manage internal assessment."
    icon={<BarChart3 size={40} />}
    gradient="from-purple-600 via-fuchsia-500 to-pink-500"
  />

  <DashboardCard
    href="/teachers/assignments"
    title="Assignments"
    description="Create and manage assignments."
    icon={<FileText size={40} />}
    gradient="from-pink-500 via-rose-500 to-red-500"
  />

  <DashboardCard
    href="/teachers/announcements"
    title="Announcements"
    description="Notify all students instantly."
    icon={<Bell size={40} />}
    gradient="from-slate-700 via-slate-600 to-slate-500"
  />

</div>

{/* ================= QUICK OVERVIEW ================= */}

<div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">

  <OverviewCard
    title="Joined Subjects"
    value="06"
    color="text-blue-600"
    icon={<BookMarked size={32} />}
  />

  <OverviewCard
    title="Attendance"
    value="94%"
    color="text-green-600"
    icon={<ClipboardCheck size={32} />}
  />

  <OverviewCard
    title="Assignments"
    value="18"
    color="text-orange-500"
    icon={<FileText size={32} />}
  />

  <OverviewCard
    title="Announcements"
    value="07"
    color="text-purple-600"
    icon={<Bell size={32} />}
  />

</div>

{/* ================= RECENT ACTIVITY ================= */}

<div className="mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-8 shadow-xl">

  <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

    <div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-800">

        Recent Activity

      </h2>

      <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-500">

        Latest activities from your teaching portal.

      </p>

    </div>

    <Link
      href="/teachers/recent-activity"
      className="inline-block rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold hover:bg-slate-200 sm:px-5"
    >

      View All

    </Link>

  </div>

  {loading ? (

    <div className="py-12 text-center text-slate-500">

      Loading...

    </div>

  ) : activities.length === 0 ? (

    <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center">

      <Clock
        size={40}
        className="mx-auto mb-4 text-slate-300"
      />

      <p className="font-semibold text-slate-500">

        No Recent Activity

      </p>

    </div>

  ) : (

    <div className="space-y-3 sm:space-y-4">

      {activities.slice(0,3).map((activity) => (

        <div
          key={activity.id}
          className="flex items-center justify-between gap-3 rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-5 transition hover:border-blue-200 hover:bg-blue-50"
        >

          <div className="flex min-w-0 items-center gap-3 sm:gap-4">

            <div className="shrink-0 rounded-xl sm:rounded-2xl bg-slate-100 p-2 sm:p-3">

              {getActivityIcon(activity.type)}

            </div>

            <div className="min-w-0">

              <h3 className="truncate font-semibold text-slate-800 text-sm sm:text-base">

                {activity.title}

              </h3>

              <p className="truncate text-xs sm:text-sm text-slate-500">

                {activity.subtitle}

              </p>

            </div>

          </div>

          <span className="shrink-0 text-xs sm:text-sm font-semibold text-slate-500">

            {formatActivityTime(activity.created_at)}

          </span>

        </div>

      ))}

    </div>

  )}

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

}:{

  href:string;

  title:string;

  description:string;

  icon:React.ReactNode;

  gradient:string;

}){

  return(

    <Link href={href}>

      <div
        className={`group cursor-pointer rounded-2xl sm:rounded-3xl bg-gradient-to-br ${gradient} p-5 sm:p-7 text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
      >

        <div className="transition-transform duration-300 group-hover:rotate-12">

          {icon}

        </div>

        <h2 className="mt-4 sm:mt-6 text-xl sm:text-3xl font-bold">

          {title}

        </h2>

        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-white/80">

          {description}

        </p>

      </div>

    </Link>

  );

}

/* =========================================================
   OVERVIEW CARD
========================================================= */

function OverviewCard({

  title,

  value,

  color,

  icon,

}:{

  title:string;

  value:string;

  color:string;

  icon:React.ReactNode;

}){

  return(

    <div className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-xl transition hover:shadow-2xl">

      <div className="flex items-center justify-between gap-2">

        <div className="min-w-0">

          <p className="truncate text-sm sm:text-base text-gray-500">

            {title}

          </p>

          <h2 className={`mt-1 sm:mt-3 text-2xl sm:text-4xl font-bold ${color}`}>

            {value}

          </h2>

        </div>

        <div className={`shrink-0 ${color}`}>

          {icon}

        </div>

      </div>

    </div>

  );

}