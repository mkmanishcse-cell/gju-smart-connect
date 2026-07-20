"use client";

import { useRouter } from "next/navigation";

import {
  BookOpen,
  FlaskConical,
  GraduationCap,
  Award,
  UserRound,
  ExternalLink,
} from "lucide-react";

type Props = {
  id: string;
  code: string;
  name: string;
  semester: number;
  credits: number;
  type: string;
  teacherName?: string;
};

export default function StudentSubjectCard({
  id,
  code,
  name,
  semester,
  credits,
  type,
  teacherName = "Not Assigned",
}: Props) {

  const router = useRouter();

  const theory =
    type.toLowerCase() === "theory";

  return (

    <div className="group relative overflow-hidden rounded-[28px] border border-blue-200 bg-gradient-to-br from-blue-100 via-white to-indigo-100 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

      {/* Top Accent */}

      <div
        className={`h-1.5 ${
          theory
            ? "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600"
            : "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"
        }`}
      />

      {/* Background Icon */}

      <div className="absolute -right-8 -top-8 opacity-5 transition-all duration-300 group-hover:opacity-10">

        {theory ? (

          <BookOpen size={120} />

        ) : (

          <FlaskConical size={120} />

        )}

      </div>

      <div className="relative p-5">

        {/* Header */}

        <div className="flex items-start justify-between gap-4">

          <div className="flex-1">

            <p className="text-[11px] font-semibold uppercase tracking-[3px] text-slate-500">

              {code}

            </p>

            <h2 className="mt-2 text-2xl font-bold leading-snug text-slate-800">

              {name}

            </h2>

          </div>

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              theory
                ? "bg-blue-100 text-blue-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >

            {theory ? (

              <BookOpen size={24} />

            ) : (

              <FlaskConical size={24} />

            )}

          </div>

        </div>

        {/* Badges */}

        <div className="mt-5 flex flex-wrap gap-2">

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              theory
                ? "bg-blue-100 text-blue-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {type}
          </span>

          <span className="flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">

            <GraduationCap size={13} />

            Semester {semester}

          </span>

          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">

            <Award size={13} />

            {credits} Credits

          </span>

        </div>
                {/* Teacher Information */}

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white/80 p-4 backdrop-blur-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600">

              <UserRound
                size={20}
                className="text-white"
              />

            </div>

            <div>

              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">

                Faculty

              </p>

              <h3 className="text-base font-semibold text-slate-800">

                {teacherName}

              </h3>

            </div>

          </div>

        </div>

        
        {/* Divider */}

        <div className="mt-5 border-t border-slate-200 pt-5">
                    <button

            onClick={() =>
              router.push(`/students/my-subjects/${id}`)
            }

            className={`

group

flex

w-full

items-center

justify-center

gap-3

rounded-2xl

py-3.5

font-semibold

text-white

shadow-lg

transition-all

duration-300

hover:scale-[1.02]

hover:shadow-xl

${

theory

? "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600"

: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"

}

`}

          >

            <ExternalLink

              size={18}

              className="transition group-hover:translate-x-1"

            />

            Open Subject

          </button>

        </div>

      </div>

    </div>

  );

}