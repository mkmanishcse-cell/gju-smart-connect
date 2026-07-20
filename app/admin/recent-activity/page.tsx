"use client";
import Footer from "@/components/common/Footer";
import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  GraduationCap,
  Users,
  BookOpen,
  Building2,
  Library,
} from "lucide-react";

import {
  ActivityItem,
  getRecentActivities,
} from "@/lib/activity";

export default function RecentActivityPage() {

  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadActivities();

  }, []);

  async function loadActivities() {

    setLoading(true);

    const data = await getRecentActivities();

    setActivities(data);

    setLoading(false);

  }

  function getIcon(type: string) {

    switch (type) {

      case "student":

        return (
          <GraduationCap
            className="text-blue-600"
            size={24}
          />
        );

      case "teacher":

        return (
          <Users
            className="text-green-600"
            size={24}
          />
        );

      case "subject":

        return (
          <BookOpen
            className="text-orange-500"
            size={24}
          />
        );

      case "department":

        return (
          <Building2
            className="text-purple-600"
            size={24}
          />
        );

      default:

        return (
          <Library
            className="text-pink-600"
            size={24}
          />
        );

    }

  }

  function getBadge(type: string) {

    switch (type) {

      case "student":

        return "Student Added";

      case "teacher":

        return "Teacher Added";

      case "subject":

        return "Subject Added";

      case "department":

        return "Department Added";

      default:

        return "Course Added";

    }

  }

  return (

<div className="p-8">

<div className="flex items-center gap-4">

<Link

href="/admin"

className="rounded-lg border p-2 hover:bg-slate-100"

>

<ArrowLeft size={20}/>

</Link>

<div>

<h1 className="text-4xl font-bold text-slate-800">

Recent Activity

</h1>

<p className="mt-2 text-slate-500">

Latest updates across the system.

</p>

</div>

</div>

<div className="mt-10 rounded-2xl bg-white shadow-lg">

{loading ? (

<div className="p-10 text-center">

Loading...

</div>

) : activities.length === 0 ? (

<div className="p-10 text-center text-slate-500">

No recent activity found.

</div>

) : (

<div>

{activities.map((activity)=>(

<div

key={activity.id}

className="flex items-center justify-between border-b p-6 hover:bg-slate-50"

>

<div className="flex items-center gap-5">

<div className="rounded-xl bg-slate-100 p-3">

{getIcon(activity.type)}

</div>

<div>

<h3 className="text-lg font-bold">

{activity.title}

</h3>

<p className="text-sm text-slate-500">

{activity.subtitle}

</p>

</div>

</div>

<div className="text-right">

<p className="font-semibold">

{getBadge(activity.type)}

</p>

<p className="mt-1 text-sm text-slate-500">

{new Date(activity.created_at).toLocaleString()}

</p>

</div>

</div>

))}

</div>

)}

</div>
<Footer />
</div>

);

}