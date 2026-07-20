"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Search,
  Calendar,
  ArrowLeft,
} from "lucide-react";

type Semester = {
  id: string;
  semester_no: number;
};

export default function ViewSemesters() {

  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [filtered, setFiltered] = useState<Semester[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    loadSemesters();

  }, []);

  useEffect(() => {

    setFiltered(

      semesters.filter((semester) =>

        semester.semester_no
          .toString()
          .includes(search)

      )

    );

  }, [search, semesters]);

  async function loadSemesters() {

    const { data } = await supabase

      .from("semesters")

      .select("*")

      .order("semester_no");

    if (data) {

      setSemesters(data);

      setFiltered(data);

    }

  }

  return (

<main className="min-h-screen bg-slate-100">

<div className="max-w-6xl mx-auto p-8">

<div className="flex justify-between items-center">

<div>

<h1 className="text-4xl font-bold">

All Semesters

</h1>

<p className="text-gray-500 mt-2">

Total Semesters : {semesters.length}

</p>

</div>

<Link
href="/admin/reports"
className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-3 flex items-center gap-2"
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
placeholder="Search Semester..."
className="w-full border rounded-xl py-3 pl-12"
/>

</div>

</div>
{/* Semesters Table */}

<div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-8">

  <table className="w-full">

    <thead className="bg-pink-600 text-white">

      <tr>

        <th className="p-4 text-left">

          Semester ID

        </th>

        <th className="p-4 text-left">

          Semester Number

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

            No Semesters Found

          </td>

        </tr>

      ) : (

        filtered.map((semester) => (

          <tr
            key={semester.id}
            className="border-b hover:bg-slate-50"
          >

            <td className="p-4 font-medium">

              {semester.id}

            </td>

            <td className="p-4">

              Semester {semester.semester_no}

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

    <Calendar
      size={30}
      className="text-pink-600"
    />

    <div>

      <p className="font-semibold">

        Semester Records

      </p>

      <p className="text-gray-500 text-sm">

        Total Records : {semesters.length}

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