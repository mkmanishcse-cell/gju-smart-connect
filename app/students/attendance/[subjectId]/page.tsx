"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { supabase } from "@/lib/supabase";

import LoadingScreen from "@/components/student/LoadingScreen";
import Footer from "@/components/common/Footer";

type Student = {
  id: string;
  student_name: string;
  roll_no: string;
};

type Subject = {
  id: string;
  subject_name: string;
  subject_code: string;
};

type Attendance = {
  id: string;
  attendance_date: string;
  status: string;
};

export default function StudentAttendancePage() {

  const router = useRouter();

  const { subjectId } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [student, setStudent] =
    useState<Student | null>(null);

  const [subject, setSubject] =
    useState<Subject | null>(null);

  const [attendance, setAttendance] =
    useState<Attendance[]>([]);

  useEffect(() => {

    if (subjectId) {

      loadAttendance();

    }

  }, [subjectId]);

  async function loadAttendance() {

    try {

      const session =
        sessionStorage.getItem("user");

      if (!session) {

        router.push("/login?role=student");

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
          subject_name,
          subject_code
        `)

        .eq("id", subjectId)

        .single();

      if (subjectError || !subjectData) {

        console.error(subjectError);

        return;

      }

      setSubject(subjectData);
            /* Attendance */

      const {

        data: attendanceData,

        error: attendanceError,

      } = await supabase

        .from("attendance")

        .select(`
          id,
          attendance_date,
          status
        `)

        .eq(
          "student_id",
          studentData.id
        )

        .eq(
          "subject_id",
          subjectId
        )

        .order(
          "attendance_date",
          {
            ascending: true,
          }
        );

      if (attendanceError) {

        console.error(attendanceError);

        return;

      }

      setAttendance(
        attendanceData ?? []
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  /* Attendance Summary */

  const totalClasses =
    attendance.length;

  const presentClasses =
    attendance.filter(
      (item) => item.status === "P"
    ).length;

  const absentClasses =
    attendance.filter(
      (item) => item.status === "A"
    ).length;

  const attendancePercentage =
    totalClasses === 0
      ? 0
      : Number(
          (
            (presentClasses /
              totalClasses) *
            100
          ).toFixed(1)
        );

  if (loading) {

    return <LoadingScreen />;

  }

  if (!student || !subject) {

    return null;

  }

  return (

    <main className="space-y-8">
      <div className="space-y-8">

  {/* Back Button */}

  <div>

    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
    >
      <ArrowLeft size={18} />
      Back
    </button>

  </div>

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

  {/* Attendance Summary */}

  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

    <div className="border-b bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 px-6 py-5">

      <h2 className="text-2xl font-bold text-slate-800">
        Attendance Summary
      </h2>

    </div>

    <div className="grid gap-6 p-6 md:grid-cols-4">

      <div className="rounded-2xl bg-slate-50 p-5 text-center">

        <p className="text-sm text-slate-500">
          Total Classes
        </p>

        <h3 className="mt-2 text-3xl font-bold text-slate-800">
          {totalClasses}
        </h3>

      </div>

      <div className="rounded-2xl bg-green-50 p-5 text-center">

        <p className="text-sm text-green-600">
          Present
        </p>

        <h3 className="mt-2 text-3xl font-bold text-green-700">
          {presentClasses}
        </h3>

      </div>

      <div className="rounded-2xl bg-red-50 p-5 text-center">

        <p className="text-sm text-red-600">
          Absent
        </p>

        <h3 className="mt-2 text-3xl font-bold text-red-700">
          {absentClasses}
        </h3>

      </div>

      <div className="rounded-2xl bg-blue-50 p-5 text-center">

        <p className="text-sm text-blue-600">
          Attendance %
        </p>

        <h3 className="mt-2 text-3xl font-bold text-blue-700">
          {attendancePercentage}%
        </h3>

      </div>

    </div>

  </div>

  {/* Attendance History */}

  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

    <div className="border-b bg-slate-50 px-6 py-5">

      <h2 className="text-2xl font-bold text-slate-800">
        Attendance History
      </h2>

    </div>

    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-6 py-4 text-left">
              Date
            </th>

            <th className="px-6 py-4 text-center">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {attendance.map((item) => (

            <tr
              key={item.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="px-6 py-4">

                {new Date(
                  item.attendance_date
                ).toLocaleDateString("en-IN")}

              </td>

              <td className="px-6 py-4 text-center">

                {item.status === "P" ? (

                  <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">

                    Present

                  </span>

                ) : (

                  <span className="rounded-full bg-red-100 px-4 py-1 text-sm font-semibold text-red-700">

                    Absent

                  </span>

                )}

              </td>

            </tr>

          ))}

          {attendance.length === 0 && (

            <tr>

              <td
                colSpan={2}
                className="py-12 text-center text-slate-500"
              >

                No attendance records found.

              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>

  </div>

</div>
            <Footer />

    </main>

  );

}