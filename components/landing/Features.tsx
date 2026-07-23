import {
  ShieldCheck,
  BookOpen,
  ClipboardCheck,
  Bell,
  Cloud,
  Smartphone,
} from "lucide-react";

const features = [
  {
    title: "Secure Login",
    description: "Role based authentication for Students, Teachers and Admin.",
    icon: ShieldCheck,
  },
  {
    title: "Attendance",
    description: "Track attendance with detailed reports and percentages.",
    icon: ClipboardCheck,
  },
  {
    title: "Assignments",
    description: "Upload, submit and evaluate assignments online.",
    icon: BookOpen,
  },
  {
    title: "Announcements",
    description: "Receive important notices from faculty instantly.",
    icon: Bell,
  },
  {
    title: "Cloud Based",
    description: "Access your academic data anytime from anywhere.",
    icon: Cloud,
  },
  {
    title: "Responsive",
    description: "Works perfectly on Mobile, Tablet and Desktop.",
    icon: Smartphone,
  },
];

export default function Features() {
  return (
    <section className="py-12 sm:py-24 bg-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-8 sm:mb-16">

          <h2 className="text-2xl sm:text-5xl font-bold text-slate-900">
            Why GJU Smart Connect?
          </h2>

          <p className="mt-2 sm:mt-4 text-gray-500 text-sm sm:text-lg">
            Everything you need in one modern academic platform.
          </p>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">

          {features.map((feature) => {

            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-8 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-blue-100 flex items-center justify-center">

                  <Icon className="w-5 h-5 sm:w-8 sm:h-8 text-blue-700" />

                </div>

                <h3 className="mt-3 sm:mt-6 text-base sm:text-2xl font-bold text-slate-800">
                  {feature.title}
                </h3>

                <p className="mt-2 sm:mt-4 text-sm sm:text-base text-gray-600 leading-5 sm:leading-7">
                  {feature.description}
                </p>

              </div>
            );

          })}

        </div>

      </div>

    </section>
  );
}