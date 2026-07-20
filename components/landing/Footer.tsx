import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">

     <div className="max-w-7xl mx-auto px-6 pt-16 pb-6">

        <div className="grid lg:grid-cols-4 gap-12">

          {/* Logo */}

          <div>

            <div className="flex items-center gap-3">

              <GraduationCap
                size={40}
                className="text-blue-400"
              />

              <div>

                <h2 className="text-2xl font-bold">

                  GJU Smart Connect

                </h2>

                <p className="text-slate-400">

                  Smart Academic Portal

                </p>

              </div>

            </div>

            <p className="mt-6 text-slate-400 leading-8">

              A complete University Management
              System developed to simplify
              academic activities for Students,
              Teachers and Administrators.

            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-xl font-semibold mb-6">

              Quick Links

            </h3>

            <div className="space-y-4">

              <a href="#home" className="block hover:text-blue-400">
                Home
              </a>

              <a href="#portals" className="block hover:text-blue-400">
                Portals
              </a>

              <a href="#features" className="block hover:text-blue-400">
                Features
              </a>

              <a href="#statistics" className="block hover:text-blue-400">
                Statistics
              </a>

              <a href="#about" className="block hover:text-blue-400">
                About
              </a>

              <a href="#contact" className="block hover:text-blue-400">
                Contact
              </a>

            </div>

          </div>

          {/* Portals */}

          <div>

            <h3 className="text-xl font-semibold mb-6">

              Login Portals

            </h3>

            <div className="space-y-4">

              <Link
                href="/login?role=student"
                className="block hover:text-blue-400"
              >
                Student Login
              </Link>

              <Link
                href="/login?role=teacher"
                className="block hover:text-blue-400"
              >
                Teacher Login
              </Link>

              <Link
                href="/login?role=admin"
                className="block hover:text-blue-400"
              >
                Admin Login
              </Link>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-xl font-semibold mb-6">

              Contact

            </h3>

            <div className="space-y-5">

              <div className="flex gap-3">

                <Mail className="text-blue-400" />

                <span>

                  manishitgju@gmail.com

                </span>

              </div>

              <div className="flex gap-3">

                <Phone className="text-green-400" />

                <span>

                  +91 8757472016

                </span>

              </div>

              <div className="flex gap-3">

                <MapPin className="text-red-400" />

                <span>

                  GJU, Hisar, Haryana

                </span>

              </div>

            </div>

          </div>

        </div>

      {/* Bottom */}

<div className="mx-auto mt-10 max-w-7xl border-t border-slate-800 px-6 pt-8 pb-5 text-center">

        <p className="text-sm font-medium tracking-wide text-slate-600">
          © 2026{" "}
          <span className="font-bold text-slate-800">
            GJU Smart Connect
          </span>
          . All Rights Reserved.
        </p>

        <p className="mt-2 text-base font-semibold text-slate-700">
          Developed by{" "}
          <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 bg-clip-text font-bold text-transparent">
            Manish Kushwaha
          </span>
          <span className="mx-2 text-slate-400">|</span>
          <span className="font-medium text-slate-600">
            B.Tech Information Technology
          </span>
        </p>

      </div>
</div>
    </footer>
  );
}