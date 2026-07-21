"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

import {
  Search,
  ArrowLeft,
  BookMarked,
  GraduationCap,
} from "lucide-react";

import SubjectCard from "@/components/teacher/SubjectCard";

type Subject = {
  id: string;
  subject_code: string;
  subject_name: string;
  credits: number;
  subject_type: string;
  semesters?: {
    semester_no: number;
  };
};

export default function JoinSubjectPage() {
  const [teacherId, setTeacherId] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [joinedSubjects, setJoinedSubjects] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTeacher();
  }, []);

  async function loadTeacher() {
    const session = sessionStorage.getItem("user");

    if (!session) {
      window.location.href = "/login?role=teacher";
      return;
    }

    const teacher = JSON.parse(session);

    setTeacherId(teacher.id);

    await loadSubjects(
      teacher.department_id,
      teacher.course_id
    );

    await loadJoinedSubjects(teacher.id);
  }

  async function loadSubjects(
    departmentId: string,
    courseId?: string
  ) {
    let query = supabase
      .from("subjects")
      .select(`
        *,
        semesters(
          semester_no
        )
      `)
      .eq("department_id", departmentId);

    if (courseId) {
      query = query.eq("course_id", courseId);
    }

    const { data, error } = await query.order("subject_code");

    if (error) {
      console.log(error);
      return;
    }

    setSubjects(data || []);
  }

  async function loadJoinedSubjects(id: string) {
    const { data, error } = await supabase
      .from("teacher_subjects")
      .select("subject_id")
      .eq("teacher_id", id);

    if (error) {
      console.log(error);
      return;
    }

    setJoinedSubjects(
      (data || []).map((item: any) => item.subject_id)
    );
  }

  async function joinSubject(subjectId: string) {
    if (joinedSubjects.includes(subjectId)) {
      alert("Subject already joined.");
      return;
    }

    const { error } = await supabase
      .from("teacher_subjects")
      .insert({
        teacher_id: teacherId,
        subject_id: subjectId,
      });

    if (error) {
      alert(error.message);
      return;
    }

    await loadJoinedSubjects(teacherId);

    alert("Subject Joined Successfully.");
  }

  const filteredSubjects = subjects.filter((subject) => {
    const keyword = search.toLowerCase();

    return (
      subject.subject_name
        .toLowerCase()
        .includes(keyword) ||
      subject.subject_code
        .toLowerCase()
        .includes(keyword)
    );
  });

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-5 sm:py-5 lg:px-8 lg:py-8">
                {/* Hero Section */}

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 shadow-xl p-4 sm:p-6 lg:p-8 text-white">
          <div className="absolute -right-10 -top-10 opacity-10">

            <BookMarked size={220} />

          </div>

          <div className="relative flex justify-between items-start flex-wrap gap-6">

            <div>

              <div className="flex items-center gap-3">

                <GraduationCap size={26} />

                <span className="uppercase tracking-[3px] text-sm font-semibold">

                  Teacher Portal

                </span>

              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold mt-5">

                Join Subjects

              </h1>

              <p className="mt-2 max-w-2xl text-sm text-blue-100 sm:text-base lg:text-lg">

                Select the subjects you want to teach and start managing attendance,
                marks, assignments and announcements.

              </p>

            </div>
 <div className="flex w-full gap-2 sm:w-auto sm:flex-row">
  <Link href="/teachers" className="flex-1 sm:flex-none">
    <div className="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 px-3 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 cursor-pointer text-sm sm:text-base">
      <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
      Dashboard
    </div>
  </Link>

  <Link href="/teachers/my-subjects" className="flex-1 sm:flex-none">
    <div className="w-full bg-white text-blue-700 hover:bg-slate-100 transition-all duration-300 px-3 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 shadow-lg cursor-pointer text-sm sm:text-base">
      <BookMarked size={18} className="sm:w-5 sm:h-5" />
      My Subjects
    </div>
  </Link>
</div>

          </div>

          {/* Statistics */}

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-6">

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 sm:p-5 lg:p-6">

              <p className="text-sm opacity-80">

                Total Subjects

              </p>

              <h2 className="text-2xl sm:text-3xl lg:text-3xl sm:text-4xl lg:text-5xl font-bold mt-3">

                {subjects.length}

              </h2>

            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 sm:p-5 lg:p-6">

              <p className="text-sm opacity-80">

                Joined Subjects

              </p>

              <h2 className="text-2xl sm:text-3xl lg:text-3xl sm:text-4xl lg:text-5xl font-bold mt-3">

                {joinedSubjects.length}

              </h2>

            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 sm:p-5 lg:p-6">

              <p className="text-sm opacity-80">

                Remaining

              </p>

              <h2 className="text-2xl sm:text-3xl lg:text-3xl sm:text-4xl lg:text-5xl font-bold mt-3">

                {subjects.length - joinedSubjects.length}

              </h2>

            </div>

          </div>

        </div>

        {/* Search */}

        <div className="mt-5 rounded-2xl bg-white p-3 shadow-lg sm:p-5 lg:p-6">

          <div className="relative">

            <Search
              size={22}
              className="absolute left-5 top-4 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Subject Name or Subject Code..."
              className="w-full rounded-2xl border border-slate-300 py-3 pl-11 sm:pl-14 pr-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition"
            />

          </div>

        </div>

        {/* Subject Cards */}

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {filteredSubjects.length === 0 ? (

            <div className="col-span-full bg-white rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 text-center">

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">

                No Subjects Found

              </h2>

              <p className="text-gray-500 mt-3">

                No subjects match your search or no subjects are available.

              </p>

            </div>

          ) : (

            filteredSubjects.map((subject) => (

              <SubjectCard
                key={subject.id}
                code={subject.subject_code}
                name={subject.subject_name}
                semester={subject.semesters?.semester_no || 0}
                credits={subject.credits}
                type={subject.subject_type}
                joined={joinedSubjects.includes(subject.id)}
                onJoin={() => joinSubject(subject.id)}
              />

            ))

          )}

        </div>


        <footer className="mt-8 rounded-2xl bg-white p-4 shadow-lg sm:p-5 lg:p-6">

          <div className="flex flex-col items-center justify-between gap-4 text-center lg:flex-row lg:text-left">

            <div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">

                GJU Smart Connect

              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-1">

                Teacher Subject Management Portal

              </p>

            </div>

            <div className="grid w-full grid-cols-3 gap-3 text-center lg:flex lg:w-auto lg:gap-8">

              <div>

                <h3 className="text-xl sm:text-2xl font-bold text-blue-600">

                  {subjects.length}

                </h3>

                <p className="text-xs sm:text-sm text-gray-500">

                  Subjects

                </p>

              </div>

              <div>

                <h3 className="text-xl sm:text-2xl font-bold text-green-600">

                  {joinedSubjects.length}

                </h3>

                <p className="text-xs sm:text-sm text-gray-500">

                  Joined

                </p>

              </div>

              <div>

                <h3 className="text-xl sm:text-2xl font-bold text-orange-500">

                  {subjects.length - joinedSubjects.length}

                </h3>

                <p className="text-xs sm:text-sm text-gray-500">

                  Available

                </p>

              </div>

            </div>

            <div className="text-center lg:text-right">

              <p className="text-xs sm:text-sm text-gray-500">

                © 2026 All Rights Reserved

              </p>

              <p className="mt-1 text-sm">

                Developed By

                <span className="font-bold text-blue-600">

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