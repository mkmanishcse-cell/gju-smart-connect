import { PortalType } from "./types";

export function getPageTitle(
  pathname: string,
  portal: PortalType
): string {

  const routes: Record<string, string> = {

    // Dashboard

    [`/${portal}`]:
      `${capitalize(portal)} Dashboard`,

    // Common

    [`/${portal}/my-subjects`]:
      "My Subjects",

    [`/${portal}/attendance`]:
      "Attendance",

    [`/${portal}/marks`]:
      "Marks",

    [`/${portal}/announcements`]:
      "Announcements",

    [`/${portal}/change-password`]:
      "Change Password",

  };

  // Teacher Only

  if (portal === "teacher") {

    routes["/teachers/join-subject"] =
      "Join Subjects";

    routes["/teachers/assignments"] =
      "Assignments";

  }

  // Admin Only

  if (portal === "admin") {

    routes["/admin/departments"] =
      "Departments";

    routes["/admin/courses"] =
      "Courses";

    routes["/admin/semesters"] =
      "Semesters";

    routes["/admin/subjects"] =
      "Subjects";

    routes["/admin/teachers"] =
      "Teachers";

    routes["/admin/students"] =
      "Students";

    routes["/admin/upload"] =
      "Upload Data";

    routes["/admin/recent-activity"] =
      "Recent Activity";

  }

  return (
    routes[pathname] ??
    "Dashboard"
  );

}

function capitalize(
  value: string
) {

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );

}