"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
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
  subject_code: string;
  subject_name: string;
};

type Assignment = {
  id: string;
  assignment_no: number;
  title: string;
  description: string;
  file_url: string | null;
  last_date: string | null;
};

export default function StudentAssignmentsPage() {

  const { subjectId } = useParams();
const router = useRouter();
  const [loading, setLoading] =
    useState(true);

  const [student, setStudent] =
    useState<Student | null>(null);

  const [subject, setSubject] =
    useState<Subject | null>(null);

  const [assignments, setAssignments] =
    useState<Assignment[]>([]);

  useEffect(() => {

    if (subjectId) {

      loadAssignments();

    }

  }, [subjectId]);

  async function loadAssignments() {

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
            /* Assignments */

      const {

        data: assignmentData,

        error: assignmentError,

      } = await supabase

        .from("assignments")

        .select(`
          id,
          assignment_no,
          title,
          description,
          file_url,
          last_date
        `)

        .eq(
          "subject_id",
          subjectId
        )

        .order(
          "assignment_no",
          {
            ascending: true,
          }
        );

      if (assignmentError) {

        console.error(assignmentError);

        return;

      }

      setAssignments(
        assignmentData ?? []
      );

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



  {/* Assignments */}

  {assignments.map((assignment) => (

    <div
      key={assignment.id}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >

      <div className="border-b bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 px-6 py-5">

        <h2 className="text-xl font-bold text-slate-800">

          Assignment {assignment.assignment_no}

        </h2>

      </div>

      <div className="space-y-6 p-6">

        {/* Title */}

        <div>

          <p className="text-sm font-medium text-slate-500">
            Title
          </p>

          <div className="mt-2 rounded-xl bg-slate-50 p-4">

            {assignment.title}

          </div>

        </div>

        {/* Description */}

        <div>

          <p className="text-sm font-medium text-slate-500">
            Description
          </p>

          <div className="mt-2 rounded-xl bg-slate-50 p-4 whitespace-pre-wrap">

            {assignment.description || "No description"}

          </div>

        </div>

        {/* Question Paper */}

        <div>

          <p className="text-sm font-medium text-slate-500">
            Question Paper
          </p>

          <div className="mt-2">

            {assignment.file_url ? (

              <a
                href={assignment.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
              >

                📄 Download Question Paper

              </a>

            ) : (

              <p className="text-slate-500">
                No file uploaded.
              </p>

            )}

          </div>

        </div>

        {/* Last Date */}

        <div>

          <p className="text-sm font-medium text-slate-500">
            Last Date
          </p>

          <div className="mt-2 rounded-xl bg-red-50 p-4 font-semibold text-red-600">

            {assignment.last_date ?? "Not Available"}

          </div>

        </div>

      </div>

    </div>

  ))}

  {assignments.length === 0 && (

    <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-28 text-center">

      <h3 className="text-xl font-semibold text-slate-700">

        No Assignments Found

      </h3>

      <p className="mt-2 text-slate-500">

        No assignments have been uploaded for this subject.

      </p>

    </div>

  )}
        

    </div>
<div className="-mx-2 sm:-mx-4 md:-mx-6 lg:-mx-8 mt-8">
        <Footer />
      </div>
  </main>

  );

}