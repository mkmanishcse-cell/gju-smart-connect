import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  CalendarCheck,
  ClipboardList,
  FileText,
  Megaphone,
  KeyRound,
} from "lucide-react";

import { SidebarMenu } from "@/components/layout/types";

export const teacherMenus: SidebarMenu[] = [

  {
    name: "Dashboard",
    href: "/teachers",
    icon: LayoutDashboard,
  },

  {
    name: "My Subjects",
    href: "/teachers/my-subjects",
    icon: BookOpen,
  },

  {
    name: "Join Subjects",
    href: "/teachers/join-subject",
    icon: PlusCircle,
  },

  {
    name: "Attendance",
    href: "/teachers/attendance",
    icon: CalendarCheck,
  },

  {
    name: "Marks",
    href: "/teachers/marks",
    icon: ClipboardList,
  },

  {
    name: "Assignments",
    href: "/teachers/assignments",
    icon: FileText,
  },

  {
    name: "Announcements",
    href: "/teachers/announcements",
    icon: Megaphone,
  },

  {
    name: "Change Password",
    href: "/teachers/change-password",
    icon: KeyRound,
  },

];