"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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

type Subject = {
  id: string;
  subject_name: string;
  subject_code: string;
  department_id: string;
  course_id: string;
  semester_id: string;
};

type StudentLite = {
  id: string;
  roll_no: string;
  student_name: string;
};

type DateColumn = {
  columnIndex: number;
  date: string; // YYYY-MM-DD
  label: string; // original header text, for preview
};

type ParsedStudentRow = {
  rollNo: string;
  statuses: Record<string, "P" | "A" | null>; // key = date string
};

/* =====================================================
   HELPERS
===================================================== */

function formatDate(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function excelSerialToDate(serial: number): Date {
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  return new Date(utcValue * 1000);
}

function parseHeaderToDate(value: any): string | null {
  if (value === undefined || value === null || value === "") return null;

  if (value instanceof Date) {
    if (isNaN(value.getTime())) return null;
    return formatDate(value);
  }

  if (typeof value === "number") {
    const d = excelSerialToDate(value);
    if (isNaN(d.getTime())) return null;
    return formatDate(d);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    // YYYY-MM-DD
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(trimmed)) {
      const [y, m, d] = trimmed.split("-");
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }

    // DD-MM-YYYY or DD/MM/YYYY
    const match = trimmed.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
    if (match) {
      const [, dd, mm, yyyy] = match;
      return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }

    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) return formatDate(parsed);

    return null;
  }

  return null;
}

function normalizeStatus(value: any): "P" | "A" | null {
  if (value === undefined || value === null) return null;

  const str = String(value).trim().toLowerCase();
  if (str === "") return null;

  if (["p", "present", "1"].includes(str)) return "P";
  if (["a", "absent", "0"].includes(str)) return "A";

  return null;
}

/* =====================================================
   PAGE
===================================================== */

