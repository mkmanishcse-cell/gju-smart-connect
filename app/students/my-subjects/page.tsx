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

    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">

            My Subjects

          </h1>

          <p className="mt-1 text-slate-500">

            View all subjects assigned to your semester

          </p>

        </div>

        <Link

          href="/students"

          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-5 py-3 text-white shadow-lg transition hover:shadow-xl"

        >

          <ArrowLeft size={18} />

          Dashboard

        </Link>

      </div>

      {/* Summary */}

      <div className="grid gap-5 md:grid-cols-3">

        <div className="rounded-[24px] border border-blue-200 bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-5 shadow-lg">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">

                Total Subjects

              </p>

              <h2 className="mt-2 text-4xl font-bold text-slate-800">

                {subjects.length}

              </h2>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600">

              <BookOpen

                size={28}

                className="text-white"

              />

            </div>

          </div>

        </div>

        <div className="rounded-[24px] border border-green-200 bg-gradient-to-br from-green-100 via-white to-emerald-100 p-5 shadow-lg">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">

                Theory Subjects

              </p>

              <h2 className="mt-2 text-4xl font-bold text-slate-800">

                {theoryCount}

              </h2>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600">

              <BookOpen

                size={28}

                className="text-white"

              />

            </div>

          </div>

        </div>

        <div className="rounded-[24px] border border-orange-200 bg-gradient-to-br from-orange-100 via-white to-amber-100 p-5 shadow-lg">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">

                Practical Subjects

              </p>

              <h2 className="mt-2 text-4xl font-bold text-slate-800">

                {practicalCount}

              </h2>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500">

              <FlaskConical

                size={28}

                className="text-white"

              />

            </div>

          </div>

        </div>

      </div>

      {/* Search */}

      <div className="relative max-w-lg">

        <Search

          size={18}

          className="absolute left-4 top-3.5 text-slate-400"

        />

        <input

          value={search}

          onChange={(e) =>
            setSearch(e.target.value)
          }

          placeholder="Search subject..."

          className="w-full rounded-xl border border-blue-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"

        />

      </div>

      {/* Subject Cards */}

      {filteredSubjects.length === 0 ? (

        <div className="rounded-[28px] border border-blue-200 bg-white py-20 text-center shadow-lg">

          <BookOpen

            size={56}

            className="mx-auto text-blue-500"

          />

          <h2 className="mt-5 text-2xl font-bold text-slate-800">

            No Subjects Found

          </h2>

          <p className="mt-2 text-slate-500">

            No subjects match your search.

          </p>

        </div>

      ) : (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

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
<Footer />
    </div>

  );

}