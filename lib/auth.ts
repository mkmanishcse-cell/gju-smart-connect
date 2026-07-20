import { supabase } from "./supabase";

export async function login(
  role: string,
  username: string,
  password: string
) {
  let query;

  switch (role) {

    case "student":

      query = supabase
        .from("students")
        .select(`
          *,
          departments(
            department_name
          ),
          courses(
            course_name
          ),
          semesters(
            semester_no
          )
        `)
        .eq("roll_no", username)
        .eq("password", password)
        .single();

      break;

    case "teacher":

      query = supabase
        .from("teachers")
        .select(`
          *,
          departments(
            department_name
          )
        `)
        .eq("teacher_id", username)
        .eq("password", password)
        .single();

      break;

    case "admin":

      query = supabase
        .from("admins")
        .select("*")
        .eq("admin_id", username)
        .eq("password", password)
        .single();

      break;

    default:
      throw new Error("Invalid Role");
  }

  const { data, error } = await query;

  if (error || !data) {

    console.log(error);

    return null;

  }

  return data;
}