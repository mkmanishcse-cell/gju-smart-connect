"use client";

import Footer from "@/components/common/Footer";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

/* =========================
   TYPES
========================= */

type Department = {
  id: string;
  department_name: string;
};

type Course = {
  id: string;
  course_name: string;
  department_id: string;

  departments?: {
    department_name: string;
  };
};

type Semester = {
  id: string;
  semester_no: number;

  course_id: string;

  courses?: {
    course_name: string;
  };
};

export default function SemesterPage() {

  /* =========================
      STATES
  ========================= */

  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [courses, setCourses] =
    useState<Course[]>([]);

  const [semesters, setSemesters] =
    useState<Semester[]>([]);

  const [departmentId, setDepartmentId] =
    useState("");

  const [courseId, setCourseId] =
    useState("");

  const [semesterNo, setSemesterNo] =
    useState("");

  /* =========================
      FILTERS
  ========================= */

  const filteredCourses = useMemo(() => {

    return courses.filter(

      (course) =>

        course.department_id === departmentId

    );

  }, [courses, departmentId]);

  const filteredSemesters = useMemo(() => {

    if (!courseId) return [];

    return semesters.filter(

      (semester) =>

        semester.course_id === courseId

    );

  }, [semesters, courseId]);

  /* =========================
      LOAD DATA
  ========================= */

  useEffect(() => {

    loadDepartments();

    loadCourses();

    loadSemesters();

  }, []);

  async function loadDepartments() {

    const { data } = await supabase

      .from("departments")

      .select("*")

      .order("department_name");

    if (data) {

      setDepartments(data);

    }

  }

  async function loadCourses() {

    const { data } = await supabase

      .from("courses")

      .select(`
        *,
        departments(
          department_name
        )
      `)

      .order("course_name");

    if (data) {

      setCourses(data as Course[]);

    }

  }

  async function loadSemesters() {

    const { data } = await supabase

      .from("semesters")

      .select(`
        *,
        courses(
          course_name
        )
      `)

      .order("semester_no");

    if (data) {

      setSemesters(data as Semester[]);

    }

  }
    /* =========================
      ADD SEMESTER
  ========================= */

  async function addSemester() {

    if (!departmentId) {

      alert("Please select Department.");

      return;

    }

    if (!courseId) {

      alert("Please select Course.");

      return;

    }

    if (!semesterNo) {

      alert("Please enter Semester Number.");

      return;

    }

    /* Duplicate Check */

    const { data: existing } = await supabase

      .from("semesters")

      .select("id")

      .eq("course_id", courseId)

      .eq("semester_no", Number(semesterNo))

      .maybeSingle();

    if (existing) {

      alert("Semester already exists for this course.");

      return;

    }

    const { error } = await supabase

      .from("semesters")

      .insert({

        course_id: courseId,

        semester_no: Number(semesterNo),

      });

    if (error) {

      alert(error.message);

      return;

    }

    alert("Semester Added Successfully");

    setSemesterNo("");

    loadSemesters();

  }

  /* =========================
      DELETE
  ========================= */

  async function deleteSemester(id: string) {

    if (!confirm("Delete this semester?")) {

      return;

    }

    const { error } = await supabase

      .from("semesters")

      .delete()

      .eq("id", id);

    if (error) {

      alert(error.message);

      return;

    }

    loadSemesters();

  }

  /* =========================
      UI
  ========================= */

  return (

    <main className="min-h-screen bg-slate-100">

      <div className="max-w-6xl mx-auto p-8">

        {/* Header */}

        <div className="flex justify-between items-start mb-8">

          <div>

            <h1 className="text-4xl font-bold text-slate-800">

              Semester Management

            </h1>

            <p className="mt-2 text-gray-500">

              Manage semesters department wise.

            </p>

          </div>

          <Link
            href="/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
          >

            <ArrowLeft size={20} />

            Dashboard

          </Link>

        </div>

        {/* Add Card */}

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <div className="grid lg:grid-cols-4 gap-5">

            {/* Department */}

            <select

              value={departmentId}

              onChange={(e) => {

                setDepartmentId(e.target.value);

                setCourseId("");

              }}

              className="border rounded-xl px-4 py-3"

            >

              <option value="">

                Select Department

              </option>

              {departments.map((department) => (

                <option

                  key={department.id}

                  value={department.id}

                >

                  {department.department_name}

                </option>

              ))}

            </select>

            {/* Course */}

            <select

              value={courseId}

              onChange={(e) =>

                setCourseId(e.target.value)

              }

              disabled={!departmentId}

              className="border rounded-xl px-4 py-3 disabled:bg-slate-100"

            >

              <option value="">

                Select Course

              </option>

              {filteredCourses.map((course) => (

                <option

                  key={course.id}

                  value={course.id}

                >

                  {course.course_name}

                </option>

              ))}

            </select>

            {/* Semester */}

            <input

              type="number"

              min={1}

              max={8}

              value={semesterNo}

              onChange={(e) =>

                setSemesterNo(e.target.value)

              }

              placeholder="Semester Number"

              className="border rounded-xl px-4 py-3"

            />

            <button

              onClick={addSemester}

              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2"

            >

              <Plus size={20} />

              Add Semester

            </button>

          </div>

        </div>
                {/* =========================
            SEMESTER TABLE
        ========================= */}

        <div className="mt-8 rounded-3xl bg-white shadow-lg overflow-hidden">

          <div className="border-b px-6 py-5">

            <h2 className="text-2xl font-bold">

              Added Semesters

            </h2>

            <p className="mt-2 text-gray-500">

              {courseId
                ? "Showing semesters for selected course."
                : "Please select a department and course."}

            </p>

          </div>

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="p-5 text-left">

                  Course

                </th>

                <th className="p-5 text-left">

                  Semester

                </th>

                <th className="p-5 text-right">

                  Action

                </th>

              </tr>

            </thead>

            <tbody>

              {!courseId ? (

                <tr>

                  <td
                    colSpan={3}
                    className="py-12 text-center text-gray-500"
                  >

                    Select a Course to view semesters.

                  </td>

                </tr>

              ) : filteredSemesters.length === 0 ? (

                <tr>

                  <td
                    colSpan={3}
                    className="py-12 text-center text-gray-500"
                  >

                    No Semester Found.

                  </td>

                </tr>

              ) : (

                filteredSemesters.map((semester) => (

                  <tr
                    key={semester.id}
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="p-5">

                      {semester.courses?.course_name}

                    </td>

                    <td className="p-5 font-semibold">

                      Semester {semester.semester_no}

                    </td>

                    <td className="p-5 text-right">

                      <button

                        onClick={() =>
                          deleteSemester(
                            semester.id
                          )
                        }

                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"

                      >

                        <Trash2 size={18} />

                        Delete

                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      <Footer />

    </main>

  );

}