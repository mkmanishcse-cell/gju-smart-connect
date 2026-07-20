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
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold text-slate-900">
            Why GJU Smart Connect?
          </h2>

          <p className="mt-4 text-gray-500 text-lg">
            Everything you need in one modern academic platform.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature) => {

            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-8 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">

                  <Icon className="w-8 h-8 text-blue-700" />

                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-800">
                  {feature.title}
                </h3>

                <p className="mt-4 text-gray-600 leading-7">
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