"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Footer from "@/components/common/Footer";
import {
  Search,
  BookOpen,
  ArrowLeft,
} from "lucide-react";

type Subject = {
  id: string;

  subject_code: string;

  subject_name: string;

  subject_type: string;

  credits: number;

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

export default function ViewSubjects() {

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    loadSubjects();

  }, []);

  useEffect(() => {

    const data = subjects.filter((subject) =>

      subject.subject_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      subject.subject_code
        .toLowerCase()
        .includes(search.toLowerCase())

    );

    setFilteredSubjects(data);

  }, [subjects, search]);

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

  return (

    <main className="min-h-screen bg-slate-100">

      <div className="max-w-7xl mx-auto p-8">
                {/* Header */}

        <div className="flex justify-between items-center flex-wrap gap-6">

          <div>

            <h1 className="text-4xl font-bold text-slate-800">
              All Subjects
            </h1>

            <p className="text-gray-500 mt-2">
              View and manage all university subjects
            </p>

          </div>

          <Link
            href="/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
          >

            <ArrowLeft size={20} />

            Dashboard

          </Link>

        </div>

        {/* Statistics */}

        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-lg">

            <p className="text-blue-100">
              Total Subjects
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {subjects.length}
            </h2>

          </div>

          <div className="bg-green-600 text-white rounded-2xl p-6 shadow-lg">

            <p className="text-green-100">
              Theory Subjects
            </p>

            <h2 className="text-4xl font-bold mt-2">

              {
                subjects.filter(
                  (s) => s.subject_type === "Theory"
                ).length
              }

            </h2>

          </div>

          <div className="bg-orange-500 text-white rounded-2xl p-6 shadow-lg">

            <p className="text-orange-100">
              Practical Subjects
            </p>

            <h2 className="text-4xl font-bold mt-2">

              {
                subjects.filter(
                  (s) => s.subject_type === "Practical"
                ).length
              }

            </h2>

          </div>

        </div>

        {/* Search */}

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-4 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Subject by Name or Code..."
              className="w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>

        {/* Subjects Table */}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-8">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>

                <th className="p-4 text-left">
                  Subject Code
                </th>

                <th className="p-4 text-left">
                  Subject Name
                </th>

                <th className="p-4 text-left">
                  Department
                </th>

                <th className="p-4 text-left">
                  Course
                </th>

                <th className="p-4 text-left">
                  Semester
                </th>

                <th className="p-4 text-left">
                  Type
                </th>

                <th className="p-4 text-left">
                  Credits
                </th>

              </tr>

            </thead>

            <tbody>
                            {filteredSubjects.length === 0 ? (

                <tr>

                  <td
                    colSpan={7}
                    className="text-center py-10 text-gray-500"
                  >

                    No Subjects Found

                  </td>

                </tr>

              ) : (

                filteredSubjects.map((subject) => (

                  <tr
                    key={subject.id}
                    className="border-b hover:bg-slate-50 transition"
                  >

                    <td className="p-4 font-semibold">
                      {subject.subject_code}
                    </td>

                    <td className="p-4">
                      {subject.subject_name}
                    </td>

                    <td className="p-4">
                      {subject.departments?.department_name || "-"}
                    </td>

                    <td className="p-4">
                      {subject.courses?.course_name || "-"}
                    </td>

                    <td className="p-4">
                      Semester {subject.semesters?.semester_no || "-"}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          subject.subject_type === "Theory"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >

                        {subject.subject_type}

                      </span>

                    </td>

                    <td className="p-4 font-semibold">
                      {subject.credits}
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