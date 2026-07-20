"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

import {
  ArrowLeft,
  ClipboardCheck,
  Bell,
  FileText,
  BarChart3,
  BookOpen,
  Sparkles,
  Users,
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

export default function SubjectDashboard() {

  const router = useRouter();

  const params = useParams();

  const [subject, setSubject] =
    useState<Subject | null>(null);

  const [studentCount, setStudentCount] =
    useState(0);

  const [announcementCount, setAnnouncementCount] =
    useState(0);

  const [assignmentCount, setAssignmentCount] =
    useState(0);

  const [attendancePercent, setAttendancePercent] =
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

    // Total Students

    const { count: students } = await supabase

      .from("students")

      .select("*", {
        count: "exact",
        head: true,
      })

      .eq("department_id", subject.department_id)

      .eq("course_id", subject.course_id)

      .eq("semester_id", subject.semester_id);

    setStudentCount(students || 0);

    // Assignments

    const { count: assignments } = await supabase

      .from("assignments")

      .select("*", {
        count: "exact",
        head: true,
      })

      .eq("subject_id", subject.id);

    setAssignmentCount(assignments || 0);

    // Announcements

    const { count: announcements } = await supabase

      .from("announcements")

      .select("*", {
        count: "exact",
        head: true,
      })

      .eq("subject_id", subject.id);

    setAnnouncementCount(announcements || 0);

    // Attendance

    const { data: attendance } = await supabase

      .from("attendance")

      .select("status")

      .eq("subject_id", subject.id);

    if (attendance && attendance.length > 0) {

      const present = attendance.filter(
        (a: any) => a.status === "P"
      ).length;

      setAttendancePercent(

        Math.round(
          (present / attendance.length) * 100
        )

      );

    }

  }

  if (!subject) {

    return (

      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">

        Loading Subject...

      </div>

    );

  }

  return (

    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Hero Banner */}

        <div
          className={`relative overflow-hidden rounded-3xl shadow-2xl p-8 text-white ${
            subject.subject_type === "Theory"
              ? "bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500"
              : "bg-gradient-to-r from-orange-600 via-red-500 to-pink-500"
          }`}
        >

          <div className="absolute -right-12 -top-12 opacity-10">

            <BookOpen size={260} />

          </div>

          <div className="relative flex justify-between items-start flex-wrap gap-6">

            <div>

              <div className="flex items-center gap-3">

                <Sparkles size={24} />

                <span className="uppercase tracking-widest text-sm font-semibold">

                  Teacher Dashboard

                </span>

              </div>

              <h1 className="text-5xl font-extrabold mt-5">

                {subject.subject_name}

              </h1>

              <p className="mt-4 text-lg opacity-90">

                {subject.subject_code} •{" "}
                {subject.departments?.department_name} •{" "}
                {subject.courses?.course_name}

              </p>

              <p className="mt-2 text-base opacity-80">

                Semester {subject.semesters?.semester_no}

              </p>

            </div>

            <Link
              href="/teachers/my-subjects"
              className="bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold"
            >

              <ArrowLeft size={20} />

              My Subjects

            </Link>

          </div>

          {/* Subject Details */}

          <div className="grid md:grid-cols-4 gap-5 mt-10">

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5">

              <p className="text-sm opacity-80">

                Subject Type

              </p>

              <h3 className="text-2xl font-bold mt-2">

                {subject.subject_type}

              </h3>

            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5">

              <p className="text-sm opacity-80">

                Credits

              </p>

              <h3 className="text-2xl font-bold mt-2">

                {subject.credits}

              </h3>

            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5">

              <p className="text-sm opacity-80">

                Students

              </p>

              <h3 className="text-2xl font-bold mt-2">

                {studentCount}

              </h3>

            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5">

              <p className="text-sm opacity-80">

                Attendance

              </p>

              <h3 className="text-2xl font-bold mt-2">

                {attendancePercent}%

              </h3>

            </div>

          </div>

        </div>
                {/* Feature Cards */}

        <div
  className={`grid gap-8 mt-10 ${
    subject.subject_type === "Theory"
      ? "xl:grid-cols-4 md:grid-cols-2"
      : "xl:grid-cols-2 md:grid-cols-2"
  }`}
>

          {/* Attendance */}

          <div
            onClick={() =>
              router.push(`/teachers/attendance/${subject.id}`)
            }
            className="group cursor-pointer rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 p-5"
          >

            <ClipboardCheck
              size={45}
              className="group-hover:rotate-12 transition-transform duration-300"
            />

            <h2 className="text-2xl font-bold mt-6">

              Attendance

            </h2>

            <p className="mt-3 text-blue-100">

              Mark and manage attendance.

            </p>

          </div>

          {/* Marks (Theory Only) */}

          {subject.subject_type === "Theory" && (

            <div
              onClick={() =>
                router.push(`/teachers/marks/${subject.id}`)
              }
              className="group cursor-pointer rounded-3xl bg-gradient-to-br from-green-600 via-emerald-500 to-lime-400 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 p-7"
            >

              <BarChart3
                size={55}
                className="group-hover:rotate-12 transition-transform duration-300"
              />

              <h2 className="text-2xl font-bold mt-6">

                Marks

              </h2>

              <p className="mt-3 text-green-100">

                Manage internal marks.

              </p>

            </div>

          )}

          {/* Assignments (Theory Only) */}

          {subject.subject_type === "Theory" && (

            <div
              onClick={() =>
                router.push(`/teachers/assignments/${subject.id}`)
              }
              className="group cursor-pointer rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 p-7"
            >

              <FileText
                size={55}
                className="group-hover:rotate-12 transition-transform duration-300"
              />

              <h2 className="text-2xl font-bold mt-6">

                Assignments

              </h2>

              <p className="mt-3 text-orange-100">

                Create and manage assignments.

              </p>

            </div>

          )}

          {/* Announcements */}

          <div
            onClick={() =>
              router.push(`/teachers/announcements/${subject.id}`)
            }
            className="group cursor-pointer rounded-3xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 p-7"
          >

            <Bell
              size={45}
              className="group-hover:rotate-12 transition-transform duration-300"
            />

            <h2 className="text-2xl font-bold mt-6">

              Announcements

            </h2>

            <p className="mt-3 text-purple-100">

              Notify all enrolled students.

            </p>

          </div>

        </div>
                {/* Quick Overview */}

        <div
          className={`grid gap-6 mt-10 ${
            subject.subject_type === "Theory"
              ? "lg:grid-cols-4"
              : "lg:grid-cols-3"
          }`}
        >

          {/* Students */}

          <div className="bg-white rounded-3xl shadow-xl p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500">

                  Students

                </p>

                <h2 className="text-4xl font-bold text-blue-600 mt-3">

                  {studentCount}

                </h2>

              </div>

              <Users
                size={42}
                className="text-blue-600"
              />

            </div>

          </div>

          {/* Attendance */}

          <div className="bg-white rounded-3xl shadow-xl p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500">

                  Attendance

                </p>

                <h2 className="text-4xl font-bold text-green-600 mt-3">

                  {attendancePercent}%

                </h2>

              </div>

              <ClipboardCheck
                size={42}
                className="text-green-600"
              />

            </div>

          </div>

          {/* Assignments (Theory Only) */}

          {subject.subject_type === "Theory" && (

            <div className="bg-white rounded-3xl shadow-xl p-6">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">

                    Assignments

                  </p>

                  <h2 className="text-4xl font-bold text-orange-500 mt-3">

                    {assignmentCount}

                  </h2>

                </div>

                <FileText
                  size={42}
                  className="text-orange-500"
                />

              </div>

            </div>

          )}

          {/* Announcements */}

          <div className="bg-white rounded-3xl shadow-xl p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500">

                  Announcements

                </p>

                <h2 className="text-4xl font-bold text-purple-600 mt-3">

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
                {/* Subject Information */}

        <div className="grid lg:grid-cols-2 gap-6 mt-10">

          <div className="bg-white rounded-3xl shadow-xl p-7">

            <h2 className="text-2xl font-bold text-slate-800">

              Subject Information

            </h2>

            <div className="space-y-4 mt-6">

              <div className="flex justify-between">

                <span className="text-gray-500">

                  Subject Code

                </span>

                <span className="font-semibold">

                  {subject.subject_code}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">

                  Subject Name

                </span>

                <span className="font-semibold">

                  {subject.subject_name}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">

                  Department

                </span>

                <span className="font-semibold">

                  {subject.departments?.department_name}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">

                  Course

                </span>

                <span className="font-semibold">

                  {subject.courses?.course_name}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">

                  Semester

                </span>

                <span className="font-semibold">

                  Semester {subject.semesters?.semester_no}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">

                  Credits

                </span>

                <span className="font-semibold">

                  {subject.credits}

                </span>

              </div>

            </div>

          </div>

          {/* Teacher Tips */}

          <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl shadow-xl text-white p-7">

            <h2 className="text-2xl font-bold">

              Teacher Tips

            </h2>

            <div className="space-y-4 mt-6">

              <div className="flex gap-3">

                <ClipboardCheck />

                <p>

                  Update attendance regularly.

                </p>

              </div>

              {subject.subject_type === "Theory" && (

                <div className="flex gap-3">

                  <BarChart3 />

                  <p>

                    Complete internal marks before final submission.

                  </p>

                </div>

              )}

              {subject.subject_type === "Theory" && (

                <div className="flex gap-3">

                  <FileText />

                  <p>

                    Upload assignments before the deadline.

                  </p>

                </div>

              )}

              <div className="flex gap-3">

                <Bell />

                <p>

                  Use announcements to notify students.

                </p>

              </div>

            </div>

          </div>

        </div>
                {/* Footer */}

        <footer className="mt-12 border-t border-slate-200 pt-8">

          <div className="flex flex-col md:flex-row justify-between items-center gap-5">

            <div>

              <h3 className="text-xl font-bold text-slate-800">

                GJU Smart Connect

              </h3>

              <p className="text-gray-500 mt-1">

                Teacher Subject Dashboard

              </p>

            </div>

            <div>

              <span
                className={`px-5 py-2 rounded-full font-semibold ${
                  subject.subject_type === "Theory"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >

                {subject.subject_type}

              </span>

            </div>

            <div className="text-right">

              <p className="font-semibold text-slate-800">

                {subject.subject_name}

              </p>

              <p className="text-gray-500">

                {subject.subject_code}

              </p>

            </div>

          </div>

        </footer>

      </div>

    </main>

  );

}