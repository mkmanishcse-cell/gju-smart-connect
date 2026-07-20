"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { supabase } from "@/lib/supabase";

import LoadingScreen from "@/components/student/LoadingScreen";
import Footer from "@/components/common/Footer";

type Student = {
  id: string;
  student_name: string;
  roll_no: string;
};

type Subject = {
  id: string;
  subject_code: string;
  subject_name: string;
};

type Announcement = {
  id: string;
  title: string;
  message: string;
  created_at: string;
};

export default function StudentAnnouncementsPage() {

  const router = useRouter();

  const { subjectId } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [student, setStudent] =
    useState<Student | null>(null);

  const [subject, setSubject] =
    useState<Subject | null>(null);

  const [announcements, setAnnouncements] =
    useState<Announcement[]>([]);

  useEffect(() => {

    if (subjectId) {

      loadAnnouncements();

    }

  }, [subjectId]);

  async function loadAnnouncements() {

    try {

      const session =
        sessionStorage.getItem("user");

      if (!session) {

        router.push("/login?role=student");

        return;

      }

      const loginUser =
        JSON.parse(session);

      /* Student */

      const {

        data: studentData,

        error: studentError,

      } = await supabase

        .from("students")

        .select(`
          id,
          student_name,
          roll_no
        `)

        .eq("id", loginUser.id)

        .single();

      if (studentError || !studentData) {

        console.error(studentError);

        return;

      }

      setStudent(studentData);

      /* Subject */

      const {

        data: subjectData,

        error: subjectError,

      } = await supabase

        .from("subjects")

        .select(`
          id,
          subject_code,
          subject_name
        `)

        .eq("id", subjectId)

        .single();

      if (subjectError || !subjectData) {

        console.error(subjectError);

        return;

      }

      setSubject(subjectData);
            /* Announcements */

      const {

        data: announcementData,

        error: announcementError,

      } = await supabase

        .from("announcements")

        .select(`
          id,
          title,
          message,
          created_at
        `)

        .eq(
          "subject_id",
          subjectId
        )

        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      if (announcementError) {

        console.error(announcementError);

        return;

      }

      setAnnouncements(
        announcementData ?? []
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return <LoadingScreen />;

  }

  if (!student || !subject) {

    return null;

  }

  return (

    <main className="space-y-8">
        <div className="space-y-8">

  {/* Back Button */}

  <div>

    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
    >
      <ArrowLeft size={18} />
      Back
    </button>

  </div>

  {/* Student Information */}

  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

    <div className="border-b bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 px-6 py-5">

      <h2 className="text-2xl font-bold text-slate-800">
        Student Information
      </h2>

    </div>

    <div className="grid gap-6 p-6 md:grid-cols-3">

      <div>

        <p className="text-sm text-slate-500">
          Student Name
        </p>

        <p className="mt-1 font-semibold text-slate-800">
          {student.student_name}
        </p>

      </div>

      <div>

        <p className="text-sm text-slate-500">
          Roll Number
        </p>

        <p className="mt-1 font-semibold text-slate-800">
          {student.roll_no}
        </p>

      </div>

      <div>

        <p className="text-sm text-slate-500">
          Subject
        </p>

        <p className="mt-1 font-semibold text-slate-800">
          {subject.subject_name}
        </p>

      </div>

    </div>

  </div>

  {/* Announcements */}

  {announcements.map((announcement) => (

    <div
      key={announcement.id}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >

      <div className="border-b bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 px-6 py-5">

        <h2 className="text-xl font-bold text-slate-800">
          {announcement.title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">

          Published on{" "}

          {new Date(
            announcement.created_at
          ).toLocaleDateString()}

        </p>

      </div>

      <div className="p-6">

        <div className="rounded-xl bg-slate-50 p-5 whitespace-pre-wrap leading-7 text-slate-700">

          {announcement.message}

        </div>

      </div>

    </div>

  ))}

  {announcements.length === 0 && (

    <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">

      <h2 className="text-xl font-semibold text-slate-700">

        No Announcements

      </h2>

      <p className="mt-2 text-slate-500">

        No announcements have been published for this subject.

      </p>

    </div>

  )}
        <Footer />

    </div>

  </main>

  );

}