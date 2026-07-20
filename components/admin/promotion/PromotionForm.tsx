"use client";

import { useEffect, useState } from "react";

import {
  getDepartments,
  getCourses,
  getSemesters,
  getStudents,
  getStudentsCount,
} from "@/lib/promotion";

import {
  Department,
  Course,
  Semester,
  Student,
} from "./types";

import PromotionSummary from "./PromotionSummary";
import PromotionPreview from "./PromotionPreview";
import PromotionDialog from "./PromotionDialog";

export default function PromotionForm() {

  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [departmentId, setDepartmentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [semesterId, setSemesterId] = useState("");

  const [studentsCount, setStudentsCount] = useState(0);

  const [nextSemester, setNextSemester] = useState("--");

  const [loading, setLoading] = useState(false);

  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {

    loadDepartments();

  }, []);

  async function loadDepartments() {

    const data = await getDepartments();

    setDepartments(data);

  }

  async function handleDepartment(id: string) {

    setDepartmentId(id);

    setCourseId("");

    setSemesterId("");

    setStudents([]);

    setStudentsCount(0);

    setNextSemester("--");

    setSemesters([]);

    const data = await getCourses(id);

    setCourses(data);

  }

  async function handleCourse(id: string) {

    setCourseId(id);

    setSemesterId("");

    setStudents([]);

    setStudentsCount(0);

    setNextSemester("--");

    const data = await getSemesters(id);

    setSemesters(data);

  }

  async function handleSemester(id: string) {

    setSemesterId(id);

    const sem = semesters.find((s) => s.id === id);

    if (sem) {

      if (sem.semester_no >= 8) {

        setNextSemester("Completed");

      } else {

        setNextSemester(`Semester ${sem.semester_no + 1}`);

      }

    }

    const count = await getStudentsCount(

      departmentId,

      courseId,

      id

    );

    setStudentsCount(count);

    const list = await getStudents(

      departmentId,

      courseId,

      id

    );

    setStudents(list);

  }

  return (

    <>
<div className="rounded-2xl bg-white p-8 shadow-lg">

  <h2 className="text-2xl font-bold text-slate-800">

    Promotion Details

  </h2>

  <p className="mt-2 text-slate-500">

    Select Department, Course and Current Semester.

  </p>

  <div className="mt-8 grid gap-6 lg:grid-cols-3">

    {/* Department */}

    <div>

      <label className="mb-2 block font-semibold">

        Department

      </label>

      <select

        value={departmentId}

        onChange={(e)=>handleDepartment(e.target.value)}

        className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-600"

      >

        <option value="">

          Select Department

        </option>

        {departments.map((department)=>(

          <option

            key={department.id}

            value={department.id}

          >

            {department.department_name}

          </option>

        ))}

      </select>

    </div>

    {/* Course */}

    <div>

      <label className="mb-2 block font-semibold">

        Course

      </label>

      <select

        value={courseId}

        disabled={!departmentId}

        onChange={(e)=>handleCourse(e.target.value)}

        className="w-full rounded-xl border border-slate-300 p-3 outline-none disabled:bg-slate-100"

      >

        <option value="">

          Select Course

        </option>

        {courses.map((course)=>(

          <option

            key={course.id}

            value={course.id}

          >

            {course.course_name}

          </option>

        ))}

      </select>

    </div>

    {/* Semester */}

    <div>

      <label className="mb-2 block font-semibold">

        Current Semester

      </label>

      <select

        value={semesterId}

        disabled={!courseId}

        onChange={(e)=>handleSemester(e.target.value)}

        className="w-full rounded-xl border border-slate-300 p-3 outline-none disabled:bg-slate-100"

      >

        <option value="">

          Select Semester

        </option>

        {semesters.map((semester)=>(

          <option

            key={semester.id}

            value={semester.id}

          >

            Semester {semester.semester_no}

          </option>

        ))}

      </select>

    </div>

  </div>

</div>

<PromotionSummary

  studentsCount={studentsCount}

  nextSemester={nextSemester}

/>

<PromotionPreview

  students={students}

/>

<div className="mt-8 flex justify-end gap-4">

  <button

    onClick={()=>setShowDialog(true)}

    disabled={

      !semesterId ||

      studentsCount===0 ||

      loading ||

      nextSemester==="Completed"

    }

    className="rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 hover:bg-pink-700"

  >

    Promote Students

  </button>

</div>

<PromotionDialog

  open={showDialog}

  onClose={()=>setShowDialog(false)}

  departmentId={departmentId}

  courseId={courseId}

  semesterId={semesterId}

  studentsCount={studentsCount}

  nextSemester={nextSemester}

  onSuccess={()=>{

    setShowDialog(false);

    handleSemester(semesterId);

  }}

/>

</>

);

}