"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  Search,
  Save,
  FileBarChart2,
  Upload,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import Footer from "@/components/common/Footer";
import LoadingScreen from "@/components/teacher/LoadingScreen";

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

export default function TeacherMarksPage() {
  const { id } = useParams();
  const subjectId = id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");

  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadSubject();
  }, []);

  async function loadSubject() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", subjectId)
        .single();

      if (error || !data) {
        console.log(error);
        return;
      }

      setSubjectName(data.subject_name);
      setSubjectCode(data.subject_code);

      await loadStudents(
        data.department_id,
        data.course_id,
        data.semester_id
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadStudents(
    departmentId: string,
    courseId: string,
    semesterId: string
  ) {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("department_id", departmentId)
      .eq("course_id", courseId)
      .eq("semester_id", semesterId)
      .order("roll_no");

    if (error) {
      console.log(error);
      return;
    }

    const rows: Student[] = [];

    for (const student of data || []) {
      const { data: mark } = await supabase
        .from("marks")
        .select("*")
        .eq("student_id", student.id)
        .eq("subject_id", subjectId)
        .maybeSingle();

      rows.push({
        id: student.id,
        roll_no: student.roll_no,
        student_name: student.student_name,
        minor1: Number(mark?.minor1 ?? 0),
        minor2: Number(mark?.minor2 ?? 0),
        minor3: Number(mark?.minor3 ?? 0),
        best_two_average: Number(mark?.best_two_average ?? 0),
        assignment_marks: Number(mark?.assignment_marks ?? 0),
        attendance_marks: Number(mark?.attendance_marks ?? 0),
        total_marks: Number(mark?.total_marks ?? 0),
      });
    }

    setStudents(rows);
  }

  /* ================= SEARCH ================= */

  const filteredStudents = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return students;

    return students.filter(
      (student) =>
        student.student_name.toLowerCase().includes(keyword) ||
        student.roll_no.toLowerCase().includes(keyword)
    );
  }, [students, search]);

  /* ================= CALCULATE ================= */

  function calculateMarks(student: Student) {
    const minors = [
      Number(student.minor1),
      Number(student.minor2),
      Number(student.minor3),
    ].sort((a, b) => b - a);

    student.best_two_average = Number(
      ((minors[0] + minors[1]) / 2).toFixed(1)
    );

    student.total_marks = Math.round(
      student.best_two_average +
        Number(student.assignment_marks) +
        Number(student.attendance_marks)
    );
  }

  /* ================= UPDATE ================= */

  function updateStudent(
    studentId: string,
    field: keyof Student,
    value: string
  ) {
    let number = value === "" ? 0 : Number(value);

    if (isNaN(number)) number = 0;

    switch (field) {
      case "minor1":
      case "minor2":
      case "minor3":
        number = Math.min(Math.max(number, 0), 20);
        break;

      case "assignment_marks":
        number = Math.min(Math.max(number, 0), 6);
        break;

      case "attendance_marks":
        number = Math.min(Math.max(number, 0), 4);
        break;
    }

    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) return student;

        const updated = {
          ...student,
          [field]: number,
        };

        calculateMarks(updated);
        return updated;
      })
    );
  }

  /* ================= SAVE ================= */

  async function saveAllMarks() {
    try {
      setSaving(true);

      for (const student of students) {
        const { data: existing } = await supabase
          .from("marks")
          .select("id")
          .eq("student_id", student.id)
          .eq("subject_id", subjectId)
          .maybeSingle();

        const payload = {
          student_id: student.id,
          subject_id: subjectId,
          minor1: student.minor1,
          minor2: student.minor2,
          minor3: student.minor3,
          best_two_average: student.best_two_average,
          assignment_marks: student.assignment_marks,
          attendance_marks: student.attendance_marks,
          total_marks: student.total_marks,
          updated_at: new Date().toISOString(),
        };

        if (existing) {
          await supabase.from("marks").update(payload).eq("id", existing.id);
        } else {
          await supabase.from("marks").insert(payload);
        }
      }

      alert("Marks saved successfully.");
    } catch (error) {
      console.log(error);
      alert("Failed to save marks.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:p-6">
  {/* ================= HEADER ================= */}
<div className="mb-5 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-center lg:justify-between">
  <div className="flex items-center gap-3 sm:gap-4">
    <Link
      href="/teachers/marks"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-indigo-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 sm:h-12 sm:w-12 sm:rounded-2xl"
    >
      <ArrowLeft size={18} className="sm:hidden" />
      <ArrowLeft size={20} className="hidden sm:block" />
    </Link>

    <div>
      <h1 className="bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 bg-clip-text text-xl font-extrabold text-transparent sm:text-2xl lg:text-3xl">
        Marks Management
      </h1>
      <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm lg:text-base">
        Manage Internal Assessment Marks
      </p>
    </div>
  </div>
</div>
        {/* ================= SUBJECT INFO ================= */}
        <div className="mb-5 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-4 text-white shadow-xl sm:mb-8 sm:rounded-3xl sm:p-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
            <div>
              <p className="text-xs text-sky-100 sm:text-sm">Subject Name</p>
              <h2 className="mt-1 text-base font-bold sm:mt-2 sm:text-2xl">
                {subjectName}
              </h2>
            </div>

            <div>
              <p className="text-xs text-sky-100 sm:text-sm">Subject Code</p>
              <h2 className="mt-1 text-base font-bold sm:mt-2 sm:text-2xl">
                {subjectCode}
              </h2>
            </div>

            <div className="col-span-2 md:col-span-1">
              <p className="text-xs text-sky-100 sm:text-sm">
                Total Students
              </p>
              <h2 className="mt-1 text-base font-bold sm:mt-2 sm:text-2xl">
                {students.length}
              </h2>
            </div>
          </div>
        </div>

        {/* ================= SEARCH ================= */}
        <div className="mb-5 rounded-2xl bg-white p-3 shadow sm:mb-8 sm:rounded-3xl sm:p-6">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 sm:left-4 sm:h-5 sm:w-5"
            />

            <input
              type="text"
              placeholder="Search by Roll No or Student Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-blue-500 sm:rounded-2xl sm:py-3 sm:pl-12 sm:text-base"
            />
          </div>
        </div>

        {/* ================= TABLE ================= */}
  {/* ================= TABLE ================= */}
<div className="overflow-hidden rounded-2xl bg-white shadow-xl sm:rounded-3xl">
  <div className="flex flex-col gap-3 border-b bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
    <div>
      <h2 className="text-base font-bold text-slate-800 sm:text-xl">
        Student Marks Register
      </h2>
      <p className="mt-1 text-xs text-slate-500 sm:text-sm">
        Minor: 20 | Assignment: 6 | Attendance: 4 | Total: 30
      </p>
    </div>

    <div className="flex gap-2 sm:gap-3">
      <Link
        href={`/teachers/marks/register/${subjectId}`}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:flex-none sm:rounded-2xl sm:px-5 sm:py-3 sm:text-base sm:shadow"
      >
        <FileBarChart2 size={14} className="sm:hidden" />
        <FileBarChart2 size={18} className="hidden sm:block" />
        View Register
      </Link>

      <Link
        href={`/teachers/marks/${subjectId}/upload`}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-cyan-600 px-2.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-cyan-700 sm:flex-none sm:rounded-2xl sm:px-5 sm:py-3 sm:text-base sm:shadow"
      >
        <Upload size={14} className="sm:hidden" />
        <Upload size={18} className="hidden sm:block" />
        Upload Marks
      </Link>
    </div>
  </div>

  <div className="max-h-[65vh] overflow-auto sm:max-h-[70vh]">
    <table className="min-w-full border-separate border-spacing-0 text-xs sm:text-sm">
      <thead>
        <tr>
          <th className="sticky left-0 top-0 z-30 whitespace-nowrap border-b border-slate-200 bg-slate-100 px-2 py-2.5 text-left sm:px-4 sm:py-4">
            Roll
          </th>
          <th className="sticky top-0 z-20 whitespace-nowrap border-b border-slate-200 bg-slate-100 px-2 py-2.5 text-left sm:px-4 sm:py-4">
            Student
          </th>
          <th className="sticky top-0 z-20 whitespace-nowrap border-b border-slate-200 bg-slate-100 px-1.5 py-2.5 text-center sm:px-4 sm:py-4">
            M1<br />
            <span className="text-[10px] font-normal sm:text-xs">(20)</span>
          </th>
          <th className="sticky top-0 z-20 whitespace-nowrap border-b border-slate-200 bg-slate-100 px-1.5 py-2.5 text-center sm:px-4 sm:py-4">
            M2<br />
            <span className="text-[10px] font-normal sm:text-xs">(20)</span>
          </th>
          <th className="sticky top-0 z-20 whitespace-nowrap border-b border-slate-200 bg-slate-100 px-1.5 py-2.5 text-center sm:px-4 sm:py-4">
            M3<br />
            <span className="text-[10px] font-normal sm:text-xs">(20)</span>
          </th>
          <th className="sticky top-0 z-20 whitespace-nowrap border-b border-slate-200 bg-slate-100 px-1.5 py-2.5 text-center sm:px-4 sm:py-4">
            Best 2
          </th>
          <th className="sticky top-0 z-20 whitespace-nowrap border-b border-slate-200 bg-slate-100 px-1.5 py-2.5 text-center sm:px-4 sm:py-4">
            Assign.<br />
            <span className="text-[10px] font-normal sm:text-xs">(6)</span>
          </th>
          <th className="sticky top-0 z-20 whitespace-nowrap border-b border-slate-200 bg-slate-100 px-1.5 py-2.5 text-center sm:px-4 sm:py-4">
            Attend.<br />
            <span className="text-[10px] font-normal sm:text-xs">(4)</span>
          </th>
          <th className="sticky top-0 z-20 whitespace-nowrap border-b border-slate-200 bg-slate-100 px-2 py-2.5 text-center sm:px-4 sm:py-4">
            Total
          </th>
        </tr>
      </thead>

      <tbody>
        {filteredStudents.map((student) => (
          <tr key={student.id} className="border-t transition hover:bg-sky-50">
            {/* Roll */}
            <td className="sticky left-0 z-10 whitespace-nowrap border-b border-slate-100 bg-white px-2 py-2 font-semibold sm:px-4 sm:py-4">
              {student.roll_no}
            </td>

            {/* Student */}
            <td className="whitespace-nowrap border-b border-slate-100 px-2 py-2 sm:px-4 sm:py-4">
              {student.student_name}
            </td>

            {/* Minor 1 */}
            <td className="border-b border-slate-100 px-1 py-1.5 sm:px-2 sm:py-3">
              <input
                type="number"
                min={0}
                max={20}
                placeholder="0"
                value={student.minor1 === 0 ? "" : student.minor1}
                onChange={(e) =>
                  updateStudent(student.id, "minor1", e.target.value)
                }
                className="w-12 rounded-lg border border-slate-300 py-1.5 text-center text-xs outline-none focus:border-blue-600 sm:w-20 sm:rounded-xl sm:py-2 sm:text-sm"
              />
            </td>

            {/* Minor 2 */}
            <td className="border-b border-slate-100 px-1 py-1.5 sm:px-2 sm:py-3">
              <input
                type="number"
                min={0}
                max={20}
                placeholder="0"
                value={student.minor2 === 0 ? "" : student.minor2}
                onChange={(e) =>
                  updateStudent(student.id, "minor2", e.target.value)
                }
                className="w-12 rounded-lg border border-slate-300 py-1.5 text-center text-xs outline-none focus:border-blue-600 sm:w-20 sm:rounded-xl sm:py-2 sm:text-sm"
              />
            </td>

            {/* Minor 3 */}
            <td className="border-b border-slate-100 px-1 py-1.5 sm:px-2 sm:py-3">
              <input
                type="number"
                min={0}
                max={20}
                placeholder="0"
                value={student.minor3 === 0 ? "" : student.minor3}
                onChange={(e) =>
                  updateStudent(student.id, "minor3", e.target.value)
                }
                className="w-12 rounded-lg border border-slate-300 py-1.5 text-center text-xs outline-none focus:border-blue-600 sm:w-20 sm:rounded-xl sm:py-2 sm:text-sm"
              />
            </td>

            {/* Best Two */}
            <td className="border-b border-slate-100 px-1.5 py-2 text-center sm:px-4 sm:py-3">
              <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700 sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm">
                {student.best_two_average.toFixed(1)}
              </span>
            </td>

            {/* Assignment */}
            <td className="border-b border-slate-100 px-1 py-1.5 sm:px-2 sm:py-3">
              <input
                type="number"
                min={0}
                max={6}
                placeholder="0"
                value={
                  student.assignment_marks === 0
                    ? ""
                    : student.assignment_marks
                }
                onChange={(e) =>
                  updateStudent(
                    student.id,
                    "assignment_marks",
                    e.target.value
                  )
                }
                className="w-12 rounded-lg border border-slate-300 py-1.5 text-center text-xs outline-none focus:border-orange-500 sm:w-20 sm:rounded-xl sm:py-2 sm:text-sm"
              />
            </td>

            {/* Attendance */}
            <td className="border-b border-slate-100 px-1 py-1.5 sm:px-2 sm:py-3">
              <input
                type="number"
                min={0}
                max={4}
                placeholder="0"
                value={
                  student.attendance_marks === 0
                    ? ""
                    : student.attendance_marks
                }
                onChange={(e) =>
                  updateStudent(
                    student.id,
                    "attendance_marks",
                    e.target.value
                  )
                }
                className="w-12 rounded-lg border border-slate-300 py-1.5 text-center text-xs outline-none focus:border-green-500 sm:w-20 sm:rounded-xl sm:py-2 sm:text-sm"
              />
            </td>

            {/* Total */}
            <td className="border-b border-slate-100 px-2 py-2 sm:px-4 sm:py-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden h-3 flex-1 rounded-full bg-slate-200 sm:block">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                    style={{
                      width: `${Math.min(
                        (student.total_marks / 30) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <span className="min-w-[54px] rounded-full bg-green-100 px-2 py-1 text-center text-xs font-bold text-green-700 sm:min-w-[70px] sm:px-3 sm:text-sm">
                  {student.total_marks}/30
                </span>
              </div>
            </td>
          </tr>
        ))}

        {filteredStudents.length === 0 && (
          <tr>
            <td colSpan={9} className="py-16 text-center text-slate-500">
              No students found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

        {/* ================= ACTIONS ================= */}
        <div className="mt-5 flex flex-row gap-2 sm:mt-8 sm:gap-4 sm:justify-end">
          <Link
            href={`/teachers/marks/register/${subjectId}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 shadow transition hover:bg-slate-50 sm:flex-none sm:rounded-2xl sm:px-6 sm:py-3 sm:text-base"
          >
            <FileBarChart2 size={16} className="sm:hidden" />
            <FileBarChart2 size={20} className="hidden sm:block" />
            View Marks Register
          </Link>

          <button
            onClick={saveAllMarks}
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-3 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:rounded-2xl sm:px-8 sm:py-3 sm:text-base"
          >
            <Save size={16} className="sm:hidden" />
            <Save size={20} className="hidden sm:block" />
            {saving ? "Saving..." : "Save Marks"}
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}