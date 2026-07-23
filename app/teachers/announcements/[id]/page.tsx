"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import Footer from "@/components/common/Footer";
import LoadingScreen from "@/components/teacher/LoadingScreen";
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

  const [loading, setLoading] = useState(true);

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
    try {
      setLoading(true);

      const session = sessionStorage.getItem("user");

      if (!session) {
        window.location.href = "/login?role=teacher";
        return;
      }

      const teacher = JSON.parse(session);

      setTeacherId(teacher.id);

      await loadAnnouncements();
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">

        {/* Hero */}

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-500 p-4 text-white shadow-xl sm:rounded-3xl sm:p-6 sm:shadow-2xl lg:p-8">

          <div className="absolute -right-6 -top-6 opacity-10 sm:-right-10 sm:-top-10">
            <Bell size={120} className="sm:hidden" />
            <Bell size={220} className="hidden sm:block" />
          </div>
 <Link
              href="/teachers/announcements"
              className="w-full sm:w-auto"
            >

              <div className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/20 bg-white/20 px-3 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/30 sm:h-12 sm:gap-2 sm:px-5 mb-2">

                <ArrowLeft
                  size={16}
                  className="sm:hidden"
                />

                <ArrowLeft
                  size={20}
                  className="hidden sm:block"
                />

                <span className="text-xs font-semibold sm:text-base">
                  Back
                </span>

              </div>

            </Link>
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">

            <div>

              <div className="flex items-center gap-2 sm:gap-3">

                <GraduationCap
                  size={20}
                  className="sm:hidden"
                />

                <GraduationCap
                  size={26}
                  className="hidden sm:block"
                />

                <span className="text-xs font-semibold uppercase tracking-[2px] sm:text-sm sm:tracking-[3px]">
                  Teacher Portal
                </span>

              </div>

              <h1 className="mt-3 text-2xl font-extrabold sm:mt-5 sm:text-4xl lg:text-5xl">
                Announcement Management
              </h1>

              <p className="mt-2 text-base text-purple-100 sm:mt-4 sm:text-xl">
                {subjectName}
              </p>

              <p className="text-sm text-purple-200 sm:text-base">
                {subjectCode}
              </p>

            </div>

          </div>

        </div>

        {/* Publish Announcement */}

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow sm:mt-8 sm:rounded-3xl sm:shadow-xl">

          <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-4 text-white sm:px-6 sm:py-5">

            <h2 className="text-xl font-bold sm:text-2xl">
              Publish Announcement
            </h2>

            <p className="mt-1 text-sm text-purple-100 sm:mt-2 sm:text-base">
              This announcement will be visible to all students of this subject.
            </p>

          </div>

          <div className="p-4 sm:p-6">

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              placeholder="Write your announcement here..."
              className="w-full resize-none rounded-xl border border-slate-300 p-4 text-sm outline-none transition focus:border-purple-600 focus:ring-4 focus:ring-purple-100 sm:rounded-2xl sm:p-5 sm:text-base"
            />

            <button
              onClick={publishAnnouncement}
              disabled={saving}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 py-3 text-sm font-bold text-white transition hover:from-purple-700 hover:to-pink-600 disabled:opacity-50 sm:mt-6 sm:w-auto sm:gap-3 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-base"
            >

              <Send size={18} className="sm:hidden" />

              <Send
                size={20}
                className="hidden sm:block"
              />

              {saving
                ? "Publishing..."
                : "Publish Announcement"}

            </button>

          </div>

        </div>
                {/* Latest Announcements */}

        <div className="mt-6 sm:mt-10">

          <div className="mb-5 flex items-center justify-between">

            <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Latest Announcements
            </h2>

            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 sm:text-sm">
              {announcements.length} Total
            </span>

          </div>

          {announcements.length === 0 ? (

            <div className="rounded-2xl bg-white p-8 text-center shadow sm:rounded-3xl sm:p-12 sm:shadow-xl">

              <Bell
                size={48}
                className="mx-auto text-slate-400 sm:hidden"
              />

              <Bell
                size={65}
                className="mx-auto hidden text-slate-400 sm:block"
              />

              <h3 className="mt-4 text-xl font-bold text-slate-800 sm:mt-6 sm:text-3xl">
                No Announcements Yet
              </h3>

              <p className="mt-2 text-sm text-slate-500 sm:mt-3 sm:text-base">
                Publish your first announcement for this subject.
              </p>

            </div>

          ) : (

            <div className="space-y-4 sm:space-y-6">

              {announcements.map((item) => (

                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl"
                >

                  {/* Card Header */}

                  <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-3 text-white sm:px-6 sm:py-4">

                    <div className="flex items-center gap-2">

                      <Bell size={18} className="sm:hidden" />

                      <Bell size={20} className="hidden sm:block" />

                      <span className="text-sm font-semibold sm:text-base">
                        Announcement
                      </span>

                    </div>

                    <span className="text-[11px] text-purple-100 sm:text-sm">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>

                  </div>

                  {/* Body */}

                  <div className="p-4 sm:p-6">

                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700 sm:text-base">

                      {item.message}

                    </p>

                    <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                      <p className="text-xs text-slate-500 sm:text-sm">

                        Published :
                        {" "}
                        {new Date(item.created_at).toLocaleString()}

                      </p>

                      <button
                        onClick={() => deleteAnnouncement(item.id)}
                        className="flex items-center justify-center rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 sm:px-5"
                      >

                        Delete

                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>
                {/* Bottom Spacer */}
        <div className="h-4 sm:h-8" />

      </div>

      {/* Footer */}

      <Footer />

    </main>

  );

}