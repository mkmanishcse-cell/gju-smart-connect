"use client";

import SubjectCard from "@/components/teacher/SubjectCard";
import { useEffect, useState } from "react";
import Footer from "@/components/common/Footer";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

import {
  ArrowLeft,
  Search,
  ClipboardCheck,
  GraduationCap,
  BookMarked,
} from "lucide-react";

type Subject = {
  id: string;
  subject_code: string;
  subject_name: string;
  subject_type: string;
  credits: number;
  semester_no: number;
};

export default function AttendanceSubjectsPage() {
  const [teacherId, setTeacherId] = useState("");

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTeacher();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();

    setFilteredSubjects(
      subjects.filter(
        (subject) =>
          subject.subject_name.toLowerCase().includes(keyword) ||
          subject.subject_code.toLowerCase().includes(keyword)
      )
    );
  }, [search, subjects]);

  async function loadTeacher() {
    const session = sessionStorage.getItem("user");

    if (!session) {
      window.location.href = "/login?role=teacher";

      return;
    }

    const teacher = JSON.parse(session);

    setTeacherId(teacher.id);

    loadSubjects(teacher.id);
  }

  async function loadSubjects(id: string) {
    // Get Joined Subject IDs

    const { data: joined, error: joinedError } = await supabase
      .from("teacher_subjects")
      .select("subject_id")
      .eq("teacher_id", id);

    if (joinedError) {
      console.log(joinedError);

      return;
    }

    if (!joined || joined.length === 0) {
      setSubjects([]);

      setFilteredSubjects([]);

      return;
    }

    const subjectIds = joined.map((item) => item.subject_id);

    // Fetch Subject Details

    const { data: subjectData, error: subjectError } = await supabase
      .from("subjects")
      .select(`
        *,
        semesters(
          semester_no
        )
      `)

      .in("id", subjectIds)

      .order("subject_code");

    if (subjectError) {
      console.log(subjectError);

      return;
    }

    const list: Subject[] = (subjectData || []).map((item: any) => ({
      id: item.id,

      subject_code: item.subject_code,

      subject_name: item.subject_name,

      subject_type: item.subject_type,

      credits: item.credits,

      semester_no: item.semesters?.semester_no || 0,
    }));

    setSubjects(list);

    setFilteredSubjects(list);
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-100">
      <div className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 p-4 text-white shadow-xl sm:rounded-3xl sm:p-6 sm:shadow-2xl lg:p-8">
          <div className="absolute -right-6 -top-6 opacity-10 sm:-right-10 sm:-top-10">
            <ClipboardCheck size={120} className="sm:hidden" />
            <ClipboardCheck size={220} className="hidden sm:block" />
          </div>

          <div className="relative flex flex-col flex-wrap items-start justify-between gap-4 sm:flex-row sm:gap-6">
            <div>
              <div className="flex items-center gap-2 sm:gap-3">
                <GraduationCap size={20} className="sm:hidden" />
                <GraduationCap size={26} className="hidden sm:block" />
                <span className="text-xs font-semibold uppercase tracking-[2px] sm:tracking-[3px] sm:text-sm">
                  Teacher Portal
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-extrabold sm:mt-5 sm:text-4xl lg:text-5xl">
                Attendance
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-blue-100 sm:mt-4 sm:text-lg">
                Choose a subject to mark attendance.
              </p>
            </div>

            <div className="flex w-full gap-2 sm:w-auto sm:gap-4">
              <Link href="/teachers" className="flex-1 sm:flex-none">
                <div className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/20 px-3 py-2.5 text-sm backdrop-blur-md transition-all duration-300 hover:bg-white/30 sm:justify-start sm:gap-3 sm:rounded-2xl sm:px-6 sm:py-3 sm:text-base">
                  <ArrowLeft size={16} className="sm:hidden" />
                  <ArrowLeft size={20} className="hidden sm:block" />
                  Dashboard
                </div>
              </Link>

              <Link href="/teachers/my-subjects" className="flex-1 sm:flex-none">
                <div className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-blue-700 shadow-lg transition-all duration-300 hover:bg-slate-100 sm:justify-start sm:gap-3 sm:rounded-2xl sm:px-6 sm:py-3 sm:text-base">
                  <BookMarked size={16} className="sm:hidden" />
                  <BookMarked size={20} className="hidden sm:block" />
                  My Subjects
                </div>
              </Link>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-3 gap-2 sm:mt-10 sm:gap-6">
            <div className="rounded-xl bg-white/15 p-3 backdrop-blur-md sm:rounded-2xl sm:p-6">
              <p className="text-[11px] opacity-80 sm:text-sm">
                Total Subjects
              </p>
              <h2 className="mt-1 text-xl font-bold sm:mt-3 sm:text-5xl">
                {subjects.length}
              </h2>
            </div>

            <div className="rounded-xl bg-white/15 p-3 backdrop-blur-md sm:rounded-2xl sm:p-6">
              <p className="text-[11px] opacity-80 sm:text-sm">Theory</p>
              <h2 className="mt-1 text-xl font-bold sm:mt-3 sm:text-5xl">
                {subjects.filter((s) => s.subject_type === "Theory").length}
              </h2>
            </div>

            <div className="rounded-xl bg-white/15 p-3 backdrop-blur-md sm:rounded-2xl sm:p-6">
              <p className="text-[11px] opacity-80 sm:text-sm">Practical</p>
              <h2 className="mt-1 text-xl font-bold sm:mt-3 sm:text-5xl">
                {subjects.filter((s) => s.subject_type === "Practical").length}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Subject..."
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 sm:rounded-2xl sm:py-4 sm:pl-14 sm:text-base"
            />
          </div>
        </div>

        {/* Subject Cards */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredSubjects.length === 0 ? (
            <div className="col-span-full rounded-2xl bg-white p-8 text-center shadow sm:rounded-3xl sm:p-14 sm:shadow-xl">
              <ClipboardCheck
                size={48}
                className="mx-auto text-slate-400 sm:hidden"
              />
              <ClipboardCheck
                size={70}
                className="mx-auto hidden text-slate-400 sm:block"
              />

              <h2 className="mt-4 text-xl font-bold text-slate-800 sm:mt-6 sm:text-3xl">
                No Subjects Found
              </h2>

              <p className="mt-2 text-sm text-gray-500 sm:mt-3 sm:text-base">
                Join a subject to mark attendance.
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
                mode="attendance"
              />
            ))
          )}
        </div>

        {/* Footer */}
      </div>
      <div className="shrink-0">
        <Footer />
      </div>
    </main>
  );
}