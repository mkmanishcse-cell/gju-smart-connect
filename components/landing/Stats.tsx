export default function Stats() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-700">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-4 gap-10 text-center text-white">

          <div>
            <h2 className="text-5xl font-bold">5000+</h2>
            <p className="mt-3 text-lg">Students</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold">300+</h2>
            <p className="mt-3 text-lg">Faculty Members</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold">120+</h2>
            <p className="mt-3 text-lg">Subjects</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold">24×7</h2>
            <p className="mt-3 text-lg">Availability</p>
          </div>

        </div>

      </div>

    </section>
  );
}