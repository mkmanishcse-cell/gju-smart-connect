export default function Stats() {
  return (
    <section className="py-10 sm:py-20 bg-gradient-to-r from-blue-700 to-indigo-700">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 text-center text-white">

          <div>
            <h2 className="text-2xl sm:text-5xl font-bold">5000+</h2>
            <p className="mt-1 sm:mt-3 text-sm sm:text-lg">Students</p>
          </div>

          <div>
            <h2 className="text-2xl sm:text-5xl font-bold">300+</h2>
            <p className="mt-1 sm:mt-3 text-sm sm:text-lg">Faculty Members</p>
          </div>

          <div>
            <h2 className="text-2xl sm:text-5xl font-bold">120+</h2>
            <p className="mt-1 sm:mt-3 text-sm sm:text-lg">Subjects</p>
          </div>

          <div>
            <h2 className="text-2xl sm:text-5xl font-bold">24×7</h2>
            <p className="mt-1 sm:mt-3 text-sm sm:text-lg">Availability</p>
          </div>

        </div>

      </div>

    </section>
  );
}