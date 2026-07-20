"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import LoadingScreen from "@/components/student/LoadingScreen";
import StudentInfoCard from "@/components/student/StudentInfoCard";
import QuickActions from "@/components/student/QuickActions";
import AnnouncementSection from "@/components/student/AnnouncementSection";
import Footer from "@/components/common/Footer";
/* ============================
   TYPES
============================ */

type Student = {
  id: string;
  student_name: string;
  roll_no: string;
  department_id: string;
  course_id: string;
  semester_id: string;
};

type Announcement = {
  id: string;
  title: string;
  message: string;
  created_at: string;
  subject: string;
};

export default function StudentDashboard() {

  /* ============================
      STATES
  ============================ */

  const [loading, setLoading] = useState(true);

  const [student, setStudent] =
    useState<Student | null>(null);

  const [department, setDepartment] =
    useState("");

  const [course, setCourse] =
    useState("");

  const [semester, setSemester] =
    useState("");

  const [attendance, setAttendance] =
    useState(0);

  const [averageMarks, setAverageMarks] =
    useState(0);

  const [subjects, setSubjects] =
    useState(0);

  const [assignments, setAssignments] =
    useState(0);

  const [announcements, setAnnouncements] =
    useState<Announcement[]>([]);

  useEffect(() => {

    loadDashboard();

  }, []);

  async function loadDashboard() {

    try {

      // sessionStorage instead of localStorage: matches
      // login page + ProtectedRoute, clears on tab close.
      const session =
        sessionStorage.getItem("user");

      if (!session) {

        window.location.href =
          "/login?role=student";

        return;

      }

      const loginUser =
        JSON.parse(session);

      /* Student */

      const {

        data: studentData,

      } = await supabase

        .from("students")

        .select("*")

        .eq("id", loginUser.id)

        .single();

      if (!studentData) return;

      setStudent(studentData);

      /* Department */

      const {

        data: dept,

      } = await supabase

        .from("departments")

        .select("department_name")

        .eq("id", studentData.department_id)

        .single();

      setDepartment(

        dept?.department_name ?? ""

      );

      /* Course */

      const {

        data: courseData,

      } = await supabase

        .from("courses")

        .select("course_name")

        .eq("id", studentData.course_id)

        .single();

      setCourse(

        courseData?.course_name ?? ""

      );

      /* Semester */

      const {

        data: semesterData,

      } = await supabase

        .from("semesters")

        .select("semester_no")

        .eq("id", studentData.semester_id)

        .single();

      setSemester(

        String(

          semesterData?.semester_no ?? ""

        )

      );

      /* Subjects */

      const {

        data: subjectData,

      } = await supabase

        .from("subjects")

        .select("*")

        .eq("department_id", studentData.department_id)

        .eq("course_id", studentData.course_id)

        .eq("semester_id", studentData.semester_id);

      setSubjects(

        subjectData?.length ?? 0

      );

      const theorySubjects =

        subjectData?.filter(

          (item: any) =>

            item.subject_type === "Theory"

        ) ?? [];

      setAssignments(

        theorySubjects.length * 2

      );

      /* Attendance */

      const {

        data: attendanceData,

      } = await supabase

        .from("attendance")

        .select("status")

        .eq("student_id", studentData.id);

      if (attendanceData && attendanceData.length > 0) {

        const present = attendanceData.filter(

          (item: any) => item.status === "P"

        ).length;

        const attendancePercentage = Number(

          ((present / attendanceData.length) * 100).toFixed(1)

        );

        setAttendance(attendancePercentage);

      }

      /* Marks */

      const {

        data: marksData,

      } = await supabase

        .from("marks")

        .select("total_marks")

        .eq("student_id", studentData.id);

      if (marksData && marksData.length > 0) {

        const total = marksData.reduce(

          (sum: number, row: any) =>

            sum + Number(row.total_marks ?? 0),

          0

        );

        setAverageMarks(

          Number((total / marksData.length).toFixed(2))

        );

      }

      /* Announcements */

      if (subjectData && subjectData.length > 0) {

        const ids = subjectData.map(

          (item: any) => item.id

        );

        const { data } = await supabase

          .from("announcements")

          .select(`
            id,
            title,
            message,
            created_at,
            subjects(subject_name)
          `)

          .in("subject_id", ids)

          .order("created_at", {

            ascending: false,

          })

          .limit(5);

        const formatted =

          data?.map((item: any) => ({

            id: item.id,

            title: item.title,

            message: item.message,

            created_at: item.created_at,

            subject:

              item.subjects?.subject_name ??

              "Subject",

          })) ?? [];

        setAnnouncements(formatted);

      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  /* Loading */

  if (loading) {

    return <LoadingScreen />;

  }

  if (!student) {

    return null;

  }

  /* UI */

 return (
  <ProtectedRoute role="student">

    <div className="space-y-8">

      <StudentInfoCard

        studentName={student.student_name}

        rollNo={student.roll_no}

        department={department}

        course={course}

        semester={semester}

        attendance={attendance}

        averageMarks={averageMarks}

        totalSubjects={subjects}

        totalAssignments={assignments}

      />

      <QuickActions />

      <AnnouncementSection

        announcements={announcements}

      />
<Footer />
       </div>

  </ProtectedRoute>
);

}