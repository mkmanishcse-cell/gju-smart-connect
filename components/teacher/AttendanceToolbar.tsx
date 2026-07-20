"use client";

import { Save, Search } from "lucide-react";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  onSave: () => void;
};

export default function AttendanceToolbar({
  search,
  setSearch,
  onSave,
}: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mt-8">

      <div className="flex flex-col lg:flex-row gap-5 items-center">

        {/* Search */}

        <div className="relative flex-1 w-full">

          <Search
            size={20}
            className="absolute left-4 top-4 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Student by Roll No or Name..."
            className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-600"
          />

        </div>

        {/* Save Button */}

        <button
          onClick={onSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center gap-3 transition whitespace-nowrap"
        >

          <Save size={20} />

          Save Attendance

        </button>

      </div>

    </div>
  );
}