"use client";

import {
  User,
  Building2,
  School,
  Layers3,
  BarChart3,
  Trophy,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";

type Props = {
  studentName: string;
  rollNo: string;
  department: string;
  course: string;
  semester: string;
  attendance: number;
  averageMarks: number;
  totalSubjects: number;
  totalAssignments: number;
};

export default function StudentInfoCard({
  studentName,
  rollNo,
  department,
  course,
  semester,
  attendance,
  averageMarks,
  totalSubjects,
  totalAssignments,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-blue-200 bg-gradient-to-br from-blue-100 via-slate-50 to-indigo-100 shadow-xl">

      {/* Background Glow */}

      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-400/25 blur-3xl" />

      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />

      {/* Top Accent */}

      <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600" />

      <div className="relative p-5">

        <div className="grid gap-6 xl:grid-cols-[1.5fr_360px] items-center">

          {/* ================= LEFT ================= */}

          <div>

            {/* Profile */}

            <div className="flex items-center gap-5">

              <div className="relative">

                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 shadow-xl shadow-blue-400/40">

                  <User
                    size={36}
                    className="text-white"
                  />

                </div>

                <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-[3px] border-white bg-green-500" />

              </div>

              <div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                  {studentName}
                </h1>

                <p className="mt-1 text-sm text-slate-600">
                  Roll No.
                  <span className="ml-2 font-semibold text-slate-800">
                    {rollNo}
                  </span>
                </p>

              </div>

            </div>

            {/* Student Details */}

            <div className="mt-7 space-y-4">

              {/* Department */}

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-200">

                  <Building2
                    size={18}
                    className="text-blue-700"
                  />

                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Department
                  </p>

                  <h3 className="text-base font-semibold text-slate-800">
                    {department}
                  </h3>

                </div>

              </div>

              {/* Course */}

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-200">

                  <School
                    size={18}
                    className="text-emerald-700"
                  />

                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Course
                  </p>

                  <h3 className="text-base font-semibold text-slate-800">
                    {course}
                  </h3>

                </div>

              </div>

              {/* Semester */}

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-200">

                  <Layers3
                    size={18}
                    className="text-amber-700"
                  />

                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Semester
                  </p>

                  <h3 className="text-base font-semibold text-slate-800">
                    Semester {semester}
                  </h3>

                </div>

              </div>

            </div>

          </div>
                    {/* ================= RIGHT ================= */}

          <div>

            <div className="rounded-[26px] border border-slate-300 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-5 shadow-2xl">

              {/* Header */}

              <div className="flex items-center justify-between">

                <div>

<h2 className="mt-0 text-xl font-bold text-white">
                    Current Performance
                  </h2>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">

                  <BarChart3
                    size={22}
                    className="text-cyan-300"
                  />

                </div>

              </div>

              {/* Stats */}

              <div className="mt-5 space-y-3">

                {/* Attendance */}

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-emerald-500/15 p-3 transition-all duration-300 hover:bg-emerald-500/25">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">

                      <BarChart3
                        size={18}
                        className="text-emerald-300"
                      />

                    </div>

                    <div>

                      <h3 className="text-sm font-semibold text-white">
                        Attendance
                      </h3>

                      <p className="text-xs text-slate-300">
                        Overall
                      </p>

                    </div>

                  </div>

                  <span className="text-2xl font-bold text-emerald-300">
                    {attendance}%
                  </span>

                </div>

                {/* Average Marks */}

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-sky-500/15 p-3 transition-all duration-300 hover:bg-sky-500/25">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20">

                      <Trophy
                        size={18}
                        className="text-sky-300"
                      />

                    </div>

                    <div>

                      <h3 className="text-sm font-semibold text-white">
                        Average Marks
                      </h3>

                      <p className="text-xs text-slate-300">
                        Internal
                      </p>

                    </div>

                  </div>

                  <span className="text-2xl font-bold text-sky-300">
                    {averageMarks}
                  </span>

                </div>

                {/* Subjects */}

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-amber-500/15 p-3 transition-all duration-300 hover:bg-amber-500/25">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20">

                      <BookOpen
                        size={18}
                        className="text-amber-300"
                      />

                    </div>

                    <div>

                      <h3 className="text-sm font-semibold text-white">
                        Subjects
                      </h3>

                      <p className="text-xs text-slate-300">
                        Current Semester
                      </p>

                    </div>

                  </div>

                  <span className="text-2xl font-bold text-amber-300">
                    {totalSubjects}
                  </span>

                </div>

                {/* Assignments */}

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-violet-500/15 p-3 transition-all duration-300 hover:bg-violet-500/25">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">

                      <ClipboardCheck
                        size={18}
                        className="text-violet-300"
                      />

                    </div>

                    <div>
<h3 className="text-sm font-semibold text-white">
                        Assignments
                      </h3>
                      <p className="text-xs text-slate-300">
                        Total
                      </p>

                    </div>

                  </div>

                  <span className="text-2xl font-bold text-violet-300">
                    {totalAssignments}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}