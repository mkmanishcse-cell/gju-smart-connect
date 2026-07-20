import { supabase } from "./supabase";

export async function getDashboardCounts() {

  const [
    students,
    teachers,
    subjects,
    departments,
    courses,
    semesters,
  ] = await Promise.all([

    supabase
      .from("students")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("teachers")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("subjects")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("departments")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("courses")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("semesters")
      .select("*", { count: "exact", head: true }),

  ]);

  return {

    students: students.count ?? 0,

    teachers: teachers.count ?? 0,

    subjects: subjects.count ?? 0,

    departments: departments.count ?? 0,

    courses: courses.count ?? 0,

    semesters: semesters.count ?? 0,

  };

}