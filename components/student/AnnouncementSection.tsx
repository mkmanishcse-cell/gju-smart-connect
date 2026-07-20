"use client";

import Link from "next/link";

import {

  Bell,

  Pin,

  Clock3,

  ArrowRight,

} from "lucide-react";

type Announcement = {

  id: string;

  title: string;

  message: string;

  created_at: string;

  subject: string;

};

type Props = {

  announcements: Announcement[];

};

function timeAgo(date: string) {

  const now = Date.now();

  const created = new Date(date).getTime();

  const diff = Math.floor((now - created) / 1000);

  if (diff < 60) return "Just now";

  if (diff < 3600)

    return `${Math.floor(diff / 60)} min ago`;

  if (diff < 86400)

    return `${Math.floor(diff / 3600)} hrs ago`;

  return `${Math.floor(diff / 86400)} days ago`;

}

export default function AnnouncementSection({

  announcements,

}: Props) {

  return (

<section className="relative overflow-hidden rounded-[28px] border border-blue-200 bg-gradient-to-br from-blue-100 via-slate-50 to-indigo-100 shadow-xl">

{/* Background Glow */}

<div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl"/>

<div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-violet-400/15 blur-3xl"/>

{/* Top Accent */}

<div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600"/>

<div className="relative">

{/* Header */}

<div className="flex items-center justify-between border-b border-blue-200 px-5 py-4">

<div>

<h2 className="text-xl font-bold text-slate-800">

Latest Announcements

</h2>

<p className="mt-1 text-sm text-slate-600">

Recent updates from teachers

</p>

</div>

<Link

href="/students/announcements"

className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:shadow-xl"

>

View All

<ArrowRight size={16}/>

</Link>

</div>

<div className="p-4">
  {
  announcements.length === 0 ? (

    <div className="rounded-2xl border border-blue-200 bg-white/70 py-12 text-center backdrop-blur-sm">

      <Bell
        size={40}
        className="mx-auto text-blue-500"
      />

      <h3 className="mt-4 text-xl font-bold text-slate-800">
        No Announcements
      </h3>

      <p className="mt-2 text-sm text-slate-600">
        Nothing has been posted yet.
      </p>

    </div>

  ) : (

    <div className="space-y-3">

      {announcements.map((item, index) => {

        const isNew =
          Date.now() -
            new Date(item.created_at).getTime() <
          86400000;

        return (

          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl border border-blue-200 bg-white/70 backdrop-blur-sm shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >

            {/* Left Accent */}

            <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-cyan-500 via-blue-600 to-indigo-600" />

            <div className="p-4 pl-6">

              {/* Top Row */}

              <div className="flex flex-wrap items-center justify-between gap-2">

                <div className="flex flex-wrap items-center gap-2">

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">

                    {item.subject}

                  </span>

                  {index === 0 && (

                    <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">

                      <Pin size={11} />

                      Pinned

                    </span>

                  )}

                  {isNew && (

                    <span className="rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold text-white">

                      NEW

                    </span>

                  )}

                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500">

                  <Clock3 size={14} />

                  {timeAgo(item.created_at)}

                </div>

              </div>

              {/* Title */}

              <h3 className="mt-3 text-lg font-bold text-slate-800">

                {item.title}

              </h3>

              {/* Message */}

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">

                {item.message}

              </p>

            </div>

          </div>

        );

      })}

    </div>

  )
}

      </div>

    </div>

  </section>

);

}