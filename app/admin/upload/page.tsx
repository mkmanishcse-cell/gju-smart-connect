"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";

import { supabase } from "@/lib/supabase";
import Footer from "@/components/common/Footer";

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

type Department = {
  id: string;
  department_name: string;
};

type Course = {
  id: string;
  department_id: string;
  course_name: string;
};

type Semester = {
  id: string;
  course_id: string;
  semester_no: number;
};

type ExcelStudent = {
  "Roll No": string;
  "Student Name": string;
  Email: string;
  Mobile: string;
  Department: string;
  Course: string;
  Semester: number;
};

/* =====================================================
   PAGE
===================================================== */

export default function UploadStudentsPage() {
  /* ===========================
      REFS
  =========================== */

  const inputRef = useRef<HTMLInputElement>(null);

  /* ===========================
      STATES
  =========================== */

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [rows, setRows] = useState<ExcelStudent[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failedRows, setFailedRows] = useState<string[]>([]);

  /* Master Data */

  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);

  /* ===========================
      LOAD MASTER DATA
  =========================== */

  async function loadMasters() {
    const { data: dep } = await supabase.from("departments").select("*");
    const { data: course } = await supabase.from("courses").select("*");
    const { data: sem } = await supabase.from("semesters").select("*");

    setDepartments(dep ?? []);
    setCourses(course ?? []);
    setSemesters(sem ?? []);
  }

  /* ===========================
      FILE PICKER
  =========================== */

  function chooseFile() {
    inputRef.current?.click();
  }

  async function readExcel(file: File) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<ExcelStudent>(sheet);

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
    await loadMasters();
    await readExcel(selected);
  }

  async function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);

    const selected = e.dataTransfer.files?.[0];
    if (!selected) return;

    setFile(selected);
    await loadMasters();
    await readExcel(selected);
  }

  /* =====================================================
     UPLOAD STUDENTS
     (moved OUTSIDE the JSX return — this was the main error:
      a function declaration and a duplicate <button> were
      sitting in the middle of the returned JSX, which is
      invalid syntax)
  ===================================================== */

  async function uploadStudents() {
    if (rows.length === 0) {
      alert("Please select an Excel file.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setSuccessCount(0);
    setFailedRows([]);

    /* -----------------------
       Create Lookup Maps
    ----------------------- */

    const departmentMap = new Map(
      departments.map((item) => [
        item.department_name.trim().toLowerCase(),
        item.id,
      ])
    );

    const courseMap = new Map(
      courses.map((item) => [
        `${item.department_id}_${item.course_name.trim().toLowerCase()}`,
        item.id,
      ])
    );

    const semesterMap = new Map(
      semesters.map((item) => [
        `${item.course_id}_${item.semester_no}`,
        item.id,
      ])
    );

    /* -----------------------
       Existing Roll Numbers
    ----------------------- */

    const { data: students } = await supabase
      .from("students")
      .select("roll_no");

    const rollSet = new Set(
      (students ?? []).map((item: any) => String(item.roll_no))
    );

    let success = 0;
    const failed: string[] = [];

    /* -----------------------
       Upload Loop
    ----------------------- */

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      // Guard against missing/blank cells in the Excel sheet
      const rollNo = String(row["Roll No"] ?? "").trim();
      const departmentName = String(row.Department ?? "").trim();
      const courseName = String(row.Course ?? "").trim();

      if (!rollNo) {
        failed.push(`Row ${i + 2} : Roll No missing`);
        continue;
      }

      const departmentId = departmentMap.get(departmentName.toLowerCase());

      if (!departmentId) {
        failed.push(`${rollNo} : Department not found`);
        continue;
      }

      const courseId = courseMap.get(
        `${departmentId}_${courseName.toLowerCase()}`
      );

      if (!courseId) {
        failed.push(`${rollNo} : Course not found`);
        continue;
      }

      const semesterId = semesterMap.get(
        `${courseId}_${Number(row.Semester)}`
      );

      if (!semesterId) {
        failed.push(`${rollNo} : Semester not found`);
        continue;
      }

      if (rollSet.has(rollNo)) {
        failed.push(`${rollNo} : Already Exists`);
        continue;
      }

      /* -----------------------
         Insert Student
      ----------------------- */

      const { error } = await supabase.from("students").insert({
        roll_no: rollNo,
        student_name: row["Student Name"],
        email: row.Email,
        mobile: String(row.Mobile ?? ""),
        password: rollNo,
        department_id: departmentId,
        course_id: courseId,
        semester_id: semesterId,
      });

      if (error) {
        failed.push(`${rollNo} : ${error.message}`);
        continue;
      }

      rollSet.add(rollNo);
      success++;
      setSuccessCount(success);
      setProgress(Math.round(((i + 1) / rows.length) * 100));
    }

    setFailedRows(failed);
    setUploading(false);
    setProgress(100);

    if (failed.length === 0) {
      alert(`${success} students uploaded successfully.`);
    } else {
      alert(`${success} uploaded successfully.\n\n${failed.length} failed.`);
      console.table(failed);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="mx-auto max-w-7xl px-8 py-8">
        {/* ================= HEADER ================= */}

        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Upload Students
            </h1>

            <p className="mt-2 text-slate-500">
              Import students directly into the database.
            </p>
          </div>

          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-blue-700"
          >
            <ArrowLeft size={20} />
            Dashboard
          </Link>
        </div>

        {/* ================= HERO ================= */}

        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <FileSpreadsheet size={30} />
                <span className="text-lg font-semibold">Excel Upload</span>
              </div>

              <h2 className="mt-6 text-5xl font-extrabold">
                Student Upload
              </h2>

              <p className="mt-4 max-w-2xl text-lg text-blue-100">
                Upload hundreds of students in one click.
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
              href="/sample-students.xlsx"
              download
              className="flex items-center gap-2 rounded-xl border px-6 py-3 font-semibold hover:bg-slate-50"
            >
              <Download size={18} />
              Download Sample
            </Link>

            <button
              type="button"
              onClick={uploadStudents}
              disabled={!file || uploading}
              className={`rounded-xl px-8 py-3 font-semibold text-white transition ${
                file && !uploading
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-slate-400"
              }`}
            >
              <UploadCloud size={20} className="inline mr-2" />
              {uploading ? "Uploading..." : "Upload Students"}
            </button>
          </div>

          {/* ================= PREVIEW ================= */}

          {rows.length > 0 && (
            <div className="mt-10">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Excel Preview</h2>

                <div className="rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-700">
                  {rows.length} Students
                </div>
              </div>

              <div className="overflow-auto rounded-2xl border">
                <table className="min-w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left">Roll No</th>
                      <th className="p-3 text-left">Student Name</th>
                      <th className="p-3 text-left">Department</th>
                      <th className="p-3 text-left">Course</th>
                      <th className="p-3 text-left">Semester</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">{row["Roll No"]}</td>
                        <td className="p-3">{row["Student Name"]}</td>
                        <td className="p-3">{row.Department}</td>
                        <td className="p-3">{row.Course}</td>
                        <td className="p-3">Semester {row.Semester}</td>
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

              <div className="mt-6">
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
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}