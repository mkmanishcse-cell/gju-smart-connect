"use client";

import { Student } from "./types";

interface Props {
  students: Student[];
}

export default function PromotionPreview({
  students,
}: Props) {

  if (students.length === 0) return null;

  return (

    <div className="mt-8 rounded-2xl bg-white shadow-lg overflow-hidden">

      <div className="border-b p-6">

        <h2 className="text-2xl font-bold">

          Students Preview

        </h2>

      </div>

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="p-4 text-left">

              Roll No

            </th>

            <th className="p-4 text-left">

              Student Name

            </th>

          </tr>

        </thead>

        <tbody>

          {students.map((student)=>(

            <tr
              key={student.id}
              className="border-t"
            >

              <td className="p-4">

                {student.roll_no}

              </td>

              <td className="p-4">

                {student.student_name}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}