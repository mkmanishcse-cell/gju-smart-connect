"use client";
import Footer from "@/components/common/Footer";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

export default function CoursesPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [departmentId, setDepartmentId] = useState("");
  const [courseName, setCourseName] = useState("");

  async function loadDepartments() {
    const { data } = await supabase
      .from("departments")
      .select("*")
      .order("department_name");

    if (data) setDepartments(data);
  }

  async function loadCourses() {
    const { data } = await supabase
      .from("courses")
      .select(`
        *,
        departments (
          department_name
        )
      `)
      .order("course_name");

    if (data) setCourses(data as Course[]);
  }

  useEffect(() => {
    loadDepartments();
    loadCourses();
  }, []);

  async function addCourse() {
    if (!departmentId || !courseName) return;

    await supabase.from("courses").insert({
      department_id: departmentId,
      course_name: courseName,
    });

    setCourseName("");
    setDepartmentId("");

    loadCourses();
  }

  async function deleteCourse(id: string) {
    await supabase
      .from("courses")
      .delete()
      .eq("id", id);

    loadCourses();
  }

  return (
    <div className="max-w-6xl mx-auto pt-8">

     <div className="flex justify-between items-start mb-8">

  <div>

    <h1 className="text-4xl font-bold text-slate-800">
      Courses
    </h1>

    <p className="text-gray-500 mt-2">
      Manage all university courses
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

      <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

        <div className="grid md:grid-cols-3 gap-4">

          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            <option value="">Select Department</option>

            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.department_name}
              </option>
            ))}

          </select>

          <input
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Course Name"
            className="border rounded-xl px-4 py-3"
          />

          <button
            onClick={addCourse}
            className="bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2"
          >
            <Plus size={20}/>
            Add Course
          </button>

        </div>

      </div>

      <div className="bg-white rounded-2xl shadow-md mt-8">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left p-5">
                Department
              </th>

              <th className="text-left p-5">
                Course
              </th>

              <th className="text-right p-5">
                Action
              </th>

            </tr>

          </thead>

          <tbody>
                        {courses.length === 0 ? (

              <tr>

                <td
                  colSpan={3}
                  className="text-center py-10 text-gray-500"
                >
                  No courses found.
                </td>

              </tr>

            ) : (

              courses.map((course) => (

                <tr
                  key={course.id}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="p-5">
                    {course.departments?.department_name}
                  </td>

                  <td className="p-5 font-medium">
                    {course.course_name}
                  </td>

                  <td className="p-5 text-right">

                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 inline-flex items-center gap-2"
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
<Footer />
    </div>

  );

}