"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Footer from "@/components/common/Footer";
import {
  Search,
  ArrowLeft,
  BookMarked,
  GraduationCap,
} from "lucide-react";

import SubjectCard from "@/components/teacher/SubjectCard";

type Subject = {
  id: string;
  subject_code: string;
  subject_name: string;
  credits: number;
  subject_type: string;
  semesters?: {
    semester_no: number;
  };
};

export default function JoinSubjectPage() {
  const [teacherId, setTeacherId] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [joinedSubjects, setJoinedSubjects] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTeacher();
  }, []);

  async function loadTeacher() {
    const session = sessionStorage.getItem("user");

    if (!session) {
      window.location.href = "/login?role=teacher";
      return;
    }

    const teacher = JSON.parse(session);

    setTeacherId(teacher.id);

    await loadSubjects(teacher.department_id, teacher.course_id);

    await loadJoinedSubjects(teacher.id);
  }

  async function loadSubjects(departmentId: string, courseId?: string) {
    let query = supabase
      .from("subjects")
      .select(`
        *,
        semesters(
          semester_no
        )
      `)
      .eq("department_id", departmentId);

    if (courseId) {
      query = query.eq("course_id", courseId);
    }

    const { data, error } = await query.order("subject_code");

    if (error) {
      console.log(error);
      return;
    }

    setSubjects(data || []);
  }

  async function loadJoinedSubjects(id: string) {
    const { data, error } = await supabase
      .from("teacher_subjects")
      .select("subject_id")
      .eq("teacher_id", id);

    if (error) {
      console.log(error);
      return;
    }

    setJoinedSubjects((data || []).map((item: any) => item.subject_id));
  }

  async function joinSubject(subjectId: string) {
    if (joinedSubjects.includes(subjectId)) {
      alert("Subject already joined.");
      return;
    }

    const { error } = await supabase.from("teacher_subjects").insert({
      teacher_id: teacherId,
      subject_id: subjectId,
    });

    if (error) {
      alert(error.message);
      return;
    }

    await loadJoinedSubjects(teacherId);

    alert("Subject Joined Successfully.");
  }

  const filteredSubjects = subjects.filter((subject) => {
    const keyword = search.toLowerCase();

    return (
      subject.subject_name.toLowerCase().includes(keyword) ||
      subject.subject_code.toLowerCase().includes(keyword)
    );
  });

  return (
    <main className="flex min-h-screen flex-col bg-slate-100">
      <div className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 p-4 text-white shadow-xl sm:rounded-3xl sm:p-6 sm:shadow-2xl lg:p-8">
          <div className="absolute -right-6 -top-6 opacity-10 sm:-right-10 sm:-top-10">
            <BookMarked size={120} className="sm:hidden" />
            <BookMarked size={220} className="hidden sm:block" />
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
                Join Subjects
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-blue-100 sm:mt-4 sm:text-lg">
                Select the subjects you want to teach and start managing
                attendance, marks, assignments and announcements.
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
              <p className="text-[11px] opacity-80 sm:text-sm">
                Joined Subjects
              </p>
              <h2 className="mt-1 text-xl font-bold sm:mt-3 sm:text-5xl">
                {joinedSubjects.length}
              </h2>
            </div>

            <div className="rounded-xl bg-white/15 p-3 backdrop-blur-md sm:rounded-2xl sm:p-6">
              <p className="text-[11px] opacity-80 sm:text-sm">Remaining</p>
              <h2 className="mt-1 text-xl font-bold sm:mt-3 sm:text-5xl">
                {subjects.length - joinedSubjects.length}
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
              placeholder="Search by Subject Name or Subject Code..."
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 sm:rounded-2xl sm:py-4 sm:pl-14 sm:text-base"
            />
          </div>
        </div>

        {/* Subject Cards */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredSubjects.length === 0 ? (
            <div className="col-span-full rounded-2xl bg-white p-8 text-center shadow sm:rounded-3xl sm:p-14 sm:shadow-xl">
              <BookMarked
                size={48}
                className="mx-auto text-slate-400 sm:hidden"
              />
              <BookMarked
                size={70}
                className="mx-auto hidden text-slate-400 sm:block"
              />

              <h2 className="mt-4 text-xl font-bold text-slate-800 sm:mt-6 sm:text-3xl">
                No Subjects Found
              </h2>

              <p className="mt-2 text-sm text-gray-500 sm:mt-3 sm:text-base">
                No subjects match your search or no subjects are available.
              </p>
            </div>
          ) : (
            filteredSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                code={subject.subject_code}
                name={subject.subject_name}
                semester={subject.semesters?.semester_no || 0}
                credits={subject.credits}
                type={subject.subject_type}
                joined={joinedSubjects.includes(subject.id)}
                onJoin={() => joinSubject(subject.id)}
              />
            ))
          )}
        </div>
      </div>
      <div className="shrink-0">
        <Footer />
      </div>
    </main>
  );
}