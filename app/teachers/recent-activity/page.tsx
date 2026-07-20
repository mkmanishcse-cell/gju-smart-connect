"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  BookOpen,
  Bell,
  ClipboardCheck,
  BarChart3,
  FileText,
} from "lucide-react";

import {
  ActivityItem,
  getTeacherRecentActivities,
  formatActivityTime,
} from "@/lib/activity";

export default function TeacherRecentActivityPage() {

  const [activities, setActivities] =
    useState<ActivityItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadActivities();

  }, []);

  async function loadActivities() {

    try {

      setLoading(true);

      const session =
        sessionStorage.getItem("user");

      if (!session) return;

      const teacher =
        JSON.parse(session);

      const data =
        await getTeacherRecentActivities(
          teacher.id
        );

      setActivities(data);

    }

    finally {

      setLoading(false);

    }

  }

  function getIcon(type: ActivityItem["type"]) {

    switch (type) {

      case "announcement":

        return (
          <Bell
            className="text-blue-600"
            size={24}
          />
        );

      case "assignment":

        return (
          <FileText
            className="text-pink-600"
            size={24}
          />
        );

      case "attendance":

        return (
          <ClipboardCheck
            className="text-green-600"
            size={24}
          />
        );

      case "marks":

        return (
          <BarChart3
            className="text-purple-600"
            size={24}
          />
        );

      default:

        return (
          <BookOpen
            className="text-orange-500"
            size={24}
          />
        );

    }

  }

  function getBadge(type: ActivityItem["type"]) {

    switch (type) {

      case "announcement":

        return "Announcement";

      case "assignment":

        return "Assignment";

      case "attendance":

        return "Attendance";

      case "marks":

        return "Marks Updated";

      case "subject":

        return "Subject Joined";

      default:

        return "Activity";

    }

  }

  return (

    <div className="p-8">

      <div className="flex items-center gap-4">

        <Link
          href="/teachers"
          className="rounded-lg border p-2 hover:bg-slate-100"
        >

          <ArrowLeft size={20} />

        </Link>

        <div>

          <h1 className="text-4xl font-bold text-slate-800">

            Recent Activity

          </h1>

          <p className="mt-2 text-slate-500">

            Latest updates from your teaching portal.

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

            {activities.map((activity) => (

              <div
                key={activity.id}
                className="flex items-center justify-between border-b p-6 transition hover:bg-slate-50"
              >

                <div className="flex items-center gap-5">

                  <div className="rounded-xl bg-slate-100 p-3">

                    {getIcon(activity.type)}

                  </div>

                  <div>

                    <h3 className="text-lg font-bold text-slate-800">

                      {activity.title}

                    </h3>

                    <p className="mt-1 text-sm text-slate-500">

                      {activity.subtitle}

                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <p className="font-semibold text-slate-700">

                    {getBadge(activity.type)}

                  </p>

                  <p className="mt-1 text-sm text-slate-500">

                    {formatActivityTime(
                      activity.created_at
                    )}

                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}