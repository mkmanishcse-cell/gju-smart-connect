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

  const [subject, setSubject] =
    useState<Subject | null>(null);

  const [students, setStudents] =
    useState<Student[]>([]);

  const [attendance, setAttendance] =
    useState<Attendance[]>([]);

  useEffect(() => {

    if (subjectId) {

      loadRegister();

    }

  }, [subjectId]);

  async function loadRegister() {

    try {

      setLoading(true);

      /* Subject */

      const {
        data: subjectData,
        error: subjectError,
      } = await supabase

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

      const {
        data: studentData,
        error: studentError,
      } = await supabase

        .from("students")

        .select(`
          id,
          roll_no,
          student_name
        `)

        .eq(
          "department_id",
          subjectData.department_id
        )

        .eq(
          "course_id",
          subjectData.course_id
        )

        .eq(
          "semester_id",
          subjectData.semester_id
        )

        .order("roll_no");

      if (studentError) {

        console.error(studentError);

        return;

      }

      setStudents(studentData ?? []);

      /* Attendance */

      const {
        data: attendanceData,
        error: attendanceError,
      } = await supabase

        .from("attendance")

        .select(`
          student_id,
          attendance_date,
          status
        `)

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

    return [
      ...new Set(
        attendance.map(
          item => item.attendance_date
        )
      ),
    ];

  }, [attendance]);
    function getAttendance(
    studentId: string,
    attendanceDate: string
  ) {

    const record = attendance.find(
      (item) =>
        item.student_id === studentId &&
        item.attendance_date === attendanceDate
    );

    return record?.status ?? "-";

  }

  function getPresentCount(
    studentId: string
  ) {

    return attendance.filter(
      (item) =>
        item.student_id === studentId &&
        item.status === "P"
    ).length;

  }

  function getPercentage(
    studentId: string
  ) {

    if (attendanceDates.length === 0)
      return "0%";

    const present =
      getPresentCount(studentId);

    return `${(
      (present / attendanceDates.length) *
      100
    ).toFixed(1)}%`;

  }

 function handlePrint() {
  exportPDF();
}

  function exportExcel() {

    const rows = students.map(
      (student) => {

        const row: Record<
          string,
          string | number
        > = {

          "Roll No": student.roll_no,

          "Student Name":
            student.student_name,

        };

        attendanceDates.forEach(
          (date) => {

            const header =
              new Date(
                date
              ).toLocaleDateString(
                "en-GB",
                {

                  day: "2-digit",

                  month: "short",

                }
              );

            row[header] =
              getAttendance(
                student.id,
                date
              );

          }
        );

        row["Present"] =
          getPresentCount(student.id);

        row["Attendance %"] =
          getPercentage(student.id);

        return row;

      }
    );

    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      "Attendance"

    );

    XLSX.writeFile(

      workbook,

      `${subject?.subject_name}_Attendance.xlsx`

    );

  }

  function exportPDF() {

    const doc =
      new jsPDF("landscape");

    const head = [[

      "Roll No",

      "Student",

      ...attendanceDates.map(
        (date) =>
          new Date(
            date
          ).toLocaleDateString(
            "en-GB",
            {

              day: "2-digit",

              month: "short",

            }
          )
      ),

      "Present",

      "%",

    ]];

    const body = students.map(
      (student) => [

        student.roll_no,

        student.student_name,

        ...attendanceDates.map(
          (date) =>
            getAttendance(
              student.id,
              date
            )
        ),

        getPresentCount(student.id),

        getPercentage(student.id),

      ]
    );

    doc.setFontSize(18);

    doc.text(

      `${subject?.subject_name} Attendance Register`,

      14,

      15

    );

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

    doc.save(

      `${subject?.subject_name}_Attendance.pdf`

    );

  }

  if (loading) {

    return <LoadingScreen />;

  }

  if (!subject) {

    return null;

  }
    return (

    <main className="min-h-screen flex flex-col bg-slate-100">

      <div className="flex-1 p-6">

        {/* Header */}

      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">

       <div className="flex w-full items-center justify-between gap-3">

            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium shadow hover:bg-slate-50 sm:rounded-xl sm:px-5 sm:py-3 sm:text-base sm:font-semibold">
              <ArrowLeft size={18} />
              Back
            </button>

            <div>

              <h1 className="text-xl font-bold text-slate-800 sm:text-3xl">
                Attendance Register
              </h1>

              <p className="text-slate-500">
                Dynamic Attendance Report
              </p>

            </div>

          </div>

          <div className="flex w-full flex-wrap justify-end gap-2 sm:w-auto sm:gap-3">

            <button
              onClick={handlePrint}
              className="rounded-lg px-3 py-2 text-xs font-medium sm:rounded-xl sm:px-5 sm:py-3 sm:text-base sm:font-semibold">
              <Printer size={18} />
              Print
            </button>

            <button
              onClick={exportPDF}
              className="rounded-lg px-3 py-2 text-xs font-medium sm:rounded-xl sm:px-5 sm:py-3 sm:text-base sm:font-semibold">
              <FileText size={18} />
              Export PDF
            </button>

            <button
              onClick={exportExcel}
              className="rounded-lg px-3 py-2 text-xs font-medium sm:rounded-xl sm:px-5 sm:py-3 sm:text-base sm:font-semibold">
              <FileSpreadsheet size={18} />
              Export Excel
            </button>

          </div>

        </div>

        {/* Subject Card */}

        <div className="mb-6 rounded-3xl bg-white shadow">

          <div className="border-b px-6 py-5">

            <h2 className="text-2xl font-bold">

              Subject Information

            </h2>

          </div>

          <div className="grid gap-4 p-4 md:grid-cols-4 md:p-6">

            <div>

              <p className="text-sm text-slate-500">

                Subject Name

              </p>

              <p className="mt-1 text-lg font-semibold">

                {subject.subject_name}

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">

                Subject Code

              </p>

              <p className="mt-1 text-lg font-semibold">

                {subject.subject_code}

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">

                Total Students

              </p>

              <p className="mt-1 text-lg font-semibold">

                {students.length}

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">

                Classes Taken

              </p>

              <p className="mt-1 text-lg font-semibold text-blue-600">

                {attendanceDates.length}

              </p>

            </div>

          </div>

        </div>

        {/* Register */}

        <div className="overflow-hidden rounded-3xl bg-white shadow">

          <div className="overflow-x-auto">

           <table className="min-w-[700px] border-collapse sm:min-w-max">

              <thead className="bg-slate-100">

                <tr>

                  <th className="sticky left-0 z-20 border bg-slate-100 px-2 py-2 text-xs sm:px-5 sm:py-3 sm:text-sm">

                    Roll No

                  </th>

                  <th className="sticky left-[130px] z-20 border bg-slate-100 px-2 py-2 text-xs sm:px-5 sm:py-3 sm:text-sm">

                    Student Name

                  </th>

                  {attendanceDates.map((date) => (

                    <th
                      key={date}
                      className="border px-4 py-3 whitespace-nowrap"
                    >

                      {new Date(date).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                        }
                      )}

                    </th>

                  ))}

                  <th className="border px-4 py-3">

                    Present

                  </th>

                  <th className="border px-4 py-3">

                    %

                  </th>

                </tr>

              </thead>

              <tbody>
                {students.map((student) => {

  const presentCount = getPresentCount(student.id);

  return (

    <tr
      key={student.id}
      className="hover:bg-slate-50"
    >

      <td className="sticky left-0 z-10 border bg-white px-5 py-3 font-medium whitespace-nowrap">
        {student.roll_no}
      </td>

      <td className="sticky left-[130px] z-10 border bg-white px-5 py-3whitespace-nowrap">
        {student.student_name}
      </td>

      {attendanceDates.map((date) => {

        const status = getAttendance(student.id, date);

        return (

          <td
            key={date}
            className="border px-3 py-3 text-center"
          >

            {status === "P" ? (

              <span className="inline-flex h-6 w-6 text-[10px] sm:h-8 sm:w-8 sm:text-base items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                P
              </span>

            ) : status === "A" ? (

              <span className="inline-flex h-6 w-6 text-[10px] sm:h-8 sm:w-8 sm:text-base items-center justify-center rounded-full bg-red-100 font-bold text-red-700">
                A
              </span>

            ) : (

              <span className="text-slate-400">
                -
              </span>

            )}

          </td>

        );

      })}

      <td className="border text-center font-bold text-green-700">
        {presentCount}
      </td>

      <td className="border text-center font-bold text-blue-700">
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