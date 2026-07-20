"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Footer from "@/components/common/Footer";
type Department = {
  id: string;
  department_name: string;
};

export default function DepartmentsPage() {
  const [department, setDepartment] = useState("");

  const [departments, setDepartments] = useState<Department[]>([]);

  const [loading, setLoading] = useState(false);

  async function loadDepartments() {
    const { data } = await supabase
      .from("departments")
      .select("*")
      .order("department_name");

    if (data) {
      setDepartments(data);
    }
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  async function addDepartment() {
    if (!department.trim()) return;

    setLoading(true);

    await supabase.from("departments").insert({
      department_name: department,
    });

    setDepartment("");

    loadDepartments();

    setLoading(false);
  }

  async function deleteDepartment(id: string) {
    await supabase
      .from("departments")
      .delete()
      .eq("id", id);

    loadDepartments();
  }

  return (

    <div className="max-w-6xl mx-auto pt-8">

     <div className="flex justify-between items-start mb-8">

  <div>

    <h1 className="text-4xl font-bold text-slate-800">
      Departments
    </h1>

    <p className="text-gray-500 mt-2">
      Manage all university departments
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

        <div className="flex gap-4">

          <input
            value={department}
            onChange={(e)=>setDepartment(e.target.value)}
            placeholder="Department Name"
            className="flex-1 border rounded-xl px-4 py-3"
          />

          <button
            onClick={addDepartment}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 flex items-center gap-2"
          >

            <Plus size={20}/>

            {loading ? "Saving..." : "Add"}

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

              <th className="text-right p-5">
                Action
              </th>

            </tr>

          </thead>

          <tbody>
                        {departments.length === 0 ? (

              <tr>

                <td
                  colSpan={2}
                  className="text-center py-10 text-gray-500"
                >
                  No departments found.
                </td>

              </tr>

            ) : (

              departments.map((item) => (

                <tr
                  key={item.id}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="p-5 font-medium">
                    {item.department_name}
                  </td>

                  <td className="p-5 text-right">

                    <button
                      onClick={() => deleteDepartment(item.id)}
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