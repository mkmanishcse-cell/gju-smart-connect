"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  BadgeCheck,
} from "lucide-react";
import {
  GraduationCap,
  ClipboardList,
  Trophy,
  TrendingUp,
  ArrowLeft,
  BookOpen,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import LoadingScreen from "@/components/student/LoadingScreen";
import Footer from "@/components/common/Footer";

type Student = {
  id: string;
  student_name: string;
  roll_no: string;
  department_id: string;
  course_id: string;
  semester_id: string;
};

type StudentMarks = {
  subject_id: string;
  subject_code: string;
  subject_name: string;
  minor1: number;
  minor2: number;
  minor3: number;
  best_two_average: number;
  assignment_marks: number;
  attendance_marks: number;
  total_marks: number;
};

const MAX_TOTAL_MARKS = 30;

export default function StudentMarksPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [student, setStudent] = useState<Student | null>(null);

  const [department, setDepartment] = useState("");

  const [course, setCourse] = useState("");

  const [semester, setSemester] = useState("");

  const [marks, setMarks] = useState<StudentMarks[]>([]);

  useEffect(() => {
    loadMarks();
  }, []);

  async function loadMarks() {
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

      if (error || !studentData) {
        return;
      }

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

      const { data: sem } = await supabase
        .from("semesters")
        .select("semester_no")
        .eq("id", studentData.semester_id)
        .single();

      setSemester(String(sem?.semester_no ?? ""));

      /* Load Subjects */
      const { data: subjects, error: subjectError } = await supabase
        .from("subjects")
        .select(`
          id,
          subject_code,
          subject_name
        `)
        .eq("department_id", studentData.department_id)
        .eq("course_id", studentData.course_id)
        .eq("semester_id", studentData.semester_id)
        .eq("subject_type", "Theory");

      if (subjectError || !subjects) {
        setMarks([]);
        return;
      }

      const rows: StudentMarks[] = [];

      for (const subject of subjects) {
        const { data: marksData } = await supabase
          .from("marks")
          .select(`
            minor1,
            minor2,
            minor3,
            best_two_average,
            assignment_marks,
            attendance_marks,
            total_marks
          `)
          .match({
            student_id: studentData.id,
            subject_id: subject.id,
          })
          .single();

        rows.push({
          subject_id: subject.id,
          subject_code: subject.subject_code,
          subject_name: subject.subject_name,
          minor1: Number(marksData?.minor1 ?? 0),
          minor2: Number(marksData?.minor2 ?? 0),
          minor3: Number(marksData?.minor3 ?? 0),
          best_two_average: Number(marksData?.best_two_average ?? 0),
          assignment_marks: Number(marksData?.assignment_marks ?? 0),
          attendance_marks: Number(marksData?.attendance_marks ?? 0),
          total_marks: Number(marksData?.total_marks ?? 0),
        });
      }

      setMarks(rows);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  /* ================= SUMMARY ================= */

  const summary = useMemo(() => {
    const totalSubjects = marks.length;

    const totalMarks = marks.reduce((sum, item) => sum + item.total_marks, 0);

    const highest =
      marks.length > 0 ? Math.max(...marks.map((x) => x.total_marks)) : 0;

    const average =
      marks.length > 0 ? Number((totalMarks / marks.length).toFixed(1)) : 0;

    return { totalSubjects, totalMarks, highest, average };
  }, [marks]);

  const averagePercent =
    summary.average > 0
      ? Math.min((summary.average / MAX_TOTAL_MARKS) * 100, 100)
      : 0;

  if (loading) {
    return <LoadingScreen />;
  }

  if (!student) {
    return null;
  }

  return (
    <main className="space-y-5 px-3 py-4 sm:space-y-8 sm:px-6 sm:py-6">
      {/* ================= HEADER ================= */}
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
        Marks Dashboard
      </h1>

    </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-sky-50 sm:mt-4 sm:text-base sm:leading-7">
                Welcome
                <span className="font-semibold"> {student.student_name}</span>
                . View all your internal assessment marks, assignment marks
                and attendance marks.
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
            Your marks summary at a glance
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
          {/* Circular chart */}
          <div className="flex shrink-0 flex-col items-center">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              className="sm:h-[150px] sm:w-[150px]"
            >
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="12"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="url(#avgGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={
                  2 * Math.PI * 50 * (1 - averagePercent / 100)
                }
                transform="rotate(-90 60 60)"
              />
              <defs>
                <linearGradient id="avgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
              <text
                x="60"
                y="56"
                textAnchor="middle"
                className="fill-slate-800 text-2xl font-bold"
              >
                {summary.average}
              </text>
              <text
                x="60"
                y="76"
                textAnchor="middle"
                className="fill-slate-400 text-[10px] font-medium"
              >
                AVG / {MAX_TOTAL_MARKS}
              </text>
            </svg>
          </div>

          {/* Stat tiles */}
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            <StatTile
              title="Subjects"
              value={summary.totalSubjects}
              icon={<BookOpen size={20} />}
              tone="bg-indigo-50 text-indigo-600"
            />
            <StatTile
              title="Highest"
              value={summary.highest}
              icon={<Trophy size={20} />}
              tone="bg-emerald-50 text-emerald-600"
            />
            <StatTile
              title="Average"
              value={summary.average}
              icon={<TrendingUp size={20} />}
              tone="bg-amber-50 text-amber-600"
            />
            <StatTile
              title="Total"
              value={summary.totalMarks}
              icon={<ClipboardList size={20} />}
              tone="bg-violet-50 text-violet-600"
            />
          </div>
        </div>
      </div>

      {/* ================= MARKS TABLE ================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md sm:rounded-3xl sm:shadow-xl">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-7 sm:py-6">
          <h2 className="text-base font-bold text-slate-800 sm:text-2xl">
            Subject Wise Marks
          </h2>
          <p className="mt-1 text-xs text-slate-500 sm:mt-2 sm:text-base">
            Internal Assessment Marks
          </p>
        </div>

        {/* Desktop / tablet table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Subject
                </th>
                <th className="text-center text-sm font-semibold text-slate-600">
                  M1
                </th>
                <th className="text-center text-sm font-semibold text-slate-600">
                  M2
                </th>
                <th className="text-center text-sm font-semibold text-slate-600">
                  M3
                </th>
                <th className="text-center text-sm font-semibold text-slate-600">
                  Best
                </th>
                <th className="text-center text-sm font-semibold text-slate-600">
                  Assign.
                </th>
                <th className="text-center text-sm font-semibold text-slate-600">
                  Attend.
                </th>
                <th className="px-6 text-center text-sm font-semibold text-slate-600">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {marks.map((item) => (
                <tr
                  key={item.subject_id}
                  className="border-b transition hover:bg-indigo-50/50"
                >
                  <td className="px-6 py-5">
                    <h3 className="font-semibold text-slate-800">
                      {item.subject_name}
                    </h3>
                    <span className="mt-2 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                      {item.subject_code}
                    </span>
                  </td>
                  <td className="text-center text-slate-700">{item.minor1}</td>
                  <td className="text-center text-slate-700">{item.minor2}</td>
                  <td className="text-center text-slate-700">{item.minor3}</td>
                  <td className="text-center font-semibold text-sky-600">
                    {item.best_two_average}
                  </td>
                  <td className="text-center text-slate-700">
                    {item.assignment_marks}
                  </td>
                  <td className="text-center text-slate-700">
                    {item.attendance_marks}
                  </td>
                  <td className="px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-3 flex-1 rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500"
                          style={{
                            width: `${Math.min(
                              (item.total_marks / MAX_TOTAL_MARKS) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="min-w-[60px] rounded-full bg-violet-50 px-3 py-1 text-center font-bold text-violet-600">
                        {item.total_marks}/{MAX_TOTAL_MARKS}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}

              {marks.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-20 text-center">
                    <BookOpen size={70} className="mx-auto text-slate-300" />
                    <h3 className="mt-6 text-2xl font-bold text-slate-700">
                      No Marks Found
                    </h3>
                    <p className="mt-3 text-slate-500">
                      Marks will appear here after your teacher uploads them.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="divide-y divide-slate-100 md:hidden">
          {marks.map((item) => (
            <div key={item.subject_id} className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    {item.subject_name}
                  </h3>
                  <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-600">
                    {item.subject_code}
                  </span>
                </div>
                <span className="shrink-0 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-600">
                  {item.total_marks}/{MAX_TOTAL_MARKS}
                </span>
              </div>

              <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500"
                  style={{
                    width: `${Math.min(
                      (item.total_marks / MAX_TOTAL_MARKS) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <MiniStat label="M1" value={item.minor1} />
                <MiniStat label="M2" value={item.minor2} />
                <MiniStat label="M3" value={item.minor3} />
                <MiniStat label="Best" value={item.best_two_average} />
                <MiniStat label="Assign." value={item.assignment_marks} />
                <MiniStat label="Attend." value={item.attendance_marks} />
              </div>
            </div>
          ))}

          {marks.length === 0 && (
            <div className="py-16 text-center">
              <BookOpen size={56} className="mx-auto text-slate-300" />
              <h3 className="mt-4 text-lg font-bold text-slate-700">
                No Marks Found
              </h3>
              <p className="mt-2 px-4 text-sm text-slate-500">
                Marks will appear here after your teacher uploads them.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="-mx-2 sm:-mx-4 md:-mx-6 lg:-mx-8 mt-8">
              <Footer />
              </div>
    </main>
  );
}

/* ---------------- INFO CARD ---------------- */

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 sm:rounded-2xl sm:p-5">
      <p className="text-[11px] text-slate-500 sm:text-sm">{title}</p>
      <h3 className="mt-1 text-sm font-bold text-slate-800 sm:mt-2 sm:text-lg">
        {value}
      </h3>
    </div>
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
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 sm:rounded-2xl sm:p-4">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11 sm:rounded-xl ${tone}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-slate-500 sm:text-sm">{title}</p>
        <h3 className="text-lg font-bold text-slate-800 sm:text-2xl">
          {value}
        </h3>
      </div>
    </div>
  );
}

/* ---------------- MINI STAT (mobile table) ---------------- */

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-slate-50 py-2">
      <p className="text-[10px] text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}