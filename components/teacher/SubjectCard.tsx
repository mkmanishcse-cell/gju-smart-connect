"use client";

import { useRouter } from "next/navigation";
import {
  BookOpen,
  FlaskConical,
  GraduationCap,
  Award,
  CheckCircle2,
  PlusCircle,
  ExternalLink,
  Trash2,
  ClipboardCheck,
  BarChart3,
  ClipboardList,
  Megaphone,
} from "lucide-react";

type Props = {
  id?: string;
  code: string;
  name: string;
  semester: number;
  credits: number;
  type: string;
  mode?:
    | "join"
    | "mySubjects"
    | "attendance"
    | "marks"
    | "assignments"
    | "announcements";
  joined?: boolean;
  onJoin?: () => void;
  onRemove?: () => void;
};

export default function SubjectCard({
  id,
  code,
  name,
  semester,
  credits,
  type,
  mode = "join",
  joined = false,
  onJoin,
  onRemove,
}: Props) {
  const router = useRouter();

  const theory = type.toLowerCase() === "theory";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Top Gradient */}
      <div
        className={`h-2 ${
          theory
            ? "bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500"
            : "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"
        }`}
      />

      {/* Background Icon */}
      <div className="absolute -right-5 -top-5 opacity-5 transition-all duration-300 group-hover:opacity-10">
        {theory ? (
          <BookOpen
            size={80}
            className="sm:h-[110px] sm:w-[110px]"
          />
        ) : (
          <FlaskConical
            size={80}
            className="sm:h-[110px] sm:w-[110px]"
          />
        )}
      </div>

      {/* Joined Badge */}
      {mode === "join" && joined && (
        <div className="absolute right-3 top-3 z-20">
          <div className="flex items-center gap-1 rounded-full bg-green-600 px-2.5 py-1 text-[11px] text-white shadow">
            <CheckCircle2 size={11} />
            Joined
          </div>
        </div>
      )}

      {/* Card Body */}
      <div className="relative p-3 sm:p-5">
                {/* Header */}

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0 flex-1">

            <p className="truncate uppercase tracking-[2px] text-[10px] font-semibold text-slate-500 sm:text-[11px] sm:tracking-[3px]">

              {code}

            </p>

            <h2 className="mt-1 text-lg font-bold leading-snug text-slate-800 sm:mt-2 sm:text-xl">

              {name}

            </h2>

          </div>

          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${
              theory
                ? "bg-blue-100 text-blue-600"
                : "bg-orange-100 text-orange-600"
            }`}
          >
            {theory ? (
              <BookOpen
                size={18}
                className="sm:h-[22px] sm:w-[22px]"
              />
            ) : (
              <FlaskConical
                size={18}
                className="sm:h-[22px] sm:w-[22px]"
              />
            )}
          </div>

        </div>

        {/* Chips */}

        <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">

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

        {/* Progress */}

        <div className="mt-3 sm:mt-5">

          <div className="flex justify-between text-xs">

            <span className="text-slate-500">

              Status

            </span>

            <span
              className={`font-semibold ${
                theory
                  ? "text-blue-600"
                  : "text-orange-600"
              }`}
            >

              Active

            </span>

          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">

            <div
              className={`h-full ${
                theory
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500"
                  : "bg-gradient-to-r from-orange-500 to-red-500"
              }`}
              style={{ width: "100%" }}
            />

          </div>

        </div>

        <div className="mt-3 border-t border-slate-200 pt-3 sm:mt-5 sm:pt-5">
                  {mode === "join" ? (

          joined ? (

            <button
              disabled
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-2 text-sm font-semibold text-white cursor-not-allowed sm:py-2.5 sm:text-base"
            >
              <CheckCircle2 size={16} />
              Already Joined
            </button>

          ) : (

            <button
              onClick={onJoin}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold text-white transition hover:scale-[1.02] sm:py-2.5 sm:text-base ${
                theory
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                  : "bg-gradient-to-r from-orange-500 to-red-500"
              }`}
            >
              <PlusCircle size={16} />
              Join Subject
            </button>

          )

        ) : mode === "mySubjects" ? (

          <div className="grid grid-cols-2 gap-2 sm:gap-3">

            <button
              onClick={() =>
                router.push(`/teachers/my-subjects/${id}`)
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] sm:py-2.5 sm:text-base"
            >
              <ExternalLink size={16} />
              Open
            </button>

            <button
              onClick={onRemove}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] sm:py-2.5 sm:text-base"
            >
              <Trash2 size={16} />
              Remove
            </button>

          </div>

        ) : mode === "attendance" ? (

          <button
            onClick={() =>
              router.push(`/teachers/attendance/${id}`)
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] sm:py-2.5 sm:text-base"
          >
            <ClipboardCheck size={16} />
            Open Attendance
          </button>

        ) : mode === "marks" ? (

          <button
            onClick={() =>
              router.push(`/teachers/marks/${id}`)
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] sm:py-2.5 sm:text-base"
          >
            <BarChart3 size={16} />
            Open Marks
          </button>

        ) : mode === "assignments" ? (

          <button
            onClick={() =>
              router.push(`/teachers/assignments/${id}`)
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] sm:py-2.5 sm:text-base"
          >
            <ClipboardList size={16} />
            Open Assignments
          </button>

        ) : (

          <button
            onClick={() =>
              router.push(`/teachers/announcements/${id}`)
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] sm:py-2.5 sm:text-base"
          >
            <Megaphone size={16} />
            Open Announcements
          </button>

        )}

      </div>
            {/* End Card Body */}

      </div>

      {/* End Card */}

    </div>

  );

}