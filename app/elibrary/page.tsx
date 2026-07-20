"use client";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import { useState } from "react";
import { libraryLinks } from "@/data/libraryLinks";
import { ArrowLeft, LibraryBig } from "lucide-react";

export default function ELibraryPage() {
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");

  const openDrive = () => {
    if (!department || !course) {
      alert("Please select Department and Course.");
      return;
    }

    const link =
      libraryLinks[
        department as keyof typeof libraryLinks
      ]?.[course];

    if (link) {
      window.open(link, "_blank");
    } else {
      alert("Content not available.");
    }
  };

  return (
   <main className="min-h-screen flex flex-col bg-slate-100">

  <div className="flex-1 max-w-7xl mx-auto w-full px-8 pt-10 pb-8">



        {/* Header */}

        <div className="flex justify-between items-start mb-10">

          <div>

            <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
              <LibraryBig className="text-purple-600" size={38} />
              E-Library
            </h1>

            <p className="text-gray-500 mt-2">
              Access department-wise study materials from Google Drive.
            </p>

          </div>

          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>

        </div>

        {/* Card */}

        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-10">

          <div className="text-center mb-8">

            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-5">

              <LibraryBig
                size={42}
                className="text-purple-600"
              />

            </div>

            <h2 className="text-3xl font-bold text-slate-800">
              Select Department & Course
            </h2>

            <p className="text-gray-500 mt-2">
              Choose your department and course to view study materials.
            </p>

          </div>

          <div className="space-y-6">

            <div>

              <label className="block mb-2 font-semibold text-slate-700">
                Department
              </label>

              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setCourse("");
                }}
                className="w-full rounded-xl border border-slate-300 p-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
              >

                <option value="">
                  Select Department
                </option>

                {Object.keys(libraryLinks).map((dept) => (

                  <option
                    key={dept}
                    value={dept}
                  >
                    {dept}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="block mb-2 font-semibold text-slate-700">
                Course
              </label>

              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                disabled={!department}
                className="w-full rounded-xl border border-slate-300 p-3 disabled:bg-slate-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
              >

                <option value="">
                  Select Course
                </option>

                {department &&
                  Object.keys(
                    libraryLinks[
                      department as keyof typeof libraryLinks
                    ]
                  ).map((c) => (

                    <option
                      key={c}
                      value={c}
                    >
                      {c}
                    </option>

                  ))}

              </select>

            </div>

            <button
              onClick={openDrive}
              className="w-full rounded-xl bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              View Study Materials
            </button>

          </div>

        </div>

       </div>

  <Footer />

</main>
  );
}