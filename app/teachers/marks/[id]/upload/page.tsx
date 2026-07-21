"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as XLSX from "xlsx";

import { supabase } from "@/lib/supabase";
import Footer from "@/components/common/Footer";
import LoadingScreen from "@/components/teacher/LoadingScreen";

import {
  ArrowLeft,
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
} from "lucide-react";

/* =====================================================
   TYPES
===================================================== */

type ExcelMarkRow = {
  "Roll No": string | number;
  Minor1?: number;
  Minor2?: number;
  Minor3?: number;
  Assignment?: number;
  Attendance?: number;
};

type StudentLite = {
  id: string;
  roll_no: string;
  student_name: string;
};

/* =====================================================
   PAGE
===================================================== */

export default function UploadMarksPage() {
  const { id } = useParams();
  const subjectId = id as string;

  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");

  const [students, setStudents] = useState<StudentLite[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [rows, setRows] = useState<ExcelMarkRow[]>([]);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failedRows, setFailedRows] = useState<string[]>([]);

  /* ===========================
      LOAD SUBJECT + STUDENTS
  =========================== */

  useEffect(() => {
    loadSubjectAndStudents();
  }, []);

  async function loadSubjectAndStudents() {
    try {
      setLoading(true);

      const { data: subject, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", subjectId)
        .single();

      if (error || !subject) {
        console.log(error);
        return;
      }

      setSubjectName(subject.subject_name);
      setSubjectCode(subject.subject_code);

      const { data: studentRows, error: studentError } = await supabase
        .from("students")
        .select("id, roll_no, student_name")
        .eq("department_id", subject.department_id)
        .eq("course_id", subject.course_id)
        .eq("semester_id", subject.semester_id)
        .order("roll_no");

      if (studentError) {
        console.log(studentError);
        return;
      }

      setStudents(studentRows ?? []);
    } finally {
      setLoading(false);
    }
  }

  /* ===========================
      FILE PICKER
  =========================== */

  function chooseFile() {
    inputRef.current?.click();
  }

  async function readExcel(selected: File) {
    const buffer = await selected.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<ExcelMarkRow>(sheet);

    if (json.length === 0) {
      alert("Excel file is empty.");
      return;
    }

    setRows(json);
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    await readExcel(selected);
  }

  async function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);

    const selected = e.dataTransfer.files?.[0];
    if (!selected) return;

    setFile(selected);
    await readExcel(selected);
  }

  /* ===========================
      HELPERS
  =========================== */

  function clamp(value: number, min: number, max: number) {
    if (isNaN(value)) return min;
    return Math.min(Math.max(value, min), max);
  }

  function calculateTotals(
    minor1: number,
    minor2: number,
    minor3: number,
    assignment: number,
    attendance: number
  ) {
    const sortedMinors = [minor1, minor2, minor3].sort((a, b) => b - a);
    const bestTwoAverage = Number(
      ((sortedMinors[0] + sortedMinors[1]) / 2).toFixed(1)
    );
    const total = Math.round(bestTwoAverage + assignment + attendance);
    return { bestTwoAverage, total };
  }

  /* ===========================
      UPLOAD MARKS
  =========================== */

  async function uploadMarks() {
    if (rows.length === 0) {
      alert("Please select an Excel file.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setSuccessCount(0);
    setFailedRows([]);

    const studentMap = new Map(
      students.map((student) => [
        student.roll_no.trim().toLowerCase(),
        student,
      ])
    );

    let success = 0;
    const failed: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      const rollNo = String(row["Roll No"] ?? "").trim();

      if (!rollNo) {
        failed.push(`Row ${i + 2} : Roll No missing`);
        continue;
      }

      const student = studentMap.get(rollNo.toLowerCase());

      if (!student) {
        failed.push(`${rollNo} : Student not found in this subject`);
        continue;
      }

      const minor1 = clamp(Number(row.Minor1 ?? 0), 0, 20);
      const minor2 = clamp(Number(row.Minor2 ?? 0), 0, 20);
      const minor3 = clamp(Number(row.Minor3 ?? 0), 0, 20);
      const assignment = clamp(Number(row.Assignment ?? 0), 0, 6);
      const attendance = clamp(Number(row.Attendance ?? 0), 0, 4);

      const { bestTwoAverage, total } = calculateTotals(
        minor1,
        minor2,
        minor3,
        assignment,
        attendance
      );

      const payload = {
        student_id: student.id,
        subject_id: subjectId,
        minor1,
        minor2,
        minor3,
        best_two_average: bestTwoAverage,
        assignment_marks: assignment,
        attendance_marks: attendance,
        total_marks: total,
        updated_at: new Date().toISOString(),
      };

      const { data: existing } = await supabase
        .from("marks")
        .select("id")
        .eq("student_id", student.id)
        .eq("subject_id", subjectId)
        .maybeSingle();

      const { error } = existing
        ? await supabase.from("marks").update(payload).eq("id", existing.id)
        : await supabase.from("marks").insert(payload);

      if (error) {
        failed.push(`${rollNo} : ${error.message}`);
        continue;
      }

      success++;
      setSuccessCount(success);
      setProgress(Math.round(((i + 1) / rows.length) * 100));
    }

    setFailedRows(failed);
    setUploading(false);
    setProgress(100);

    if (failed.length === 0) {
      alert(`${success} student(s) marks uploaded successfully.`);
    } else {
      alert(`${success} uploaded successfully.\n\n${failed.length} failed.`);
      console.table(failed);
    }
  }

  if (loading) {
    return <LoadingScreen />;
  }

 return (
  <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
    <div className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      {/* ================= HEADER ================= */}

      <div className="mb-5 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href={`/teachers/marks/${subjectId}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-indigo-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 sm:h-12 sm:w-12 sm:rounded-2xl"
          >
            <ArrowLeft size={18} className="sm:hidden" />
            <ArrowLeft size={20} className="hidden sm:block" />
          </Link>

          <div>
            <h1 className="bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 bg-clip-text text-xl font-extrabold text-transparent sm:text-2xl lg:text-3xl">
              Upload Marks
            </h1>
            <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
              {subjectName} ({subjectCode})
            </p>
          </div>
        </div>
      </div>

      {/* ================= HERO ================= */}

      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-[18px] text-white shadow-xl sm:rounded-3xl sm:p-9">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 sm:gap-3">
              <FileSpreadsheet size={21} className="sm:hidden" />
              <FileSpreadsheet size={32} className="hidden sm:block" />
              <span className="text-sm font-semibold sm:text-lg">
                Excel Upload
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-extrabold sm:mt-6 sm:text-[52px]">
              Marks Upload
            </h2>

            <p className="mt-2 max-w-2xl text-xs text-blue-100 sm:mt-4 sm:text-lg">
              Upload all students' marks in one click.
            </p>
          </div>

          <UploadCloud size={63} className="opacity-20 sm:hidden" />
          <UploadCloud size={179} className="hidden opacity-20 sm:block" />
        </div>
      </div>

      {/* ================= CARD ================= */}

      <div className="mt-5 rounded-2xl bg-white p-[17px] shadow-xl sm:mt-8 sm:rounded-3xl sm:p-[34px]">
        <input
          ref={inputRef}
          hidden
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={onFileChange}
        />

        <div
          onDrop={onDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          className={`rounded-2xl border-2 border-dashed p-[21px] text-center transition sm:rounded-3xl sm:p-[50px] ${
            dragging ? "border-blue-600 bg-blue-50" : "border-slate-300"
          }`}
        >
          <UploadCloud size={42} className="mx-auto text-blue-600 sm:hidden" />
          <UploadCloud
            size={74}
            className="mx-auto hidden text-blue-600 sm:block"
          />

          <h2 className="mt-3 text-lg font-bold sm:mt-6 sm:text-[32px]">
            Drag & Drop Excel File
          </h2>

          <p className="mt-2 text-xs text-slate-500 sm:mt-3 sm:text-base">
            or browse your computer
          </p>

          <button
            type="button"
            onClick={chooseFile}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 sm:mt-8 sm:rounded-2xl sm:px-[34px] sm:py-[17px] sm:text-base sm:shadow-lg"
          >
            Choose Excel File
          </button>

          <div className="mt-4 flex justify-center gap-2 sm:mt-8 sm:gap-4">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700 sm:px-4 sm:py-2 sm:text-base">
              XLSX
            </span>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-700 sm:px-4 sm:py-2 sm:text-base">
              XLS
            </span>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700 sm:px-4 sm:py-2 sm:text-base">
              CSV
            </span>
          </div>
        </div>

        {/* FILE CARD */}

        {file && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 sm:mt-8 sm:rounded-2xl sm:p-[21px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="rounded-lg bg-white p-2 shadow sm:rounded-xl sm:p-[17px]">
                  <FileSpreadsheet
                    size={24}
                    className="text-green-600 sm:hidden"
                  />
                  <FileSpreadsheet
                    size={44}
                    className="hidden text-green-600 sm:block"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold sm:text-xl">
                    {file.name}
                  </h3>
                  <p className="text-xs text-slate-500 sm:text-base">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>

              <CheckCircle2
                size={22}
                className="text-green-600 sm:hidden"
              />
              <CheckCircle2
                size={38}
                className="hidden text-green-600 sm:block"
              />
            </div>
          </div>
        )}

        {/* BUTTONS */}

        <div className="mt-4 flex justify-center gap-2 sm:mt-8 sm:gap-5">
          <Link
            href="/sample-marks.xlsx"
            download
            className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-slate-50 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
          >
            <Download size={14} className="sm:hidden" />
            <Download size={18} className="hidden sm:block" />
            Sample
          </Link>

          <button
            type="button"
            onClick={uploadMarks}
            disabled={!file || uploading}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition sm:rounded-xl sm:px-8 sm:py-3 sm:text-base ${
              file && !uploading
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-slate-400"
            }`}
          >
            <UploadCloud size={14} className="sm:hidden" />
            <UploadCloud size={18} className="hidden sm:block" />
            {uploading ? "Uploading..." : "Upload Marks"}
          </button>
        </div>

        {/* ================= PREVIEW ================= */}

        {rows.length > 0 && (
          <div className="mt-6 sm:mt-10">
            <div className="mb-3 flex items-center justify-between sm:mb-5">
              <h2 className="text-base font-bold sm:text-2xl">
                Excel Preview
              </h2>

              <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 sm:px-4 sm:py-2 sm:text-base">
                {rows.length} Rows
              </div>
            </div>

            <div className="overflow-auto rounded-xl border sm:rounded-2xl">
              <table className="min-w-full text-xs sm:text-[15px]">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-2 text-left sm:p-[13px]">Roll No</th>
                    <th className="p-2 text-center sm:p-[13px]">Minor1</th>
                    <th className="p-2 text-center sm:p-[13px]">Minor2</th>
                    <th className="p-2 text-center sm:p-[13px]">Minor3</th>
                    <th className="p-2 text-center sm:p-[13px]">Assign.</th>
                    <th className="p-2 text-center sm:p-[13px]">Attend.</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.slice(0, 5).map((row, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2 sm:p-[13px]">{row["Roll No"]}</td>
                      <td className="p-2 text-center sm:p-[13px]">
                        {row.Minor1 ?? 0}
                      </td>
                      <td className="p-2 text-center sm:p-[13px]">
                        {row.Minor2 ?? 0}
                      </td>
                      <td className="p-2 text-center sm:p-[13px]">
                        {row.Minor3 ?? 0}
                      </td>
                      <td className="p-2 text-center sm:p-[13px]">
                        {row.Assignment ?? 0}
                      </td>
                      <td className="p-2 text-center sm:p-[13px]">
                        {row.Attendance ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {rows.length > 5 && (
              <p className="mt-2 text-xs text-slate-500 sm:mt-3 sm:text-sm">
                Showing first 5 rows out of {rows.length}
              </p>
            )}
          </div>
        )}

        {/* ================= PROGRESS ================= */}

        <div className="mt-6 sm:mt-10">
          <div className="mb-2 flex justify-between sm:mb-3">
            <span className="text-xs font-semibold sm:text-base">
              Upload Progress
            </span>
            <span className="text-xs font-bold text-blue-600 sm:text-base">
              {progress}%
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 sm:h-[17px]">
            <div
              style={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
            />
          </div>
        </div>

        {/* ================= SUMMARY ================= */}

        {(successCount > 0 || failedRows.length > 0) && (
          <div className="mt-6 rounded-xl border bg-slate-50 p-4 sm:mt-10 sm:rounded-2xl sm:p-[25px]">
            <h2 className="text-base font-bold sm:text-xl">
              Upload Summary
            </h2>

            <div className="mt-3 flex gap-6 sm:mt-5 sm:gap-10">
              <div>
                <p className="text-xs font-semibold text-green-600 sm:text-base">
                  Uploaded
                </p>
                <h3 className="text-2xl font-bold sm:text-[42px]">
                  {successCount}
                </h3>
              </div>

              <div>
                <p className="text-xs font-semibold text-red-600 sm:text-base">
                  Failed
                </p>
                <h3 className="text-2xl font-bold sm:text-[42px]">
                  {failedRows.length}
                </h3>
              </div>
            </div>

            {failedRows.length > 0 && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 sm:mt-6 sm:rounded-xl sm:p-[17px]">
                <h3 className="text-sm font-bold text-red-700 sm:text-base">
                  Failed Rows
                </h3>

                <div className="mt-2 max-h-56 overflow-auto sm:mt-3">
                  {failedRows.map((item, index) => (
                    <p key={index} className="text-xs text-red-600 sm:text-sm">
                      • {item}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-2 sm:mt-6 sm:gap-4">
              <button
                type="button"
                onClick={() => {
                  setRows([]);
                  setFile(null);
                  setProgress(0);
                  setSuccessCount(0);
                  setFailedRows([]);
                }}
                className="flex-1 rounded-lg bg-slate-700 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 sm:flex-none sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
              >
                Reset
              </button>

              {successCount > 0 && (
                <Link
                  href={`/teachers/marks/${subjectId}`}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-center text-xs font-semibold text-white hover:bg-green-700 sm:flex-none sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
                >
                  View Marks Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>

    <Footer />
  </main>
);
}