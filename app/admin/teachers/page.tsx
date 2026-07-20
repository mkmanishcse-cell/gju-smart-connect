"use client";

"use client";
import Footer from "@/components/common/Footer";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  ArrowLeft,
} from "lucide-react";

type Department = {
  id: string;
  department_name: string;
};

type Teacher = {
  id: string;
  teacher_id: string;
  teacher_name: string;
  email: string;
  mobile: string;
  password: string;
  department_id: string;
  departments?: {
    department_name: string;
  };
};

export default function TeachersPage() {

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState("");

  const [form, setForm] = useState({

    teacher_id: "",
    teacher_name: "",
    email: "",
    mobile: "",
    password: "",
    department_id: "",

  });

  useEffect(() => {

    loadDepartments();

    loadTeachers();

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

    }

  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {

    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });

  }
    async function saveTeacher() {

    if (
      !form.teacher_id ||
      !form.teacher_name ||
      !form.email ||
      !form.mobile ||
      !form.password ||
      !form.department_id
    ) {

      alert("Please fill all fields.");

      return;

    }

    if (editingId) {

      const { error } = await supabase

        .from("teachers")

        .update({
          teacher_id: form.teacher_id,
          teacher_name: form.teacher_name,
          email: form.email,
          mobile: form.mobile,
          password: form.password,
          department_id: form.department_id,
        })

        .eq("id", editingId);

      if (error) {

        alert(error.message);

        return;

      }

      alert("Teacher Updated Successfully");

    } else {

      const { error } = await supabase

        .from("teachers")

        .insert(form);

      if (error) {

        alert(error.message);

        return;

      }

      alert("Teacher Added Successfully");

    }

    setForm({
      teacher_id: "",
      teacher_name: "",
      email: "",
      mobile: "",
      password: "",
      department_id: "",
    });

    setEditingId("");

    loadTeachers();

  }

  function editTeacher(teacher: Teacher) {

    setEditingId(teacher.id);

    setForm({

      teacher_id: teacher.teacher_id,
      teacher_name: teacher.teacher_name,
      email: teacher.email,
      mobile: teacher.mobile,
      password: teacher.password,
      department_id: teacher.department_id,

    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }

  async function deleteTeacher(id: string) {

    if (!confirm("Delete this teacher?")) return;

    await supabase

      .from("teachers")

      .delete()

      .eq("id", id);

    loadTeachers();

  }

  const filteredTeachers = teachers.filter((teacher) =>

    teacher.teacher_name
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    teacher.teacher_id
      .toLowerCase()
      .includes(search.toLowerCase())

  );

  return (

    <main className="min-h-screen bg-slate-100">

      <div className="max-w-7xl mx-auto p-8">

       <div className="flex justify-between items-start mb-8">

  <div>

    <h1 className="text-4xl font-bold text-slate-800">
      Teacher Management
    </h1>

    <p className="text-gray-500 mt-2">
      Add, Edit and Manage Teachers
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

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

            <input
              name="teacher_id"
              value={form.teacher_id}
              onChange={handleChange}
              placeholder="Teacher ID"
              className="border rounded-xl p-3"
            />

            <input
              name="teacher_name"
              value={form.teacher_name}
              onChange={handleChange}
              placeholder="Teacher Name"
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

            <select
              name="department_id"
              value={form.department_id}
              onChange={handleChange}
              className="border rounded-xl p-3"
            >

              <option value="">
                Select Department
              </option>

              {departments.map((department) => (

                <option
                  key={department.id}
                  value={department.id}
                >
                  {department.department_name}
                </option>

              ))}

            </select>

          </div>

          <button

            onClick={saveTeacher}

            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 flex items-center gap-2"

          >

            <Plus size={20} />

            {editingId ? "Update Teacher" : "Add Teacher"}

          </button>

        </div>
                {/* Search */}

        <div className="bg-white rounded-3xl shadow-lg p-6 mt-8">

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

        {/* Teacher Table */}

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mt-8">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>

                <th className="p-4 text-left">Teacher ID</th>

                <th className="p-4 text-left">Teacher Name</th>

                <th className="p-4 text-left">Email</th>

                <th className="p-4 text-left">Mobile</th>

                <th className="p-4 text-left">Department</th>

                <th className="p-4 text-center">Action</th>

              </tr>

            </thead>

            <tbody>

              {filteredTeachers.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-500"
                  >

                    No Teachers Found

                  </td>

                </tr>

              ) : (

                filteredTeachers.map((teacher) => (

                  <tr
                    key={teacher.id}
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="p-4">
                      {teacher.teacher_id}
                    </td>

                    <td className="p-4 font-semibold">
                      {teacher.teacher_name}
                    </td>

                    <td className="p-4">
                      {teacher.email}
                    </td>

                    <td className="p-4">
                      {teacher.mobile}
                    </td>

                    <td className="p-4">
                      {teacher.departments?.department_name}
                    </td>

                    <td className="p-4">

                      <div className="flex justify-center gap-3">

                        <button

                          onClick={() => editTeacher(teacher)}

                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"

                        >

                          <Pencil size={18} />

                        </button>

                        <button

                          onClick={() => deleteTeacher(teacher.id)}

                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"

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

        {/* Footer */}


      </div>
<Footer />
    </main>

  );

}