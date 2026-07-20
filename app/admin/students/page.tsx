"use client";

import Footer from "@/components/common/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  GraduationCap,
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

type Student = {
  id: string;
  roll_no: string;
  student_name: string;
  email: string;
  mobile: string;
  password: string;

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

export default function StudentsPage() {

  const [students, setStudents] = useState<Student[]>([]);

  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [courses, setCourses] =
    useState<Course[]>([]);

  const [semesters, setSemesters] =
    useState<Semester[]>([]);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] =
    useState("");

  const [form, setForm] = useState({

    roll_no: "",

    student_name: "",

    email: "",

    mobile: "",

    password: "",

    department_id: "",

    course_id: "",

    semester_id: "",

  });

  // Filter Courses by Department

  const filteredCourses = courses.filter(

    (course) =>

      course.department_id === form.department_id

  );

  // Filter Semesters by Course

  const filteredSemesters = semesters.filter(

    (semester) =>

      semester.course_id === form.course_id

  );

  useEffect(() => {

    loadDepartments();

    loadCourses();

    loadSemesters();

    loadStudents();

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

      .select("*")

      .order("course_name");

    if (data) {

      setCourses(data);

    }

  }

  async function loadSemesters() {

    const { data } = await supabase

      .from("semesters")

      .select("*")

      .order("semester_no");

    if (data) {

      setSemesters(data);

    }

  }

  async function loadStudents() {

    const { data } = await supabase

      .from("students")

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

      .order("student_name");

    if (data) {

      setStudents(data as Student[]);

    }

  }
    function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // Department change → reset Course & Semester
      if (name === "department_id") {
        updated.course_id = "";
        updated.semester_id = "";
      }

      // Course change → reset Semester
      if (name === "course_id") {
        updated.semester_id = "";
      }

      return updated;
    });
  }

  async function saveStudent() {

    if (
      !form.roll_no ||
      !form.student_name ||
      !form.email ||
      !form.mobile ||
      !form.password ||
      !form.department_id ||
      !form.course_id ||
      !form.semester_id
    ) {

      alert("Please fill all fields.");

      return;

    }

    if (editingId) {

      const { error } = await supabase

        .from("students")

        .update({

          roll_no: form.roll_no,
          student_name: form.student_name,
          email: form.email,
          mobile: form.mobile,
          password: form.password,
          department_id: form.department_id,
          course_id: form.course_id,
          semester_id: form.semester_id,

        })

        .eq("id", editingId);

      if (error) {

        alert(error.message);

        return;

      }

      alert("Student Updated Successfully");

    } else {

      const { error } = await supabase

        .from("students")

        .insert(form);

      if (error) {

        alert(error.message);

        return;

      }

      alert("Student Added Successfully");

    }

    setForm({

      roll_no: "",
      student_name: "",
      email: "",
      mobile: "",
      password: "",
      department_id: "",
      course_id: "",
      semester_id: "",

    });

    setEditingId("");

    loadStudents();

  }

  function editStudent(student: Student) {

    setEditingId(student.id);

    setForm({

      roll_no: student.roll_no,

      student_name: student.student_name,

      email: student.email,

      mobile: student.mobile,

      password: student.password,

      department_id: student.department_id,

      course_id: student.course_id,

      semester_id: student.semester_id,

    });

    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  }

  async function deleteStudent(id: string) {

    if (!confirm("Delete this student?")) return;

    const { error } = await supabase

      .from("students")

      .delete()

      .eq("id", id);

    if (error) {

      alert(error.message);

      return;

    }

    loadStudents();

  }

  const filteredStudents = students.filter(

    (student) =>

      student.student_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      student.roll_no
        .toLowerCase()
        .includes(search.toLowerCase())

  );

  return (

    <main className="min-h-screen bg-slate-100">

      <div className="mx-auto max-w-7xl p-8">
                {/* ================= HEADER ================= */}

        <div className="flex justify-between items-start mb-8">

          <div>

            <h1 className="text-4xl font-bold text-slate-800">
              Student Management
            </h1>

            <p className="text-gray-500 mt-2">
              Add, Edit and Manage Students
            </p>

          </div>

          <Link
            href="/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"
          >

            <ArrowLeft size={20} />

            Dashboard

          </Link>

        </div>

        {/* ================= ADD STUDENT ================= */}

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-6">

            {editingId ? "Update Student" : "Add Student"}

          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

            <input
              name="roll_no"
              value={form.roll_no}
              onChange={handleChange}
              placeholder="Roll Number"
              className="border rounded-xl p-3"
            />

            <input
              name="student_name"
              value={form.student_name}
              onChange={handleChange}
              placeholder="Student Name"
              className="border rounded-xl p-3"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="border rounded-xl p-3"
            />

            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              className="border rounded-xl p-3"
            />

            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="border rounded-xl p-3"
            />

            {/* Department */}

            <select
              name="department_id"
              value={form.department_id}
              onChange={handleChange}
              className="border rounded-xl p-3"
            >

              <option value="">Select Department</option>

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
              name="course_id"
              value={form.course_id}
              onChange={handleChange}
              disabled={!form.department_id}
              className="border rounded-xl p-3 disabled:bg-slate-100"
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
              name="semester_id"
              value={form.semester_id}
              onChange={handleChange}
              disabled={!form.course_id}
              className="border rounded-xl p-3 disabled:bg-slate-100"
            >

              <option value="">
                Select Semester
              </option>

              {filteredSemesters.map((semester) => (

                <option
                  key={semester.id}
                  value={semester.id}
                >
                  Semester {semester.semester_no}
                </option>

              ))}

            </select>

          </div>

          <button
            onClick={saveStudent}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 flex items-center gap-2"
          >

            <Plus size={20} />

            {editingId
              ? "Update Student"
              : "Add Student"}

          </button>

        </div>

        {/* ================= SEARCH ================= */}

        <div className="bg-white rounded-3xl shadow-lg p-6 mt-8">

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
              placeholder="Search Student..."
              className="w-full border rounded-xl py-3 pl-12 pr-4"
            />

          </div>

        </div>
                {/* ================= STUDENT TABLE ================= */}

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mt-8">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>

                <th className="p-4 text-left">Roll No</th>

                <th className="p-4 text-left">Student Name</th>

                <th className="p-4 text-left">Department</th>

                <th className="p-4 text-left">Course</th>

                <th className="p-4 text-left">Semester</th>

                <th className="p-4 text-left">Email</th>

                <th className="p-4 text-left">Mobile</th>

                <th className="p-4 text-center">Action</th>

              </tr>

            </thead>

            <tbody>

              {filteredStudents.length === 0 ? (

                <tr>

                  <td
                    colSpan={8}
                    className="py-10 text-center text-gray-500"
                  >
                    No Students Found
                  </td>

                </tr>

              ) : (

                filteredStudents.map((student) => (

                  <tr
                    key={student.id}
                    className="border-b hover:bg-slate-50 transition"
                  >

                    <td className="p-4">
                      {student.roll_no}
                    </td>

                    <td className="p-4 font-semibold">
                      {student.student_name}
                    </td>

                    <td className="p-4">
                      {student.departments?.department_name}
                    </td>

                    <td className="p-4">
                      {student.courses?.course_name}
                    </td>

                    <td className="p-4">
                      Semester {student.semesters?.semester_no}
                    </td>

                    <td className="p-4">
                      {student.email}
                    </td>

                    <td className="p-4">
                      {student.mobile}
                    </td>

                    <td className="p-4">

                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() => editStudent(student)}
                          className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700"
                        >

                          <Pencil size={18} />

                        </button>

                        <button
                          onClick={() => deleteStudent(student.id)}
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