"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Footer from "@/components/common/Footer";
import { supabase } from "@/lib/supabase";

import {
  ArrowLeft,
  ClipboardCheck,
  Bell,
  FileText,
  BarChart3,
  BookOpen,
  Sparkles,
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

  const [subject, setSubject] = useState<Subject | null>(null);
  const [studentCount, setStudentCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [attendancePercent, setAttendancePercent] = useState(0);

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

    /* ================= TOTAL STUDENTS ================= */

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

    /* ================= ASSIGNMENTS ================= */

    const { count: assignments } = await supabase
      .from("assignments")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("subject_id", subject.id);

    setAssignmentCount(assignments || 0);

    /* ================= ANNOUNCEMENTS ================= */

    const { count: announcements } = await supabase
      .from("announcements")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("subject_id", subject.id);

    setAnnouncementCount(announcements || 0);

    /* ================= ATTENDANCE ================= */

    const { data: attendance } = await supabase
      .from("attendance")
      .select("status")
      .eq("subject_id", subject.id);

    if (attendance && attendance.length > 0) {
      const present = attendance.filter(
        (a: any) => a.status === "P"
      ).length;

      setAttendancePercent(
        Math.round((present / attendance.length) * 100)
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

      <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-5 sm:py-5 lg:px-8 lg:py-8">

        {/* ================= HERO BANNER ================= */}

        <div
          className={`relative overflow-hidden rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 text-white ${
            subject.subject_type === "Theory"
              ? "bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500"
              : "bg-gradient-to-r from-orange-600 via-red-500 to-pink-500"
          }`}
        >

          {/* Background Icon */}

          <div className="absolute -right-12 -top-12 opacity-10">
            <BookOpen size={260} />
          </div>

          {/* ================= HERO CONTENT ================= */}

          <div className="relative flex items-start justify-start flex-wrap gap-6 pt-10">

            <div>

              {/* Back + Teacher Dashboard */}

              <div className="flex items-center gap-3">

                <button
                  onClick={() => router.back()}
                  aria-label="Go Back"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/20
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:bg-white/30
                    active:scale-95
                  "
                >
                  <ArrowLeft size={20} />
                </button>

                <Sparkles size={24} />

                <span className="uppercase tracking-widest text-sm font-semibold">
                  Teacher Dashboard
                </span>

              </div>

              {/* Subject Name */}

              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold mt-5">
                {subject.subject_name}
              </h1>

              {/* Subject Details */}

              <p className="mt-4 text-sm sm:text-base lg:text-lg opacity-90">
                {subject.subject_code} •{" "}
                {subject.departments?.department_name} •{" "}
                {subject.courses?.course_name}
              </p>

              {/* Semester */}

              <p className="mt-2 text-base opacity-80">
                Semester {subject.semesters?.semester_no}
              </p>

            </div>

          </div>

          {/* ================= SUBJECT DETAILS ================= */}

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">

            {/* Subject Type */}

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 sm:p-4 lg:p-5">

              <p className="text-sm opacity-80">
                Subject Type
              </p>

              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mt-2">
                {subject.subject_type}
              </h3>

            </div>

            {/* Credits */}

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 sm:p-4 lg:p-5">

              <p className="text-sm opacity-80">
                Credits
              </p>

              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mt-2">
                {subject.credits}
              </h3>

            </div>

            {/* Students */}

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 sm:p-4 lg:p-5">

              <p className="text-sm opacity-80">
                Students
              </p>

              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mt-2">
                {studentCount}
              </h3>

            </div>

            {/* Attendance */}

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 sm:p-4 lg:p-5">

              <p className="text-sm opacity-80">
                Attendance
              </p>

              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mt-2">
                {attendancePercent}%
              </h3>

            </div>

          </div>

        </div>

        {/* ================= FEATURE CARDS ================= */}

        <div
          className={`mt-6 grid gap-4 ${
            subject.subject_type === "Theory"
              ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-2"
          }`}
        >

          {/* Attendance */}

          <div
            onClick={() =>
              router.push(`/teachers/attendance/${subject.id}`)
            }
            className="group cursor-pointer rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 p-4 sm:p-5 lg:p-7"
          >

            <ClipboardCheck
              size={36}
              className="group-hover:rotate-12 transition-transform duration-300"
            />

            <h2 className="text-xl lg:text-2xl font-bold mt-6">
              Attendance
            </h2>

            <p className="mt-3 text-blue-100">
              Mark and manage attendance.
            </p>

          </div>

          {/* Marks */}

          {subject.subject_type === "Theory" && (
            <div
              onClick={() =>
                router.push(`/teachers/marks/${subject.id}`)
              }
              className="group cursor-pointer rounded-3xl bg-gradient-to-br from-green-600 via-emerald-500 to-lime-400 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 p-4 sm:p-5 lg:p-7"
            >

              <BarChart3
                size={42}
                className="group-hover:rotate-12 transition-transform duration-300"
              />

              <h2 className="text-xl lg:text-2xl font-bold mt-6">
                Marks
              </h2>

              <p className="mt-3 text-green-100">
                Manage internal marks.
              </p>

            </div>
          )}

          {/* Assignments */}

          {subject.subject_type === "Theory" && (
            <div
              onClick={() =>
                router.push(`/teachers/assignments/${subject.id}`)
              }
              className="group cursor-pointer rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 p-4 sm:p-5 lg:p-7"
            >

              <FileText
                size={42}
                className="group-hover:rotate-12 transition-transform duration-300"
              />

              <h2 className="text-xl lg:text-2xl font-bold mt-6">
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
            className="group cursor-pointer rounded-3xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 p-4 sm:p-5 lg:p-7"
          >

            <Bell
              size={42}
              className="group-hover:rotate-12 transition-transform duration-300"
            />

            <h2 className="text-xl lg:text-2xl font-bold mt-6">
              Announcements
            </h2>

            <p className="mt-3 text-purple-100">
              Notify all enrolled students.
            </p>

          </div>

        </div>

      </div>

      {/* ================= FOOTER ================= */}

      <Footer />

    </main>
  );
}