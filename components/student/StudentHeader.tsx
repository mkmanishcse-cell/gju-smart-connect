"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

import {
  Menu,
  Search,
  Bell,
  X,
} from "lucide-react";

type Props = {
  onMenuClick: () => void;
};

type Student = {
  id: string;
  student_name: string;
};

type Announcement = {
  id: string;
  title: string;
  message: string;
  created_at: string;
  subject_name: string;
};

export default function StudentHeader({
  onMenuClick,
}: Props) {

  const [student, setStudent] =
    useState<Student | null>(null);

  const [search, setSearch] =
    useState("");

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [announcements, setAnnouncements] =
    useState<Announcement[]>([]);

  const [searchResults, setSearchResults] =
    useState<any[]>([]);

  useEffect(() => {

    const session =
      sessionStorage.getItem("user");

    if (session) {

      setStudent(JSON.parse(session));

    }

    loadAnnouncements();

  }, []);

  async function loadAnnouncements() {

 const { data: announcementsData } = await supabase
  .from("announcements")
  .select("*")
  .order("created_at", { ascending: false })
  .limit(5);

if (!announcementsData) {
  setAnnouncements([]);
  return;
}

const subjectIds = announcementsData.map(
  (item) => item.subject_id
);

const { data: subjectsData } = await supabase
  .from("subjects")
  .select("id,subject_name");

const formatted = announcementsData.map((item: any) => ({
  id: item.id,
  title: item.title,
  message: item.message,
  created_at: item.created_at,
  subject_name:
    subjectsData?.find(
      (s) => s.id === item.subject_id
    )?.subject_name ?? "Subject",
}));

setAnnouncements(formatted);

    setAnnouncements(formatted);

  }

  async function handleSearch(value: string) {

    setSearch(value);

    if (!value.trim()) {

      setSearchOpen(false);

      setSearchResults([]);

      return;

    }

    setSearchOpen(true);

    const { data } = await supabase

      .from("subjects")

      .select("id,subject_name,subject_code")

      .or(
        `subject_name.ilike.%${value}%,subject_code.ilike.%${value}%`
      );

    setSearchResults(data ?? []);

  }

  function timeAgo(date: string) {

    const diff =
      Math.floor(
        (Date.now() -
          new Date(date).getTime()) /
          1000
      );

    if (diff < 60) return "Just now";

    if (diff < 3600)
      return `${Math.floor(diff / 60)} min ago`;

    if (diff < 86400)
      return `${Math.floor(diff / 3600)} hrs ago`;

    return `${Math.floor(diff / 86400)} days ago`;

  }

  const today =

    new Date().toLocaleDateString(

      "en-IN",

      {

        weekday: "long",

        day: "numeric",

        month: "long",

        year: "numeric",

      }

    );

  return (

<header className="sticky top-0 z-30 border-b border-blue-200 bg-gradient-to-r from-blue-100 via-white to-indigo-100 backdrop-blur-xl shadow-md">

<div className="flex h-[72px] items-center justify-between px-8">

{/* LEFT */}

<div className="flex items-center gap-5">

<button

onClick={onMenuClick}

className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg transition hover:scale-105"

>

<Menu size={22}/>

</button>

<div>

<h2 className="text-[28px] font-bold tracking-tight text-slate-800">

Student Dashboard

</h2>

<p className="text-sm text-slate-600">

{today}

</p>

</div>

</div>

{/* RIGHT START */}
{/* RIGHT */}

<div className="relative flex items-center gap-4">

  {/* Search */}

  <div className="relative hidden lg:block">

    <Search
      size={18}
      className="absolute left-4 top-3.5 text-slate-500"
    />

    <input
      value={search}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search subjects..."
      className="w-[320px] rounded-xl border border-blue-200 bg-white/80 py-3 pl-11 pr-10 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
    />

    {search && (

      <button
        onClick={() => {
          setSearch("");
          setSearchOpen(false);
          setSearchResults([]);
        }}
        className="absolute right-3 top-3 text-slate-500"
      >
        <X size={18} />
      </button>

    )}

    {/* Search Results */}

    {searchOpen && (

      <div className="absolute right-0 mt-3 w-[360px] overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-2xl">

        {searchResults.length === 0 ? (

          <div className="p-5 text-center text-sm text-slate-500">
            No matching subjects found
          </div>

        ) : (

          searchResults.map((item: any) => (

            <Link
              key={item.id}
              href="/students/my-subjects"
              onClick={() => setSearchOpen(false)}
              className="block border-b border-slate-100 px-5 py-4 transition hover:bg-blue-50"
            >

              <h3 className="font-semibold text-slate-800">
                {item.subject_name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {item.subject_code}
              </p>

            </Link>

          ))

        )}

      </div>

    )}

  </div>

  {/* Notification */}

  <div className="relative">

    <button
      onClick={() =>
        setNotificationsOpen(!notificationsOpen)
      }
      className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-blue-200 bg-white shadow-md transition hover:shadow-lg"
    >

      <Bell
        size={21}
        className="text-slate-700"
      />

      {announcements.length > 0 && (

        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">

          {announcements.length}

        </span>

      )}

    </button>

    {/* Notification Dropdown */}

    {notificationsOpen && (

      <div className="absolute right-0 mt-3 w-[380px] overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-2xl">

        <div className="border-b border-slate-200 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-5 py-4">

          <h3 className="text-lg font-bold text-white">
            Latest Announcements
          </h3>

        </div>

        {announcements.length === 0 ? (

          <div className="p-6 text-center text-slate-500">
            No announcements
          </div>

        ) : (

          announcements.map((item) => (

            <Link
              key={item.id}
              href="/students/announcements"
              onClick={() =>
                setNotificationsOpen(false)
              }
              className="block border-b border-slate-100 px-5 py-4 transition hover:bg-blue-50"
            >

              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                {item.subject_name}
              </span>

              <h4 className="mt-2 font-semibold text-slate-800">
                {item.title}
              </h4>

              <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                {item.message}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {timeAgo(item.created_at)}
              </p>

            </Link>

          ))

        )}

        <Link
          href="/students/announcements"
          onClick={() => setNotificationsOpen(false)}
          className="block bg-slate-50 px-5 py-3 text-center font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          View All Announcements
        </Link>

      </div>

    )}

  </div>

</div>

</div>

</header>

);

}