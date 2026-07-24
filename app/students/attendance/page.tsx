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
  Building2,
  BadgeCheck,
  ArrowLeft,
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
      <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-500 via-sky-500 to-blue-500 p-5 shadow-lg sm:rounded-3xl sm:p-8 sm:shadow-xl">
        {/* Background */}
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl sm:-top-20 sm:-right-20 sm:h-72 sm:w-72" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-sky-200/20 blur-3xl sm:-bottom-20 sm:-left-20 sm:h-72 sm:w-72" />

        <div className="relative">
          {/* Back Button */}
         <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between sm:gap-8">

  {/* Left */}
  <div>

    <div className="flex items-center gap-3 sm:gap-4">

      <button
        onClick={() => router.push("/students")}
        aria-label="Back to Dashboard"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/15 text-white backdrop-blur transition-all duration-300 hover:bg-white/25 sm:h-11 sm:w-11 sm:rounded-xl"
      >
        <ArrowLeft size={16} className="sm:hidden" />
        <ArrowLeft size={20} className="hidden sm:block" />
      </button>

      <h1 className="text-2xl font-bold sm:text-4xl">
        Attendance Dashboard
      </h1>

    </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-sky-50 sm:mt-4 sm:text-base sm:leading-7">
                Welcome
                <span className="font-semibold"> {student.student_name}</span>
                . View your attendance across all enrolled subjects and track your academic attendance in one place.
              </p>

              <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
               <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
  <GraduationCap size={14} className="text-cyan-300 sm:h-4 sm:w-4" />
  <span>Semester {semester}</span>
</div>

<div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
  <BookOpen size={14} className="text-cyan-300 sm:h-4 sm:w-4" />
  <span>{course}</span>
</div>

<div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
  <Building2 size={14} className="text-cyan-300 sm:h-4 sm:w-4" />
  <span>{department}</span>
</div>

<div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
  <BadgeCheck size={14} className="text-cyan-300 sm:h-4 sm:w-4" />
  <span>Roll No: {student.roll_no}</span>
</div>
              </div>
            </div>

          </div>
        </div>
      </div>

{/* ================= PERFORMANCE OVERVIEW ================= */}

<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md sm:rounded-3xl sm:p-7 sm:shadow-xl">

  <div className="mb-4 sm:mb-6">

    <h2 className="text-base font-bold text-slate-800 sm:text-2xl">
      Performance Overview
    </h2>

    <p className="text-xs text-slate-500 sm:text-base">
      Your attendance summary at a glance
    </p>

  </div>

  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">

    <StatTile
      title="Subjects"
      value={summary.totalSubjects}
      icon={<BookOpen size={20} />}
      tone="bg-indigo-50 text-indigo-600"
    />

    <StatTile
      title="Present"
      value={summary.totalPresent}
      icon={<CheckCircle2 size={20} />}
      tone="bg-emerald-50 text-emerald-600"
    />

    <StatTile
      title="Absent"
      value={summary.totalAbsent}
      icon={<XCircle size={20} />}
      tone="bg-red-50 text-red-600"
    />

    <StatTile
      title="Overall"
      value={`${summary.overall}%`}
      icon={<TrendingUp size={20} />}
      tone="bg-violet-50 text-violet-600"
    />

  </div>

</div>
{/* ================= SUBJECT ATTENDANCE ================= */}

