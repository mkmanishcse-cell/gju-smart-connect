"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import Link from "next/link";

import { supabase } from "@/lib/supabase";
import Footer from "@/components/common/Footer";

import {

  ArrowLeft,

  ClipboardCheck,

  Bell,

  FileText,

  BarChart3,

  BookOpen,

  Sparkles,

  Award,

} from "lucide-react";

type Subject = {

  id: string;

  subject_code: string;

  subject_name: string;

  subject_type: string;

  credits: number;

  department_id: string;

  course_id: string;

  semester_id: string;

  departments?: {

    department_name: string;

  };

  courses?: {

    course_name: string;

  };

  semesters?: {

    semester_no: number;

  };

};

export default function StudentSubjectDashboard() {

  const router = useRouter();

  const params = useParams();

  const [subject, setSubject] =

    useState<Subject | null>(null);

  const [attendancePercent, setAttendancePercent] =

    useState(0);

  const [announcementCount, setAnnouncementCount] =

    useState(0);

  const [assignmentCount, setAssignmentCount] =

    useState(0);

  const [averageMarks, setAverageMarks] =

    useState(0);

  useEffect(() => {

    loadSubject();

  }, []);

  useEffect(() => {

    if (subject) {

      loadDashboard();

    }

  }, [subject]);

  async function loadSubject() {

    const { data, error } = await supabase

      .from("subjects")

      .select(`
        *,
        departments(
          department_name
        ),
        courses(
          course_name
        ),
        semesters(
          semester_no
        )
      `)

      .eq("id", params.id)

      .single();

    if (error) {

      console.log(error);

      return;

    }

    setSubject(data);

  }

  async function loadDashboard() {

    if (!subject) return;

    /* Attendance */

    const { data: attendance } =

      await supabase

        .from("attendance")

        .select("status")

        .eq("subject_id", subject.id);

    if (

      attendance &&

      attendance.length > 0

    ) {

      const present = attendance.filter(

        (item: any) =>

          item.status === "P"

      ).length;

      setAttendancePercent(

        Math.round(

          (present /

            attendance.length) *

            100

        )

      );

    }

    /* Marks */

    const { data: marks } =

      await supabase

        .from("marks")

        .select("total_marks")

        .eq("subject_id", subject.id);

    if (marks && marks.length > 0) {

      const total = marks.reduce(

        (sum: number, item: any) =>

          sum +

          Number(

            item.total_marks ?? 0

          ),

        0

      );

      setAverageMarks(

        Number(

          (

            total /

            marks.length

          ).toFixed(2)

        )

      );

    }

    /* Assignments */

    const { count: assignments } =

      await supabase

        .from("assignments")

        .select("*", {

          count: "exact",

          head: true,

        })

        .eq("subject_id", subject.id);

    setAssignmentCount(

      assignments ?? 0

    );

    /* Announcements */

    const { count: announcements } =

      await supabase

        .from("announcements")

        .select("*", {

          count: "exact",

          head: true,

        })

        .eq("subject_id", subject.id);

    setAnnouncementCount(

      announcements ?? 0

    );

  }

  if (!subject) {

    return (

      <div className="flex min-h-screen items-center justify-center text-xl font-semibold">

        Loading Subject...

      </div>

    );

  }

  return (

    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      <div className="mx-auto max-w-7xl px-8 py-8">
                {/* ================= HERO ================= */}

        <div
          className={`relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl ${
            subject.subject_type === "Theory"
              ? "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700"
              : "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"
          }`}
        >

          {/* Background Icon */}

          <div className="absolute -right-12 -top-12 opacity-10">

            {subject.subject_type === "Theory" ? (

              <BookOpen size={240} />

            ) : (

              <FileText size={240} />

            )}

          </div>

          <div className="relative flex flex-wrap items-start justify-between gap-6">

            <div>

              <div className="flex items-center gap-3">

                <Sparkles size={22} />

                <span className="text-sm font-semibold uppercase tracking-[3px]">

                  Student Dashboard

                </span>

              </div>

              <h1 className="mt-5 text-5xl font-extrabold">

                {subject.subject_name}

              </h1>

              <p className="mt-4 text-lg text-blue-100">

                {subject.subject_code}

                {" • "}

                {subject.departments?.department_name}

                {" • "}

                {subject.courses?.course_name}

              </p>

              <p className="mt-2 text-base text-blue-100">

                Semester {subject.semesters?.semester_no}

              </p>

            </div>

            <Link

              href="/students/my-subjects"

              className="flex items-center gap-2 rounded-2xl bg-white/20 px-6 py-3 font-semibold backdrop-blur-md transition-all duration-300 hover:bg-white/30"

            >

              <ArrowLeft size={20} />

              My Subjects

            </Link>

          </div>

          {/* Hero Stats */}

          <div className="mt-10 grid gap-5 md:grid-cols-4">

            <div className="rounded-2xl bg-white/15 p-5 backdrop-blur-md">

              <p className="text-sm text-blue-100">

                Subject Type

              </p>

              <h3 className="mt-2 text-2xl font-bold">

                {subject.subject_type}

              </h3>

            </div>

            <div className="rounded-2xl bg-white/15 p-5 backdrop-blur-md">

              <p className="text-sm text-blue-100">

                Credits

              </p>

              <h3 className="mt-2 text-2xl font-bold">

                {subject.credits}

              </h3>

            </div>

            <div className="rounded-2xl bg-white/15 p-5 backdrop-blur-md">

              <p className="text-sm text-blue-100">

                Attendance

              </p>

              <h3 className="mt-2 text-2xl font-bold">

                {attendancePercent}%

              </h3>

            </div>

            <div className="rounded-2xl bg-white/15 p-5 backdrop-blur-md">

              <p className="text-sm text-blue-100">

                Average Marks

              </p>

              <h3 className="mt-2 text-2xl font-bold">

                {averageMarks}

              </h3>

            </div>

          </div>

        </div>

        {/* ================= FEATURE CARDS ================= */}

        <div
          className={`mt-10 grid gap-8 ${
            subject.subject_type === "Theory"
              ? "xl:grid-cols-4 md:grid-cols-2"
              : "xl:grid-cols-2 md:grid-cols-2"
          }`}
        >

          {/* Attendance */}

          <div
            onClick={() =>
              router.push(`/students/attendance/${subject.id}`)
            }
            className="group cursor-pointer rounded-3xl bg-gradient-to-br from-green-600 via-emerald-500 to-lime-400 p-7 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >

            <ClipboardCheck
              size={50}
              className="transition-transform duration-300 group-hover:rotate-12"
            />

            <h2 className="mt-6 text-2xl font-bold">

              Attendance

            </h2>

            <p className="mt-3 text-green-100">

              View attendance records.

            </p>

          </div>

          {/* Theory Only */}

          {subject.subject_type === "Theory" && (

            <>
                        {/* Marks */}

            <div
              onClick={() =>
                router.push(`/students/marks/${subject.id}`)
              }
              className="group cursor-pointer rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-7 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >

              <BarChart3
                size={50}
                className="transition-transform duration-300 group-hover:rotate-12"
              />

              <h2 className="mt-6 text-2xl font-bold">

                Marks

              </h2>

              <p className="mt-3 text-blue-100">

                View internal marks.

              </p>

            </div>

            {/* Assignments */}

            <div
              onClick={() =>
                router.push(`/students/assignments/${subject.id}`)
              }
              className="group cursor-pointer rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 p-7 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >

              <FileText
                size={50}
                className="transition-transform duration-300 group-hover:rotate-12"
              />

              <h2 className="mt-6 text-2xl font-bold">

                Assignments

              </h2>

              <p className="mt-3 text-orange-100">

                View assignments.

              </p>

            </div>

            </>

          )}

          {/* Announcements */}

          <div
            onClick={() =>
              router.push(`/students/announcements/${subject.id}`)
            }
            className="group cursor-pointer rounded-3xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500 p-7 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >

            <Bell
              size={50}
              className="transition-transform duration-300 group-hover:rotate-12"
            />

            <h2 className="mt-6 text-2xl font-bold">

              Announcements

            </h2>

            <p className="mt-3 text-purple-100">

              View latest updates.

            </p>

          </div>

        </div>

        {/* ================= QUICK OVERVIEW ================= */}

        <div
          className={`grid gap-6 mt-10 ${
            subject.subject_type === "Theory"
              ? "lg:grid-cols-3"
              : "lg:grid-cols-2"
          }`}
        >

          <div className="rounded-3xl bg-white p-6 shadow-xl">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500">

                  Attendance

                </p>

                <h2 className="mt-3 text-4xl font-bold text-green-600">

                  {attendancePercent}%

                </h2>

              </div>

              <ClipboardCheck
                size={42}
                className="text-green-600"
              />

            </div>

          </div>

          {subject.subject_type === "Theory" && (

            <div className="rounded-3xl bg-white p-6 shadow-xl">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-slate-500">

                    Average Marks

                  </p>

                  <h2 className="mt-3 text-4xl font-bold text-blue-600">

                    {averageMarks}

                  </h2>

                </div>

                <BarChart3
                  size={42}
                  className="text-blue-600"
                />

              </div>

            </div>

          )}

          <div className="rounded-3xl bg-white p-6 shadow-xl">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500">

                  Announcements

                </p>

                <h2 className="mt-3 text-4xl font-bold text-purple-600">

                  {announcementCount}

                </h2>

              </div>

              <Award
                size={42}
                className="text-purple-600"
              />

            </div>

          </div>

        </div>
        {/* ================= SUBJECT INFORMATION ================= */}

<div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">

  <h2 className="text-2xl font-bold">

    Subject Information

  </h2>

  <div className="mt-6 grid md:grid-cols-2 gap-5">

    <div>
      <p className="text-gray-500">Subject Code</p>
      <h3 className="font-semibold">{subject.subject_code}</h3>
    </div>

    <div>
      <p className="text-gray-500">Subject Type</p>
      <h3 className="font-semibold">{subject.subject_type}</h3>
    </div>

    <div>
      <p className="text-gray-500">Department</p>
      <h3 className="font-semibold">
        {subject.departments?.department_name}
      </h3>
    </div>

    <div>
      <p className="text-gray-500">Course</p>
      <h3 className="font-semibold">
        {subject.courses?.course_name}
      </h3>
    </div>

    <div>
      <p className="text-gray-500">Semester</p>
      <h3 className="font-semibold">
        {subject.semesters?.semester_no}
      </h3>
    </div>

    <div>
      <p className="text-gray-500">Credits</p>
      <h3 className="font-semibold">{subject.credits}</h3>
    </div>

  </div>

</div>


 <Footer />

      </div>
    </main>
  );
}