export default function UploadAttendancePage() {
  const router = useRouter();
  const { id } = useParams();
  const subjectId = id as string;

  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState("");
  const [subject, setSubject] = useState<Subject | null>(null);
  const [students, setStudents] = useState<StudentLite[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const [dateColumns, setDateColumns] = useState<DateColumn[]>([]);
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [headerWarnings, setHeaderWarnings] = useState<string[]>([]);

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

      const session = sessionStorage.getItem("user");
      if (!session) {
        router.push("/login?role=teacher");
        return;
      }
      const loginUser = JSON.parse(session);
      setTeacherId(loginUser.id);

      const { data: subjectData, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", subjectId)
        .single();

      if (error || !subjectData) {
        console.log(error);
        return;
      }

      setSubject(subjectData);

      const { data: studentRows, error: studentError } = await supabase
        .from("students")
        .select("id, roll_no, student_name")
        .eq("department_id", subjectData.department_id)
        .eq("course_id", subjectData.course_id)
        .eq("semester_id", subjectData.semester_id)
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
    const workbook = XLSX.read(buffer, { cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const raw: any[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      raw: true,
      defval: "",
    });

    if (raw.length < 2) {
      alert("Excel file must have a header row and at least one student row.");
      return;
    }

    const headerRow = raw[0];
    const warnings: string[] = [];

    // Column 0 = Roll No, rest = dates
    const columns: DateColumn[] = [];

    for (let col = 1; col < headerRow.length; col++) {
      const headerValue = headerRow[col];
      const parsedDate = parseHeaderToDate(headerValue);

      if (!parsedDate) {
        if (String(headerValue ?? "").trim() !== "") {
          warnings.push(
            `Column "${headerValue}" ignored — could not read it as a date.`
          );
        }
        continue;
      }

      columns.push({
        columnIndex: col,
        date: parsedDate,
        label: String(headerValue),
      });
    }

    if (columns.length === 0) {
      alert(
        "No valid date columns found. Please check your column headers (e.g. 2026-07-20)."
      );
      return;
    }

    const dataRows: ParsedStudentRow[] = [];

    for (let r = 1; r < raw.length; r++) {
      const row = raw[r];
      const rollNo = String(row[0] ?? "").trim();

      if (!rollNo) continue;

      const statuses: Record<string, "P" | "A" | null> = {};

      for (const column of columns) {
        statuses[column.date] = normalizeStatus(row[column.columnIndex]);
      }

      dataRows.push({ rollNo, statuses });
    }

    setDateColumns(columns);
    setParsedRows(dataRows);
    setHeaderWarnings(warnings);
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
      UPLOAD ATTENDANCE
  =========================== */

  async function uploadAttendance() {
    if (parsedRows.length === 0 || dateColumns.length === 0) {
      alert("Please select a valid Excel file first.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setSuccessCount(0);
    setFailedRows([]);

    const studentMap = new Map(
      students.map((student) => [student.roll_no.trim().toLowerCase(), student])
    );

    const failed: string[] = [];
    const payload: {
      student_id: string;
      subject_id: string;
      teacher_id: string;
      attendance_date: string;
      status: "P" | "A";
    }[] = [];

    for (const row of parsedRows) {
      const student = studentMap.get(row.rollNo.toLowerCase());

      if (!student) {
        failed.push(`${row.rollNo} : Student not found in this subject`);
        continue;
      }

      for (const column of dateColumns) {
        const status = row.statuses[column.date];

        if (status === null) continue; // blank cell, skip silently

        payload.push({
          student_id: student.id,
          subject_id: subjectId,
          teacher_id: teacherId,
          attendance_date: column.date,
          status,
        });
      }
    }

    if (payload.length === 0) {
      setUploading(false);
      alert("No valid attendance entries found to upload.");
      return;
    }

    const chunkSize = 300;
    let saved = 0;

    for (let i = 0; i < payload.length; i += chunkSize) {
      const chunk = payload.slice(i, i + chunkSize);

      const { error } = await supabase
        .from("attendance")
        .upsert(chunk, {
          onConflict: "student_id,subject_id,attendance_date",
        });

      if (error) {
        failed.push(`Batch ${i / chunkSize + 1} : ${error.message}`);
      } else {
        saved += chunk.length;
      }

      setSuccessCount(saved);
      setProgress(Math.round(((i + chunk.length) / payload.length) * 100));
    }

    setFailedRows(failed);
    setUploading(false);
    setProgress(100);

    if (failed.length === 0) {
      alert(`${saved} attendance record(s) uploaded successfully.`);
    } else {
      alert(`${saved} uploaded successfully.\n\n${failed.length} issue(s) found.`);
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
              Upload Attendance
            </h1>

            <p className="mt-2 text-slate-500">
              {subject?.subject_name} ({subject?.subject_code})
            </p>
          </div>

          <Link
            href={`/teachers/attendance/${subjectId}`}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-blue-700"
          >
            <ArrowLeft size={20} />
            Back to Attendance
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
                Attendance Upload
              </h2>

              <p className="mt-4 max-w-2xl text-lg text-blue-100">
                Upload attendance for multiple dates in one file — first
                column Roll No, remaining columns as dates.
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

          {/* HEADER WARNINGS */}

          {headerWarnings.length > 0 && (
            <div className="mt-6 rounded-2xl bg-orange-50 p-4">
              <h3 className="font-bold text-orange-700">
                Some columns were skipped
              </h3>
              <div className="mt-2">
                {headerWarnings.map((warning, index) => (
                  <p key={index} className="text-sm text-orange-600">
                    • {warning}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* BUTTONS */}

          <div className="mt-8 flex justify-center gap-5">
            <Link
              href="/sample-attendance.xlsx"
              download
              className="flex items-center gap-2 rounded-xl border px-6 py-3 font-semibold hover:bg-slate-50"
            >
              <Download size={18} />
              Download Sample
            </Link>

            <button
              type="button"
              onClick={uploadAttendance}
              disabled={!file || uploading || parsedRows.length === 0}
              className={`rounded-xl px-8 py-3 font-semibold text-white transition ${
                file && !uploading && parsedRows.length > 0
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-slate-400"
              }`}
            >
              <UploadCloud size={20} className="inline mr-2" />
              {uploading ? "Uploading..." : "Upload Attendance"}
            </button>
          </div>

          {/* ================= PREVIEW ================= */}

          {parsedRows.length > 0 && (
            <div className="mt-10">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Excel Preview</h2>

                <div className="rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-700">
                  {parsedRows.length} Students × {dateColumns.length} Dates
                </div>
              </div>

              <div className="overflow-auto rounded-2xl border">
                <table className="min-w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left">Roll No</th>
                      {dateColumns.map((column) => (
                        <th
                          key={column.date}
                          className="p-3 text-center whitespace-nowrap"
                        >
                          {column.date}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {parsedRows.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3 font-semibold">{row.rollNo}</td>
                        {dateColumns.map((column) => (
                          <td
                            key={column.date}
                            className="p-3 text-center"
                          >
                            {row.statuses[column.date] === "P" && (
                              <span className="rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700">
                                P
                              </span>
                            )}
                            {row.statuses[column.date] === "A" && (
                              <span className="rounded-full bg-red-100 px-3 py-1 font-semibold text-red-700">
                                A
                              </span>
                            )}
                            {row.statuses[column.date] === null && (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {parsedRows.length > 5 && (
                <p className="mt-3 text-sm text-slate-500">
                  Showing first 5 rows out of {parsedRows.length}
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
                  <p className="font-semibold text-green-600">
                    Records Saved
                  </p>
                  <h3 className="text-4xl font-bold">{successCount}</h3>
                </div>

                <div>
                  <p className="font-semibold text-red-600">Issues</p>
                  <h3 className="text-4xl font-bold">{failedRows.length}</h3>
                </div>
              </div>

              {failedRows.length > 0 && (
                <div className="mt-6 rounded-xl bg-red-50 p-4">
                  <h3 className="font-bold text-red-700">Issues Found</h3>

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
                    setDateColumns([]);
                    setParsedRows([]);
                    setHeaderWarnings([]);
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
                    href={`/teachers/attendance/${subjectId}`}
                    className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
                  >
                    View Attendance
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