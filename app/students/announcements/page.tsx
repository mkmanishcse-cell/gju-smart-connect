"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

import Footer from "@/components/common/Footer";

import {
  ArrowLeft,
  Bell,
  Clock3,
  Filter,
  Search,
} from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  message: string;
  created_at: string;
  subject_name: string;
};

export default function StudentAnnouncementsPage() {
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedSubject, setSelectedSubject] = useState("All");

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select(`
          id,
          title,
          message,
          created_at,
          subjects(subject_name)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      const formatted =
        data?.map((item: any) => ({
          id: item.id,
          title: item.title,
          message: item.message,
          created_at: item.created_at,
          subject_name: item.subjects?.subject_name ?? "Subject",
        })) ?? [];

      setAnnouncements(formatted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function timeAgo(date: string) {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;

    return new Date(date).toLocaleDateString("en-IN");
  }

  const subjects = useMemo(() => {
    return ["All", ...new Set(announcements.map((item) => item.subject_name))];
  }, [announcements]);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const matchSubject =
        selectedSubject === "All" || item.subject_name === selectedSubject;

      const keyword = search.toLowerCase();

      const matchSearch =
        item.title.toLowerCase().includes(keyword) ||
        item.message.toLowerCase().includes(keyword) ||
        item.subject_name.toLowerCase().includes(keyword);

      return matchSubject && matchSearch;
    });
  }, [announcements, search, selectedSubject]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <main className="flex min-h-full flex-col bg-slate-50">
      <div className="flex-1 space-y-4 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-6">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/students"
            aria-label="Back to Dashboard"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-200 bg-white text-indigo-600 shadow-sm transition hover:bg-indigo-50 hover:shadow-md sm:h-11 sm:w-11"
          >
            <ArrowLeft size={18} className="sm:hidden" />
            <ArrowLeft size={20} className="hidden sm:block" />
          </Link>

          <div>
            <h1 className="text-xl font-bold text-slate-800 sm:text-3xl">
              Announcements
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 sm:mt-1 sm:text-base">
              Latest updates from your teachers
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-4 shadow-md sm:rounded-3xl sm:p-6 sm:shadow-lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between sm:gap-5">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-3 text-slate-400 sm:left-4 sm:top-3.5 sm:size-[18px]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search announcements..."
                className="w-full rounded-xl border border-indigo-100 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:py-3 sm:pl-11 sm:text-base"
              />
            </div>

            {/* Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="mr-1 flex items-center gap-1.5 text-slate-500 sm:mr-2 sm:gap-2">
                <Filter size={16} className="sm:hidden" />
                <Filter size={18} className="hidden sm:block" />
                <span className="text-xs font-medium sm:text-sm">Filter</span>
              </div>

              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:py-2 sm:text-sm ${
                    selectedSubject === subject
                      ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-sm"
                      : "border border-indigo-100 bg-white text-slate-600 hover:bg-indigo-50"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Announcement List */}
        {filteredAnnouncements.length === 0 ? (
          <div className="rounded-2xl border border-indigo-100 bg-white py-14 text-center shadow-md sm:rounded-3xl sm:py-20 sm:shadow-lg">
            <Bell size={40} className="mx-auto text-indigo-400 sm:size-[50px]" />

            <h2 className="mt-4 text-lg font-bold text-slate-800 sm:mt-5 sm:text-2xl">
              No Announcements Found
            </h2>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              There are no announcements matching your search.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredAnnouncements.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-sky-50/60 shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:rounded-3xl sm:shadow-lg sm:hover:-translate-y-1 sm:hover:shadow-xl"
              >
                {/* Top Accent */}
                <div className="h-1 bg-gradient-to-r from-indigo-500 to-sky-500 sm:h-1.5" />

                <div className="p-4 sm:p-6">
                  {/* Subject & Time */}
                  <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                    <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 sm:px-3 sm:text-xs">
                      {item.subject_name}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 sm:gap-2 sm:text-sm">
                      <Clock3 size={13} className="sm:hidden" />
                      <Clock3 size={15} className="hidden sm:block" />
                      {timeAgo(item.created_at)}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="mt-3 text-lg font-bold text-slate-800 sm:mt-5 sm:text-2xl">
                    {item.title}
                  </h2>

                  {/* Message */}
                  <div className="mt-3 rounded-xl bg-slate-50 p-3.5 sm:mt-4 sm:rounded-2xl sm:p-5">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

     <div className="
       fixed inset-x-0 bottom-2
       sm:static sm:bottom-auto
       -mx-2 sm:-mx-4 md:-mx-6 lg:-mx-8
     ">
       <Footer />
     </div>
    </main>
  );
}