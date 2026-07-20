import { supabase } from "./supabase";

export async function getDepartments() {

  const { data, error } = await supabase

    .from("departments")

    .select("*")

    .order("department_name");

  if (error) throw error;

  return data ?? [];

}

export async function getCourses(

  departmentId: string

) {

  const { data, error } = await supabase

    .from("courses")

    .select("*")

    .eq("department_id", departmentId)

    .order("course_name");

  if (error) throw error;

  return data ?? [];

}

export async function getSemesters(

  courseId: string

) {

  const { data, error } = await supabase

    .from("semesters")

    .select("*")

    .eq("course_id", courseId)

    .order("semester_no");

  if (error) throw error;

  return data ?? [];

}

export async function getStudentsCount(

  departmentId: string,

  courseId: string,

  semesterId: string

) {

  const { count, error } = await supabase

    .from("students")

    .select("*", {

      count: "exact",

      head: true,

    })

    .eq("department_id", departmentId)

    .eq("course_id", courseId)

    .eq("semester_id", semesterId);

  if (error) throw error;

  return count ?? 0;

}

export async function getStudents(

  departmentId: string,

  courseId: string,

  semesterId: string

) {

  const { data, error } = await supabase

    .from("students")

    .select("id,roll_no,student_name")

    .eq("department_id", departmentId)

    .eq("course_id", courseId)

    .eq("semester_id", semesterId)

    .order("roll_no");

  if (error) throw error;

  return data ?? [];

}

export async function promoteStudents(

  departmentId: string,

  courseId: string,

  semesterId: string

) {

  /* Find Current Semester */

  const { data: currentSemester, error: currentError } =
    await supabase
      .from("semesters")
      .select("*")
      .eq("id", semesterId)
      .single();

  if (currentError || !currentSemester) {

    throw new Error("Current semester not found.");

  }

  /* Final Semester Check */

  if (currentSemester.semester_no >= 8) {

    throw new Error("Students are already in Final Semester.");

  }

  /* Find Next Semester */

  const { data: nextSemester, error: nextError } =
    await supabase
      .from("semesters")
      .select("*")
      .eq("course_id", courseId)
      .eq("semester_no", currentSemester.semester_no + 1)
      .single();

  if (nextError || !nextSemester) {

    throw new Error("Next semester not found.");

  }

  /* Count Students */

  const { count, error: countError } =
    await supabase
      .from("students")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("department_id", departmentId)
      .eq("course_id", courseId)
      .eq("semester_id", semesterId);

  if (countError) {

    throw countError;

  }

  if (!count || count === 0) {

    throw new Error("No students found.");

  }

  /* Promote */

  const { error } = await supabase

    .from("students")

    .update({

      semester_id: nextSemester.id,

    })

    .eq("department_id", departmentId)

    .eq("course_id", courseId)

    .eq("semester_id", semesterId);

  if (error) {

    throw error;

  }

  return {

    promoted: count,

    nextSemester,

  };

}