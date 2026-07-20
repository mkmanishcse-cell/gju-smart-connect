"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  ArrowLeft,
  Bell,
  GraduationCap,
  Send,
} from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  message: string;
  created_at: string;
};

export default function AnnouncementPage() {

  const { id } = useParams();

  const subjectId = id as string;

  const [subjectName, setSubjectName] = useState("");

  const [subjectCode, setSubjectCode] = useState("");

  const [teacherId, setTeacherId] = useState("");

  const [message, setMessage] = useState("");

  const [saving, setSaving] = useState(false);

  const [announcements, setAnnouncements] =
    useState<Announcement[]>([]);

  useEffect(() => {

    loadTeacher();

    loadSubject();

  }, []);
    async function loadTeacher() {

    const session = sessionStorage.getItem("user");

    if (!session) {

      window.location.href = "/login?role=teacher";

      return;

    }

    const teacher = JSON.parse(session);

    setTeacherId(teacher.id);

    await loadAnnouncements();

  }

  async function loadSubject() {

    const { data, error } = await supabase

      .from("subjects")

      .select("subject_name, subject_code")

      .eq("id", subjectId)

      .single();

    if (error) {

      console.log(error);

      return;

    }

    setSubjectName(data.subject_name);

    setSubjectCode(data.subject_code);

  }

  async function loadAnnouncements() {

    const { data, error } = await supabase

      .from("announcements")

      .select("*")

      .eq("subject_id", subjectId)

      .order("created_at", {
        ascending: false,
      });

    if (error) {

      console.log(error);

      return;

    }

    setAnnouncements(data || []);

  }
    async function publishAnnouncement() {

    if (!message.trim()) {

      alert("Please write an announcement.");

      return;

    }

    try {

      setSaving(true);

      const { error } = await supabase

        .from("announcements")

        .insert({

          teacher_id: teacherId,

          subject_id: subjectId,

          title: "Announcement",

          message: message.trim(),

        });

      if (error) {

        console.log(error);

        alert(error.message);

        return;

      }

      setMessage("");

      await loadAnnouncements();

      alert("Announcement published successfully.");

    } catch (err) {

      console.log(err);

      alert("Something went wrong.");

    } finally {

      setSaving(false);

    }

  }

  async function deleteAnnouncement(id: string) {

    const confirmDelete = window.confirm(

      "Delete this announcement?"

    );

    if (!confirmDelete) return;

    const { error } = await supabase

      .from("announcements")

      .delete()

      .eq("id", id);

    if (error) {

      console.log(error);

      alert(error.message);

      return;

    }

    await loadAnnouncements();

  }

  return (

    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Hero */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 shadow-2xl p-8 text-white">

          <div className="absolute -right-10 -top-10 opacity-10">

            <Bell size={220} />

          </div>

          <div className="relative flex justify-between items-start flex-wrap gap-6">

            <div>

              <div className="flex items-center gap-3">

                <GraduationCap size={26} />

                <span className="uppercase tracking-[3px] text-sm font-semibold">

                  Teacher Portal

                </span>

              </div>

              <h1 className="text-5xl font-extrabold mt-5">

                Announcement Management

              </h1>

              <p className="mt-4 text-xl text-purple-100">

                {subjectName}

              </p>

              <p className="text-purple-200">

                {subjectCode}

              </p>

            </div>

            <Link href="/teachers/announcements">

              <div className="bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 rounded-2xl px-6 py-3 flex items-center gap-3 cursor-pointer">

                <ArrowLeft size={20} />

                Back

              </div>

            </Link>

          </div>

        </div>

        {/* Announcement Box */}

        <div className="mt-10 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

          <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-5 text-white">

            <h2 className="text-2xl font-bold">

              Publish Announcement

            </h2>

            <p className="text-purple-100 mt-2">

              This announcement will be visible to all students of this subject.

            </p>

          </div>

          <div className="p-6">

            <textarea

              value={message}

              onChange={(e) => setMessage(e.target.value)}

              rows={8}

              placeholder="Write your announcement here..."

              className="w-full rounded-2xl border border-slate-300 p-5 resize-none outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100"

            />

            <button

              onClick={publishAnnouncement}

              disabled={saving}

              className="mt-6 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition"

            >

              <Send size={20} />

              {saving ? "Publishing..." : "Publish Announcement"}

            </button>

          </div>

        </div>
                {/* Latest Announcements */}

        <div className="mt-10">

          <h2 className="text-3xl font-bold text-slate-800 mb-6">

            Latest Announcements

          </h2>

          {announcements.length === 0 ? (

            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">

              <Bell
                size={60}
                className="mx-auto text-slate-400"
              />

              <h3 className="text-2xl font-bold mt-5">

                No Announcements Yet

              </h3>

              <p className="text-gray-500 mt-3">

                Publish your first announcement for this subject.

              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {announcements.map((item) => (

                <div
                  key={item.id}
                  className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6"
                >

                  <div className="flex justify-between items-start gap-6">

                    <div className="flex-1">

                      <p className="text-slate-700 whitespace-pre-wrap leading-7">

                        {item.message}

                      </p>

                      <p className="text-sm text-gray-500 mt-5">

                        Published :

                        {" "}

                        {new Date(
                          item.created_at
                        ).toLocaleString()}

                      </p>

                    </div>

                    <button
                      onClick={() =>
                        deleteAnnouncement(item.id)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl transition"
                    >

                      Delete

                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* Footer */}

        <footer className="mt-14 rounded-3xl bg-white shadow-xl p-8">

          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

            <div>

              <h2 className="text-2xl font-bold text-slate-800">

                GJU Smart Connect

              </h2>

              <p className="text-gray-500 mt-2">

                Teacher Announcement Management

              </p>

            </div>

            <div className="text-center">

              <p className="text-gray-500">

                Total Announcements

              </p>

              <h2 className="text-4xl font-bold text-purple-600 mt-2">

                {announcements.length}

              </h2>

            </div>

            <div className="text-right">

              <p className="text-gray-500">

                © 2026 All Rights Reserved

              </p>

              <p className="mt-2">

                Developed By

                <span className="font-bold text-purple-600">

                  {" "}Manish Kushwaha

                </span>

              </p>

            </div>

          </div>

        </footer>

      </div>

    </main>

  );

}