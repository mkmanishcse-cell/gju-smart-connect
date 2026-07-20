"use client";

import SubjectCard from "@/components/teacher/SubjectCard";
import { useEffect, useState } from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

import {

ArrowLeft,

Search,

ClipboardCheck,

} from "lucide-react";

type Subject={

id:string;

subject_code:string;

subject_name:string;

subject_type:string;

credits:number;

semester_no:number;

};

export default function AttendanceSubjectsPage(){

const [teacherId,setTeacherId]=useState("");

const [subjects,setSubjects]=useState<Subject[]>([]);

const [filteredSubjects,setFilteredSubjects]=useState<Subject[]>([]);

const [search,setSearch]=useState("");

useEffect(()=>{

loadTeacher();

},[]);

useEffect(()=>{

const keyword=search.toLowerCase();

setFilteredSubjects(

subjects.filter((subject)=>

subject.subject_name.toLowerCase().includes(keyword)||

subject.subject_code.toLowerCase().includes(keyword)

)

);

},[search,subjects]);
  async function loadTeacher() {

    const session = sessionStorage.getItem("user");

    if (!session) {

      window.location.href = "/login?role=teacher";

      return;

    }

    const teacher = JSON.parse(session);

    setTeacherId(teacher.id);

    loadSubjects(teacher.id);

  }

  async function loadSubjects(id: string) {

    // Get Joined Subject IDs

    const { data: joined, error: joinedError } = await supabase

      .from("teacher_subjects")

      .select("subject_id")

      .eq("teacher_id", id);

    if (joinedError) {

      console.log(joinedError);

      return;

    }

    if (!joined || joined.length === 0) {

      setSubjects([]);

      setFilteredSubjects([]);

      return;

    }

    const subjectIds = joined.map((item) => item.subject_id);

    // Fetch Subject Details

    const { data: subjectData, error: subjectError } = await supabase

      .from("subjects")

      .select(`
        *,
        semesters(
          semester_no
        )
      `)

      .in("id", subjectIds)

      .order("subject_code");

    if (subjectError) {

      console.log(subjectError);

      return;

    }

    const list: Subject[] = (subjectData || []).map((item: any) => ({

      id: item.id,

      subject_code: item.subject_code,

      subject_name: item.subject_name,

      subject_type: item.subject_type,

      credits: item.credits,

      semester_no: item.semesters?.semester_no || 0,

    }));

    setSubjects(list);

    setFilteredSubjects(list);

  }

  return (

    <main className="min-h-screen bg-slate-100">

      <div className="max-w-7xl mx-auto p-8">

        {/* Header */}

        <div className="flex justify-between items-center flex-wrap gap-6">

          <div>

            <h1 className="text-4xl font-bold text-slate-800">

              Attendance

            </h1>

            <p className="text-gray-500 mt-2">

              Choose a subject to mark attendance.

            </p>

          </div>

          <Link
            href="/teachers"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg"
          >

            <ArrowLeft size={20} />

            Dashboard

          </Link>

        </div>

        {/* Statistics */}

        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg">

            <p className="text-blue-100">

              Total Subjects

            </p>

            <h2 className="text-4xl font-bold mt-3">

              {subjects.length}

            </h2>

          </div>

          <div className="bg-green-600 rounded-2xl p-6 text-white shadow-lg">

            <p className="text-green-100">

              Theory

            </p>

            <h2 className="text-4xl font-bold mt-3">

              {subjects.filter(s => s.subject_type === "Theory").length}

            </h2>

          </div>

          <div className="bg-orange-500 rounded-2xl p-6 text-white shadow-lg">

            <p className="text-orange-100">

              Practical

            </p>

            <h2 className="text-4xl font-bold mt-3">

              {subjects.filter(s => s.subject_type === "Practical").length}

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
              placeholder="Search Subject..."
              className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-600"
            />

          </div>

        </div>

        {/* Subject Cards */}

        <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-6 mt-8">
                      {filteredSubjects.length === 0 ? (

            <div className="col-span-full bg-white rounded-3xl shadow-lg p-12 text-center">

              <ClipboardCheck
                size={60}
                className="mx-auto text-slate-400"
              />

              <h2 className="text-3xl font-bold mt-5 text-slate-800">

                No Subjects Found

              </h2>

              <p className="text-gray-500 mt-3">

                Join a subject to mark attendance.

              </p>

            </div>

          ) : (

            filteredSubjects.map((subject) => (

  <SubjectCard
    key={subject.id}
    id={subject.id}
    code={subject.subject_code}
    name={subject.subject_name}
    semester={subject.semester_no}
    credits={subject.credits}
    type={subject.subject_type}
    mode="attendance"
  />

))
          )}

        </div>

        {/* Footer */}
        <footer className="mt-12 bg-white rounded-3xl shadow-lg p-8">

  <div className="flex flex-col md:flex-row justify-between items-center gap-6">

    <div>

      <h2 className="text-2xl font-bold text-slate-800">

        GJU Smart Connect

      </h2>

      <p className="text-gray-500 mt-2">

        Teacher Attendance Management

      </p>

    </div>

    <div className="text-center">

      <p className="text-gray-500">

        Available Subjects

      </p>

      <h2 className="text-4xl font-bold text-blue-600 mt-2">

        {subjects.length}

      </h2>

    </div>

    <div className="text-right">

      <p className="text-gray-500">

        © 2026 All Rights Reserved

      </p>

      <p className="text-sm text-slate-500 mt-2">

        Developed By

        <span className="font-semibold text-blue-600">

          {" "}Manish Kushwaha

        </span>

      </p>

    </div>

  </div>

</footer>

      </div>

    </main>

  );

}