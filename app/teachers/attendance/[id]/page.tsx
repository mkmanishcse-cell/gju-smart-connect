"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";

import { supabase } from "@/lib/supabase";

import LoadingScreen from "@/components/teacher/LoadingScreen";
import Footer from "@/components/common/Footer";

type Subject={
id:string;
subject_name:string;
subject_code:string;
department_id:string;
course_id:string;
semester_id:string;
};

type Student={
student_id:string;
roll_no:string;
student_name:string;
status:"P"|"A";
};

export default function TeacherAttendancePage(){

const router=useRouter();

const params=useParams();

const subjectId=params.id as string;

const [loading,setLoading]=useState(true);
const [saving,setSaving]=useState(false);

const [teacherId,setTeacherId]=useState("");

const [attendanceDate,setAttendanceDate]=useState(
new Date().toISOString().split("T")[0]
);

const [subject,setSubject]=useState<Subject|null>(null);

const [students,setStudents]=useState<Student[]>([]);

useEffect(()=>{

if(!subjectId)return;

loadAttendance();

},[subjectId,attendanceDate]);

async function loadAttendance(){

try{

setLoading(true);

const session=sessionStorage.getItem("user");

if(!session){

router.push("/login?role=teacher");

return;

}

const loginUser=JSON.parse(session);

setTeacherId(loginUser.id);

const {data:subjectData,error:subjectError}=await supabase

.from("subjects")

.select("*")

.eq("id",subjectId)

.single();

if(subjectError||!subjectData){

console.error(subjectError);

return;

}

setSubject(subjectData);

const {data:studentData,error:studentError}=await supabase

.from("students")

.select(`
id,
roll_no,
student_name
`)

.eq("department_id",subjectData.department_id)

.eq("course_id",subjectData.course_id)

.eq("semester_id",subjectData.semester_id)

.order("roll_no");

if(studentError){

console.error(studentError);

return;

}

const rows:Student[]=(studentData??[]).map(student=>({

student_id:student.id,

roll_no:student.roll_no,

student_name:student.student_name,

status:"P",

}));
      /* Existing Attendance */

      const {

        data: existingAttendance,

        error: attendanceError,

      } = await supabase

        .from("attendance")

        .select(`
          student_id,
          status
        `)

        .eq("subject_id", subjectId)

        .eq("attendance_date", attendanceDate);

      if (attendanceError) {

        console.error(attendanceError);

      }

      const attendanceMap = new Map(

        (existingAttendance ?? []).map(item => [

          item.student_id,

          item.status,

        ])

      );

      const finalStudents: Student[] = rows.map(student => ({

        ...student,

        status:

          (attendanceMap.get(student.student_id) as

            | "P"

            | "A") ?? "P",

      }));

      setStudents(finalStudents);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  function updateStatus(

    studentId: string,

    status: "P" | "A"

  ) {

    setStudents(prev =>

      prev.map(student =>

        student.student_id === studentId

          ? {

              ...student,

              status,

            }

          : student

      )

    );

  }

  if (loading) {

    return <LoadingScreen />;

  }

  if (!subject) {

    return null;

  }

async function saveAttendance(){

try{

setSaving(true);

const payload=students.map(student=>({

student_id:student.student_id,

subject_id:subjectId,

teacher_id:teacherId,

attendance_date:attendanceDate,

status:student.status,

}));

const {error}=await supabase

.from("attendance")

.upsert(payload,{

onConflict:"student_id,subject_id,attendance_date",

});

if(error){

console.error(error);

alert(error.message);

return;

}

await loadAttendance();

alert("Attendance Saved Successfully");

}catch(error){

console.error(error);

alert("Something went wrong");

}finally{

setSaving(false);

}

}
  return(

<main className="space-y-8">

<div>

<button
onClick={()=>router.back()}
className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
>

<ArrowLeft size={18}/>

Back

</button>

</div>

{/* Subject Information */}

<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

<div className="border-b bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 px-6 py-5">

<h2 className="text-xl font-bold text-slate-800 sm:text-2xl">

Subject Information

</h2>

</div>

<div className="grid gap-4 p-4 md:grid-cols-3 md:p-6">

<div>

<p className="text-sm text-slate-500">

Subject

</p>

<p className="mt-1 font-semibold text-slate-800">

{subject.subject_name}

</p>

</div>

<div>

<p className="text-sm text-slate-500">

Subject Code

</p>

<p className="mt-1 font-semibold text-slate-800">

{subject.subject_code}

</p>

</div>

<div>

<p className="text-sm text-slate-500">

Attendance Date

</p>

<input
type="date"
value={attendanceDate}
onChange={(e)=>setAttendanceDate(e.target.value)}
className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
/>

</div>

</div>

</div>

{/* Attendance Table */}

<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

<div className="flex flex-col gap-4 border-b bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

<h2 className="text-lg font-bold text-slate-800 sm:text-2xl">

Student Attendance

</h2>
</div>
<div className="flex justify-end items-center gap-4 mt-4 mb-4">

 <button
  type="button"
  onClick={() => {
    if (!subjectId) {
      alert("Subject ID not found");
      return;
    }

    console.log("Subject ID:", subjectId);

    router.push(`/teachers/attendance/register/${subjectId}`);
  }}
  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base sm:font-semibold">
  📋 View Register
</button>

<Link
href={`/teachers/attendance/${subjectId}/upload`}
className="flex items-center justify-center gap-1 rounded-lg bg-cyan-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-cyan-700 sm:gap-2 sm:rounded-xl sm:px-5 sm:py-3 sm:text-base sm:font-semibold">
<Upload size={18} />
Upload Attendance
</Link>

</div>

<div className="overflow-x-auto">

<table className="min-w-full">

<thead className="bg-slate-100">

<tr>

<th className="px-2 py-2 text-left text-xs font-semibold sm:px-6 sm:py-4 sm:text-sm">

Roll No

</th>

<th className="px-6 py-4 text-left">

Student Name

</th>

<th className="px-6 py-4 text-center">

Status

</th>

</tr>

</thead>

<tbody>

{students.map(student=>(

<tr
key={student.student_id}
className="border-t hover:bg-slate-50"
>

<td className="px-2 py-2 text-xs font-medium sm:px-6 sm:py-4 sm:text-sm">

{student.roll_no}

</td>

<td className="px-2 py-2 text-xs sm:px-6 sm:py-4 sm:text-sm">

{student.student_name}

</td>

<td className="px-6 py-4">

<div className="flex justify-center gap-1 sm:gap-3">

<button
onClick={()=>updateStatus(student.student_id,"P")}
className={`rounded-lg px-2 py-1 text-[11px] font-medium sm:rounded-xl sm:px-5 sm:py-2 sm:text-sm sm:font-semibold font-semibold transition ${
student.status==="P"
?"bg-green-600 text-white"
:"bg-slate-200 text-slate-700 hover:bg-green-100"
}`}
>

Present

</button>

<button
onClick={()=>updateStatus(student.student_id,"A")}
className={`rounded-lg px-2 py-1 text-[11px] font-medium sm:rounded-xl sm:px-5 sm:py-2 sm:text-sm sm:font-semibold font-semibold transition ${
student.status==="A"
?"bg-red-600 text-white"
:"bg-slate-200 text-slate-700 hover:bg-red-100"
}`}
>

Absent

</button>

</div>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>
<div className="mt-6 flex flex-wrap justify-end gap-2">

 <button
  type="button"
  onClick={() => {
    if (!subjectId) {
      alert("Subject ID not found");
      return;
    }

    console.log("Subject ID:", subjectId);

    router.push(`/teachers/attendance/register/${subjectId}`);
  }}
  className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
>
  📋 View Register
</button>

  <button
    onClick={saveAttendance}
    disabled={saving}
    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 sm:rounded-xl sm:px-6 sm:py-3 sm:text-base sm:font-semibold">
    {saving ? "Saving..." : "💾 Save Attendance"}
  </button>

</div>
      <Footer/>

</main>

);

}