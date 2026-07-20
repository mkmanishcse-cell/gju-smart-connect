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
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="mx-auto max-w-7xl px-8 py-8">
        {/* ================= HEADER ================= */}

        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Upload Marks
            </h1>

            <p className="mt-2 text-slate-500">
              {subjectName} ({subjectCode})
            </p>
          </div>

          <Link
            href={`/teachers/marks/${subjectId}`}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-blue-700"
          >
            <ArrowLeft size={20} />
            Back to Marks
          </Link>
        </div>

        {/* ================= HERO ================= */}

        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <FileSpreadsheet size={30} />
                <span className="text-lg font-semibold">Excel Upload</span>
              </div>

              <h2 className="mt-6 text-5xl font-extrabold">
                Marks Upload
              </h2>

              <p className="mt-4 max-w-2xl text-lg text-blue-100">
                Upload all students' marks in one click.
              </p>
            </div>

            <UploadCloud size={170} className="opacity-20" />
          </div>
        </div>

        {/* ================= CARD ================= */}

        <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">
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
            className={`rounded-3xl border-2 border-dashed p-12 text-center transition ${
              dragging ? "border-blue-600 bg-blue-50" : "border-slate-300"
            }`}
          >
            <UploadCloud size={70} className="mx-auto text-blue-600" />

            <h2 className="mt-6 text-3xl font-bold">
              Drag & Drop Excel File
            </h2>

            <p className="mt-3 text-slate-500">or browse your computer</p>

            <button
              type="button"
              onClick={chooseFile}
              className="mt-8 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg hover:bg-blue-700"
            >
              Choose Excel File
            </button>

            <div className="mt-8 flex justify-center gap-4">
              <span className="rounded-full bg-green-100 px-4 py-2 text-green-700">
                XLSX
              </span>
              <span className="rounded-full bg-orange-100 px-4 py-2 text-orange-700">
                XLS
              </span>
              <span className="rounded-full bg-purple-100 px-4 py-2 text-purple-700">
                CSV
              </span>
            </div>
          </div>

          {/* FILE CARD */}

          {file && (
            <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-white p-4 shadow">
                    <FileSpreadsheet size={42} className="text-green-600" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">{file.name}</h3>
                    <p className="text-slate-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>

                <CheckCircle2 size={36} className="text-green-600" />
              </div>
            </div>
          )}

          {/* BUTTONS */}

          <div className="mt-8 flex justify-center gap-5">
            <Link
              href="/sample-marks.xlsx"
              download
              className="flex items-center gap-2 rounded-xl border px-6 py-3 font-semibold hover:bg-slate-50"
            >
              <Download size={18} />
              Download Sample
            </Link>

            <button
              type="button"
              onClick={uploadMarks}
              disabled={!file || uploading}
              className={`rounded-xl px-8 py-3 font-semibold text-white transition ${
                file && !uploading
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-slate-400"
              }`}
            >
              <UploadCloud size={20} className="inline mr-2" />
              {uploading ? "Uploading..." : "Upload Marks"}
            </button>
          </div>

          {/* ================= PREVIEW ================= */}

          {rows.length > 0 && (
            <div className="mt-10">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Excel Preview</h2>

                <div className="rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-700">
                  {rows.length} Rows
                </div>
              </div>

              <div className="overflow-auto rounded-2xl border">
                <table className="min-w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left">Roll No</th>
                      <th className="p-3 text-center">Minor1</th>
                      <th className="p-3 text-center">Minor2</th>
                      <th className="p-3 text-center">Minor3</th>
                      <th className="p-3 text-center">Assignment</th>
                      <th className="p-3 text-center">Attendance</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">{row["Roll No"]}</td>
                        <td className="p-3 text-center">{row.Minor1 ?? 0}</td>
                        <td className="p-3 text-center">{row.Minor2 ?? 0}</td>
                        <td className="p-3 text-center">{row.Minor3 ?? 0}</td>
                        <td className="p-3 text-center">
                          {row.Assignment ?? 0}
                        </td>
                        <td className="p-3 text-center">
                          {row.Attendance ?? 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {rows.length > 5 && (
                <p className="mt-3 text-sm text-slate-500">
                  Showing first 5 rows out of {rows.length}
                </p>
              )}
            </div>
          )}

          {/* ================= PROGRESS ================= */}

          <div className="mt-10">
            <div className="mb-3 flex justify-between">
              <span className="font-semibold">Upload Progress</span>
              <span className="font-bold text-blue-600">{progress}%</span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-slate-200">
              <div
                style={{ width: `${progress}%` }}
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
              />
            </div>
          </div>

          {/* ================= SUMMARY ================= */}

          {(successCount > 0 || failedRows.length > 0) && (
            <div className="mt-10 rounded-2xl border bg-slate-50 p-6">
              <h2 className="text-xl font-bold">Upload Summary</h2>

              <div className="mt-5 flex gap-10">
                <div>
                  <p className="font-semibold text-green-600">Uploaded</p>
                  <h3 className="text-4xl font-bold">{successCount}</h3>
                </div>

                <div>
                  <p className="font-semibold text-red-600">Failed</p>
                  <h3 className="text-4xl font-bold">{failedRows.length}</h3>
                </div>
              </div>

              {failedRows.length > 0 && (
                <div className="mt-6 rounded-xl bg-red-50 p-4">
                  <h3 className="font-bold text-red-700">Failed Rows</h3>

                  <div className="mt-3 max-h-56 overflow-auto">
                    {failedRows.map((item, index) => (
                      <p key={index} className="text-sm text-red-600">
                        • {item}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setRows([]);
                    setFile(null);
                    setProgress(0);
                    setSuccessCount(0);
                    setFailedRows([]);
                  }}
                  className="rounded-xl bg-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-800"
                >
                  Reset
                </button>

                {successCount > 0 && (
                  <Link
                    href={`/teachers/marks/${subjectId}`}
                    className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
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