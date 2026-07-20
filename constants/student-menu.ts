import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Megaphone,
  KeyRound,
} from "lucide-react";

import { SidebarMenu } from "@/components/layout/types";

export const studentMenus: SidebarMenu[] = [

  {
    name: "Dashboard",
    href: "/students",
    icon: LayoutDashboard,
  },

  {
    name: "My Subjects",
    href: "/students/my-subjects",
    icon: BookOpen,
  },

  {
    name: "Attendance",
    href: "/students/attendance",
    icon: CalendarCheck,
  },

  {
    name: "Marks",
    href: "/students/marks",
    icon: ClipboardList,
  },

  {
    name: "Announcements",
    href: "/students/announcements",
    icon: Megaphone,
  },

  {
    name: "Change Password",
    href: "/students/change-password",
    icon: KeyRound,
  },

];