<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md sm:rounded-3xl sm:shadow-xl">

  {/* Header */}

  <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-7 sm:py-6">

    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

      <div>

        <h2 className="text-base font-bold text-slate-800 sm:text-2xl">
          Subject Wise Attendance
        </h2>

        <p className="mt-1 text-xs text-slate-500 sm:mt-2 sm:text-base">
          View attendance details for every enrolled subject.
        </p>

      </div>

      <div className="inline-flex items-center rounded-xl bg-indigo-50 px-4 py-2 sm:rounded-2xl sm:px-5 sm:py-3">

        <span className="text-sm font-semibold text-indigo-600 sm:text-base">
          {attendance.length} Subjects
        </span>

      </div>

    </div>

  </div>

  {/* Desktop */}

  <div className="hidden overflow-x-auto md:block">

    <table className="min-w-full">

      <thead className="bg-slate-100">

        <tr>

          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
            Subject
          </th>

          <th className="text-center text-sm font-semibold text-slate-600">
            Classes
          </th>

          <th className="text-center text-sm font-semibold text-slate-600">
            Present
          </th>

          <th className="text-center text-sm font-semibold text-slate-600">
            Absent
          </th>

          <th className="px-6 text-center text-sm font-semibold text-slate-600">
            Attendance
          </th>

        </tr>

      </thead>

      <tbody>
        {attendance.map((item) => {

  const style = getAttendanceStyle(item.percentage);

  return (

    <tr
      key={item.subject_id}
      onClick={() =>
        router.push(`/students/attendance/${item.subject_id}`)
      }
      className="cursor-pointer border-b transition hover:bg-indigo-50/50"
    >

      {/* Subject */}

      <td className="px-6 py-5">

        <h3 className="font-semibold text-slate-800">
          {item.subject_name}
        </h3>

        <span className="mt-2 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
          {item.subject_code}
        </span>

      </td>

      {/* Total */}

      <td className="text-center text-slate-700">
        {item.totalClasses}
      </td>

      {/* Present */}

      <td className="text-center font-semibold text-emerald-600">
        {item.present}
      </td>

      {/* Absent */}

      <td className="text-center font-semibold text-red-500">
        {item.absent}
      </td>

      {/* Progress */}

      <td className="px-6">

        <div className="flex items-center gap-3">

          <div className="h-3 flex-1 rounded-full bg-slate-200">

            <div
              className={`h-full rounded-full ${style.progress}`}
              style={{
                width: `${item.percentage}%`,
              }}
            />

          </div>

          <span
            className={`min-w-[60px] rounded-full px-3 py-1 text-center font-bold ${style.badge}`}
          >
            {item.percentage}%
          </span>

        </div>

      </td>

    </tr>

  );

})}

{/* Empty State */}

{attendance.length === 0 && (

  <tr>

    <td
      colSpan={5}
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
{/* ================= MOBILE VIEW ================= */}

<div className="divide-y divide-slate-100 md:hidden">

  {attendance.map((item) => {

    const style =
      getAttendanceStyle(item.percentage);

    return (

      <div
        key={item.subject_id}
        onClick={() =>
          router.push(
            `/students/attendance/${item.subject_id}`
          )
        }
        className="cursor-pointer p-4 transition hover:bg-slate-50"
      >

        <div className="flex items-center justify-between gap-3">

          <div>

            <h3 className="text-sm font-semibold text-slate-800">
              {item.subject_name}
            </h3>

            <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-600">
              {item.subject_code}
            </span>

          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${style.badge}`}
          >
            {item.percentage}%
          </span>

        </div>

        <div className="mt-4 h-2 w-full rounded-full bg-slate-200">

          <div
            className={`h-full rounded-full ${style.progress}`}
            style={{
              width: `${item.percentage}%`,
            }}
          />

        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">

          <MiniStat
            label="Classes"
            value={item.totalClasses}
          />

          <MiniStat
            label="Present"
            value={item.present}
          />

          <MiniStat
            label="Absent"
            value={item.absent}
          />

        </div>

      </div>

    );

  })}

  {attendance.length === 0 && (

    <div className="py-16 text-center">

      <BookOpen
        size={56}
        className="mx-auto text-slate-300"
      />

      <h3 className="mt-4 text-lg font-bold text-slate-700">
        No Attendance Found
      </h3>

      <p className="mt-2 px-4 text-sm text-slate-500">
        Attendance records will appear here after your teacher marks attendance.
      </p>

    </div>

  )}

</div>

</div>

<div className="-mx-2 mt-8 sm:-mx-4 md:-mx-6 lg:-mx-8">
  <Footer />
</div>

</main>

);
}
/* ---------------- STAT TILE ---------------- */

function StatTile({
  title,
  value,
  icon,
  tone,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition hover:shadow-md sm:rounded-2xl sm:p-4">

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11 sm:rounded-xl ${tone}`}
      >
        {icon}
      </div>

      <div>

        <p className="text-[11px] text-slate-500 sm:text-sm">
          {title}
        </p>

        <h3 className="text-lg font-bold text-slate-800 sm:text-2xl">
          {value}
        </h3>

      </div>

    </div>
  );
}

/* ---------------- MINI STAT ---------------- */

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg bg-slate-50 py-2 text-center">

      <p className="text-[10px] text-slate-500">
        {label}
      </p>

      <p className="text-sm font-semibold text-slate-700">
        {value}
      </p>

    </div>
  );
}