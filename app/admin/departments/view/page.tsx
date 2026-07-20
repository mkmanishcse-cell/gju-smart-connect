"use client";
import Footer from "@/components/common/Footer";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Search,
  Building2,
  ArrowLeft,
} from "lucide-react";

type Department = {
  id: string;
  department_name: string;
};

export default function ViewDepartments() {

  const [departments, setDepartments] = useState<Department[]>([]);
  const [filtered, setFiltered] = useState<Department[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    loadDepartments();

  }, []);

  useEffect(() => {

    const data = departments.filter((department) =>

      department.department_name
        .toLowerCase()
        .includes(search.toLowerCase())

    );

    setFiltered(data);

  }, [departments, search]);

  async function loadDepartments() {

    const { data } = await supabase

      .from("departments")

      .select("*")

      .order("department_name");

    if (data) {

      setDepartments(data as Department[]);
      setFiltered(data as Department[]);

    }

  }

  return (

    <main className="min-h-screen bg-slate-100">

      <div className="max-w-6xl mx-auto p-8">

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold">

              All Departments

            </h1>

            <p className="text-gray-500 mt-2">

              Total Departments : {departments.length}

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
              placeholder="Search Department..."
              className="w-full border rounded-xl py-3 pl-12 pr-4"
            />

          </div>

        </div>
                {/* Departments Table */}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-8">

          <table className="w-full">

            <thead className="bg-purple-600 text-white">

              <tr>

                <th className="p-4 text-left">
                  Department ID
                </th>

                <th className="p-4 text-left">
                  Department Name
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

                    No Departments Found

                  </td>

                </tr>

              ) : (

                filtered.map((department) => (

                  <tr
                    key={department.id}
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="p-4 font-medium">

                      {department.id}

                    </td>

                    <td className="p-4">

                      {department.department_name}

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