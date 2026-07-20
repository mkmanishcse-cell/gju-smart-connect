import {
  ShieldCheck,
  GraduationCap,
  Users,
  LibraryBig,
} from "lucide-react";

import PortalCard from "./PortalCard";

export default function PortalSection() {
  return (
    <section className="py-20 bg-slate-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">

          <h2 className="text-4xl font-bold text-slate-900">
            Choose Your Portal
          </h2>

          <p className="mt-4 text-lg text-gray-500">
            Select your portal to continue
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">

          <PortalCard
            title="Admin"
            description="Manage Departments, Teachers, Students and Subjects."
            icon={<ShieldCheck size={42} />}
            href="/login?role=admin"
            buttonColor="bg-red-600 hover:bg-red-700"
            buttonText="Login"
            features={[
              "Dashboard",
              "Manage Teachers",
              "Manage Students",
              "Reports",
            ]}
          />

          <PortalCard
            title="Teacher"
            description="Manage Subjects, Attendance, Marks and Assignments."
            icon={<Users size={42} />}
            href="/login?role=teacher"
            buttonColor="bg-green-600 hover:bg-green-700"
            buttonText="Login"
            features={[
              "Join Subjects",
              "Attendance",
              "Marks",
              "Assignments",
            ]}
          />

          <PortalCard
            title="Student"
            description="Access Attendance, Marks and Announcements."
            icon={<GraduationCap size={42} />}
            href="/login?role=student"
            buttonColor="bg-blue-600 hover:bg-blue-700"
            buttonText="Login"
            features={[
              "Attendance",
              "Marks",
              "Assignments",
              "Announcements",
            ]}
          />

          <PortalCard
            title="E-Library"
            description="Access study materials through Google Drive."
            icon={<LibraryBig size={42} />}
            href="/elibrary"
            buttonColor="bg-purple-600 hover:bg-purple-700"
            buttonText="Open"
            features={[
              "Department Wise",
              "Course Wise",
              "Google Drive",
              "Study Material",
            ]}
          />

        </div>

      </div>

    </section>
  );
}