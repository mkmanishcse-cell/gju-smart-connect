"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  GraduationCap,
  ClipboardList,
  Trophy,
  TrendingUp,
  ArrowLeft,
  BookOpen,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import LoadingScreen from "@/components/student/LoadingScreen";
import Footer from "@/components/common/Footer";

type Student = {
  id: string;
  student_name: string;
  roll_no: string;
  department_id: string;
  course_id: string;
  semester_id: string;
};

type StudentMarks = {
  subject_id: string;
  subject_code: string;
  subject_name: string;
  minor1: number;
  minor2: number;
  minor3: number;
  best_two_average: number;
  assignment_marks: number;
  attendance_marks: number;
  total_marks: number;
};

export default function StudentMarksPage() {

  const router = useRouter();

  const [loading,setLoading]=useState(true);

  const [student,setStudent]=useState<Student|null>(null);

  const [department,setDepartment]=useState("");

  const [course,setCourse]=useState("");

  const [semester,setSemester]=useState("");

  const [marks,setMarks]=useState<StudentMarks[]>([]);

  useEffect(()=>{

    loadMarks();

  },[]);

  async function loadMarks(){

    try{

      const session=

        sessionStorage.getItem("user");

      if(!session){

        router.push("/login?role=student");

        return;

      }

      const loginUser=

        JSON.parse(session);

      const {

        data:studentData,

        error,

      }=await supabase

      .from("students")

      .select("*")

      .eq("id",loginUser.id)

      .single();

      if(error||!studentData){

        return;

      }

      setStudent(studentData);

      const {data:dept}=await supabase

      .from("departments")

      .select("department_name")

      .eq("id",studentData.department_id)

      .single();

      setDepartment(

        dept?.department_name??""

      );

      const {data:courseData}=await supabase

      .from("courses")

      .select("course_name")

      .eq("id",studentData.course_id)

      .single();

      setCourse(

        courseData?.course_name??""

      );

      const {data:sem}=await supabase

      .from("semesters")

      .select("semester_no")

      .eq("id",studentData.semester_id)

      .single();

      setSemester(

        String(sem?.semester_no??"")

      );
            /* Load Subjects */

      const {

        data: subjects,

        error: subjectError,

      } = await supabase

        .from("subjects")

        .select(`
          id,
          subject_code,
          subject_name
        `)

        .eq("department_id", studentData.department_id)

        .eq("course_id", studentData.course_id)

        .eq("semester_id", studentData.semester_id)

        .eq("subject_type", "Theory");

      if (subjectError || !subjects) {

        setMarks([]);

        return;

      }

      const rows: StudentMarks[] = [];

      for (const subject of subjects) {

        const {

          data: marksData,

        } = await supabase

          .from("marks")

          .select(`
            minor1,
            minor2,
            minor3,
            best_two_average,
            assignment_marks,
            attendance_marks,
            total_marks
          `)

          .match({

            student_id: studentData.id,

            subject_id: subject.id,

          })

          .single();

        rows.push({

          subject_id: subject.id,

          subject_code: subject.subject_code,

          subject_name: subject.subject_name,

          minor1: Number(marksData?.minor1 ?? 0),

          minor2: Number(marksData?.minor2 ?? 0),

          minor3: Number(marksData?.minor3 ?? 0),

          best_two_average: Number(

            marksData?.best_two_average ?? 0

          ),

          assignment_marks: Number(

            marksData?.assignment_marks ?? 0

          ),

          attendance_marks: Number(

            marksData?.attendance_marks ?? 0

          ),

          total_marks: Number(

            marksData?.total_marks ?? 0

          ),

        });

      }

      setMarks(rows);

    }

    catch (error) {

      console.error(error);

    }

    finally {

      setLoading(false);

    }

  }

  /* ================= SUMMARY ================= */

  const summary = useMemo(() => {

    const totalSubjects = marks.length;

    const totalMarks = marks.reduce(

      (sum, item) => sum + item.total_marks,

      0

    );

    const highest =

      marks.length > 0

        ? Math.max(...marks.map((x) => x.total_marks))

        : 0;

    const average =

      marks.length > 0

        ? Number((totalMarks / marks.length).toFixed(1))

        : 0;

    return {

      totalSubjects,

      totalMarks,

      highest,

      average,

    };

  }, [marks]);

  if (loading) {

    return <LoadingScreen />;

  }

  if (!student) {

    return null;

  }

  return (

<main className="space-y-8">

{/* ================= HEADER ================= */}

<div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 p-8 shadow-xl">
    {/* Background */}

  <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>

  <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl"></div>

  <div className="relative">

    {/* Back Button */}

    <button
      onClick={() => router.push("/students")}
      className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition-all duration-300 hover:bg-white/25"
    >

      <ArrowLeft size={18} />

      Back

    </button>

    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

      {/* Left */}

      <div>

       
 <div>
        </div>

        <h1 className="mt-5 text-4xl font-bold">

          Marks Dashboard

        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-sky-100">

          Welcome

          <span className="font-semibold">

            {" "}

            {student.student_name}

          </span>

          . View all your internal assessment marks,

          assignment marks and attendance marks.

        </p>

        <div className="mt-6 flex flex-wrap gap-3">

          <div className="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">

            🎓 Semester {semester}

          </div>

          <div className="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">

            📚 {course}

          </div>

          <div className="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">

            🏢 {department}

          </div>

        </div>

      </div>

      {/* Right */}

      <div className="rounded-3xl border border-white/20 bg-white/15 p-8 text-center backdrop-blur">

        <p className="text-sm uppercase tracking-[4px] text-sky-100">

          Total Subjects

        </p>

        <h2 className="mt-4 text-6xl font-extrabold">

          {summary.totalSubjects}

        </h2>

        <p className="mt-3 text-sky-100">

          Theory Subjects

        </p>

      </div>

    </div>

  </div>

</div>

{/* ================= STUDENT INFO ================= */}

<div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl">

  <div className="mb-7 flex items-center gap-5">

    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg">

      <GraduationCap size={30} />

    </div>

    <div>

      <h2 className="text-2xl font-bold text-slate-800">

        Student Information

      </h2>

      <p className="text-slate-500">

        Academic Details

      </p>

    </div>

  </div>

  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

    <Info title="Student Name" value={student.student_name} />

    <Info title="Roll Number" value={student.roll_no} />

    <Info title="Department" value={department} />

    <Info title="Course" value={course} />

    <Info title="Semester" value={semester} />

  </div>

</div>

{/* ================= SUMMARY ================= */}

<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

  <SummaryCard

    title="Subjects"

    value={summary.totalSubjects}

    color="from-sky-500 to-blue-600"

    icon={<BookOpen size={34}/>}

  />

  <SummaryCard

    title="Highest"

    value={summary.highest}

    color="from-green-500 to-emerald-600"

    icon={<Trophy size={34}/>}

  />

  <SummaryCard

    title="Average"

    value={summary.average}

    color="from-orange-500 to-amber-500"

    icon={<TrendingUp size={34}/>}

  />

  <SummaryCard

    title="Total"

    value={summary.totalMarks}

    color="from-violet-500 to-purple-600"

    icon={<ClipboardList size={34}/>}

  />

</div>
{/* ================= MARKS TABLE ================= */}

<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

  <div className="border-b border-slate-200 bg-slate-50 px-7 py-6">

    <div className="flex items-center justify-between">

      <div>

        <h2 className="text-2xl font-bold text-slate-800">

          Subject Wise Marks

        </h2>

        <p className="mt-2 text-slate-500">

          Internal Assessment Marks

        </p>

      </div>

      <div className="rounded-2xl bg-sky-100 px-5 py-3">

        <span className="font-semibold text-sky-700">

          {marks.length} Subjects

        </span>

      </div>

    </div>

  </div>

  <div className="overflow-x-auto">

    <table className="min-w-full">

      <thead className="bg-slate-100">

        <tr>

          <th className="px-6 py-4 text-left">Subject</th>

          <th className="text-center">M1</th>

          <th className="text-center">M2</th>

          <th className="text-center">M3</th>

          <th className="text-center">Best</th>

          <th className="text-center">Assign.</th>

          <th className="text-center">Attend.</th>

          <th className="px-6 text-center">Total</th>

        </tr>

      </thead>

      <tbody>

        {marks.map((item)=>(

          <tr

            key={item.subject_id}

            className="border-b transition hover:bg-sky-50"

          >

            <td className="px-6 py-5">

              <h3 className="font-semibold">

                {item.subject_name}

              </h3>

              <span className="mt-2 inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">

                {item.subject_code}

              </span>

            </td>

            <td className="text-center">{item.minor1}</td>

            <td className="text-center">{item.minor2}</td>

            <td className="text-center">{item.minor3}</td>

            <td className="text-center font-semibold text-blue-600">

              {item.best_two_average}

            </td>

            <td className="text-center">

              {item.assignment_marks}

            </td>

            <td className="text-center">

              {item.attendance_marks}

            </td>

            <td className="px-6">

              <div className="flex items-center gap-3">

                <div className="h-3 flex-1 rounded-full bg-slate-200">

                  <div

                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600"

                    style={{
  width:`${Math.min((item.total_marks / 30) * 100,100)}%`

                    }}

                  />

                </div>

                <span className="min-w-[60px] rounded-full bg-violet-100 px-3 py-1 text-center font-bold text-violet-700">

                  {item.total_marks}/30

                </span>

              </div>

            </td>

          </tr>

        ))}

        {marks.length===0 &&(

          <tr>

            <td

              colSpan={8}

              className="py-20 text-center"

            >

              <BookOpen

                size={70}

                className="mx-auto text-slate-300"

              />

              <h3 className="mt-6 text-2xl font-bold text-slate-700">

                No Marks Found

              </h3>

              <p className="mt-3 text-slate-500">

                Marks will appear here after your teacher uploads them.

              </p>

            </td>

          </tr>

        )}

      </tbody>

    </table>

  </div>

</div>

<Footer />

</main>

);

/* ---------------- INFO CARD ---------------- */

function Info({

title,

value,

}:{

title:string;

value:string;

}){

return(

<div className="rounded-2xl bg-slate-50 p-5">

<p className="text-sm text-slate-500">

{title}

</p>

<h3 className="mt-2 text-lg font-bold text-slate-800">

{value}

</h3>

</div>

);

}

/* ---------------- SUMMARY CARD ---------------- */

function SummaryCard({

title,

value,

icon,

color,

}:{

title:string;

value:number|string;

icon:React.ReactNode;

color:string;

}){

return(

<div className={`rounded-3xl bg-gradient-to-br ${color} p-6 text-white shadow-lg`}>

<div className="flex items-center justify-between">

<div>

<p className="text-white/80">

{title}

</p>

<h2 className="mt-3 text-4xl font-bold">

{value}

</h2>

</div>

<div>

{icon}

</div>

</div>

</div>

);

}
}