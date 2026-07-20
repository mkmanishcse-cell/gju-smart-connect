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

  const theory =
    type.toLowerCase() === "theory";

  return (

    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      {/* Top Gradient */}

      <div

        className={`h-2 ${

          theory

            ? "bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500"

            : "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"

        }`}

      />

      {/* Background Icon */}

      <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-all duration-300">

        {theory ? (

          <BookOpen size={110} />

        ) : (

          <FlaskConical size={110} />

        )}

      </div>

      {/* Joined Badge */}

      {mode === "join" && joined && (

        <div className="absolute top-4 right-4 z-20">

          <div className="rounded-full bg-green-600 text-white px-3 py-1 text-xs flex items-center gap-1 shadow">

            <CheckCircle2 size={12} />

            Joined

          </div>

        </div>

      )}

      <div className="relative p-5">

        {/* Header */}

        <div className="flex justify-between items-start gap-4">

          <div className="flex-1">

            <p className="uppercase tracking-[3px] text-[11px] font-semibold text-slate-500">

              {code}

            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-2 leading-snug">

              {name}

            </h2>

          </div>

          <div

            className={`w-11 h-11 rounded-xl flex items-center justify-center ${

              theory

                ? "bg-blue-100 text-blue-600"

                : "bg-orange-100 text-orange-600"

            }`}

          >

            {theory ? (

              <BookOpen size={22} />

            ) : (

              <FlaskConical size={22} />

            )}

          </div>

        </div>

        {/* Chips */}

        <div className="flex flex-wrap gap-2 mt-4">

          <span

            className={`px-3 py-1 rounded-full text-xs font-semibold ${

              theory

                ? "bg-blue-100 text-blue-700"

                : "bg-orange-100 text-orange-700"

            }`}

          >

            {type}

          </span>

          <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold flex items-center gap-1">

            <GraduationCap size={13} />

            Semester {semester}

          </span>

          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1">

            <Award size={13} />

            {credits} Credits

          </span>

        </div>

        {/* Progress */}

        <div className="mt-5">

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

          <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">

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

        <div className="border-t border-slate-200 mt-5 pt-5">
                  {mode === "join" ? (

          joined ? (

            <button
              disabled
              className="w-full rounded-xl bg-green-600 py-2.5 text-white font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
            >

              <CheckCircle2 size={18} />

              Already Joined

            </button>

          ) : (

            <button
              onClick={onJoin}
              className={`w-full rounded-xl py-2.5 text-white font-semibold flex items-center justify-center gap-2 transition hover:scale-[1.02] ${
                theory
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                  : "bg-gradient-to-r from-orange-500 to-red-500"
              }`}
            >

              <PlusCircle size={18} />

              Join Subject

            </button>

          )

        ) : mode === "mySubjects" ? (

          <div className="grid grid-cols-2 gap-3">

            <button
              onClick={() =>
                router.push(`/teachers/my-subjects/${id}`)
              }
              className="rounded-xl py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition"
            >

              <ExternalLink size={18} />

              Open

            </button>

            <button
              onClick={onRemove}
              className="rounded-xl py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition"
            >

              <Trash2 size={18} />

              Remove

            </button>

          </div>

        ) : mode === "attendance" ? (

          <button
            onClick={() =>
              router.push(`/teachers/attendance/${id}`)
            }
            className="w-full rounded-xl py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition"
          >

            <ClipboardCheck size={18} />

            Open Attendance

          </button>

        ) : mode === "marks" ? (

          <button
            onClick={() =>
              router.push(`/teachers/marks/${id}`)
            }
            className="w-full rounded-xl py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition"
          >

            <BarChart3 size={18} />

            Open Marks

          </button>

        ) : mode === "assignments" ? (

          <button
            onClick={() =>
              router.push(`/teachers/assignments/${id}`)
            }
            className="w-full rounded-xl py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition"
          >

            <ClipboardList size={18} />

            Open Assignments

          </button>

        ) : (
                    <button
            onClick={() =>
              router.push(`/teachers/announcements/${id}`)
            }
            className="w-full rounded-xl py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all duration-300"
          >

            <Megaphone size={18} />

            Open Announcements

          </button>

        )}

          </div>

      {/* End Body */}

    </div>

    {/* End Card */}

    </div>

  );

}