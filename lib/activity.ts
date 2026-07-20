import { supabase } from "./supabase";

/* =========================================================
   TYPES
========================================================= */

export type ActivityType =
  | "student"
  | "teacher"
  | "department"
  | "course"
  | "subject"
  | "announcement"
  | "assignment"
  | "attendance"
  | "marks";

export interface ActivityItem {

  id: string;

  type: ActivityType;

  title: string;

  subtitle: string;

  created_at: string;

}

/* =========================================================
   RELATIVE TIME
========================================================= */

export function formatActivityTime(
  createdAt: string
) {

  const created = new Date(createdAt);

  const now = new Date();

  const diff = now.getTime() - created.getTime();

  const minutes = Math.floor(diff / 60000);

  const hours = Math.floor(minutes / 60);

  const days = Math.floor(hours / 24);

  if (minutes < 1)
    return "Just now";

  if (minutes < 60)
    return `${minutes} min ago`;

  if (hours < 24)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  if (days === 1)
    return "Yesterday";

  if (days < 7)
    return `${days} days ago`;

  return created.toLocaleDateString("en-IN", {

    day: "numeric",

    month: "short",

    year: "numeric",

  });

}

/* =========================================================
   ADMIN RECENT ACTIVITY
========================================================= */

export async function getAdminRecentActivities() {

  const [

    students,

    teachers,

    departments,

    courses,

    subjects,

  ] = await Promise.all([

    supabase

      .from("students")

      .select("id,student_name,roll_no,created_at")

      .order("created_at",{ascending:false})

      .limit(5),

    supabase

      .from("teachers")

      .select("id,teacher_name,teacher_id,created_at")

      .order("created_at",{ascending:false})

      .limit(5),

    supabase

      .from("departments")

      .select("id,department_name,created_at")

      .order("created_at",{ascending:false})

      .limit(5),

    supabase

      .from("courses")

      .select("id,course_name,created_at")

      .order("created_at",{ascending:false})

      .limit(5),

    supabase

      .from("subjects")

      .select("id,subject_name,subject_code,created_at")

      .order("created_at",{ascending:false})

      .limit(5),

  ]);

  const activities: ActivityItem[] = [];
  /* =========================================================
   STUDENTS
========================================================= */

students.data?.forEach((item) => {

  activities.push({

    id: item.id,

    type: "student",

    title: "New Student Added",

    subtitle: `${item.student_name} • Roll No ${item.roll_no}`,

    created_at: item.created_at,

  });

});

/* =========================================================
   TEACHERS
========================================================= */

teachers.data?.forEach((item) => {

  activities.push({

    id: item.id,

    type: "teacher",

    title: "New Teacher Added",

    subtitle: `${item.teacher_name} • ${item.teacher_id}`,

    created_at: item.created_at,

  });

});

/* =========================================================
   DEPARTMENTS
========================================================= */

departments.data?.forEach((item) => {

  activities.push({

    id: item.id,

    type: "department",

    title: "Department Created",

    subtitle: item.department_name,

    created_at: item.created_at,

  });

});

/* =========================================================
   COURSES
========================================================= */

courses.data?.forEach((item) => {

  activities.push({

    id: item.id,

    type: "course",

    title: "Course Added",

    subtitle: item.course_name,

    created_at: item.created_at,

  });

});

/* =========================================================
   SUBJECTS
========================================================= */

subjects.data?.forEach((item) => {

  activities.push({

    id: item.id,

    type: "subject",

    title: "New Subject Added",

    subtitle: `${item.subject_name} (${item.subject_code})`,

    created_at: item.created_at,

  });

});

/* =========================================================
   SORT
========================================================= */

activities.sort(

  (a, b) =>

    new Date(b.created_at).getTime()

    -

    new Date(a.created_at).getTime()

);

return activities.slice(0, 30);

}

/* =========================================================
   ADMIN TOP ACTIVITIES
========================================================= */

export async function getAdminTopActivities() {

  const data = await getAdminRecentActivities();

  return data.slice(0, 3);

}

/* =========================================================
   TEACHER RECENT ACTIVITY
========================================================= */

