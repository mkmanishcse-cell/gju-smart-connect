"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Printer,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import { supabase } from "@/lib/supabase";

import LoadingScreen from "@/components/teacher/LoadingScreen";
import Footer from "@/components/common/Footer";

type Student = {
  id: string;
  roll_no: string;
  student_name: string;

  minor1: number;
  minor2: number;
  minor3: number;

  best_two_average: number;

  assignment_marks: number;

  attendance_marks: number;

  total_marks: number;
};

export default function ViewMarksRegisterPage() {
  const router = useRouter();

  const { id } = useParams();

  const subjectId = id as string;

  const [loading, setLoading] = useState(true);

  const [subjectName, setSubjectName] = useState("");

  const [subjectCode, setSubjectCode] = useState("");

  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    loadRegister();
  }, []);

  async function loadRegister() {
    try {
      setLoading(true);

      const { data: subject } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", subjectId)
        .single();

      if (!subject) return;

      setSubjectName(subject.subject_name);

      setSubjectCode(subject.subject_code);

      const { data: studentData, error: studentsError } = await supabase
        .from("students")
        .select("*")
        .eq("department_id", subject.department_id)
        .eq("course_id", subject.course_id)
        .eq("semester_id", subject.semester_id)
        .order("roll_no");

      if (studentsError || !studentData) {
        console.log(studentsError);
        return;
      }

      const studentIds = studentData.map((s) => s.id);

      // Fetch ALL marks for these students + this subject in ONE query
      // instead of one query per student (this was the main slowdown).
      let marksData: any[] = [];

      if (studentIds.length > 0) {
        const { data: marksResult, error: marksError } = await supabase
          .from("marks")
          .select("*")
          .eq("subject_id", subjectId)
          .in("student_id", studentIds);

        if (marksError) {
          console.log(marksError);
        } else {
          marksData = marksResult || [];
        }
      }

      const marksMap = new Map<string, any>();
      for (const mark of marksData) {
        marksMap.set(mark.student_id, mark);
      }

      const list: Student[] = studentData.map((student) => {
        const mark = marksMap.get(student.id);

        return {
          id: student.id,
          roll_no: student.roll_no,
          student_name: student.student_name,
          minor1: mark?.minor1 || 0,
          minor2: mark?.minor2 || 0,
          minor3: mark?.minor3 || 0,
          best_two_average: mark?.best_two_average || 0,
          assignment_marks: mark?.assignment_marks || 0,
          attendance_marks: mark?.attendance_marks || 0,
          total_marks: mark?.total_marks || 0,
        };
      });

      setStudents(list);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingScreen />;
  }

  /* ================= PDF BUILDER (shared by Export + Print) ================= */

  function buildPdfDoc() {
    const doc = new jsPDF("landscape");

    autoTable(doc, {
      head: [
        [
          "Roll",
          "Student",
          "M1",
          "M2",
          "M3",
          "Best 2",
          "Assignment",
          "Attendance",
          "Total",
        ],
      ],

      body: students.map((student) => [
        student.roll_no,
        student.student_name,
        student.minor1,
        student.minor2,
        student.minor3,
        student.best_two_average.toFixed(1),
        student.assignment_marks,
        student.attendance_marks,
        student.total_marks,
      ]),

      startY: 25,

      styles: {
        fontSize: 8,
        halign: "center",
      },

      headStyles: {
        fillColor: [37, 99, 235],
      },
    });

    doc.setFontSize(18);

    doc.text(`${subjectName} Marks Register`, 14, 15);

    return doc;
  }

  function exportExcel() {
    const rows = students.map((student) => ({
      "Roll No": student.roll_no,
      "Student Name": student.student_name,
      "Minor 1": student.minor1,
      "Minor 2": student.minor2,
      "Minor 3": student.minor3,
      "Best 2 Avg": student.best_two_average,
      Assignment: student.assignment_marks,
      Attendance: student.attendance_marks,
      Total: student.total_marks,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Marks Register");

    XLSX.writeFile(workbook, `${subjectName}_Marks_Register.xlsx`);
  }

  function exportPDF() {
    const doc = buildPdfDoc();

    doc.save(`${subjectName}_Marks_Register.pdf`);
  }

  function handlePrint() {
    const doc = buildPdfDoc();

    doc.autoPrint();

    window.open(doc.output("bloburl"), "_blank");
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="flex-1 p-3 sm:p-6">
        {/* ================= HEADER ================= */}

        <div className="mb-4 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 px-4 py-4 shadow-xl sm:mb-6 sm:rounded-3xl sm:px-8 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-white shadow backdrop-blur-md transition hover:bg-white/30 sm:h-auto sm:w-auto sm:gap-2 sm:rounded-2xl sm:px-6 sm:py-3 sm:font-semibold"
              >
                <ArrowLeft size={18} className="sm:hidden" />
                <ArrowLeft size={18} className="hidden sm:block" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <div>
                <h1 className="text-xl font-bold text-white sm:text-3xl">
                  Marks Register
                </h1>
                <p className="hidden text-sm text-blue-100 sm:block">
                  View Marks Register
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-1.5 sm:gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-2 text-xs font-medium text-white shadow transition hover:bg-slate-900 sm:gap-2 sm:rounded-xl sm:px-5 sm:py-3 sm:text-base sm:font-semibold"
              >
                <Printer size={14} className="sm:hidden" />
                <Printer size={18} className="hidden sm:block" />
                <span>Print</span>
              </button>

              <button
                onClick={exportPDF}
                className="flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-2 text-xs font-medium text-white shadow transition hover:bg-red-700 sm:gap-2 sm:rounded-xl sm:px-5 sm:py-3 sm:text-base sm:font-semibold"
              >
                <FileText size={14} className="sm:hidden" />
                <FileText size={18} className="hidden sm:block" />
                <span className="hidden xs:inline sm:inline">Export PDF</span>
                <span className="xs:hidden sm:hidden">PDF</span>
              </button>

              <button
                onClick={exportExcel}
                className="flex items-center gap-1 rounded-lg bg-green-600 px-2.5 py-2 text-xs font-medium text-white shadow transition hover:bg-green-700 sm:gap-2 sm:rounded-xl sm:px-5 sm:py-3 sm:text-base sm:font-semibold"
              >
                <FileSpreadsheet size={14} className="sm:hidden" />
                <FileSpreadsheet size={18} className="hidden sm:block" />
                <span className="hidden xs:inline sm:inline">Export Excel</span>
                <span className="xs:hidden sm:hidden">Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= SUBJECT INFO ================= */}

        <div className="mb-4 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-4 text-white shadow-xl sm:mb-6 sm:rounded-3xl sm:p-6">
          <h2 className="text-base font-bold sm:text-xl">
            Subject Information
          </h2>

          <div className="mt-3 grid grid-cols-2 gap-4 sm:mt-4 sm:gap-6 md:grid-cols-3">
            <div>
              <p className="text-xs text-sky-100 sm:text-sm">
                Subject Name
              </p>
              <p className="mt-1 text-sm font-semibold sm:text-lg">
                {subjectName}
              </p>
            </div>

            <div>
              <p className="text-xs text-sky-100 sm:text-sm">
                Subject Code
              </p>
              <p className="mt-1 text-sm font-semibold sm:text-lg">
                {subjectCode}
              </p>
            </div>

            <div className="col-span-2 md:col-span-1">
              <p className="text-xs text-sky-100 sm:text-sm">
                Total Students
              </p>
              <p className="mt-1 text-sm font-semibold sm:text-lg">
                {students.length}
              </p>
            </div>
          </div>
        </div>

        {/* ================= TABLE ================= */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-xl sm:rounded-3xl">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="whitespace-nowrap px-2 py-2.5 sm:px-4 sm:py-4">
                    Roll
                  </th>
                  <th className="whitespace-nowrap px-2 py-2.5 sm:px-4 sm:py-4">
                    Student
                  </th>
                  <th className="whitespace-nowrap px-1.5 py-2.5 sm:px-4 sm:py-4">
                    M1
                  </th>
                  <th className="whitespace-nowrap px-1.5 py-2.5 sm:px-4 sm:py-4">
                    M2
                  </th>
                  <th className="whitespace-nowrap px-1.5 py-2.5 sm:px-4 sm:py-4">
                    M3
                  </th>
                  <th className="whitespace-nowrap px-1.5 py-2.5 sm:px-4 sm:py-4">
                    Best 2
                  </th>
                  <th className="whitespace-nowrap px-1.5 py-2.5 sm:px-4 sm:py-4">
                    Assignment
                  </th>
                  <th className="whitespace-nowrap px-1.5 py-2.5 sm:px-4 sm:py-4">
                    Attendance
                  </th>
                  <th className="whitespace-nowrap px-2 py-2.5 sm:px-4 sm:py-4">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-t hover:bg-sky-50">
                    <td className="px-2 py-2 font-semibold sm:px-4 sm:py-3">
                      {student.roll_no}
                    </td>

                    <td className="whitespace-nowrap px-2 py-2 sm:px-4 sm:py-3">
                      {student.student_name}
                    </td>

                    <td className="px-2 py-2 text-center sm:px-4 sm:py-3">
                      {student.minor1}
                    </td>

                    <td className="px-2 py-2 text-center sm:px-4 sm:py-3">
                      {student.minor2}
                    </td>

                    <td className="px-2 py-2 text-center sm:px-4 sm:py-3">
                      {student.minor3}
                    </td>

                    <td className="px-2 py-2 text-center font-bold text-blue-600 sm:px-4 sm:py-3">
                      {student.best_two_average.toFixed(1)}
                    </td>

                    <td className="px-2 py-2 text-center sm:px-4 sm:py-3">
                      {student.assignment_marks}
                    </td>

                    <td className="px-2 py-2 text-center sm:px-4 sm:py-3">
                      {student.attendance_marks}
                    </td>

                    <td className="px-2 py-2 text-center font-bold text-green-600 sm:px-4 sm:py-3">
                      {student.total_marks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}