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

  const theory = type.toLowerCase() === "theory";

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
      <div className="absolute -right-5 -top-5 opacity-5 transition-all duration-300 group-hover:opacity-10">
        {theory ? (
          <BookOpen
            size={80}
            className="sm:h-[120px] sm:w-[120px]"
          />
        ) : (
          <FlaskConical
            size={80}
            className="sm:h-[120px] sm:w-[120px]"
          />
        )}
      </div>

      {/* Card Body */}
      <div className="relative p-3 sm:p-5">
                {/* Header */}

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0 flex-1">

            <p className="truncate text-[10px] font-semibold uppercase tracking-[2px] text-slate-500 sm:text-[11px] sm:tracking-[3px]">

              {code}

            </p>

            <h2 className="mt-1 text-lg font-bold leading-snug text-slate-800 sm:mt-2 sm:text-2xl">

              {name}

            </h2>

          </div>

          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl sm:h-12 sm:w-12 sm:rounded-2xl ${
              theory
                ? "bg-blue-100 text-blue-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {theory ? (
              <BookOpen
                size={18}
                className="sm:h-6 sm:w-6"
              />
            ) : (
              <FlaskConical
                size={18}
                className="sm:h-6 sm:w-6"
              />
            )}
          </div>

        </div>

        {/* Badges */}

        <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">

          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:text-xs ${
              theory
                ? "bg-blue-100 text-blue-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {type}
          </span>

          <span className="flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-semibold text-violet-700 sm:px-3 sm:text-xs">

            <GraduationCap size={12} />

            Semester {semester}

          </span>

          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:px-3 sm:text-xs">

            <Award size={12} />

            {credits} Credits

          </span>

        </div>

        {/* Teacher Information */}

        <div className="mt-3 rounded-xl border border-slate-200 bg-white/80 p-3 backdrop-blur-sm sm:mt-5 sm:rounded-2xl sm:p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 sm:h-11 sm:w-11 sm:rounded-xl">

              <UserRound
                size={18}
                className="text-white sm:h-5 sm:w-5"
              />

            </div>

            <div className="min-w-0">

              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 sm:text-xs">

                Faculty

              </p>

              <h3 className="truncate text-sm font-semibold text-slate-800 sm:text-base">

                {teacherName}

              </h3>

            </div>

          </div>

        </div>

        <div className="mt-3 border-t border-slate-200 pt-3 sm:mt-5 sm:pt-5">
                  {/* Open Button */}

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
            gap-2
            rounded-xl
            py-2
            text-sm
            font-semibold
            text-white
            shadow-lg
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:shadow-xl
            sm:gap-3
            sm:rounded-2xl
            sm:py-3.5
            sm:text-base
            ${
              theory
                ? "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600"
                : "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"
            }
          `}
        >
          <ExternalLink
            size={16}
            className="transition group-hover:translate-x-1 sm:h-[18px] sm:w-[18px]"
          />

          Open Subject

        </button>

      </div>
            {/* End Card Body */}

      </div>

      {/* End Card */}

    </div>

  );

}