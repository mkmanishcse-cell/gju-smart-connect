import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  School,
  Upload,
  History,
} from "lucide-react";

import { SidebarMenu } from "@/components/layout/types";

export const adminMenus: SidebarMenu[] = [

  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },

  {
    name: "Departments",
    href: "/admin/departments",
    icon: Building2,
  },

  {
    name: "Courses",
    href: "/admin/courses",
    icon: School,
  },

  {
    name: "Semesters",
    href: "/admin/semesters",
    icon: School,
  },

  {
    name: "Subjects",
    href: "/admin/subjects",
    icon: BookOpen,
  },

  {
    name: "Teachers",
    href: "/admin/teachers",
    icon: Users,
  },

  {
    name: "Students",
    href: "/admin/students",
    icon: GraduationCap,
  },
{
  name: "Promote Students",
  href: "/admin/promote-students",
  icon: GraduationCap,
}, 

  {
    name: "Upload",
    href: "/admin/upload",
    icon: Upload,
  },

  {
    name: "Recent Activity",
    href: "/admin/recent-activity",
    icon: History,
  },

];