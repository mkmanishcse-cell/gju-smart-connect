"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

import {
  ArrowLeft,
  GraduationCap,
  Users,
  BookOpen,
  Building2,
  School,
  Calendar,
  Download,
} from "lucide-react";

import { getDashboardCounts } from "@/lib/admin";

export default function ReportsPage() {

  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    subjects: 0,
    departments: 0,
    courses: 0,
    semesters: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    const data = await getDashboardCounts();

    setCounts({
      students: data.students || 0,
      teachers: data.teachers || 0,
      subjects: data.subjects || 0,
      departments: data.departments || 0,
      courses: data.courses || 0,
      semesters: data.semesters || 0,
    });

  }

  function exportPDF() {

    const pdf = new jsPDF();

    pdf.setFontSize(20);
    pdf.text("GJU Smart Connect", 20, 20);

    pdf.setFontSize(14);

    pdf.text(`Students : ${counts.students}`,20,40);
    pdf.text(`Teachers : ${counts.teachers}`,20,50);
    pdf.text(`Subjects : ${counts.subjects}`,20,60);
    pdf.text(`Departments : ${counts.departments}`,20,70);
    pdf.text(`Courses : ${counts.courses}`,20,80);
    pdf.text(`Semesters : ${counts.semesters}`,20,90);

    pdf.save("University_Report.pdf");

  }

  function exportExcel(){

    const data=[

      {
        Category:"Students",
        Count:counts.students,
      },

      {
        Category:"Teachers",
        Count:counts.teachers,
      },

      {
        Category:"Subjects",
        Count:counts.subjects,
      },

      {
        Category:"Departments",
        Count:counts.departments,
      },

      {
        Category:"Courses",
        Count:counts.courses,
      },

      {
        Category:"Semesters",
        Count:counts.semesters,
      }

    ];

    const sheet=XLSX.utils.json_to_sheet(data);

    const workbook=XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook,sheet,"Report");

    XLSX.writeFile(workbook,"University_Report.xlsx");

  }

  return(

<main className="min-h-screen bg-slate-100">

<div className="max-w-7xl mx-auto p-8">

<div className="flex justify-between items-center">

<div>

<h1 className="text-4xl font-bold">

Reports Dashboard

</h1>

<p className="text-gray-500 mt-2">

University Reports & Analytics

</p>

</div>

<Link
href="/admin"
className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 flex items-center gap-2"
>

<ArrowLeft size={20}/>

Dashboard

</Link>

</div>
{/* Report Cards */}

<div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mt-10">

<Link
href="/admin/students/view"
className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition block"
>

<GraduationCap
size={45}
className="text-blue-600"
/>

<h2 className="mt-5 text-gray-500">

Students

</h2>

<h1 className="text-4xl font-bold mt-2">

{counts.students}

</h1>

</Link>

<Link
href="/admin/teachers/view"
className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition block"
>

<Users
size={45}
className="text-green-600"
/>

<h2 className="mt-5 text-gray-500">

Teachers

</h2>

<h1 className="text-4xl font-bold mt-2">

{counts.teachers}

</h1>

</Link>

<Link
href="/admin/subjects/view"
className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition block"
>

<BookOpen
size={45}
className="text-orange-500"
/>

<h2 className="mt-5 text-gray-500">

Subjects

</h2>

<h1 className="text-4xl font-bold mt-2">

{counts.subjects}

</h1>

</Link>

<Link
href="/admin/departments/view"
className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition block"
>

<Building2
size={45}
className="text-purple-600"
/>

<h2 className="mt-5 text-gray-500">

Departments

</h2>

<h1 className="text-4xl font-bold mt-2">

{counts.departments}

</h1>

</Link>

<Link
href="/admin/courses/view"
className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition block"
>

<School
size={45}
className="text-cyan-600"
/>

<h2 className="mt-5 text-gray-500">

Courses

</h2>

<h1 className="text-4xl font-bold mt-2">

{counts.courses}

</h1>

</Link>

<Link
href="/admin/semesters/view"
className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition block"
>

<Calendar
size={45}
className="text-pink-600"
/>

<h2 className="mt-5 text-gray-500">

Semesters

</h2>

<h1 className="text-4xl font-bold mt-2">

{counts.semesters}

</h1>

</Link>

</div>
{/* Export Reports */}

<div className="bg-white rounded-2xl shadow-lg p-8 mt-10">

  <div className="flex items-center justify-between flex-wrap gap-5">

    <div>

      <h2 className="text-2xl font-bold">

        Export Reports

      </h2>

      <p className="text-gray-500 mt-2">

        Download University Summary in PDF or Excel.

      </p>

    </div>

    <div className="flex gap-4">

      <button
        onClick={exportPDF}
        className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-3 flex items-center gap-2 transition"
      >

        <Download size={20} />

        Export PDF

      </button>

      <button
        onClick={exportExcel}
        className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-3 flex items-center gap-2 transition"
      >

        <Download size={20} />

        Export Excel

      </button>

    </div>

  </div>

</div>

{/* University Summary */}

<div className="bg-white rounded-2xl shadow-lg p-8 mt-10">

  <h2 className="text-2xl font-bold">

    University Summary

  </h2>

  <div className="grid lg:grid-cols-2 gap-6 mt-8">

    <div className="rounded-xl bg-slate-100 p-5">

      <p className="text-gray-500">
        Total Students
      </p>

      <h3 className="text-3xl font-bold text-blue-600">
        {counts.students}
      </h3>

    </div>

    <div className="rounded-xl bg-slate-100 p-5">

      <p className="text-gray-500">
        Total Teachers
      </p>

      <h3 className="text-3xl font-bold text-green-600">
        {counts.teachers}
      </h3>

    </div>

    <div className="rounded-xl bg-slate-100 p-5">

      <p className="text-gray-500">
        Total Subjects
      </p>

      <h3 className="text-3xl font-bold text-orange-500">
        {counts.subjects}
      </h3>

    </div>

    <div className="rounded-xl bg-slate-100 p-5">

      <p className="text-gray-500">
        Total Departments
      </p>

      <h3 className="text-3xl font-bold text-purple-600">
        {counts.departments}
      </h3>

    </div>

    <div className="rounded-xl bg-slate-100 p-5">

      <p className="text-gray-500">
        Total Courses
      </p>

      <h3 className="text-3xl font-bold text-cyan-600">
        {counts.courses}
      </h3>

    </div>

    <div className="rounded-xl bg-slate-100 p-5">

      <p className="text-gray-500">
        Total Semesters
      </p>

      <h3 className="text-3xl font-bold text-pink-600">
        {counts.semesters}
      </h3>

    </div>

  </div>

</div>
        {/* Footer */}

        <footer className="mt-12 border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <div>

            <h3 className="font-bold text-lg">

              GJU Smart Connect

            </h3>

            <p className="text-gray-500 text-sm">

              University Management System

            </p>

          </div>

          <div className="text-center">

            <p className="text-gray-500">

              © 2026 All Rights Reserved

            </p>

            <p className="text-sm text-gray-400">

              Developed by

              <span className="font-semibold text-blue-600">

                {" "}Manish Kushwaha

              </span>

            </p>

          </div>

        </footer>

      </div>

    </main>

  );

}