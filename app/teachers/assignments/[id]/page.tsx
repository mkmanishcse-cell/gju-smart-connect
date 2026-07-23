"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/common/Footer";
import Link from "next/link";

import { useParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  ArrowLeft,
  ClipboardList,
  GraduationCap,
  Upload,
  Calendar,
  Save,
  Bold,
  Italic,
  List,
  ListOrdered,
  Undo2,
  Redo2,
} from "lucide-react";

import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import LoadingScreen from "@/components/teacher/LoadingScreen";

type Assignment = {
  id?: string;

  assignment_no: number;

  description: string;

  last_date: string;

  file_url: string;

  selectedFile: File | null;
};

export default function AssignmentPage() {
  const { id } = useParams();

  const subjectId = id as string;

  const [loading, setLoading] = useState(true);

  const [subjectName, setSubjectName] = useState("");

  const [subjectCode, setSubjectCode] = useState("");

  const [saving, setSaving] = useState(false);

  const [assignment1, setAssignment1] = useState<Assignment>({
    assignment_no: 1,
    description: "",
    last_date: "",
    file_url: "",
    selectedFile: null,
  });

  const [assignment2, setAssignment2] = useState<Assignment>({
    assignment_no: 2,
    description: "",
    last_date: "",
    file_url: "",
    selectedFile: null,
  });

  const editor1 = useEditor({
    extensions: [StarterKit],

    immediatelyRender: true,

    content: "",

    onUpdate({ editor }) {
      setAssignment1((prev) => ({
        ...prev,
        description: editor.getHTML(),
      }));
    },
  });

  const editor2 = useEditor({
    extensions: [StarterKit],

    immediatelyRender: true,

    content: "",

    onUpdate({ editor }) {
      setAssignment2((prev) => ({
        ...prev,
        description: editor.getHTML(),
      }));
    },
  });

  useEffect(() => {
    loadSubject();
  }, []);

  async function loadSubject() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", subjectId)
        .single();

      if (error || !data) {
        console.log(error);
        return;
      }

      setSubjectName(data.subject_name);
      setSubjectCode(data.subject_code);

      await loadAssignments();
    } finally {
      setLoading(false);
    }
  }

  async function loadAssignments() {
    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .eq("subject_id", subjectId)
      .order("assignment_no");

    if (error) {
      console.log(error);
      return;
    }

    data?.forEach((item: any) => {
      if (item.assignment_no === 1) {
        const value = {
          id: item.id,
          assignment_no: 1,
          description: item.description || "",
          last_date: item.last_date || "",
          file_url: item.file_url || "",
          selectedFile: null,
        };

        setAssignment1(value);

        editor1?.commands.setContent(value.description);
      }

      if (item.assignment_no === 2) {
        const value = {
          id: item.id,
          assignment_no: 2,
          description: item.description || "",
          last_date: item.last_date || "",
          file_url: item.file_url || "",
          selectedFile: null,
        };

        setAssignment2(value);

        editor2?.commands.setContent(value.description);
      }
    });
  }

  function selectFile(no: number, file: File | null) {
    if (no === 1) {
      setAssignment1({
        ...assignment1,
        selectedFile: file,
      });
    } else {
      setAssignment2({
        ...assignment2,
        selectedFile: file,
      });
    }
  }

  function validateAssignment(assignment: Assignment) {
    const hasQuestion =
      assignment.description.replace(/<[^>]+>/g, "").trim().length > 0;

    const hasFile = assignment.selectedFile || assignment.file_url;

    if (!hasQuestion && !hasFile) {
      alert("Please write a question or upload a question paper.");
      return false;
    }

    if (!assignment.last_date) {
      alert("Please select last submission date.");
      return false;
    }

    return true;
  }

  async function saveAssignment(assignment: Assignment) {
    if (!validateAssignment(assignment)) return;

    try {
      setSaving(true);

      let fileUrl = assignment.file_url;

      // Upload File (Optional)

      if (assignment.selectedFile) {
        const extension = assignment.selectedFile.name.split(".").pop();

        const fileName = `${subjectId}_${assignment.assignment_no}_${Date.now()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("assignment-files")
          .upload(fileName, assignment.selectedFile, {
            upsert: true,
          });

        if (uploadError) {
          alert(uploadError.message);
          setSaving(false);
          return;
        }

        const { data } = supabase.storage
          .from("assignment-files")
          .getPublicUrl(fileName);

        fileUrl = data.publicUrl;
      }

      const teacher = JSON.parse(sessionStorage.getItem("user") || "{}");

      const payload = {
        teacher_id: teacher.id,
        subject_id: subjectId,
        assignment_no: assignment.assignment_no,
        title: `Assignment ${assignment.assignment_no}`,
        description: assignment.description,
        file_url: fileUrl,
        last_date: assignment.last_date,
      };

      if (assignment.id) {
        const { error } = await supabase
          .from("assignments")
          .update(payload)
          .eq("id", assignment.id);

        if (error) {
          alert(error.message);
          setSaving(false);
          return;
        }
      } else {
        const { error } = await supabase.from("assignments").insert(payload);

        if (error) {
          alert(error.message);
          setSaving(false);
          return;
        }
      }

      alert(`Assignment ${assignment.assignment_no} Saved Successfully`);

      await loadAssignments();
    } catch (err) {
      console.log(err);
      alert("Failed to save assignment.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 p-4 text-white shadow-xl sm:rounded-3xl sm:p-6 sm:shadow-2xl lg:p-8">
          <div className="absolute -right-6 -top-6 opacity-10 sm:-right-10 sm:-top-10">
            <ClipboardList size={120} className="sm:hidden" />
            <ClipboardList size={220} className="hidden sm:block" />
          </div>
<Link href="/teachers/assignments">
  <div className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/20 bg-white/20 px-3 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/30 sm:h-12 sm:gap-2 sm:px-5 mb-2">
    <ArrowLeft
      size={16}
      strokeWidth={2.5}
      className="sm:hidden"
    />
    <ArrowLeft
      size={20}
      strokeWidth={2.5}
      className="hidden sm:block"
    />
    <span className="text-xs font-semibold sm:text-base">
      Back
    </span>
  </div>
</Link>

          <div className="relative flex flex-col flex-wrap items-start justify-between gap-4 sm:flex-row sm:gap-6">
            <div>
              <div className="flex items-center gap-2 sm:gap-3">
                <GraduationCap size={20} className="sm:hidden" />
                <GraduationCap size={24} className="hidden sm:block" />
                <span className="text-xs font-semibold uppercase tracking-[2px] sm:tracking-[3px] sm:text-sm">
                  Teacher Portal
                </span>
              </div>

              <div className="mt-3 flex items-center gap-5 sm:mt-5 sm:gap-6">

 <h1 className="ml-2 text-2xl font-extrabold sm:ml-5 sm:text-4xl lg:text-5xl">
  Assignment Management
</h1>
</div>

              <p className="mt-2 text-base text-indigo-100 sm:mt-4 sm:text-xl">
                {subjectName}
              </p>

              <p className="text-sm text-indigo-200 sm:text-base">
                {subjectCode}
              </p>
            </div>

            
          </div>
        </div>

        {/* Cards */}
        <div className="mt-5 grid gap-5 sm:mt-8 sm:gap-8 xl:grid-cols-2 xl:mt-10">
          {/* Assignment 1 */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow sm:rounded-3xl sm:shadow-xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 text-white sm:px-6 sm:py-5">
              <div>
                <h2 className="text-lg font-bold sm:text-2xl">
                  Assignment 1
                </h2>

                <p className="text-xs text-blue-100 sm:text-base">
                  Question / Question Paper
                </p>
              </div>

              <ClipboardList size={30} className="sm:hidden" />
              <ClipboardList size={38} className="hidden sm:block" />
            </div>

            <div className="p-4 sm:p-6">
              <label className="text-sm font-semibold sm:text-base">
                Question
              </label>

              <div className="mt-3 flex flex-wrap gap-1.5 rounded-t-xl border border-b-0 border-slate-300 bg-slate-100 p-2 sm:mt-4 sm:gap-2 sm:rounded-t-2xl sm:p-3">
                <button
                  onClick={() => editor1?.chain().focus().toggleBold().run()}
                  className="rounded-lg bg-white p-1.5 sm:p-2"
                >
                  <Bold size={16} className="sm:hidden" />
                  <Bold size={18} className="hidden sm:block" />
                </button>

                <button
                  onClick={() => editor1?.chain().focus().toggleItalic().run()}
                  className="rounded-lg bg-white p-1.5 sm:p-2"
                >
                  <Italic size={16} className="sm:hidden" />
                  <Italic size={18} className="hidden sm:block" />
                </button>

                <button
                  onClick={() =>
                    editor1?.chain().focus().toggleBulletList().run()
                  }
                  className="rounded-lg bg-white p-1.5 sm:p-2"
                >
                  <List size={16} className="sm:hidden" />
                  <List size={18} className="hidden sm:block" />
                </button>

                <button
                  onClick={() =>
                    editor1?.chain().focus().toggleOrderedList().run()
                  }
                  className="rounded-lg bg-white p-1.5 sm:p-2"
                >
                  <ListOrdered size={16} className="sm:hidden" />
                  <ListOrdered size={18} className="hidden sm:block" />
                </button>

                <button
                  onClick={() => editor1?.chain().focus().undo().run()}
                  className="rounded-lg bg-white p-1.5 sm:p-2"
                >
                  <Undo2 size={16} className="sm:hidden" />
                  <Undo2 size={18} className="hidden sm:block" />
                </button>

                <button
                  onClick={() => editor1?.chain().focus().redo().run()}
                  className="rounded-lg bg-white p-1.5 sm:p-2"
                >
                  <Redo2 size={16} className="sm:hidden" />
                  <Redo2 size={18} className="hidden sm:block" />
                </button>
              </div>

              <EditorContent
                editor={editor1}
                className="rounded-b-xl border border-slate-300 bg-white [&_.ProseMirror]:min-h-[220px] [&_.ProseMirror]:p-3 [&_.ProseMirror]:outline-none sm:rounded-b-2xl sm:[&_.ProseMirror]:min-h-[320px] sm:[&_.ProseMirror]:p-5"
              />

              {/* Upload */}
              <div className="mt-5 sm:mt-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700 sm:mb-3 sm:text-base">
                  Upload Question Paper (Optional)
                </label>

                <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 text-center transition hover:border-blue-600 hover:bg-blue-50 sm:h-40">
                  <Upload size={32} className="text-blue-600 sm:hidden" />
                  <Upload
                    size={42}
                    className="hidden text-blue-600 sm:block"
                  />

                  <p className="mt-2 text-sm font-semibold sm:mt-3 sm:text-base">
                    Click to Upload PDF / DOCX
                  </p>

                  <p className="px-4 text-xs text-gray-500 sm:text-sm">
                    Teacher may upload question paper instead of typing.
                  </p>

                  <input
                    hidden
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      selectFile(1, e.target.files?.[0] || null)
                    }
                  />
                </label>

                {(assignment1.selectedFile || assignment1.file_url) && (
                  <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 sm:p-4">
                    <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-sm font-semibold text-green-700 sm:text-base">
                          Question Paper
                        </p>

                        <p className="text-xs text-slate-600 sm:text-sm">
                          {assignment1.selectedFile
                            ? assignment1.selectedFile.name
                            : "Existing Uploaded File"}
                        </p>
                      </div>

                      {assignment1.file_url && (
                        <a
                          href={assignment1.file_url}
                          target="_blank"
                          className="text-sm font-semibold text-blue-600 hover:underline sm:text-base"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Last Date */}
              <div className="mt-5 sm:mt-6">
                <label className="mb-2 block text-sm font-semibold sm:mb-3 sm:text-base">
                  Last Submission Date
                </label>

                <div className="relative">
                  <Calendar
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:left-4 sm:top-4 sm:h-5 sm:w-5 sm:translate-y-0"
                  />

                  <input
                    type="date"
                    value={assignment1.last_date}
                    onChange={(e) =>
                      setAssignment1({
                        ...assignment1,
                        last_date: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-4 text-sm sm:py-3 sm:pl-12 sm:text-base"
                  />
                </div>
              </div>

              <button
                onClick={() => saveAssignment(assignment1)}
                disabled={saving}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white transition hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 sm:mt-8 sm:gap-3 sm:rounded-2xl sm:py-4 sm:text-base"
              >
                <Save size={18} className="sm:hidden" />
                <Save size={20} className="hidden sm:block" />
                {saving ? "Saving..." : "Save Assignment 1"}
              </button>
            </div>
          </div>

          {/* Assignment 2 */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow sm:rounded-3xl sm:shadow-xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-red-500 px-4 py-4 text-white sm:px-6 sm:py-5">
              <div>
                <h2 className="text-lg font-bold sm:text-2xl">
                  Assignment 2
                </h2>

                <p className="text-xs text-orange-100 sm:text-base">
                  Question / Question Paper
                </p>
              </div>

              <ClipboardList size={30} className="sm:hidden" />
              <ClipboardList size={38} className="hidden sm:block" />
            </div>

            <div className="p-4 sm:p-6">
              <label className="text-sm font-semibold sm:text-base">
                Question
              </label>

              <div className="mt-3 flex flex-wrap gap-1.5 rounded-t-xl border border-b-0 border-slate-300 bg-slate-100 p-2 sm:mt-4 sm:gap-2 sm:rounded-t-2xl sm:p-3">
                <button
                  type="button"
                  onClick={() => editor2?.chain().focus().toggleBold().run()}
                  className="rounded-lg bg-white p-1.5 hover:bg-slate-200 sm:p-2"
                >
                  <Bold size={16} className="sm:hidden" />
                  <Bold size={18} className="hidden sm:block" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    editor2?.chain().focus().toggleItalic().run()
                  }
                  className="rounded-lg bg-white p-1.5 hover:bg-slate-200 sm:p-2"
                >
                  <Italic size={16} className="sm:hidden" />
                  <Italic size={18} className="hidden sm:block" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    editor2?.chain().focus().toggleBulletList().run()
                  }
                  className="rounded-lg bg-white p-1.5 hover:bg-slate-200 sm:p-2"
                >
                  <List size={16} className="sm:hidden" />
                  <List size={18} className="hidden sm:block" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    editor2?.chain().focus().toggleOrderedList().run()
                  }
                  className="rounded-lg bg-white p-1.5 hover:bg-slate-200 sm:p-2"
                >
                  <ListOrdered size={16} className="sm:hidden" />
                  <ListOrdered size={18} className="hidden sm:block" />
                </button>

                <button
                  type="button"
                  onClick={() => editor2?.chain().focus().undo().run()}
                  className="rounded-lg bg-white p-1.5 hover:bg-slate-200 sm:p-2"
                >
                  <Undo2 size={16} className="sm:hidden" />
                  <Undo2 size={18} className="hidden sm:block" />
                </button>

                <button
                  type="button"
                  onClick={() => editor2?.chain().focus().redo().run()}
                  className="rounded-lg bg-white p-1.5 hover:bg-slate-200 sm:p-2"
                >
                  <Redo2 size={16} className="sm:hidden" />
                  <Redo2 size={18} className="hidden sm:block" />
                </button>
              </div>

              <EditorContent
                editor={editor2}
                className="rounded-b-xl border border-slate-300 bg-white [&_.ProseMirror]:min-h-[220px] [&_.ProseMirror]:p-3 [&_.ProseMirror]:outline-none sm:rounded-b-2xl sm:[&_.ProseMirror]:min-h-[320px] sm:[&_.ProseMirror]:p-5"
              />

              {/* Upload */}
              <div className="mt-5 sm:mt-6">
                <label className="mb-2 block text-sm font-semibold sm:mb-3 sm:text-base">
                  Upload Question Paper (Optional)
                </label>

                <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 text-center transition hover:border-orange-500 hover:bg-orange-50 sm:h-40">
                  <Upload size={32} className="text-orange-500 sm:hidden" />
                  <Upload
                    size={42}
                    className="hidden text-orange-500 sm:block"
                  />

                  <p className="mt-2 text-sm font-semibold sm:mt-3 sm:text-base">
                    Click to Upload PDF / DOCX
                  </p>

                  <input
                    hidden
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      selectFile(2, e.target.files?.[0] || null)
                    }
                  />
                </label>

                {(assignment2.selectedFile || assignment2.file_url) && (
                  <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 sm:p-4">
                    <div className="flex flex-col items-start justify-between gap-2 sm:flex-row">
                      <div>
                        <p className="text-sm font-semibold text-green-700 sm:text-base">
                          Question Paper
                        </p>

                        <p className="text-xs sm:text-sm">
                          {assignment2.selectedFile
                            ? assignment2.selectedFile.name
                            : "Existing Uploaded File"}
                        </p>
                      </div>

                      {assignment2.file_url && (
                        <a
                          href={assignment2.file_url}
                          target="_blank"
                          className="text-sm font-semibold text-blue-600 hover:underline sm:text-base"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Last Date */}
              <div className="mt-5 sm:mt-6">
                <label className="mb-2 block text-sm font-semibold sm:mb-3 sm:text-base">
                  Last Submission Date
                </label>

                <div className="relative">
                  <Calendar
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:left-4 sm:top-4 sm:h-5 sm:w-5 sm:translate-y-0"
                  />

                  <input
                    type="date"
                    value={assignment2.last_date}
                    onChange={(e) =>
                      setAssignment2({
                        ...assignment2,
                        last_date: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-4 text-sm sm:py-3 sm:pl-12 sm:text-base"
                  />
                </div>
              </div>

              <button
                onClick={() => saveAssignment(assignment2)}
                disabled={saving}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-3 text-sm font-bold text-white transition hover:from-orange-600 hover:to-red-600 disabled:opacity-50 sm:mt-8 sm:gap-3 sm:rounded-2xl sm:py-4 sm:text-base"
              >
                <Save size={18} className="sm:hidden" />
                <Save size={20} className="hidden sm:block" />
                {saving ? "Saving..." : "Save Assignment 2"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
       
      </div>
      <Footer />
    </main>
  );
}