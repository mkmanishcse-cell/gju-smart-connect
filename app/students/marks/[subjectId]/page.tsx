"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import LoadingScreen from "@/components/student/LoadingScreen";
import Footer from "@/components/common/Footer";

type Student = {
  id: string;
  student_name: string;
  roll_no: string;
};

type Subject = {
  id: string;
  subject_code: string;
  subject_name: string;
};

type Marks = {
  minor1: number;
  minor2: number;
  minor3: number;
  best_two_average: number;
  assignment_marks: number;
  attendance_marks: number;
  total_marks: number;
};

export default function StudentMarksPage() {

  const { subjectId } = useParams();
const router = useRouter();
  const [loading, setLoading] =
    useState(true);

  const [student, setStudent] =
    useState<Student | null>(null);

  const [subject, setSubject] =
    useState<Subject | null>(null);

  const [marks, setMarks] =
    useState<Marks | null>(null);

  useEffect(() => {

    if (subjectId) {

      loadMarks();

    }

  }, [subjectId]);

  async function loadMarks() {

    try {

      const session =
        sessionStorage.getItem("user");

      if (!session) {

        window.location.href =
          "/login?role=student";

        return;

      }

      const loginUser =
        JSON.parse(session);

      /* Student */

      const {

        data: studentData,

        error: studentError,

      } = await supabase

        .from("students")

        .select(`
          id,
          student_name,
          roll_no
        `)

        .eq("id", loginUser.id)

        .single();

      if (studentError || !studentData) {

        console.error(studentError);

        return;

      }

      setStudent(studentData);

      /* Subject */

      const {

        data: subjectData,

        error: subjectError,

      } = await supabase

        .from("subjects")

        .select(`
          id,
          subject_code,
          subject_name
        `)

        .eq("id", subjectId)

        .single();

      if (subjectError || !subjectData) {

        console.error(subjectError);

        return;

      }

      setSubject(subjectData);
            /* Marks */

      const {

        data: marksData,

        error: marksError,

      } = await supabase

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

        .eq(
          "student_id",
          studentData.id
        )

        .eq(
          "subject_id",
          subjectId
        )

        .single();

      if (marksError) {

        console.error(marksError);

      } else {

        setMarks({

          minor1:
            Number(marksData.minor1 ?? 0),

          minor2:
            Number(marksData.minor2 ?? 0),

          minor3:
            Number(marksData.minor3 ?? 0),

          best_two_average:
            Number(
              marksData.best_two_average ?? 0
            ),

          assignment_marks:
            Number(
              marksData.assignment_marks ?? 0
            ),

          attendance_marks:
            Number(
              marksData.attendance_marks ?? 0
            ),

          total_marks:
            Number(
              marksData.total_marks ?? 0
            ),

        });

      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return <LoadingScreen />;

  }

  if (!student || !subject) {

    return null;

  }

  return (

    <main className="space-y-8">
        <div className="mb-6">

  <button
    onClick={() => router.back()}
    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
  >
    <ArrowLeft size={18} />
    Back
  </button>

</div>
        <div className="space-y-8">

  {/* Student Information */}

  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

    <div className="border-b bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 px-6 py-5">

      <h2 className="text-2xl font-bold text-slate-800">
        Student Information
      </h2>

    </div>

    <div className="grid gap-6 p-6 md:grid-cols-3">

      <div>

        <p className="text-sm text-slate-500">
          Student Name
        </p>

        <p className="mt-1 font-semibold text-slate-800">
          {student.student_name}
        </p>

      </div>

      <div>

        <p className="text-sm text-slate-500">
          Roll Number
        </p>

        <p className="mt-1 font-semibold text-slate-800">
          {student.roll_no}
        </p>

      </div>

      <div>

        <p className="text-sm text-slate-500">
          Subject
        </p>

        <p className="mt-1 font-semibold text-slate-800">
          {subject.subject_name}
        </p>

      </div>

    </div>

  </div>



  {/* Marks Summary */}

  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

    <div className="border-b bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 px-6 py-5">

      <h2 className="text-2xl font-bold text-slate-800">
        Marks Summary
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        View only marks details.
      </p>

    </div>

    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-6 py-4 text-center">
              Minor 1
            </th>

            <th className="px-6 py-4 text-center">
              Minor 2
            </th>

            <th className="px-6 py-4 text-center">
              Minor 3
            </th>

            <th className="px-6 py-4 text-center">
              Best 2 Average
            </th>

            <th className="px-6 py-4 text-center">
              Assignment
            </th>

            <th className="px-6 py-4 text-center">
              Attendance
            </th>

            <th className="px-6 py-4 text-center">
              Total
            </th>

          </tr>

        </thead>

        <tbody>

          <tr className="border-t hover:bg-slate-50">

            <td className="px-6 py-4 text-center">
              {marks?.minor1 ?? 0}
            </td>

            <td className="px-6 py-4 text-center">
              {marks?.minor2 ?? 0}
            </td>

            <td className="px-6 py-4 text-center">
              {marks?.minor3 ?? 0}
            </td>

            <td className="px-6 py-4 text-center font-semibold text-blue-600">
              {marks?.best_two_average ?? 0}
            </td>

            <td className="px-6 py-4 text-center">
              {marks?.assignment_marks ?? 0}
            </td>

            <td className="px-6 py-4 text-center">
              {marks?.attendance_marks ?? 0}
            </td>

            <td className="px-6 py-4 text-center font-bold text-emerald-600">
              {marks?.total_marks ?? 0}
            </td>

          </tr>

        </tbody>

      </table>

    </div>

  </div>

</div>
      <Footer />

    </main>

  );

}