"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Search,
  School,
  ArrowLeft,
} from "lucide-react";

type Course = {
  id: string;
  course_name: string;
  course_code: string;
};

export default function ViewCourses() {

  const [courses, setCourses] = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {

    setFiltered(

      courses.filter((course) =>

        course.course_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        course.course_code
          .toLowerCase()
          .includes(search.toLowerCase())

      )

    );

  }, [search, courses]);

  async function loadCourses() {

    const { data } = await supabase

      .from("courses")

      .select("*")

      .order("course_name");

    if (data) {

      setCourses(data);

      setFiltered(data);

    }

  }

  return (

<main className="min-h-screen bg-slate-100">

<div className="max-w-6xl mx-auto p-8">

<div className="flex justify-between items-center">

<div>

<h1 className="text-4xl font-bold">

All Courses

</h1>

<p className="text-gray-500 mt-2">

Total Courses : {courses.length}

</p>

</div>

<Link
href="/admin/reports"
className="bg-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2"
>

<ArrowLeft size={20}/>

Reports

</Link>

</div>

<div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

<div className="relative">

<Search
size={20}
className="absolute left-4 top-4 text-gray-400"
/>

<input
value={search}
onChange={(e)=>setSearch(e.target.value)}
placeholder="Search Course..."
className="w-full border rounded-xl py-3 pl-12"
/>

</div>

</div>
{/* Courses Table */}

<div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-8">

  <table className="w-full">

    <thead className="bg-cyan-600 text-white">

      <tr>

        <th className="p-4 text-left">

          Course Code

        </th>

        <th className="p-4 text-left">

          Course Name

        </th>

      </tr>

    </thead>

    <tbody>

      {filtered.length === 0 ? (

        <tr>

          <td
            colSpan={2}
            className="text-center py-10 text-gray-500"
          >

            No Courses Found

          </td>

        </tr>

      ) : (

        filtered.map((course) => (

          <tr
            key={course.id}
            className="border-b hover:bg-slate-50"
          >

            <td className="p-4 font-medium">

              {course.course_code}

            </td>

            <td className="p-4">

              {course.course_name}

            </td>

          </tr>

        ))

      )}

    </tbody>

  </table>

</div>

{/* Footer */}

<footer className="mt-10 border-t pt-6 flex justify-between items-center">

  <div className="flex items-center gap-3">

    <School
      size={30}
      className="text-cyan-600"
    />

    <div>

      <p className="font-semibold">

        Course Records

      </p>

      <p className="text-gray-500 text-sm">

        Total Records : {courses.length}

      </p>

    </div>

  </div>

  <p className="text-gray-500">

    © 2026 GJU Smart Connect

  </p>

</footer>

</div>

</main>

);

}