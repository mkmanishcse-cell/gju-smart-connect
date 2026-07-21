"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  FileText,
  FileSpreadsheet,
} from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import { supabase } from "@/lib/supabase";

import LoadingScreen from "@/components/teacher/LoadingScreen";
import Footer from "@/components/common/Footer";

type Subject = {
  id: string;
  subject_name: string;
  subject_code: string;
  department_id: string;
  course_id: string;
  semester_id: string;
};

type Student = {
  id: string;
  roll_no: string;
  student_name: string;
};

type Attendance = {
  student_id: string;
  attendance_date: string;
  status: "P" | "A";
};

export default function AttendanceRegisterPage() {
  const router = useRouter();

  const params = useParams();

  const subjectId = params.id as string;

  const [loading, setLoading] = useState(true);

  const [subject, setSubject] = useState<Subject | null>(null);

  const [students, setStudents] = useState<Student[]>([]);

  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    if (subjectId) {
      loadRegister();
    }
  }, [subjectId]);

  async function loadRegister() {
    try {
      setLoading(true);

      /* Subject */

      const { data: subjectData, error: subjectError } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", subjectId)
        .single();

      if (subjectError || !subjectData) {
        console.error(subjectError);
        return;
      }

      setSubject(subjectData);

      /* Students */

      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select(
          `
          id,
          roll_no,
          student_name
        `
        )
        .eq("department_id", subjectData.department_id)
        .eq("course_id", subjectData.course_id)
        .eq("semester_id", subjectData.semester_id)
        .order("roll_no");

      if (studentError) {
        console.error(studentError);
        return;
      }

      setStudents(studentData ?? []);

      /* Attendance */

      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select(
          `
          student_id,
          attendance_date,
          status
        `
        )
        .eq("subject_id", subjectId)
        .order("attendance_date");

      if (attendanceError) {
        console.error(attendanceError);
        return;
      }

      setAttendance(attendanceData ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const attendanceDates = useMemo(() => {
    return [...new Set(attendance.map((item) => item.attendance_date))];
  }, [attendance]);

  function getAttendance(studentId: string, attendanceDate: string) {
    const record = attendance.find(
      (item) =>
        item.student_id === studentId &&
        item.attendance_date === attendanceDate
    );

    return record?.status ?? "-";
  }

  function getPresentCount(studentId: string) {
    return attendance.filter(
      (item) => item.student_id === studentId && item.status === "P"
    ).length;
  }

  function getPercentage(studentId: string) {
    if (attendanceDates.length === 0) return "0%";

    const present = getPresentCount(studentId);

    return `${((present / attendanceDates.length) * 100).toFixed(1)}%`;
  }

 function handlePrint() {
  exportPDF(true);
}

  function exportExcel() {
    const rows = students.map((student) => {
      const row: Record<string, string | number> = {
        "Roll No": student.roll_no,
        "Student Name": student.student_name,
      };

      attendanceDates.forEach((date) => {
        const header = new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        });

        row[header] = getAttendance(student.id, date);
      });

      row["Present"] = getPresentCount(student.id);

      row["Attendance %"] = getPercentage(student.id);

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    XLSX.writeFile(workbook, `${subject?.subject_name}_Attendance.xlsx`);
  }

  function exportPDF(print = false) {
  const doc = new jsPDF("landscape");

  const head = [
    [
      "Roll No",
      "Student",
      ...attendanceDates.map((date) =>
        new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })
      ),
      "Present",
      "%",
    ],
  ];

  const body = students.map((student) => [
    student.roll_no,
    student.student_name,
    ...attendanceDates.map((date) => getAttendance(student.id, date)),
    getPresentCount(student.id),
    getPercentage(student.id),
  ]);

  doc.setFontSize(18);
  doc.text(`${subject?.subject_name} Attendance Register`, 14, 15);

  autoTable(doc, {
    head,
    body,
    startY: 22,
    styles: {
      fontSize: 8,
      halign: "center",
    },
    headStyles: {
      fillColor: [37, 99, 235],
    },
  });

  if (print) {
    doc.autoPrint();

    const pdfBlob = doc.output("bloburl");
    window.open(pdfBlob, "_blank");
  } else {
    doc.save(`${subject?.subject_name}_Attendance.pdf`);
  }
}

  if (loading) {
    return <LoadingScreen />;
  }

  if (!subject) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-100">
      <div className="flex-1 p-3 sm:p-6">
        {/* Header */}

        <div className="mb-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-4 py-4 shadow-xl sm:mb-6 sm:rounded-3xl sm:px-8 sm:py-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-cyan-300 font-semibold text-slate-800 shadow-lg transition hover:bg-cyan-200 sm:h-auto sm:w-auto sm:gap-2 sm:rounded-2xl sm:px-6 sm:py-3"
            >
              <ArrowLeft size={18} className="sm:hidden" />
              <ArrowLeft size={18} className="hidden sm:block" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div>
              <h1 className="text-xl font-bold text-white sm:text-3xl">
                Attendance Register
              </h1>
              <p className="hidden text-sm text-slate-700 sm:block">
                Dynamic Attendance Report
              </p>
            </div>
          </div>

          <div className="mt-3 flex justify-end gap-1.5 sm:mt-4 sm:gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-2 text-xs font-medium text-white sm:gap-2 sm:rounded-xl sm:px-5 sm:py-3 sm:text-base sm:font-semibold"
            >
              <Printer size={14} className="sm:hidden" />
              <Printer size={18} className="hidden sm:block" />
              <span>Print</span>
            </button>

            <button
              onClick={() => exportPDF(false)}
              className="flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-2 text-xs font-medium text-white sm:gap-2 sm:rounded-xl sm:px-5 sm:py-3 sm:text-base sm:font-semibold"
            >
              <FileText size={14} className="sm:hidden" />
              <FileText size={18} className="hidden sm:block" />
              <span className="hidden xs:inline sm:inline">Export PDF</span>
              <span className="xs:hidden sm:hidden">PDF</span>
            </button>

            <button
              onClick={exportExcel}
              className="flex items-center gap-1 rounded-lg bg-green-600 px-2.5 py-2 text-xs font-medium text-white sm:gap-2 sm:rounded-xl sm:px-5 sm:py-3 sm:text-base sm:font-semibold"
            >
              <FileSpreadsheet size={14} className="sm:hidden" />
              <FileSpreadsheet size={18} className="hidden sm:block" />
              <span className="hidden xs:inline sm:inline">Export Excel</span>
              <span className="xs:hidden sm:hidden">Excel</span>
            </button>
          </div>
        </div>

        {/* Subject Card */}

        <div className="mb-4 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-white shadow-lg sm:mb-6 sm:rounded-3xl">
          <div className="border-b border-blue-100 bg-blue-50 px-4 py-3 sm:px-6 sm:py-5">
            <h2 className="text-lg font-bold sm:text-2xl">
              Subject Information
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 sm:gap-4 sm:p-4 md:grid-cols-4 md:p-6">
            <div>
              <p className="text-xs text-slate-500 sm:text-sm">
                Subject Name
              </p>
              <p className="mt-1 text-sm font-semibold sm:text-lg">
                {subject.subject_name}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 sm:text-sm">
                Subject Code
              </p>
              <p className="mt-1 text-sm font-semibold sm:text-lg">
                {subject.subject_code}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 sm:text-sm">
                Total Students
              </p>
              <p className="mt-1 text-sm font-semibold sm:text-lg">
                {students.length}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 sm:text-sm">
                Classes Taken
              </p>
              <p className="mt-1 text-sm font-semibold text-blue-600 sm:text-lg">
                {attendanceDates.length}
              </p>
            </div>
          </div>
        </div>

        {/* Register */}

        <div className="overflow-hidden rounded-2xl bg-white shadow sm:rounded-3xl">
          <h2 className="mb-2 mt-2 ms-2 text-lg font-bold sm:mt-2 sm:mb-2 sm:text-2xl">
            Attendance Table
          </h2>

          <div className="max-h-[65vh] overflow-auto sm:max-h-[75vh]">
            <table className="min-w-[700px] border-separate border-spacing-0 text-xs sm:min-w-max sm:text-sm">
              <thead className="sticky top-0 z-30 bg-slate-100 shadow-sm">
                <tr>
                  <th className="sticky left-0 top-0 z-40 w-[90px] border-b border-slate-200 bg-slate-100 px-2 py-2.5 text-left text-xs font-semibold whitespace-nowrap sm:w-[110px] sm:px-3 sm:py-3 sm:text-sm">
                    Roll No
                  </th>

                  <th className="sticky top-0 z-20 border-b border-slate-200 bg-slate-100 px-2 py-2.5 text-left whitespace-nowrap sm:px-3 sm:py-3">
                    Student Name
                  </th>

                  {attendanceDates.map((date) => (
                    <th
                      key={date}
                      className="sticky top-0 z-20 border-b border-slate-200 bg-slate-100 px-2 py-2.5 whitespace-nowrap sm:px-4 sm:py-3"
                    >
                      {new Date(date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </th>
                  ))}

                  <th className="sticky top-0 z-20 border-b border-slate-200 bg-slate-100 px-2 py-2.5 sm:px-4 sm:py-3">
                    Present
                  </th>

                  <th className="sticky top-0 z-20 border-b border-slate-200 bg-slate-100 px-2 py-2.5 sm:px-4 sm:py-3">
                    %
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => {
                  const presentCount = getPresentCount(student.id);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50">
                      <td className="sticky left-0 z-10 w-[90px] border-b border-slate-100 bg-white px-2 py-2 font-medium whitespace-nowrap sm:w-[110px] sm:px-3 sm:py-3">
                        {student.roll_no}
                      </td>

                      <td className="border-b border-slate-100 px-2 py-2 whitespace-nowrap sm:px-3 sm:py-3">
                        {student.student_name}
                      </td>

                      {attendanceDates.map((date) => {
                        const status = getAttendance(student.id, date);

                        return (
                          <td
                            key={date}
                            className="border-b border-slate-100 px-2 py-2 text-center sm:px-3 sm:py-3"
                          >
                            {status === "P" ? (
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-[10px] font-bold text-green-700 sm:h-8 sm:w-8 sm:text-base">
                                P
                              </span>
                            ) : status === "A" ? (
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-700 sm:h-8 sm:w-8 sm:text-base">
                                A
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                        );
                      })}

                      <td className="border-b border-slate-100 px-2 py-2 text-center font-bold text-green-700 sm:px-4 sm:py-3">
                        {presentCount}
                      </td>

                      <td className="border-b border-slate-100 px-2 py-2 text-center font-bold text-blue-700 sm:px-4 sm:py-3">
                        {getPercentage(student.id)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}