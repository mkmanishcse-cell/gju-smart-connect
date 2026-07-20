"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Printer,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import { supabase } from "@/lib/supabase";

import LoadingScreen from "@/components/teacher/LoadingScreen";
import Footer from "@/components/common/Footer";

type Student = {
  id: string;
  roll_no: string;
  student_name: string;

  minor1: number;
  minor2: number;
  minor3: number;

  best_two_average: number;

  assignment_marks: number;

  attendance_marks: number;

  total_marks: number;
};

export default function ViewMarksRegisterPage(){

const router=useRouter();

const {id}=useParams();

const subjectId=id as string;

const [loading,setLoading]=useState(true);

const [subjectName,setSubjectName]=useState("");

const [subjectCode,setSubjectCode]=useState("");

const [students,setStudents]=useState<Student[]>([]);

useEffect(()=>{

loadRegister();

},[]);

async function loadRegister(){

try{

setLoading(true);

const {data:subject}=await supabase

.from("subjects")

.select("*")

.eq("id",subjectId)

.single();

if(!subject)return;

setSubjectName(subject.subject_name);

setSubjectCode(subject.subject_code);

const {data:studentData}=await supabase

.from("students")

.select("*")

.eq("department_id",subject.department_id)

.eq("course_id",subject.course_id)

.eq("semester_id",subject.semester_id)

.order("roll_no");

const list:Student[]=[];

for(const student of studentData||[]){

const {data:mark}=await supabase

.from("marks")

.select("*")

.eq("student_id",student.id)

.eq("subject_id",subjectId)

.maybeSingle();

list.push({

id:student.id,

roll_no:student.roll_no,

student_name:student.student_name,

minor1:mark?.minor1||0,

minor2:mark?.minor2||0,

minor3:mark?.minor3||0,

best_two_average:mark?.best_two_average||0,

assignment_marks:mark?.assignment_marks||0,

attendance_marks:mark?.attendance_marks||0,

total_marks:mark?.total_marks||0,

});

}

setStudents(list);

}finally{

setLoading(false);

}

}

if(loading){

return <LoadingScreen/>;

}
function handlePrint() {

  window.print();

}

function exportExcel() {

  const rows = students.map((student) => ({

    "Roll No": student.roll_no,

    "Student Name": student.student_name,

    "Minor 1": student.minor1,

    "Minor 2": student.minor2,

    "Minor 3": student.minor3,

    "Best 2 Avg": student.best_two_average,

    "Assignment": student.assignment_marks,

    "Attendance": student.attendance_marks,

    "Total": student.total_marks,

  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(

    workbook,

    worksheet,

    "Marks Register"

  );

  XLSX.writeFile(

    workbook,

    `${subjectName}_Marks_Register.xlsx`

  );

}

function exportPDF() {

  const doc = new jsPDF("landscape");

  autoTable(doc,{

    head:[[
      "Roll",
      "Student",
      "M1",
      "M2",
      "M3",
      "Best 2",
      "Assignment",
      "Attendance",
      "Total"
    ]],

    body:students.map(student=>[

      student.roll_no,

      student.student_name,

      student.minor1,

      student.minor2,

      student.minor3,

      student.best_two_average.toFixed(1),

      student.assignment_marks,

      student.attendance_marks,

      student.total_marks

    ]),

    startY:25,

    styles:{

      fontSize:8,

      halign:"center"

    },

    headStyles:{

      fillColor:[37,99,235]

    }

  });

  doc.setFontSize(18);

  doc.text(

    `${subjectName} Marks Register`,

    14,

    15

  );

  doc.save(

    `${subjectName}_Marks_Register.pdf`

  );

}

return(

<main className="min-h-screen flex flex-col bg-slate-100">

<div className="flex-1 p-6">

<div className="mb-6 flex items-center justify-between">

<div className="flex items-center gap-3">

<button

onClick={()=>router.back()}

className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold shadow hover:bg-slate-50"

>

<ArrowLeft size={18}/>

Back

</button>

<div>

<h1 className="text-3xl font-bold">

Marks Register

</h1>

<p className="text-slate-500">

View Marks Register

</p>

</div>

</div>

<div className="flex gap-3">

<button

onClick={handlePrint}

className="rounded-xl bg-slate-800 px-5 py-3 text-white flex items-center gap-2"

>

<Printer size={18}/>

Print

</button>

<button

onClick={exportPDF}

className="rounded-xl bg-red-600 px-5 py-3 text-white flex items-center gap-2"

>

<FileText size={18}/>

PDF

</button>

<button

onClick={exportExcel}

className="rounded-xl bg-green-600 px-5 py-3 text-white flex items-center gap-2"

>

<FileSpreadsheet size={18}/>

Excel

</button>

</div>

</div>


        <div className="rounded-3xl bg-white shadow mb-6">

          <div className="border-b px-6 py-5">

            <h2 className="text-2xl font-bold">

              Subject Information

            </h2>

          </div>

          <div className="grid gap-6 p-6 md:grid-cols-3">

            <div>

              <p className="text-sm text-slate-500">

                Subject Name

              </p>

              <p className="mt-1 text-lg font-semibold">

                {subjectName}

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">

                Subject Code

              </p>

              <p className="mt-1 text-lg font-semibold">

                {subjectCode}

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">

                Total Students

              </p>

              <p className="mt-1 text-lg font-semibold text-blue-600">

                {students.length}

              </p>

            </div>

          </div>

        </div>
<div className="overflow-hidden rounded-3xl bg-white shadow">

<div className="overflow-x-auto">

<table className="min-w-full">

<thead className="bg-slate-100">

<tr>

<th className="px-4 py-4">Roll</th>

<th className="px-4 py-4">Student</th>

<th className="px-4 py-4">M1</th>

<th className="px-4 py-4">M2</th>

<th className="px-4 py-4">M3</th>

<th className="px-4 py-4">Best 2</th>

<th className="px-4 py-4">Assignment</th>

<th className="px-4 py-4">Attendance</th>

<th className="px-4 py-4">Total</th>

</tr>

</thead>

<tbody>
    {students.map((student) => (

<tr
  key={student.id}
  className="border-t hover:bg-slate-50"
>

  <td className="px-4 py-3 font-semibold">
    {student.roll_no}
  </td>

  <td className="px-4 py-3 whitespace-nowrap">
    {student.student_name}
  </td>

  <td className="px-4 py-3 text-center">
    {student.minor1}
  </td>

  <td className="px-4 py-3 text-center">
    {student.minor2}
  </td>

  <td className="px-4 py-3 text-center">
    {student.minor3}
  </td>

  <td className="px-4 py-3 text-center font-bold text-blue-600">
    {student.best_two_average.toFixed(1)}
  </td>

  <td className="px-4 py-3 text-center">
    {student.assignment_marks}
  </td>

  <td className="px-4 py-3 text-center">
    {student.attendance_marks}
  </td>

  <td className="px-4 py-3 text-center font-bold text-green-600">
    {student.total_marks}
  </td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</div>

<Footer />

</main>

);
}