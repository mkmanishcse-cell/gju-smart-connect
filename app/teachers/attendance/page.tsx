"use client";

import SubjectCard from "@/components/teacher/SubjectCard";
import { useEffect, useState } from "react";
import Footer from "@/components/common/Footer";
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

      <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-5 sm:py-5 lg:px-8 lg:py-8">

        {/* Header */}

        <div className="flex items-start justify-between gap-2 sm:flex-row sm:items-center">
         <div className="flex-1">
  <h1 className="text-xl font-bold text-slate-800 sm:text-3xl lg:text-4xl">
    Attendance
  </h1>

  <p className="mt-1 text-xs text-gray-500 sm:text-base">
    Choose a subject to mark attendance.
  </p>
</div>

         <Link
  href="/teachers"
  className="flex shrink-0 items-center justify-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-lg transition hover:bg-blue-700 sm:w-auto sm:gap-2 sm:rounded-xl sm:px-6 sm:py-3 sm:text-sm"
>
  <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
  <span>Dashboard</span>
</Link>

        </div>

        {/* Statistics */}

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-6">

          <div className="bg-blue-600 rounded-2xl p-4 sm:p-5 lg:p-6 text-white shadow-lg">

            <p className="text-blue-100">

              Total Subjects

            </p>

            <h2 className="text-3xl sm:text-4xl font-bold mt-3">

              {subjects.length}

            </h2>

          </div>

          <div className="bg-green-600 rounded-2xl p-4 sm:p-5 lg:p-6 text-white shadow-lg">

            <p className="text-green-100">

              Theory

            </p>

            <h2 className="text-3xl sm:text-4xl font-bold mt-3">

              {subjects.filter(s => s.subject_type === "Theory").length}

            </h2>

          </div>

          <div className="bg-orange-500 rounded-2xl p-4 sm:p-5 lg:p-6 text-white shadow-lg">

            <p className="text-orange-100">

              Practical

            </p>

            <h2 className="text-3xl sm:text-4xl font-bold mt-3">

              {subjects.filter(s => s.subject_type === "Practical").length}

            </h2>

          </div>

        </div>

        {/* Search */}

        <div className="mt-5 rounded-2xl bg-white p-3 shadow-lg sm:p-5 lg:p-6">

          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-4 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Subject..."
              className="w-full border rounded-xl py-2.5 pl-11 sm:py-3 sm:pl-12 pr-4 outline-none focus:border-blue-600"
            />

          </div>

        </div>

        {/* Subject Cards */}

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                      {filteredSubjects.length === 0 ? (

            <div className="col-span-full bg-white rounded-3xl shadow-lg p-6 sm:p-8 lg:p-12 text-center">

              <ClipboardCheck
                size={48}
                className="mx-auto text-slate-400"
              />

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-5 text-slate-800">

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
       

      </div>
<Footer />
    </main>

  );

}