"use client";

import { GraduationCap, Users } from "lucide-react";

interface Props {
  studentsCount: number;
  nextSemester: string;
}

export default function PromotionSummary({
  studentsCount,
  nextSemester,
}: Props) {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">

      <div className="rounded-2xl bg-white p-6 shadow-lg">

        <div className="flex items-center gap-5">

          <div className="rounded-2xl bg-blue-100 p-4">

            <Users
              size={34}
              className="text-blue-600"
            />

          </div>

          <div>

            <p className="text-slate-500">

              Students Found

            </p>

            <h2 className="mt-1 text-4xl font-bold text-blue-600">

              {studentsCount}

            </h2>

          </div>

        </div>

      </div>

      <div className="rounded-2xl bg-white p-6 shadow-lg">

        <div className="flex items-center gap-5">

          <div className="rounded-2xl bg-green-100 p-4">

            <GraduationCap
              size={34}
              className="text-green-600"
            />

          </div>

          <div>

            <p className="text-slate-500">

              Next Semester

            </p>

            <h2 className="mt-1 text-3xl font-bold text-green-600">

              {nextSemester}

            </h2>

          </div>

        </div>

      </div>

    </div>
  );
}