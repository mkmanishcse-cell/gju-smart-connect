"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Footer from "@/components/common/Footer";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import {
  Search,
  ArrowLeft,
  Download,
  FileSpreadsheet,
  GraduationCap,
} from "lucide-react";

type Student = {
  id: string;
  roll_no: string;
  student_name: string;
  email: string;
  mobile: string;
  department_id: string;
  course_id: string;
  semester_id: string;
};

type StudentView = Student & {
  department_name: string;
  course_name: string;
  semester_name: string;
};

export default function ViewStudents() {

  const [students, setStudents] = useState<StudentView[]>([]);
  const [filtered, setFiltered] = useState<StudentView[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    loadStudents();

  }, []);

  useEffect(() => {

    const data = students.filter((student) =>

      student.student_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      student.roll_no
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      student.email
        .toLowerCase()
        .includes(search.toLowerCase())

    );

    setFiltered(data);

  }, [search, students]);

  async function loadStudents() {

    const { data } = await supabase

      .from("students")

      .select("*")

      .order("roll_no");

    if (!data) return;

    const finalData: StudentView[] = [];

    for (const student of data) {

      const { data: department } = await supabase

        .from("departments")

        .select("department_name")

        .eq("id", student.department_id)

        .single();

      const { data: course } = await supabase

        .from("courses")

        .select("course_name")

        .eq("id", student.course_id)

        .single();

      const { data: semester } = await supabase

        .from("semesters")

        .select("semester_no")

        .eq("id", student.semester_id)

        .single();

      finalData.push({

        ...student,

        department_name:
          department?.department_name || "-",

        course_name:
          course?.course_name || "-",

        semester_name:
          "Semester " +
          (semester?.semester_no || "-"),

      });

    }

    setStudents(finalData);

    setFiltered(finalData);

  }

  function exportPDF() {

    const pdf = new jsPDF();

    pdf.setFontSize(18);

    pdf.text(
      "GJU Smart Connect",
      14,
      18
    );

    pdf.setFontSize(11);

    pdf.text(
      "Students Report",
      14,
      28
    );

    pdf.text(
      new Date().toLocaleString(),
      150,
      28
    );

    autoTable(pdf, {

      startY: 36,

      theme: "grid",

      head: [[

        "Roll No",

        "Name",

        "Email",

        "Mobile",

        "Department",

        "Course",

        "Semester",

      ]],

      body: filtered.map((student) => [

        student.roll_no,

        student.student_name,

        student.email,

        student.mobile,

        student.department_name,

        student.course_name,

        student.semester_name,

      ]),

      headStyles: {

        fillColor: [37,99,235],

      },

    });

    pdf.save("Students_Report.pdf");

  }

  function exportExcel() {

    const data = filtered.map((student) => ({

      Roll_No: student.roll_no,

      Student_Name: student.student_name,

      Email: student.email,

      Mobile: student.mobile,

      Department: student.department_name,

      Course: student.course_name,

      Semester: student.semester_name,

    }));

    const sheet =
      XLSX.utils.json_to_sheet(data);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      sheet,
      "Students"
    );

    XLSX.writeFile(
      workbook,
      "Students_Report.xlsx"
    );

  }

  return (

<main className="min-h-screen bg-slate-100">

<div className="max-w-7xl mx-auto p-8">
  {/* Header */}

<div className="flex justify-between items-center flex-wrap gap-5">

  <div>

    <h1 className="text-4xl font-bold">

      All Students

    </h1>

    <p className="text-gray-500 mt-2">

      Total Students : {filtered.length}

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

{/* Search & Export */}

<div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

  <div className="flex flex-col lg:flex-row justify-between gap-5">

    <div className="relative flex-1">

      <Search
        size={20}
        className="absolute left-4 top-4 text-gray-400"
      />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by Roll No, Name or Email..."
        className="w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

    </div>

    <div className="flex gap-3">

      <button
        onClick={exportPDF}
        className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
      >

        <Download size={20} />

        Export PDF

      </button>

      <button
        onClick={exportExcel}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
      >

        <FileSpreadsheet size={20} />

        Export Excel

      </button>

    </div>

  </div>

</div>

{/* Students Table */}

<div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-8">

<table className="w-full">

<thead className="bg-blue-600 text-white">

<tr>

<th className="p-4 text-left">Roll No</th>

<th className="p-4 text-left">Student Name</th>

<th className="p-4 text-left">Email</th>

<th className="p-4 text-left">Mobile</th>

<th className="p-4 text-left">Department</th>

<th className="p-4 text-left">Course</th>

<th className="p-4 text-left">Semester</th>

</tr>

</thead>

<tbody>
  {filtered.length === 0 ? (

<tr>

<td
colSpan={7}
className="text-center py-10 text-gray-500"
>

No Students Found

</td>

</tr>

) : (

filtered.map((student) => (

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

{student.email}

</td>

<td className="p-4">

{student.mobile || "-"}

</td>

<td className="p-4">

{student.department_name}

</td>

<td className="p-4">

{student.course_name}

</td>

<td className="p-4">

{student.semester_name}

</td>

</tr>

))

)}

</tbody>

</table>

</div>

{/* Footer */}


</div>
<Footer />
</main>

);

}