import Image from "next/image";

export default function About() {
  return (
    <section className="py-12 sm:py-24 bg-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">

          {/* Left */}

          <div>

            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-base font-semibold">

              About GJU Smart Connect

            </span>

            <h2 className="text-2xl sm:text-5xl font-bold text-slate-900 mt-4 sm:mt-6 leading-snug sm:leading-tight">

              One Smart Platform For Complete University Management

            </h2>

            <p className="mt-4 sm:mt-8 text-sm sm:text-lg text-slate-600 leading-6 sm:leading-9">

              GJU Smart Connect is a modern University Management System
              developed to simplify academic administration.
              It provides separate portals for Students, Teachers
              and Administrators with secure login and role-based access.

            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 mt-6 sm:mt-10">

              <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">

                <h3 className="text-xl sm:text-3xl font-bold text-blue-600">

                  100%

                </h3>

                <p className="mt-1 sm:mt-2 text-xs sm:text-base text-gray-600">

                  Digital Workflow

                </p>

              </div>

              <div className="bg-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">

                <h3 className="text-xl sm:text-3xl font-bold text-green-600">

                  Secure

                </h3>

                <p className="mt-1 sm:mt-2 text-xs sm:text-base text-gray-600">

                  Authentication

                </p>

              </div>

            </div>

          </div>

          {/* Right */}

          <div className="flex justify-center">

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-6 sm:p-10 text-center text-white w-full max-w-md">

              <Image
                src="/logo.png"
                alt="GJU Logo"
                width={120}
                height={120}
                className="mx-auto w-16 h-16 sm:w-[120px] sm:h-[120px]"
              />

              <h3 className="text-xl sm:text-3xl font-bold mt-4 sm:mt-8">

                GJU Smart Connect

              </h3>

              <p className="mt-3 sm:mt-5 text-sm sm:text-base leading-6 sm:leading-8 text-blue-100">

                A centralized platform to manage
                attendance, marks, assignments,
                announcements, reports and university
                administration efficiently.

              </p>

              <div className="mt-6 sm:mt-10 border-t border-blue-400 pt-4 sm:pt-6">

                <p className="text-xs sm:text-base text-blue-200">

                  Developed By

                </p>

                <h4 className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2">

                  Manish Kushwaha

                </h4>

                <p className="text-xs sm:text-base text-blue-200 mt-1 sm:mt-2">

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