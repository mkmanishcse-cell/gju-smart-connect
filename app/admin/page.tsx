"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import Footer from "@/components/common/Footer";
import StatCard from "@/components/admin/StatCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getDashboardCounts } from "@/lib/admin";
import { getTopActivities } from "@/lib/activity";

import {
  Search,
  GraduationCap,
  Users,
  BookOpen,
  Building2,
  ClipboardPlus,
  Upload,
  UserPlus,
  Library,
} from "lucide-react";

export default function AdminDashboard() {

  const [search, setSearch] = useState("");

  const [activities, setActivities] = useState<any[]>([]);

  const [counts, setCounts] = useState({

    students: 0,

    teachers: 0,

    subjects: 0,

    departments: 0,

  });

  useEffect(() => {

    loadDashboard();

    loadActivities();

  }, []);

  async function loadDashboard() {

    const data = await getDashboardCounts();

    setCounts(data);

  }

  async function loadActivities() {

    const data = await getTopActivities();

    setActivities(data);

  }

  function getIcon(type: string) {

    switch (type) {

      case "student":

        return (
          <GraduationCap
            size={22}
            className="text-blue-600"
          />
        );

      case "teacher":

        return (
          <Users
            size={22}
            className="text-green-600"
          />
        );

      case "subject":

        return (
          <BookOpen
            size={22}
            className="text-orange-500"
          />
        );

      case "department":

        return (
          <Building2
            size={22}
            className="text-purple-600"
          />
        );

      default:

        return (
          <Library
            size={22}
            className="text-pink-600"
          />
        );

    }

  }

  const quickActions = useMemo(() => [

    {

      title: "Add Student",

      href: "/admin/students",

      color: "bg-blue-500 hover:bg-blue-600",

      icon: <UserPlus size={24} />,

    },

    {

      title: "Add Teacher",

      href: "/admin/teachers",

      color: "bg-green-500 hover:bg-green-600",

      icon: <Users size={24} />,

    },

    {

      title: "Add Subject",

      href: "/admin/subjects",

      color: "bg-orange-500 hover:bg-orange-600",

      icon: <ClipboardPlus size={24} />,

    },

    {

      title: "Upload Excel",

      href: "/admin/upload",

      color: "bg-purple-500 hover:bg-purple-600",

      icon: <Upload size={24} />,

    },

    {

      title: "Promote Students",

      href: "/admin/promote-students",

      color: "bg-pink-500 hover:bg-pink-600",

      icon: <GraduationCap size={24} />,

    },

  ], []);

  const filteredActions = quickActions.filter((item) =>

    item.title

      .toLowerCase()

      .includes(search.toLowerCase())

  );
  return (
<ProtectedRoute role="admin">
<div className="p-8">

{/* Header */}

<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

<div>

<h1 className="text-4xl font-bold text-slate-800">

Welcome Admin

</h1>

<p className="mt-2 text-slate-500">

Manage the complete university from one dashboard.

</p>

</div>

<div className="relative w-full lg:w-[380px]">

<Search
size={20}
className="absolute left-4 top-3.5 text-slate-400"
/>

<input

value={search}

onChange={(e)=>setSearch(e.target.value)}

placeholder="Search Quick Actions..."

className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"

/>

</div>

</div>

{/* Quick Actions */}

<div className="mt-10">

<h2 className="text-2xl font-bold text-slate-800">

Quick Actions

</h2>

<div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

{filteredActions.map((item)=>(

<Link
key={item.title}
href={item.href}
>

<div

className={`rounded-2xl ${item.color} p-5 text-white shadow-lg transition hover:scale-105`}

>

<div className="flex items-center justify-between">

<div>

<p className="text-sm opacity-90">

Quick Action

</p>

<h3 className="mt-2 text-lg font-bold">

{item.title}

</h3>

</div>

<div>

{item.icon}

</div>

</div>

</div>

</Link>

))}

</div>

</div>

{/* Statistics */}

<div className="mt-10">

<h2 className="text-2xl font-bold text-slate-800">

Statistics

</h2>

<div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

<Link href="/admin/students/view">

<StatCard

title="Students"

value={counts.students}

color="bg-blue-600"

icon={<GraduationCap size={30}/>}

/>

</Link>

<Link href="/admin/teachers/view">

<StatCard

title="Teachers"

value={counts.teachers}

color="bg-green-600"

icon={<Users size={30}/>}

/>

</Link>

<Link href="/admin/subjects/view">

<StatCard

title="Subjects"

value={counts.subjects}

color="bg-orange-500"

icon={<BookOpen size={30}/>}

/>

</Link>

<Link href="/admin/departments/view">

<StatCard

title="Departments"

value={counts.departments}

color="bg-purple-600"

icon={<Building2 size={30}/>}

/>

</Link>

</div>

</div>
{/* Bottom Section */}

<div className="grid xl:grid-cols-3 gap-6 mt-10">

  {/* Recent Activity */}

  <div className="xl:col-span-2 rounded-2xl bg-white p-6 shadow-lg">

    <div className="flex items-center justify-between">

      <div>

        <h2 className="text-2xl font-bold">

          Recent Activity

        </h2>

        <p className="mt-1 text-gray-500">

          Latest updates from the system

        </p>

      </div>

      <Link
        href="/admin/recent-activity"
        className="font-semibold text-blue-600 hover:underline"
      >
        View All
      </Link>

    </div>

    <div className="mt-8 space-y-5">

      {activities.length === 0 ? (

        <div className="text-center py-10 text-slate-500">

          No Recent Activity

        </div>

      ) : (

        activities.map((item)=>(

          <div

            key={item.id}

            className="flex items-center justify-between rounded-xl border-l-4 border-blue-600 bg-slate-50 p-4"

          >

            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-white p-3 shadow">

                {getIcon(item.type)}

              </div>

              <div>

                <h3 className="font-semibold">

                  {item.title}

                </h3>

                <p className="text-sm text-gray-600">

                  {item.subtitle}

                </p>

              </div>

            </div>

            <span className="text-sm text-gray-500">

              {new Date(item.created_at).toLocaleDateString()}

            </span>

          </div>

        ))

      )}

    </div>

  </div>

  {/* Quick Overview */}

  <div className="rounded-2xl bg-white p-6 shadow-lg">

    <h2 className="text-2xl font-bold">

      Quick Overview

    </h2>

    <div className="mt-8 space-y-6">

      <div className="flex justify-between">

        <span>Total Students</span>

        <span className="font-bold text-blue-600">

          {counts.students}

        </span>

      </div>

      <div className="flex justify-between">

        <span>Total Teachers</span>

        <span className="font-bold text-green-600">

          {counts.teachers}

        </span>

      </div>

      <div className="flex justify-between">

        <span>Total Subjects</span>

        <span className="font-bold text-orange-500">

          {counts.subjects}

        </span>

      </div>

      <div className="flex justify-between">

        <span>Total Departments</span>

        <span className="font-bold text-purple-600">

          {counts.departments}

        </span>

      </div>

    </div>

  </div>

</div>

{/* Management */}

<div className="mt-10 grid gap-6 xl:grid-cols-2">

<Link
href="/admin/students"
className="rounded-2xl bg-white p-6 shadow-lg transition hover:shadow-xl"
>

<div className="flex items-center justify-between">

<div>

<h2 className="text-2xl font-bold">

Student Management

</h2>

<p className="mt-2 text-gray-500">

Add, Edit & Delete Students

</p>

</div>

<GraduationCap
size={42}
className="text-blue-600"
/>

</div>

</Link>

<Link
href="/admin/teachers"
className="rounded-2xl bg-white p-6 shadow-lg transition hover:shadow-xl"
>

<div className="flex items-center justify-between">

<div>

<h2 className="text-2xl font-bold">

Teacher Management

</h2>

<p className="mt-2 text-gray-500">

Add, Edit & Delete Teachers

</p>

</div>

<Users
size={42}
className="text-green-600"
/>

</div>

</Link>

</div>

{/* Footer */}

<Footer />

</div>
</ProtectedRoute>
);

}