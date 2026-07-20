"use client";

import Link from "next/link";
import { ArrowLeft, ClipboardCheck } from "lucide-react";

type Props = {
subject:{
subject_name:string;
subject_code:string;
subject_type:string;
credits:number;

semesters?:{
semester_no:number;
};
}
  totalStudents: number;
};

export default function AttendanceHeader({
  subject,
  totalStudents,
}: Props) {
  return (
    <>
      <div className="flex justify-between items-start flex-wrap gap-6">

        <div>

          <h1 className="text-4xl font-bold text-slate-800">
            Attendance Register
          </h1>

          <p className="text-gray-500 mt-2">
            Mark attendance of students
          </p>

        </div>

        <div className="flex gap-4">

          <Link
            href="/teachers"
            className="bg-slate-700 hover:bg-slate-800 text-white px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Dashboard
          </Link>

          <Link
            href="/teachers/attendance"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <ClipboardCheck size={20} />
            Attendance
          </Link>

        </div>

      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

        <div className="flex justify-between items-center flex-wrap gap-6">

          <div>

            <h2 className="text-3xl font-bold">

              {subject.subject_name}

            </h2>

            <p className="text-blue-600 font-semibold text-lg mt-2">

              {subject.subject_code}

            </p>

          </div>

          <span
            className={`px-5 py-2 rounded-full font-semibold ${
              subject.subject_type === "Theory"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {subject.subject_type}
          </span>

        </div>

        <div className="grid md:grid-cols-4 gap-5 mt-8">

          <div className="bg-slate-50 rounded-xl p-5">

            <p className="text-gray-500">

              Credits

            </p>

            <h3 className="text-2xl font-bold">

              📚 {subject.credits}

            </h3>

          </div>

          <div className="bg-slate-50 rounded-xl p-5">

            <p className="text-gray-500">

              Semester

            </p>

            <h3 className="text-2xl font-bold">

              🎓 Semester {subject.semesters?.semester_no}

            </h3>

          </div>

          <div className="bg-slate-50 rounded-xl p-5">

            <p className="text-gray-500">

              Students

            </p>

            <h3 className="text-2xl font-bold">

              👨‍🎓 {totalStudents}

            </h3>

          </div>

          <div className="bg-slate-50 rounded-xl p-5">

            <p className="text-gray-500">

              Attendance

            </p>

            <h3 className="text-2xl font-bold">

              📅 30 Days

            </h3>

          </div>

        </div>

      </div>
    </>
  );
}