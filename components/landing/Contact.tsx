import {
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";

export default function Contact() {
  return (
    <section className="py-12 sm:py-24 bg-slate-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center">

          <span className="bg-blue-100 text-blue-700 px-3 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-base font-semibold">

            Contact Us

          </span>

          <h2 className="text-2xl sm:text-5xl font-bold mt-4 sm:mt-6 text-slate-900">

            Get In Touch

          </h2>

          <p className="text-gray-500 mt-3 sm:mt-5 text-sm sm:text-lg">

            Have any questions regarding GJU Smart Connect?
            Contact us anytime.

          </p>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mt-8 sm:mt-16">

          {/* Email */}

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md sm:shadow-xl p-4 sm:p-8 text-center hover:-translate-y-2 transition">

            <Mail
              className="mx-auto text-blue-600 w-7 h-7 sm:w-[45px] sm:h-[45px]"
            />

            <h3 className="text-base sm:text-2xl font-bold mt-3 sm:mt-6">

              Email

            </h3>

            <p className="text-gray-500 mt-2 sm:mt-4 text-xs sm:text-base break-words">

              gjusmartconnect@gmail.com

            </p>

          </div>

          {/* Phone */}

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md sm:shadow-xl p-4 sm:p-8 text-center hover:-translate-y-2 transition">

            <Phone
              className="mx-auto text-green-600 w-7 h-7 sm:w-[45px] sm:h-[45px]"
            />

            <h3 className="text-base sm:text-2xl font-bold mt-3 sm:mt-6">

              Phone

            </h3>

            <p className="text-gray-500 mt-2 sm:mt-4 text-xs sm:text-base break-words">

              +91 8757472016

            </p>

          </div>

          {/* Address */}

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md sm:shadow-xl p-4 sm:p-8 text-center hover:-translate-y-2 transition">

            <MapPin
              className="mx-auto text-red-600 w-7 h-7 sm:w-[45px] sm:h-[45px]"
            />

            <h3 className="text-base sm:text-2xl font-bold mt-3 sm:mt-6">

              Address

            </h3>

            <p className="text-gray-500 mt-2 sm:mt-4 text-xs sm:text-base break-words">

              Guru Jambheshwar University,
              Hisar, Haryana

            </p>

          </div>

          {/* Website */}

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md sm:shadow-xl p-4 sm:p-8 text-center hover:-translate-y-2 transition">

            <Globe
              className="mx-auto text-purple-600 w-7 h-7 sm:w-[45px] sm:h-[45px]"
            />

            <h3 className="text-base sm:text-2xl font-bold mt-3 sm:mt-6">

              Website

            </h3>

            <p className="text-gray-500 mt-2 sm:mt-4 text-xs sm:text-base break-words">

              www.gjusmartconnect.online

            </p>

          </div>

        </div>

      </div>

    </section>
  );
}