"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

import StudentSubjectCard from "@/components/student/StudentSubjectCard";
import Footer from "@/components/common/Footer";

import {
  ArrowLeft,
  Search,
  BookOpen,
  FlaskConical,
} from "lucide-react";

type Student = {
  id: string;
  department_id: string;
  course_id: string;
  semester_id: string;
};

type Subject = {
  id: string;
  subject_code: string;
  subject_name: string;
  subject_type: string;
  credits: number;
  semester: number;
  teacher_name: string;
};

export default function MySubjectsPage() {

  const [loading, setLoading] =
    useState(true);

  const [student, setStudent] =
    useState<Student | null>(null);

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    loadSubjects();

  }, []);

  async function loadSubjects() {

    try {

      const session =
        sessionStorage.getItem("user");

      if (!session) return;

      const user =
        JSON.parse(session);

      /* Student */

      const { data: studentData } =
        await supabase

          .from("students")

          .select(`
            id,
            department_id,
            course_id,
            semester_id
          `)

          .eq("id", user.id)

          .single();

      if (!studentData) return;

      setStudent(studentData);

      /* Semester */

      const { data: semesterData } =
        await supabase

          .from("semesters")

          .select("semester_no")

          .eq("id", studentData.semester_id)

          .single();

      /* Subjects */

      const { data: subjectData } =
        await supabase

          .from("subjects")

          .select("*")

          .eq(
            "department_id",
            studentData.department_id
          )

          .eq(
            "course_id",
            studentData.course_id
          )

          .eq(
            "semester_id",
            studentData.semester_id
          )

          .order("subject_name");

      if (!subjectData) {

        setSubjects([]);

        return;

      }

      /* Teacher Mapping */

      const { data: teacherSubjects } =
        await supabase

          .from("teacher_subjects")

          .select(`
            teacher_id,
            subject_id
          `);

      /* Teachers */

      const { data: teachers } =
        await supabase

          .from("teachers")

          .select(`
            id,
            teacher_name
          `);

      const finalSubjects: Subject[] =
        subjectData.map((subject: any) => {

          const mapping =
            teacherSubjects?.find(
              (item) =>
                item.subject_id ===
                subject.id
            );

          const teacher =
            teachers?.find(
              (item) =>
                item.id ===
                mapping?.teacher_id
            );

          return {

            id: subject.id,

            subject_code:
              subject.subject_code,

            subject_name:
              subject.subject_name,

            subject_type:
              subject.subject_type,

            credits:
              subject.credits,

            semester:
              semesterData?.semester_no ?? 0,

            teacher_name:
              teacher?.teacher_name ??
              "Not Assigned",

          };

        });

      setSubjects(finalSubjects);

    } finally {

      setLoading(false);

    }

  }

  const filteredSubjects =
    useMemo(() => {

      const keyword =
        search.toLowerCase();

      return subjects.filter(

        (subject) =>

          subject.subject_name
            .toLowerCase()
            .includes(keyword)

          ||

          subject.subject_code
            .toLowerCase()
            .includes(keyword)

      );

    }, [subjects, search]);

  const theoryCount = subjects.filter(
    (item) =>
      item.subject_type.toLowerCase() ===
      "theory"
  ).length;

  const practicalCount = subjects.filter(
    (item) =>
      item.subject_type.toLowerCase() ===
      "practical"
  ).length;

  if (loading) {

    return (

      <div className="flex h-[70vh] items-center justify-center">

        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"/>

      </div>

    );

  }

  return (

    <div className="space-y-4 sm:space-y-6">

      {/* Header */}

      <div className="flex items-center gap-3 sm:gap-4">

        <Link

          href="/students"

          aria-label="Back to Dashboard"

          className="flex h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-100 text-blue-700 shadow-sm transition hover:bg-blue-200 active:scale-95"

        >

          <ArrowLeft size={20} />

        </Link>

        <div className="min-w-0">

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">

            My Subjects

          </h1>

          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm md:text-base text-slate-500">

            View all subjects assigned to your semester

          </p>

        </div>

      </div>

      {/* Summary */}

      <div className="grid gap-2.5 sm:gap-5 md:grid-cols-3">

        <div className="rounded-xl sm:rounded-[24px] border border-blue-200 bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-3 sm:p-5 shadow-lg">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs sm:text-sm text-slate-500">

                Total Subjects

              </p>

              <h2 className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold text-slate-800">

                {subjects.length}

              </h2>

            </div>

            <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600">

              <BookOpen

                className="h-5 w-5 sm:h-7 sm:w-7 text-white"

              />

            </div>

          </div>

        </div>

        <div className="rounded-xl sm:rounded-[24px] border border-green-200 bg-gradient-to-br from-green-100 via-white to-emerald-100 p-3 sm:p-5 shadow-lg">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs sm:text-sm text-slate-500">

                Theory Subjects

              </p>

              <h2 className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold text-slate-800">

                {theoryCount}

              </h2>

            </div>

            <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600">

              <BookOpen

                className="h-5 w-5 sm:h-7 sm:w-7 text-white"

              />

            </div>

          </div>

        </div>

        <div className="rounded-xl sm:rounded-[24px] border border-orange-200 bg-gradient-to-br from-orange-100 via-white to-amber-100 p-3 sm:p-5 shadow-lg">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs sm:text-sm text-slate-500">

                Practical Subjects

              </p>

              <h2 className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold text-slate-800">

                {practicalCount}

              </h2>

            </div>

            <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 to-red-500">

              <FlaskConical

                className="h-5 w-5 sm:h-7 sm:w-7 text-white"

              />

            </div>

          </div>

        </div>

      </div>

      {/* Search */}

  <div className="relative w-full max-w-lg lg:max-w-none mb-7 sm:mb-7 mt-7 sm:mt-7">

  <Search
    size={18}
    className="absolute left-3.5 sm:left-4 top-3 sm:top-3.5 text-slate-400"
  />

  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search subject..."
    className="w-full rounded-xl border border-blue-200 bg-white py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 text-sm sm:text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
  />

</div>

      {/* Subject Cards */}

      {filteredSubjects.length === 0 ? (

        <div className="rounded-2xl sm:rounded-[28px] border border-blue-200 bg-white py-12 sm:py-20 text-center shadow-lg">

          <BookOpen

            size={56}

            className="mx-auto text-blue-500"

          />

          <h2 className="mt-4 sm:mt-5 text-xl sm:text-2xl font-bold text-slate-800">

            No Subjects Found

          </h2>

          <p className="mt-2 text-sm sm:text-base text-slate-500">

            No subjects match your search.

          </p>

        </div>

      ) : (

        <div className="grid gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">

          {filteredSubjects.map((subject) => (

            <StudentSubjectCard

              key={subject.id}

              id={subject.id}

              code={subject.subject_code}

              name={subject.subject_name}

              semester={subject.semester}

              credits={subject.credits}

              type={subject.subject_type}

              teacherName={subject.teacher_name}

            />

          ))}

        </div>

      )}

      {/* Footer: cancels StudentLayout's main padding so it sits edge-to-edge on mobile + desktop */}
      <div className="-mx-2 sm:-mx-4 md:-mx-6 lg:-mx-8 mt-8">
        <Footer />
      </div>

    </div>

  );

}