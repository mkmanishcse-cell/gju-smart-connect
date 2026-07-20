"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  GraduationCap,
  ClipboardCheck,
  BookOpen,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import Footer from "@/components/common/Footer";
import LoadingScreen from "@/components/student/LoadingScreen";

type Student = {
  id: string;
  student_name: string;
  roll_no: string;
  department_id: string;
  course_id: string;
  semester_id: string;
};

type AttendanceRow = {
  subject_id: string;
  subject_code: string;
  subject_name: string;
  totalClasses: number;
  present: number;
  absent: number;
  percentage: number;
};

export default function StudentAttendancePage() {

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [student, setStudent] = useState<Student | null>(null);

  const [department, setDepartment] = useState("");

  const [course, setCourse] = useState("");

  const [semester, setSemester] = useState("");

  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);

  useEffect(() => {
    loadAttendance();
  }, []);

  async function loadAttendance() {

    try {

      const session = sessionStorage.getItem("user");

      if (!session) {
        router.push("/login?role=student");
        return;
      }

      const loginUser = JSON.parse(session);

      const { data: studentData, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", loginUser.id)
        .single();

      if (error || !studentData) return;

      setStudent(studentData);

      const { data: dept } = await supabase
        .from("departments")
        .select("department_name")
        .eq("id", studentData.department_id)
        .single();

      setDepartment(dept?.department_name ?? "");

      const { data: courseData } = await supabase
        .from("courses")
        .select("course_name")
        .eq("id", studentData.course_id)
        .single();

      setCourse(courseData?.course_name ?? "");

      const { data: semData } = await supabase
        .from("semesters")
        .select("semester_no")
        .eq("id", studentData.semester_id)
        .single();

      setSemester(String(semData?.semester_no ?? ""));

      const { data: subjects } = await supabase
        .from("subjects")
        .select(`
          id,
          subject_code,
          subject_name
        `)
        .eq("department_id", studentData.department_id)
        .eq("course_id", studentData.course_id)
        .eq("semester_id", studentData.semester_id);

      if (!subjects) {
        setAttendance([]);
        return;
      }

      const rows: AttendanceRow[] = [];
            for (const subject of subjects) {

        const { data: attendanceData } = await supabase
          .from("attendance")
          .select("status")
          .eq("student_id", studentData.id)
          .eq("subject_id", subject.id);

        const totalClasses =
          attendanceData?.length ?? 0;

        const present =
          attendanceData?.filter(
            (item) => item.status === "P"
          ).length ?? 0;

        const absent =
          attendanceData?.filter(
            (item) => item.status === "A"
          ).length ?? 0;

        const percentage =
          totalClasses === 0
            ? 0
            : Number(
                (
                  (present / totalClasses) *
                  100
                ).toFixed(1)
              );

        rows.push({
          subject_id: subject.id,
          subject_code: subject.subject_code,
          subject_name: subject.subject_name,
          totalClasses,
          present,
          absent,
          percentage,
        });

      }

      setAttendance(rows);

    } catch (error) {

      console.error("Attendance Error:", error);

    } finally {

      setLoading(false);

    }

  }

  /* Summary */

  const summary = useMemo(() => {

    const totalSubjects = attendance.length;

    const totalPresent = attendance.reduce(
      (sum, item) => sum + item.present,
      0
    );

    const totalAbsent = attendance.reduce(
      (sum, item) => sum + item.absent,
      0
    );

    const totalClasses = attendance.reduce(
      (sum, item) => sum + item.totalClasses,
      0
    );

    const overall =
      totalClasses === 0
        ? 0
        : Number(
            (
              (totalPresent / totalClasses) *
              100
            ).toFixed(1)
          );

    return {
      totalSubjects,
      totalPresent,
      totalAbsent,
      totalClasses,
      overall,
    };

  }, [attendance]);

  /* Attendance Badge Color */

  const getAttendanceStyle = (
    percentage: number
  ) => {

    if (percentage >= 75) {
      return {
        badge: "bg-green-100 text-green-700",
        progress: "bg-green-500",
      };
    }

    if (percentage >= 60) {
      return {
        badge: "bg-yellow-100 text-yellow-700",
        progress: "bg-yellow-500",
      };
    }

    return {
      badge: "bg-red-100 text-red-700",
      progress: "bg-red-500",
    };

  };

  if (loading) {

    return <LoadingScreen />;

  }

  if (!student) {

    return null;

  }

  return (

    <main className="space-y-8">
        {/* ================= HEADER ================= */}
        {/* ================= HEADER ================= */}

<div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 p-8 shadow-xl">

  {/* Background Blur */}

  <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

  <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl"></div>

  <div className="relative">

    {/* Back Button */}

    <button
      onClick={() => router.push("/students")}
      className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition-all duration-300 hover:bg-white/25"
    >

      ← Back

    </button>

    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

      {/* Left */}

      <div>

        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">

          <ClipboardCheck size={18} />

          <span className="text-sm font-medium">

            Student Portal

          </span>

        </div>

        <h1 className="mt-5 text-4xl font-bold tracking-tight">

          Attendance Dashboard

        </h1>

        <p className="mt-4 max-w-2xl text-sky-100 leading-7">

          Welcome,

          <span className="font-semibold">

            {" "}{student.student_name}

          </span>

          . Track your attendance across all enrolled subjects and
          monitor your academic progress in one place.

        </p>

        <div className="mt-6 flex flex-wrap gap-3">

          <div className="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">

            🎓 Semester {semester}

          </div>

          <div className="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">

            📚 {course}

          </div>

          <div className="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">

            🏢 {department}

          </div>

        </div>

      </div>

      {/* Right Card */}

      <div className="rounded-3xl border border-white/20 bg-white/15 p-8 text-center backdrop-blur">

        <p className="text-sm uppercase tracking-[4px] text-sky-100">

          Overall Attendance

        </p>

        <h2 className="mt-4 text-6xl font-extrabold">

          {summary.overall}%

        </h2>

        <div className="mt-5 h-3 w-56 overflow-hidden rounded-full bg-white/20">

          <div

            className="h-full rounded-full bg-white transition-all duration-700"

            style={{

              width: `${summary.overall}%`,

            }}

          />

        </div>

        <p className="mt-3 text-sm text-sky-100">

          Keep your attendance above 75%

        </p>

      </div>


    </div>

   

  </div>

</div>

{/* ================= STUDENT CARD ================= */}

<div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg">

  <div className="mb-6 flex items-center gap-4">

    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">

      <GraduationCap size={32} />

    </div>

    <div>

      <h2 className="text-2xl font-bold text-slate-800">

        Student Information

      </h2>

      <p className="text-slate-500">

        Academic Details

      </p>

    </div>

  </div>

  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

    <div>

      <p className="text-sm text-slate-500">

        Student Name

      </p>

      <h3 className="mt-2 text-lg font-semibold">

        {student.student_name}

      </h3>

    </div>

    <div>

      <p className="text-sm text-slate-500">

        Roll Number

      </p>

      <h3 className="mt-2 text-lg font-semibold">

        {student.roll_no}

      </h3>

    </div>

    <div>

      <p className="text-sm text-slate-500">

        Department

      </p>

      <h3 className="mt-2 text-lg font-semibold">

        {department}

      </h3>

    </div>

    <div>

      <p className="text-sm text-slate-500">

        Course

      </p>

      <h3 className="mt-2 text-lg font-semibold">

        {course}

      </h3>

    </div>

    <div>

      <p className="text-sm text-slate-500">

        Semester

      </p>

      <h3 className="mt-2 text-lg font-semibold">

        {semester}

      </h3>

    </div>

  </div>

</div>
{/* ================= SUMMARY CARDS ================= */}

<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

  {/* Subjects */}

  <div className="group rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">

    <div className="flex items-center justify-between">

      <BookOpen className="h-9 w-9 opacity-90" />

      <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
        Total
      </span>

    </div>

    <p className="mt-6 text-blue-100">

      Subjects

    </p>

    <h2 className="mt-2 text-4xl font-bold">

      {summary.totalSubjects}

    </h2>

  </div>

  {/* Present */}

  <div className="group rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">

    <div className="flex items-center justify-between">

      <CheckCircle2 className="h-9 w-9 opacity-90" />

      <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
        Present
      </span>

    </div>

    <p className="mt-6 text-green-100">

      Classes

    </p>

    <h2 className="mt-2 text-4xl font-bold">

      {summary.totalPresent}

    </h2>

  </div>

  {/* Absent */}

  <div className="group rounded-3xl bg-gradient-to-br from-red-400 to-rose-400 p-6 text-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">

    <div className="flex items-center justify-between">

      <XCircle className="h-9 w-9 opacity-90" />

      <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
        Absent
      </span>

    </div>

    <p className="mt-6 text-red-100">

      Classes

    </p>

    <h2 className="mt-2 text-4xl font-bold">

      {summary.totalAbsent}

    </h2>

  </div>

  {/* Overall */}

  <div className="group rounded-3xl bg-gradient-to-br from-purple-500 to-violet-700 p-6 text-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">

    <div className="flex items-center justify-between">

      <TrendingUp className="h-9 w-9 opacity-90" />

      <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
        Overall
      </span>

    </div>

    <p className="mt-6 text-purple-100">

      Attendance

    </p>

    <h2 className="mt-2 text-4xl font-bold">

      {summary.overall}%

    </h2>

  </div>

</div>

{/* ================= TABLE HEADER ================= */}

<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

  <div className="border-b border-slate-200 bg-slate-50 px-7 py-6">

    <div className="flex items-center justify-between">

      <div>

        <h2 className="text-2xl font-bold text-slate-800">

          Subject Attendance

        </h2>

        <p className="mt-2 text-slate-500">

          Click any subject to view complete attendance history.

        </p>

      </div>

      <div className="rounded-2xl bg-blue-100 px-5 py-3">

        <span className="font-semibold text-blue-700">

          {attendance.length} Subjects

        </span>

      </div>

    </div>

  </div>

  <div className="overflow-x-auto">

    <table className="min-w-full">

      <thead className="bg-slate-100">

        <tr>

          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">

            Subject

          </th>

          <th className="text-center text-sm font-semibold">

            Classes

          </th>

          <th className="text-center text-sm font-semibold">

            Present

          </th>

          <th className="text-center text-sm font-semibold">

            Absent

          </th>

          <th className="px-6 text-center text-sm font-semibold">

            Attendance

          </th>

          <th></th>

        </tr>

      </thead>

      <tbody>
        {attendance.map((item) => {

  const style =
    getAttendanceStyle(item.percentage);

  return (

    <tr
      key={item.subject_id}
      onClick={() =>
        router.push(
          `/students/attendance/${item.subject_id}`
        )
      }
      className="group cursor-pointer border-b transition-all duration-300 hover:bg-blue-50"
    >

      {/* Subject */}

      <td className="px-6 py-5">

        <div>

          <h3 className="font-semibold text-slate-800 group-hover:text-blue-600">

            {item.subject_name}

          </h3>

          <p className="mt-1 text-sm text-slate-500">

            {item.subject_code}

          </p>

        </div>

      </td>

      {/* Total Classes */}

      <td className="text-center">

        <span className="rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-700">

          {item.totalClasses}

        </span>

      </td>

      {/* Present */}

      <td className="text-center">

        <span className="rounded-xl bg-green-100 px-4 py-2 font-semibold text-green-700">

          {item.present}

        </span>

      </td>

      {/* Absent */}

      <td className="text-center">

        <span className="rounded-xl bg-red-100 px-4 py-2 font-semibold text-red-700">

          {item.absent}

        </span>

      </td>

      {/* Progress */}

      <td className="px-6 py-5">

        <div className="flex items-center gap-4">

          <div className="h-3 flex-1 rounded-full bg-slate-200">

            <div
              className={`h-3 rounded-full transition-all duration-700 ${style.progress}`}
              style={{
                width: `${item.percentage}%`,
              }}
            />

          </div>

          <span
            className={`min-w-[70px] rounded-full px-3 py-1 text-center text-sm font-semibold ${style.badge}`}
          >

            {item.percentage}%

          </span>

        </div>

      </td>

      {/* Arrow */}

      <td className="pr-6">

        <ChevronRight
          className="text-slate-400 transition-transform duration-300 group-hover:translate-x-2"
        />

      </td>

    </tr>

  );

})}

{/* Empty State */}

{attendance.length === 0 && (

  <tr>

    <td
      colSpan={6}
      className="py-20 text-center"
    >

      <BookOpen
        size={70}
        className="mx-auto text-slate-300"
      />

      <h3 className="mt-6 text-2xl font-bold text-slate-700">

        No Attendance Found

      </h3>

      <p className="mt-3 text-slate-500">

        Attendance records will appear here after your teacher marks attendance.

      </p>

    </td>

  </tr>

)}

      </tbody>

    </table>

  </div>

</div>

<Footer />

</main>

);
}