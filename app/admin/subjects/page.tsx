"use client";

import Footer from "@/components/common/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ArrowLeft,
} from "lucide-react";

type Department = {
  id: string;
  department_name: string;
};

type Course = {
  id: string;
  course_name: string;
  department_id: string;
};

type Semester = {
  id: string;
  semester_no: number;
  course_id: string;
};

type Subject = {
  id: string;

  subject_code: string;

  subject_name: string;

  subject_type: string;

  credits: number;

  department_id: string;

  course_id: string;

  semester_id: string;

  departments?: {
    department_name: string;
  };

  courses?: {
    course_name: string;
  };

  semesters?: {
    semester_no: number;
  };
};

export default function SubjectsPage() {

  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [courses, setCourses] =
    useState<Course[]>([]);

  const [semesters, setSemesters] =
    useState<Semester[]>([]);

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [filteredSubjects, setFilteredSubjects] =
    useState<Subject[]>([]);

  const [departmentId, setDepartmentId] =
    useState("");

  const [courseId, setCourseId] =
    useState("");

  const [semesterId, setSemesterId] =
    useState("");

  const [subjectCode, setSubjectCode] =
    useState("");

  const [subjectName, setSubjectName] =
    useState("");

  const [subjectType, setSubjectType] =
    useState("Theory");

  const [credits, setCredits] =
    useState(4);

  const [search, setSearch] =
    useState("");

  const [editingId, setEditingId] =
    useState("");

  // Filter Course

  const filteredCourses = courses.filter(

    (course) =>

      course.department_id === departmentId

  );

  // Filter Semester

  const filteredSemesters = semesters.filter(

    (semester) =>

      semester.course_id === courseId

  );

  useEffect(() => {

    loadMasterData();

    loadSubjects();

  }, []);

  useEffect(() => {

    const data = subjects.filter(

      (subject) =>

        subject.subject_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        subject.subject_code
          .toLowerCase()
          .includes(search.toLowerCase())

    );

    setFilteredSubjects(data);

  }, [subjects, search]);

  async function loadMasterData() {

    const { data: dep } = await supabase

      .from("departments")

      .select("*")

      .order("department_name");

    const { data: course } = await supabase

      .from("courses")

      .select("*")

      .order("course_name");

    const { data: sem } = await supabase

      .from("semesters")

      .select("*")

      .order("semester_no");

    if (dep) setDepartments(dep);

    if (course) setCourses(course);

    if (sem) setSemesters(sem);

  }

  async function loadSubjects() {

    const { data, error } = await supabase

      .from("subjects")

      .select(`
        *,
        departments(
          department_name
        ),
        courses(
          course_name
        ),
        semesters(
          semester_no
        )
      `)

      .order("subject_name");

    if (error) {

      console.log(error);

      return;

    }

    setSubjects(data as Subject[]);

    setFilteredSubjects(data as Subject[]);

  }
    async function addSubject() {

    if (
      !departmentId ||
      !courseId ||
      !semesterId ||
      !subjectCode ||
      !subjectName
    ) {

      alert("Please fill all fields.");

      return;

    }

    const { error } = await supabase

      .from("subjects")

      .insert({

        department_id: departmentId,
        course_id: courseId,
        semester_id: semesterId,

        subject_code: subjectCode,
        subject_name: subjectName,

        subject_type: subjectType,
        credits: credits,

      });

    if (error) {

      alert(error.message);

      return;

    }

    alert("Subject Added Successfully");

    resetForm();

    loadSubjects();

  }

  async function updateSubject() {

    if (!editingId) return;

    const { error } = await supabase

      .from("subjects")

      .update({

        department_id: departmentId,
        course_id: courseId,
        semester_id: semesterId,

        subject_code: subjectCode,
        subject_name: subjectName,

        subject_type: subjectType,
        credits: credits,

      })

      .eq("id", editingId);

    if (error) {

      alert(error.message);

      return;

    }

    alert("Subject Updated Successfully");

    setEditingId("");

    resetForm();

    loadSubjects();

  }

  async function deleteSubject(id: string) {

    if (!confirm("Delete this subject?")) return;

    const { error } = await supabase

      .from("subjects")

      .delete()

      .eq("id", id);

    if (error) {

      alert(error.message);

      return;

    }

    loadSubjects();

  }

  function editSubject(subject: Subject) {

    setEditingId(subject.id);

    setDepartmentId(subject.department_id);

    setCourseId(subject.course_id);

    setSemesterId(subject.semester_id);

    setSubjectCode(subject.subject_code);

    setSubjectName(subject.subject_name);

    setSubjectType(subject.subject_type);

    setCredits(subject.credits);

    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  }

  function resetForm() {

    setDepartmentId("");

    setCourseId("");

    setSemesterId("");

    setSubjectCode("");

    setSubjectName("");

    setSubjectType("Theory");

    setCredits(4);

  }

  return (

    <main className="min-h-screen bg-slate-100">

      <div className="mx-auto max-w-7xl p-8">
                {/* ================= HEADER ================= */}

        <div className="flex justify-between items-start mb-8">

          <div>

            <h1 className="text-4xl font-bold text-slate-800">
              Subject Management
            </h1>

            <p className="mt-2 text-gray-500">
              Add, Edit and Manage University Subjects
            </p>

          </div>

          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
          >

            <ArrowLeft size={20} />

            Dashboard

          </Link>

        </div>

        {/* ================= ADD / EDIT SUBJECT ================= */}

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-lg">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-2xl font-bold">

              {editingId ? "Update Subject" : "Add Subject"}

            </h2>

            {editingId && (

              <button

                onClick={() => {

                  setEditingId("");

                  resetForm();

                }}

                className="rounded-xl bg-gray-200 px-5 py-2 hover:bg-gray-300"

              >

                Cancel

              </button>

            )}

          </div>

          <div className="grid gap-5 lg:grid-cols-4">

            {/* Department */}

            <select

              value={departmentId}

              onChange={(e) => {

                setDepartmentId(e.target.value);

                setCourseId("");

                setSemesterId("");

              }}

              className="rounded-xl border px-4 py-3"

            >

              <option value="">Select Department</option>

              {departments.map((dep) => (

                <option
                  key={dep.id}
                  value={dep.id}
                >

                  {dep.department_name}

                </option>

              ))}

            </select>

            {/* Course */}

            <select

              value={courseId}

              onChange={(e) => {

                setCourseId(e.target.value);

                setSemesterId("");

              }}

              disabled={!departmentId}

              className="rounded-xl border px-4 py-3 disabled:bg-slate-100"

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

            <select

              value={semesterId}

              onChange={(e) =>

                setSemesterId(e.target.value)

              }

              disabled={!courseId}

              className="rounded-xl border px-4 py-3 disabled:bg-slate-100"

            >

              <option value="">

                Select Semester

              </option>

              {filteredSemesters.map((sem) => (

                <option
                  key={sem.id}
                  value={sem.id}
                >

                  Semester {sem.semester_no}

                </option>

              ))}

            </select>

            {/* Subject Type */}

            <select

              value={subjectType}

              onChange={(e) =>

                setSubjectType(e.target.value)

              }

              className="rounded-xl border px-4 py-3"

            >

              <option value="Theory">

                Theory

              </option>

              <option value="Practical">

                Practical

              </option>

            </select>

            {/* Subject Code */}

            <input

              value={subjectCode}

              onChange={(e) =>

                setSubjectCode(e.target.value)

              }

              placeholder="Subject Code"

              className="rounded-xl border px-4 py-3"

            />

            {/* Subject Name */}

            <input

              value={subjectName}

              onChange={(e) =>

                setSubjectName(e.target.value)

              }

              placeholder="Subject Name"

              className="rounded-xl border px-4 py-3"

            />

            {/* Credits */}

            <input

              type="number"

              min={1}

              value={credits}

              onChange={(e) =>

                setCredits(Number(e.target.value))

              }

              placeholder="Credits"

              className="rounded-xl border px-4 py-3"

            />

            {/* Button */}

            <button

              onClick={editingId ? updateSubject : addSubject}

              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"

            >

              <Plus size={20} />

              {editingId

                ? "Update Subject"

                : "Add Subject"}

            </button>

          </div>

        </div>

        {/* ================= SEARCH ================= */}

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-lg">

          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-4 text-gray-400"
            />

            <input

              value={search}

              onChange={(e) =>

                setSearch(e.target.value)

              }

              placeholder="Search Subject..."

              className="w-full rounded-xl border py-3 pl-12 pr-4"

            />

          </div>

        </div>
                {/* ================= SUBJECT TABLE ================= */}

        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-lg">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>

                <th className="p-4 text-left">Code</th>

                <th className="p-4 text-left">Subject</th>

                <th className="p-4 text-left">Department</th>

                <th className="p-4 text-left">Course</th>

                <th className="p-4 text-left">Semester</th>

                <th className="p-4 text-left">Type</th>

                <th className="p-4 text-left">Credits</th>

                <th className="p-4 text-center">Action</th>

              </tr>

            </thead>

            <tbody>

              {filteredSubjects.length === 0 ? (

                <tr>

                  <td
                    colSpan={8}
                    className="py-10 text-center text-gray-500"
                  >

                    No Subjects Found

                  </td>

                </tr>

              ) : (

                filteredSubjects.map((subject) => (

                  <tr
                    key={subject.id}
                    className="border-b transition hover:bg-slate-50"
                  >

                    <td className="p-4 font-semibold">

                      {subject.subject_code}

                    </td>

                    <td className="p-4 font-semibold">

                      {subject.subject_name}

                    </td>

                    <td className="p-4">

                      {subject.departments?.department_name}

                    </td>

                    <td className="p-4">

                      {subject.courses?.course_name}

                    </td>

                    <td className="p-4">

                      Semester {subject.semesters?.semester_no}

                    </td>

                    <td className="p-4">

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          subject.subject_type === "Theory"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >

                        {subject.subject_type}

                      </span>

                    </td>

                    <td className="p-4">

                      {subject.credits}

                    </td>

                    <td className="p-4">

                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() => editSubject(subject)}
                          className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700"
                        >

                          <Pencil size={18} />

                        </button>

                        <button
                          onClick={() => deleteSubject(subject.id)}
                          className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
                        >

                          <Trash2 size={18} />

                        </button>

                      </div>

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