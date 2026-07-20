import Image from "next/image";

export default function About() {
  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}

          <div>

            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">

              About GJU Smart Connect

            </span>

            <h2 className="text-5xl font-bold text-slate-900 mt-6">

              One Smart Platform For Complete University Management

            </h2>

            <p className="mt-8 text-lg text-slate-600 leading-9">

              GJU Smart Connect is a modern University Management System
              developed to simplify academic administration.
              It provides separate portals for Students, Teachers
              and Administrators with secure login and role-based access.

            </p>

            <div className="grid grid-cols-2 gap-6 mt-10">

              <div className="bg-blue-50 rounded-2xl p-6">

                <h3 className="text-3xl font-bold text-blue-600">

                  100%

                </h3>

                <p className="mt-2 text-gray-600">

                  Digital Workflow

                </p>

              </div>

              <div className="bg-green-50 rounded-2xl p-6">

                <h3 className="text-3xl font-bold text-green-600">

                  Secure

                </h3>

                <p className="mt-2 text-gray-600">

                  Authentication

                </p>

              </div>

            </div>

          </div>

          {/* Right */}

          <div className="flex justify-center">

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-10 text-center text-white w-full max-w-md">

              <Image
                src="/logo.png"
                alt="GJU Logo"
                width={120}
                height={120}
                className="mx-auto"
              />

              <h3 className="text-3xl font-bold mt-8">

                GJU Smart Connect

              </h3>

              <p className="mt-5 leading-8 text-blue-100">

                A centralized platform to manage
                attendance, marks, assignments,
                announcements, reports and university
                administration efficiently.

              </p>

              <div className="mt-10 border-t border-blue-400 pt-6">

                <p className="text-blue-200">

                  Developed By

                </p>

                <h4 className="text-2xl font-bold mt-2">

                  Manish Kushwaha

                </h4>

                <p className="text-blue-200 mt-2">

                  B.Tech Information Technology

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}