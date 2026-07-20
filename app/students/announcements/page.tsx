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

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [selectedSubject, setSelectedSubject] =
    useState("All");

  const [announcements, setAnnouncements] =
    useState<Announcement[]>([]);

  useEffect(() => {

    loadAnnouncements();

  }, []);

  async function loadAnnouncements() {

    try {

      const { data, error } =
        await supabase

          .from("announcements")

          .select(`
            id,
            title,
            message,
            created_at,
            subjects(subject_name)
          `)

          .order(
            "created_at",
            {
              ascending: false,
            }
          );

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

          subject_name:
            item.subjects?.subject_name ??
            "Subject",

        })) ?? [];

      setAnnouncements(formatted);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  function timeAgo(date: string) {

    const diff = Math.floor(

      (Date.now() -

        new Date(date).getTime()) /

        1000

    );

    if (diff < 60)
      return "Just now";

    if (diff < 3600)
      return `${Math.floor(diff / 60)} min ago`;

    if (diff < 86400)
      return `${Math.floor(diff / 3600)} hrs ago`;

    if (diff < 604800)
      return `${Math.floor(diff / 86400)} days ago`;

    return new Date(date).toLocaleDateString(
      "en-IN"
    );

  }

  const subjects = useMemo(() => {

    return [

      "All",

      ...new Set(

        announcements.map(

          (item) =>
            item.subject_name

        )

      ),

    ];

  }, [announcements]);

  const filteredAnnouncements =
    useMemo(() => {

      return announcements.filter((item) => {

        const matchSubject =

          selectedSubject === "All" ||

          item.subject_name ===
            selectedSubject;

        const keyword =
          search.toLowerCase();

        const matchSearch =

          item.title
            .toLowerCase()
            .includes(keyword) ||

          item.message
            .toLowerCase()
            .includes(keyword) ||

          item.subject_name
            .toLowerCase()
            .includes(keyword);

        return (
          matchSubject &&
          matchSearch
        );

      });

    }, [
      announcements,
      search,
      selectedSubject,
    ]);

  if (loading) {

    return (

      <div className="flex h-screen items-center justify-center">

        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"/>

      </div>

    );

  }

  return (

    <main className="flex min-h-screen flex-col">

      <div className="flex-1 space-y-6">
                {/* Header */}

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold text-slate-800">

              Announcements

            </h1>

            <p className="mt-1 text-slate-500">

              Latest updates from your teachers

            </p>

          </div>

          <Link
            href="/students"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl"
          >

            <ArrowLeft size={18} />

            Dashboard

          </Link>

        </div>

        {/* Search & Filter */}

        <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-6 shadow-lg">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}

            <div className="relative w-full lg:max-w-md">

              <Search
                size={18}
                className="absolute left-4 top-3.5 text-slate-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search announcements..."
                className="w-full rounded-xl border border-blue-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />

            </div>

            {/* Filter */}

            <div className="flex flex-wrap items-center gap-2">

              <div className="mr-2 flex items-center gap-2 text-slate-600">

                <Filter size={18} />

                <span className="text-sm font-medium">

                  Filter

                </span>

              </div>

              {subjects.map((subject) => (

                <button
                  key={subject}
                  onClick={() =>
                    setSelectedSubject(subject)
                  }
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedSubject === subject
                      ? "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-md"
                      : "border border-blue-200 bg-white text-slate-700 hover:bg-blue-50"
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

          <div className="rounded-3xl border border-blue-200 bg-white py-20 text-center shadow-lg">

            <Bell
              size={50}
              className="mx-auto text-blue-500"
            />

            <h2 className="mt-5 text-2xl font-bold text-slate-800">

              No Announcements Found

            </h2>

            <p className="mt-2 text-slate-500">

              There are no announcements matching your search.

            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {filteredAnnouncements.map((item) => (

              <div
                key={item.id}
                className="overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* Top Accent */}

                <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600" />

                <div className="p-6">

                  {/* Subject & Time */}

                  <div className="flex flex-wrap items-center justify-between gap-3">

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">

                      {item.subject_name}

                    </span>

                    <div className="flex items-center gap-2 text-sm text-slate-500">

                      <Clock3 size={15} />

                      {timeAgo(item.created_at)}

                    </div>

                  </div>

                  {/* Title */}

                  <h2 className="mt-5 text-2xl font-bold text-slate-800">

                    {item.title}

                  </h2>

                  {/* Message */}

                  <div className="mt-4 rounded-2xl bg-slate-50 p-5">

                    <p className="whitespace-pre-wrap leading-7 text-slate-700">

                      {item.message}

                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      <Footer />

    </main>

  );

}