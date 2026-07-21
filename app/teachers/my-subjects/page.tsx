"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

import {
  Search,
  ArrowLeft,
  BookMarked,
  GraduationCap,
  BookOpen,
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

export default function MySubjectsPage() {

  const [teacherId, setTeacherId] = useState("");

  const [subjects, setSubjects] = useState<Subject[]>([]);

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

    await loadSubjects(teacher.id);

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

      .select(`
        *,
        semesters(
          semester_no
        )
      `)

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

  async function removeSubject(subjectId: string) {

    if (!confirm("Remove this subject?")) return;

    await supabase

      .from("teacher_subjects")

      .delete()

      .eq("teacher_id", teacherId)

      .eq("subject_id", subjectId);

    loadSubjects(teacherId);

  }

  const filteredSubjects = subjects.filter((subject) => {

    const keyword = search.toLowerCase();

    return (

      subject.subject_name
        .toLowerCase()
        .includes(keyword) ||

      subject.subject_code
        .toLowerCase()
        .includes(keyword)

    );

  });

  return (

    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

     <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-5 sm:py-5 lg:px-8 lg:py-8">
                {/* Hero Section */}

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 shadow-xl p-4 sm:p-6 lg:p-8 text-white">

          <div className="absolute -right-10 -top-10 opacity-10">

            <BookMarked size={220} />

          </div>

          <div className="relative flex justify-between items-start flex-wrap gap-6">

            <div>

              <div className="flex items-center gap-3">

                <GraduationCap size={26} />

                <span className="uppercase tracking-[3px] text-sm font-semibold">

                  Teacher Portal

                </span>

              </div>

              <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl lg:text-5xl">

                My Subjects

              </h1>

              <p className="mt-2 max-w-2xl text-sm text-blue-100 sm:text-base lg:text-lg">

                View, manage and open your assigned subjects.

              </p>

            </div>

            <div className="flex w-full gap-2 sm:w-auto sm:flex-row">

             <Link href="/teachers" className="flex-1 sm:flex-none">
  <div className="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 px-3 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 cursor-pointer text-sm sm:text-base">
    <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
    Dashboard
  </div>
</Link>

<Link href="/teachers/join-subject" className="flex-1 sm:flex-none">
  <div className="w-full bg-white text-blue-700 hover:bg-slate-100 transition-all duration-300 px-3 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 shadow-lg cursor-pointer text-sm sm:text-base">
    <BookMarked size={18} className="sm:w-5 sm:h-5" />
    Join Subject
  </div>
</Link>

            </div>

          </div>

          {/* Statistics */}

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">

            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-md sm:p-5 lg:p-6">

              <p className="text-sm opacity-80">

                Joined Subjects

              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3">

                {subjects.length}

              </h2>

            </div>

            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-md sm:p-5 lg:p-6">

              <p className="text-sm opacity-80">

                Theory Subjects

              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3">

                {
                  subjects.filter(
                    (s) => s.subject_type === "Theory"
                  ).length
                }

              </h2>

            </div>

            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-md sm:p-5 lg:p-6">

              <p className="text-sm opacity-80">

                Practical Subjects

              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3">

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

        <div className="mt-5 rounded-2xl bg-white p-3 shadow-lg sm:p-5 lg:p-6">

          <div className="relative">

            <Search
              size={22}
              className="absolute left-5 top-4 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Subject Name or Subject Code..."
              className="w-full rounded-2xl border border-slate-300 py-3 pl-11 sm:pl-14 pr-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
            />

          </div>

        </div>

        {/* Subject Cards */}

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {filteredSubjects.length === 0 ? (

            <div className="col-span-full bg-white rounded-3xl shadow-xl p-6 sm:p-10 lg:p-14 text-center">

              <BookOpen
                size={70}
                className="mx-auto text-slate-400"
              />

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-6 text-slate-800">

                No Subjects Found

              </h2>

              <p className="text-gray-500 mt-3">

                No subjects match your search.

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
                mode="mySubjects"
                onRemove={() => removeSubject(subject.id)}
              />

            ))

          )}

        </div>

        {/* Dashboard Summary */}

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 lg:p-7 shadow-xl">

            <h3 className="text-lg font-semibold">

              Total Joined Subjects

            </h3>

            <h2 className="text-5xl font-extrabold mt-5">

              {subjects.length}

            </h2>

            <p className="mt-3 text-blue-100">

              Active subjects assigned to you.

            </p>

          </div>

          <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 text-white p-5 lg:p-5 lg:p-7 shadow-xl">

            <h3 className="text-lg font-semibold">

              Theory Subjects

            </h3>

            <h2 className="text-5xl font-extrabold mt-5">

              {
                subjects.filter(
                  (s) => s.subject_type === "Theory"
                ).length
              }

            </h2>

            <p className="mt-3 text-green-100">

              Includes marks & assignments.

            </p>

          </div>

          <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 text-white p-5 lg:p-7 shadow-xl">

            <h3 className="text-lg font-semibold">

              Practical Subjects

            </h3>

            <h2 className="text-5xl font-extrabold mt-5">

              {
                subjects.filter(
                  (s) => s.subject_type === "Practical"
                ).length
              }

            </h2>

            <p className="mt-3 text-orange-100">

              Includes attendance & experiments.

            </p>

          </div>

        </div>
                {/* Footer */}

        <footer className="mt-8 rounded-2xl bg-white p-5 shadow-lg lg:p-8">

          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

            <div>

              <h2 className="text-2xl font-bold text-slate-800">

                GJU Smart Connect

              </h2>

              <p className="text-gray-500 mt-2">

                Teacher Subject Management Portal

              </p>

            </div>

            <div className="grid w-full grid-cols-3 gap-3 text-center lg:flex lg:w-auto lg:gap-8">

              <div>

                <h3 className="text-3xl font-bold text-blue-600">

                  {subjects.length}

                </h3>

                <p className="text-gray-500">

                  Joined Subjects

                </p>

              </div>

              <div>

                <h3 className="text-3xl font-bold text-green-600">

                  {
                    subjects.filter(
                      (s) => s.subject_type === "Theory"
                    ).length
                  }

                </h3>

                <p className="text-gray-500">

                  Theory

                </p>

              </div>

              <div>

                <h3 className="text-3xl font-bold text-orange-500">

                  {
                    subjects.filter(
                      (s) => s.subject_type === "Practical"
                    ).length
                  }

                </h3>

                <p className="text-gray-500">

                  Practical

                </p>

              </div>

            </div>

            <div className="text-right">

              <p className="text-gray-500">

                © 2026 All Rights Reserved

              </p>

              <p className="mt-2">

                Developed By

                <span className="font-bold text-blue-600">

                  {" "}Manish Kushwaha

                </span>

              </p>

            </div>

          </div>

        </footer>

      </div>

    </main>

  );

}