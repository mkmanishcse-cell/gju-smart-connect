"use client";

type Student = {
  id: string;
  roll_no: string;
  student_name: string;
};

type AttendanceData = {
  [studentId: string]: {
    [date: string]: "P" | "A" | "L";
  };
};

type Props = {
  students: Student[];
  dates: string[];
  attendance: AttendanceData;
  changeDate: (index: number, value: string) => void;
  toggleAttendance: (studentId: string, date: string) => void;
};

export default function AttendanceTable({

  students,

  dates,

  attendance,

  changeDate,

  toggleAttendance,

}: Props) {

  return (

    <div className="bg-white rounded-3xl shadow-lg mt-8 overflow-x-auto">

      <table className="min-w-[3300px] border-collapse">

        <thead>

          <tr className="bg-slate-800 text-white">

            {/* Roll No */}

            <th className="sticky left-0 z-20 bg-slate-800 border p-3 min-w-[120px]">

              Roll No

            </th>

            {/* Student Name */}

            <th className="sticky left-[120px] z-20 bg-slate-800 border p-3 min-w-[250px]">

              Student Name

            </th>

            {/* 30 Date Columns */}

            {dates.map((date, index) => (

              <th
                key={index}
                className="border p-2 min-w-[120px]"
              >

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    changeDate(index, e.target.value)
                  }
                  className="w-full rounded text-black text-sm px-2 py-1"
                />

              </th>

            ))}

            {/* Total */}

            <th className="border p-3 min-w-[130px]">

              Total Present

            </th>

            {/* Percentage */}

            <th className="border p-3 min-w-[130px]">

              Attendance %

            </th>

          </tr>

        </thead>

        <tbody>

          {students.map((student) => {

            const presentCount = Object.values(

              attendance[student.id] || {}

            ).filter((status) => status === "P").length;

            const totalClasses = dates.filter(

              (d) => d !== ""

            ).length;

            const percentage =

              totalClasses === 0

                ? "0.00"

                : (

                    (presentCount / totalClasses) *

                    100

                  ).toFixed(2);

            return (
                              <tr key={student.id}>

                {/* Roll No */}

                <td className="sticky left-0 bg-white border p-3 font-semibold">

                  {student.roll_no}

                </td>

                {/* Student Name */}

                <td className="sticky left-[120px] bg-white border p-3">

                  {student.student_name}

                </td>

                {/* 30 Attendance Columns */}

                {dates.map((date, index) => {

                  const status = attendance[student.id]?.[date] || "";

                  return (

                    <td
                      key={index}
                      className="border p-2 text-center"
                    >

                      <button

                        disabled={!date}

                        onClick={() =>
                          toggleAttendance(student.id, date)
                        }

                        className={`w-10 h-10 rounded-lg font-bold transition-all duration-200

                        ${
                          status === "P"
                            ? "bg-green-600 text-white"
                            : status === "A"
                            ? "bg-red-600 text-white"
                            : status === "L"
                            ? "bg-yellow-400 text-black"
                            : "bg-slate-200 hover:bg-slate-300"
                        }`}

                      >

                        {status || "-"}

                      </button>

                    </td>

                  );

                })}

                {/* Total Present */}

                <td className="border text-center font-bold text-blue-700">

                  {presentCount}

                </td>

                {/* Attendance Percentage */}

                <td className="border text-center font-bold text-green-700">

                  {percentage}%

                </td>

              </tr>

            );

          })}

        </tbody>

      </table>

    </div>

  );

}