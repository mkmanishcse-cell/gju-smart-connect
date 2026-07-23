"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import Footer from "@/components/common/Footer";
import LoadingScreen from "@/components/teacher/LoadingScreen";
import { supabase } from "@/lib/supabase";

import {
  Search,
  ArrowLeft,
  Bell,
  GraduationCap,
  BookMarked,
} from "lucide-react";

import SubjectCard from "@/components/teacher/SubjectCard";

type Subject = {
  id: string;
  subject_code: string;
  subject_name: string;
  subject_type: string;
  credits: number;
  semester_no: number;
};

export default function AnnouncementsPage() {
  const [loading, setLoading] = useState(true);

  const [teacherId, setTeacherId] = useState("");

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTeacher();
  }, []);

  async function loadTeacher() {
    try {
      setLoading(true);

      const session = sessionStorage.getItem("user");

      if (!session) {
        window.location.href = "/login?role=teacher";
        return;
      }

      const teacher = JSON.parse(session);

      setTeacherId(teacher.id);

      await loadSubjects(teacher.id);
    } finally {
      setLoading(false);
    }
  }

  async function loadSubjects(id: string) {
    const { data: joined } = await supabase
      .from("teacher_subjects")
      .select("subject_id")
      .eq("teacher_id", id);

    if (!joined || joined.length === 0) {
      setSubjects([]);
      return;
    }

    const ids = joined.map((item) => item.subject_id);

    const { data, error } = await supabase
      .from("subjects")
      .select(
        `
        *,
        semesters(
          semester_no
        )
      `
      )
      .in("id", ids)
      .order("subject_code");

    if (error) {
      console.log(error);
      return;
    }

    const list: Subject[] = (data || []).map((item: any) => ({
      id: item.id,
      subject_code: item.subject_code,
      subject_name: item.subject_name,
      subject_type: item.subject_type,
      credits: item.credits,
      semester_no: item.semesters?.semester_no || 0,
    }));

    setSubjects(list);
  }

  const filteredSubjects = subjects.filter((subject) => {
    const keyword = search.toLowerCase();

    return (
      subject.subject_name.toLowerCase().includes(keyword) ||
      subject.subject_code.toLowerCase().includes(keyword)
    );
  });

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">

        {/* Hero */}

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 p-4 text-white shadow-xl sm:rounded-3xl sm:p-6 sm:shadow-2xl lg:p-8">

          <div className="absolute -right-6 -top-6 opacity-10 sm:-right-10 sm:-top-10">
            <Bell size={120} className="sm:hidden" />
            <Bell size={220} className="hidden sm:block" />
          </div>

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">

            <div>

              <div className="flex items-center gap-2 sm:gap-3">
                <GraduationCap size={20} className="sm:hidden" />
                <GraduationCap size={26} className="hidden sm:block" />

                <span className="text-xs font-semibold uppercase tracking-[2px] sm:text-sm sm:tracking-[3px]">
                  Teacher Portal
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-extrabold sm:mt-5 sm:text-4xl lg:text-5xl">
                Announcement Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-purple-100 sm:mt-4 sm:text-lg">
                Select a subject to publish announcements for students.
              </p>

            </div>

            <div className="flex w-full gap-2 sm:w-auto sm:gap-4">

              <Link href="/teachers" className="flex-1 sm:flex-none">

                <div className="flex items-center justify-center gap-2 rounded-xl bg-white/20 px-3 py-2.5 text-sm backdrop-blur-md transition-all duration-300 hover:bg-white/30 sm:gap-3 sm:rounded-2xl sm:px-6 sm:py-3 sm:text-base">

                  <ArrowLeft size={16} className="sm:hidden" />
                  <ArrowLeft size={20} className="hidden sm:block" />

                  Dashboard

                </div>

              </Link>

              <Link
                href="/teachers/my-subjects"
                className="flex-1 sm:flex-none"
              >

                <div className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-purple-700 shadow-lg transition-all duration-300 hover:bg-slate-100 sm:gap-3 sm:rounded-2xl sm:px-6 sm:py-3 sm:text-base">

                  <BookMarked size={16} className="sm:hidden" />
                  <BookMarked size={20} className="hidden sm:block" />

                  My Subjects

                </div>

              </Link>

            </div>

          </div>

          <div className="hidden sm:mt-10 sm:grid sm:grid-cols-3 sm:gap-6">

            <div className="rounded-2xl bg-white/15 p-6 backdrop-blur-md">
              <p className="text-sm opacity-80">
                Joined Subjects
              </p>

              <h2 className="mt-3 text-5xl font-bold">
                {subjects.length}
              </h2>
            </div>

            <div className="rounded-2xl bg-white/15 p-6 backdrop-blur-md">
              <p className="text-sm opacity-80">
                Theory Subjects
              </p>

              <h2 className="mt-3 text-5xl font-bold">
                {
                  subjects.filter(
                    (s) => s.subject_type === "Theory"
                  ).length
                }
              </h2>
            </div>

            <div className="rounded-2xl bg-white/15 p-6 backdrop-blur-md">
              <p className="text-sm opacity-80">
                Practical Subjects
              </p>

              <h2 className="mt-3 text-5xl font-bold">
                {
                  subjects.filter(
                    (s) => s.subject_type === "Practical"
                  ).length
                }
              </h2>
            </div>

          </div>

        </div>

        {/* Search */}

        <div className="mt-5 rounded-2xl bg-white p-3 shadow sm:mt-8 sm:rounded-3xl sm:p-6 sm:shadow-xl">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:left-5 sm:top-4 sm:h-[22px] sm:w-[22px] sm:translate-y-0"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Subject by Name or Subject Code..."
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-purple-600 focus:ring-4 focus:ring-purple-100 sm:rounded-2xl sm:py-4 sm:pl-14 sm:text-base"
            />
          </div>
        </div>
                {/* Subject Cards */}

        <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">

          {filteredSubjects.length === 0 ? (

            <div className="col-span-full rounded-2xl bg-white p-8 text-center shadow sm:rounded-3xl sm:p-14 sm:shadow-xl">

              <Bell
                size={48}
                className="mx-auto text-slate-400 sm:hidden"
              />

              <Bell
                size={70}
                className="mx-auto hidden text-slate-400 sm:block"
              />

              <h2 className="mt-4 text-xl font-bold text-slate-800 sm:mt-6 sm:text-3xl">
                No Subjects Found
              </h2>

              <p className="mt-2 text-sm text-gray-500 sm:mt-3 sm:text-base">
                No subject matches your search.
              </p>

            </div>

          ) : (

            filteredSubjects.map((subject) => (

              <SubjectCard
                key={subject.id}
                id={subject.id}
                code={subject.subject_code}
                name={subject.subject_name}
                semester={subject.semester_no}
                credits={subject.credits}
                type={subject.subject_type}
                mode="announcements"
              />

            ))

          )}

        </div>

        {/* Dashboard Summary */}

        <div className="hidden sm:mt-12 sm:grid sm:grid-cols-3 sm:gap-6">

          <div className="rounded-3xl bg-gradient-to-r from-purple-700 to-fuchsia-600 p-7 text-white shadow-xl">

            <h3 className="text-lg font-semibold">
              Total Subjects
            </h3>

            <h2 className="mt-5 text-5xl font-extrabold">
              {subjects.length}
            </h2>

            <p className="mt-3 text-purple-100">
              Subjects available for announcements.
            </p>

          </div>

          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-7 text-white shadow-xl">

            <h3 className="text-lg font-semibold">
              Theory Subjects
            </h3>

            <h2 className="mt-5 text-5xl font-extrabold">

              {
                subjects.filter(
                  (s) => s.subject_type === "Theory"
                ).length
              }

            </h2>

            <p className="mt-3 text-blue-100">
              Theory announcements enabled.
            </p>

          </div>

          <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 p-7 text-white shadow-xl">

            <h3 className="text-lg font-semibold">
              Practical Subjects
            </h3>

            <h2 className="mt-5 text-5xl font-extrabold">

              {
                subjects.filter(
                  (s) => s.subject_type === "Practical"
                ).length
              }

            </h2>

            <p className="mt-3 text-orange-100">
              Practical announcements enabled.
            </p>

          </div>

        </div>
                {/* Bottom Spacer */}
        <div className="h-4 sm:h-8" />

      </div>

      {/* Footer */}
      <Footer />

    </main>

  );

}