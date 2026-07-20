import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden"
    >
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-300 opacity-30 blur-3xl"></div>

      <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-indigo-300 opacity-20 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 pt-40 pb-24">

        <div className="text-center">

          <Image
            src="/logo.png"
            alt="GJU Logo"
            width={140}
            height={140}
            className="mx-auto"
            priority
          />

          <h1 className="mt-8 text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900">
            GJU Smart Connect
          </h1>

          <p className="mt-6 text-2xl font-semibold text-blue-700">
            Guru Jambheshwar University of Science & Technology
          </p>

          <p className="mt-5 text-lg text-gray-600 max-w-3xl mx-auto leading-8">
            A modern digital academic platform connecting Students,
            Teachers and Administration through one secure system.
          </p>

          <div className="mt-12 flex justify-center flex-wrap gap-4">

            <div className="bg-white rounded-full shadow-lg px-8 py-3">
              🎓 Student Portal
            </div>

            <div className="bg-white rounded-full shadow-lg px-8 py-3">
              👨‍🏫 Teacher Portal
            </div>

            <div className="bg-white rounded-full shadow-lg px-8 py-3">
              🛡 Admin Portal
            </div>

             <div className="bg-white rounded-full shadow-lg px-8 py-3">
              📖 Elibrary
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}