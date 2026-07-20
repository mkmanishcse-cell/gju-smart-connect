"use client";
import Footer from "@/components/common/Footer";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Search,
  Users,
  ArrowLeft,
} from "lucide-react";

type Teacher = {
  id: string;
  teacher_id: string;
  teacher_name: string;
  email: string;
  mobile: string;

  departments?: {
    department_name: string;
  };
};

export default function ViewTeachers() {

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filtered, setFiltered] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    loadTeachers();

  }, []);

  useEffect(() => {

    const data = teachers.filter((teacher) =>

      teacher.teacher_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      teacher.teacher_id
        .toLowerCase()
        .includes(search.toLowerCase())

    );

    setFiltered(data);

  }, [teachers, search]);

  async function loadTeachers() {

    const { data } = await supabase

      .from("teachers")

      .select(`
        *,
        departments(
          department_name
        )
      `)

      .order("teacher_name");

    if (data) {

      setTeachers(data as Teacher[]);
      setFiltered(data as Teacher[]);

    }

  }

  return (

<main className="min-h-screen flex flex-col bg-slate-100">

<div className="flex-1 w-full max-w-7xl mx-auto px-8 pt-8 pb-4">

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold">

              All Teachers

            </h1>

            <p className="text-gray-500 mt-2">

              Total Teachers : {teachers.length}

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

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-4 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Teacher..."
              className="w-full border rounded-xl py-3 pl-12 pr-4"
            />

          </div>

        </div>
                {/* Teachers Table */}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-8">

          <table className="w-full">

            <thead className="bg-green-600 text-white">

              <tr>

                <th className="p-4 text-left">Teacher ID</th>

                <th className="p-4 text-left">Teacher Name</th>

                <th className="p-4 text-left">Department</th>

                <th className="p-4 text-left">Email</th>

                <th className="p-4 text-left">Mobile</th>

              </tr>

            </thead>

            <tbody>

              {filtered.length === 0 ? (

                <tr>

                  <td
                    colSpan={5}
                    className="text-center py-10 text-gray-500"
                  >

                    No Teachers Found

                  </td>

                </tr>

              ) : (

                filtered.map((teacher) => (

                  <tr
                    key={teacher.id}
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="p-4 font-medium">
                      {teacher.teacher_id}
                    </td>

                    <td className="p-4">
                      {teacher.teacher_name}
                    </td>

                    <td className="p-4">
                      {teacher.departments?.department_name || "-"}
                    </td>

                    <td className="p-4">
                      {teacher.email}
                    </td>

                    <td className="p-4">
                      {teacher.mobile}
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