export async function getTeacherRecentActivities(

  teacherId: string

) {

  const [

    joinedSubjects,

    announcements,

    assignments,

    attendance,

    marks,

    subjects,

  ] = await Promise.all([
        /* ===========================
       JOINED SUBJECTS
    =========================== */

    supabase
      .from("teacher_subjects")
      .select("id,subject_id,joined_at")
      .eq("teacher_id", teacherId)
      .order("joined_at", { ascending: false })
      .limit(10),

    /* ===========================
       ANNOUNCEMENTS
    =========================== */

    supabase
      .from("announcements")
      .select("id,subject_id,title,message,created_at")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false })
      .limit(10),

    /* ===========================
       ASSIGNMENTS
    =========================== */

    supabase
      .from("assignments")
      .select("id,subject_id,assignment_no,title,created_at")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false })
      .limit(10),

    /* ===========================
       ATTENDANCE
    =========================== */

    supabase
      .from("attendance")
      .select("id,subject_id,created_at")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false })
      .limit(10),

    /* ===========================
       MARKS
    =========================== */

    supabase
      .from("marks")
      .select("id,subject_id,updated_at")
      .eq("teacher_id", teacherId)
      .order("updated_at", { ascending: false })
      .limit(10),

    /* ===========================
       SUBJECT MASTER
    =========================== */

    supabase
      .from("subjects")
      .select("id,subject_name,subject_code"),

  ]);

  const activities: ActivityItem[] = [];

  const subjectMap = new Map<
    string,
    {
      name: string;
      code: string;
    }
  >();

  subjects.data?.forEach((subject) => {

    subjectMap.set(subject.id, {

      name: subject.subject_name,

      code: subject.subject_code,

    });

  });
  /* =========================================================
   SUBJECT JOINED
========================================================= */

joinedSubjects.data?.forEach((item) => {

  const subject = subjectMap.get(item.subject_id);

  activities.push({

    id: item.id,

    type: "subject",

    title: "Subject Joined",

    subtitle: subject
      ? `${subject.name} (${subject.code})`
      : "Unknown Subject",

    created_at: item.joined_at,

  });

});

/* =========================================================
   ANNOUNCEMENTS
========================================================= */

announcements.data?.forEach((item) => {

  const subject = subjectMap.get(item.subject_id);

  activities.push({

    id: item.id,

    type: "announcement",

    title: "Announcement Posted",

    subtitle: subject
      ? `${item.message} • ${subject.name}`
      : item.message,

    created_at: item.created_at,

  });

});

/* =========================================================
   ASSIGNMENTS
========================================================= */

assignments.data?.forEach((item) => {

  const subject = subjectMap.get(item.subject_id);

  activities.push({

    id: item.id,

    type: "assignment",

    title: `Assignment ${item.assignment_no} Uploaded`,

    subtitle: subject
      ? `${item.title} • ${subject.name}`
      : item.title,

    created_at: item.created_at,

  });

});

/* =========================================================
   ATTENDANCE
========================================================= */

attendance.data?.forEach((item) => {

  const subject = subjectMap.get(item.subject_id);

  activities.push({

    id: item.id,

    type: "attendance",

    title: "Attendance Submitted",

    subtitle: subject
      ? subject.name
      : "Unknown Subject",

    created_at: item.created_at,

  });

});

/* =========================================================
   MARKS
========================================================= */

marks.data?.forEach((item) => {

  const subject = subjectMap.get(item.subject_id);

  activities.push({

    id: item.id,

    type: "marks",

    title: "Marks Updated",

    subtitle: subject
      ? subject.name
      : "Unknown Subject",

    created_at: item.updated_at,

  });

});

/* =========================================================
   SORT
========================================================= */

activities.sort(

  (a, b) =>

    new Date(b.created_at).getTime()

    -

    new Date(a.created_at).getTime()

);

return activities.slice(0, 30);

}

/* =========================================================
   TEACHER TOP ACTIVITIES
========================================================= */

export async function getTeacherTopActivities(
  teacherId: string
) {

  const data =
    await getTeacherRecentActivities(
      teacherId
    );

  return data.slice(0, 3);

}

/* =========================================================
   OLD COMPATIBILITY
========================================================= */

export async function getRecentActivities() {

  return getAdminRecentActivities();

}

export async function getTopActivities() {

  return getAdminTopActivities();

}