import {
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";

export default function Contact() {
  return (
    <section className="py-24 bg-slate-100">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <span className="bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-semibold">

            Contact Us

          </span>

          <h2 className="text-5xl font-bold mt-6 text-slate-900">

            Get In Touch

          </h2>

          <p className="text-gray-500 mt-5 text-lg">

            Have any questions regarding GJU Smart Connect?
            Contact us anytime.

          </p>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

          {/* Email */}

          <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:-translate-y-2 transition">

            <Mail
              size={45}
              className="mx-auto text-blue-600"
            />

            <h3 className="text-2xl font-bold mt-6">

              Email

            </h3>

            <p className="text-gray-500 mt-4 break-words">

              gjusmartconnect@gmail.com

            </p>

          </div>

          {/* Phone */}

          <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:-translate-y-2 transition">

            <Phone
              size={45}
              className="mx-auto text-green-600"
            />

            <h3 className="text-2xl font-bold mt-6">

              Phone

            </h3>

            <p className="text-gray-500 mt-4 break-words">

              +91 8757472016

            </p>

          </div>

          {/* Address */}

          <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:-translate-y-2 transition">

            <MapPin
              size={45}
              className="mx-auto text-red-600"
            />

            <h3 className="text-2xl font-bold mt-6">

              Address

            </h3>

            <p className="text-gray-500 mt-4 break-words">

              Guru Jambheshwar University,
              Hisar, Haryana

            </p>

          </div>

          {/* Website */}

          <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:-translate-y-2 transition">

            <Globe
              size={45}
              className="mx-auto text-purple-600"
            />

            <h3 className="text-2xl font-bold mt-6">

              Website

            </h3>

            <p className="text-gray-500 mt-4 break-words">

              www.gjusmartconnect.online

            </p>

          </div>

        </div>

      </div>

    </section>
  );
}