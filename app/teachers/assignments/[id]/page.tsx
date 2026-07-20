"use client";

import { useEffect, useState } from "react";

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
  FileText,
  Bold,
  Italic,
  List,
  ListOrdered,
  Undo2,
  Redo2,
} from "lucide-react";

import {
  EditorContent,
  useEditor,
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

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

  const [subjectName, setSubjectName] = useState("");

  const [subjectCode, setSubjectCode] = useState("");

  const [saving, setSaving] = useState(false);

  const [assignment1, setAssignment1] =
    useState<Assignment>({
      assignment_no: 1,
      description: "",
      last_date: "",
      file_url: "",
      selectedFile: null,
    });

  const [assignment2, setAssignment2] =
    useState<Assignment>({
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

        editor1?.commands.setContent(
          value.description
        );

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

        editor2?.commands.setContent(
          value.description
        );

      }

    });

  }

  function selectFile(

    no: number,

    file: File | null

  ) {

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

  function validateAssignment(

    assignment: Assignment

  ) {

    const hasQuestion =
      assignment.description
        .replace(/<[^>]+>/g, "")
        .trim().length > 0;

    const hasFile =
      assignment.selectedFile ||
      assignment.file_url;

    if (!hasQuestion && !hasFile) {

      alert(

        "Please write a question or upload a question paper."

      );

      return false;

    }

    if (!assignment.last_date) {

      alert("Please select last submission date.");

      return false;

    }

    return true;

  }
    async function saveAssignment(
    assignment: Assignment
  ) {

    if (!validateAssignment(assignment))
      return;

    try {

      setSaving(true);

      let fileUrl = assignment.file_url;

      // Upload File (Optional)

      if (assignment.selectedFile) {

        const extension =
          assignment.selectedFile.name
            .split(".")
            .pop();

        const fileName =

          `${subjectId}_${assignment.assignment_no}_${Date.now()}.${extension}`;

        const { error: uploadError } =
          await supabase.storage

            .from("assignment-files")

            .upload(
              fileName,
              assignment.selectedFile,
              {
                upsert: true,
              }
            );

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

      const teacher = JSON.parse(
        sessionStorage.getItem("user") || "{}"
      );

      const payload = {

        teacher_id: teacher.id,

        subject_id: subjectId,

        assignment_no:
          assignment.assignment_no,

        title:
          `Assignment ${assignment.assignment_no}`,

        description:
          assignment.description,

        file_url: fileUrl,

        last_date:
          assignment.last_date,

      };

      if (assignment.id) {

        const { error } =
          await supabase

            .from("assignments")

            .update(payload)

            .eq("id", assignment.id);

        if (error) {

          alert(error.message);

          setSaving(false);

          return;

        }

      } else {

        const { error } =
          await supabase

            .from("assignments")

            .insert(payload);

        if (error) {

          alert(error.message);

          setSaving(false);

          return;

        }

      }

      alert(
        `Assignment ${assignment.assignment_no} Saved Successfully`
      );

      await loadAssignments();

    } catch (err) {

      console.log(err);

      alert("Failed to save assignment.");

    } finally {

      setSaving(false);

    }

  }

  return (

    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Hero */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 shadow-2xl p-8 text-white">

          <div className="absolute -right-10 -top-10 opacity-10">

            <ClipboardList size={220} />

          </div>

          <div className="relative flex justify-between items-start flex-wrap gap-6">

            <div>

              <div className="flex items-center gap-3">

                <GraduationCap size={24} />

                <span className="uppercase tracking-[3px] text-sm font-semibold">

                  Teacher Portal

                </span>

              </div>

              <h1 className="text-5xl font-extrabold mt-5">

                Assignment Management

              </h1>

              <p className="mt-4 text-xl text-indigo-100">

                {subjectName}

              </p>

              <p className="text-indigo-200">

                {subjectCode}

              </p>

            </div>

            <Link href="/teachers/assignments">

              <div className="bg-white/20 backdrop-blur-md hover:bg-white/30 transition rounded-2xl px-6 py-3 flex items-center gap-3 cursor-pointer">

                <ArrowLeft size={20} />

                Back

              </div>

            </Link>

          </div>

        </div>

        {/* Cards */}

        <div className="grid xl:grid-cols-2 gap-8 mt-10">

          {/* Assignment 1 */}

          <div className="rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden">

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5 flex justify-between">

              <div>

                <h2 className="text-2xl font-bold">

                  Assignment 1

                </h2>

                <p className="text-blue-100">

                  Question / Question Paper

                </p>

              </div>

              <ClipboardList size={38} />

            </div>

            <div className="p-6">

              <label className="font-semibold">

                Question

              </label>

              <div className="mt-4 rounded-t-2xl border border-slate-300 border-b-0 bg-slate-100 p-3 flex gap-2 flex-wrap">

                <button
                  onClick={()=>editor1?.chain().focus().toggleBold().run()}
                  className="p-2 rounded-lg bg-white">

                  <Bold size={18}/>

                </button>

                <button
                  onClick={()=>editor1?.chain().focus().toggleItalic().run()}
                  className="p-2 rounded-lg bg-white">

                  <Italic size={18}/>

                </button>

                <button
                  onClick={()=>editor1?.chain().focus().toggleBulletList().run()}
                  className="p-2 rounded-lg bg-white">

                  <List size={18}/>

                </button>

                <button
                  onClick={()=>editor1?.chain().focus().toggleOrderedList().run()}
                  className="p-2 rounded-lg bg-white">

                  <ListOrdered size={18}/>

                </button>

                <button
                  onClick={()=>editor1?.chain().focus().undo().run()}
                  className="p-2 rounded-lg bg-white">

                  <Undo2 size={18}/>

                </button>

                <button
                  onClick={()=>editor1?.chain().focus().redo().run()}
                  className="p-2 rounded-lg bg-white">

                  <Redo2 size={18}/>

                </button>

              </div>

              <EditorContent

                editor={editor1}

                className="rounded-b-2xl border border-slate-300 bg-white [&_.ProseMirror]:min-h-[320px] [&_.ProseMirror]:p-5 [&_.ProseMirror]:outline-none"

              />
                            {/* Upload */}

              <div className="mt-6">

                <label className="block font-semibold text-slate-700 mb-3">

                  Upload Question Paper (Optional)

                </label>

                <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 h-40 cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition">

                  <Upload
                    size={42}
                    className="text-blue-600"
                  />

                  <p className="mt-3 font-semibold">

                    Click to Upload PDF / DOCX

                  </p>

                  <p className="text-sm text-gray-500">

                    Teacher may upload question paper instead of typing.

                  </p>

                  <input
                    hidden
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e)=>
                      selectFile(
                        1,
                        e.target.files?.[0] || null
                      )
                    }
                  />

                </label>

                {(assignment1.selectedFile ||
                  assignment1.file_url) && (

                  <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-4">

                    <div className="flex justify-between items-center">

                      <div>

                        <p className="font-semibold text-green-700">

                          Question Paper

                        </p>

                        <p className="text-sm text-slate-600">

                          {assignment1.selectedFile
                            ? assignment1.selectedFile.name
                            : "Existing Uploaded File"}

                        </p>

                      </div>

                      {assignment1.file_url && (

                        <a
                          href={assignment1.file_url}
                          target="_blank"
                          className="text-blue-600 font-semibold hover:underline"
                        >

                          Download

                        </a>

                      )}

                    </div>

                  </div>

                )}

              </div>

              {/* Last Date */}

              <div className="mt-6">

                <label className="block font-semibold mb-3">

                  Last Submission Date

                </label>

                <div className="relative">

                  <Calendar
                    size={20}
                    className="absolute left-4 top-4 text-gray-400"
                  />

                  <input
                    type="date"
                    value={assignment1.last_date}
                    onChange={(e)=>
                      setAssignment1({
                        ...assignment1,
                        last_date:e.target.value
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4"
                  />

                </div>

              </div>

              <button
                onClick={() =>
                  saveAssignment(assignment1)
                }
                disabled={saving}
                className="mt-8 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white py-4 font-bold flex justify-center items-center gap-3"
              >

                <Save size={20} />

                {saving
                  ? "Saving..."
                  : "Save Assignment 1"}

              </button>

            </div>

          </div>
                    {/* Assignment 2 */}

          <div className="rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden">

            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-5 flex justify-between">

              <div>

                <h2 className="text-2xl font-bold">

                  Assignment 2

                </h2>

                <p className="text-orange-100">

                  Question / Question Paper

                </p>

              </div>

              <ClipboardList size={38} />

            </div>

            <div className="p-6">

              <label className="font-semibold">

                Question

              </label>

              <div className="mt-4 rounded-t-2xl border border-slate-300 border-b-0 bg-slate-100 p-3 flex gap-2 flex-wrap">

                <button
                  type="button"
                  onClick={() => editor2?.chain().focus().toggleBold().run()}
                  className="p-2 rounded-lg bg-white hover:bg-slate-200"
                >
                  <Bold size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => editor2?.chain().focus().toggleItalic().run()}
                  className="p-2 rounded-lg bg-white hover:bg-slate-200"
                >
                  <Italic size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => editor2?.chain().focus().toggleBulletList().run()}
                  className="p-2 rounded-lg bg-white hover:bg-slate-200"
                >
                  <List size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => editor2?.chain().focus().toggleOrderedList().run()}
                  className="p-2 rounded-lg bg-white hover:bg-slate-200"
                >
                  <ListOrdered size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => editor2?.chain().focus().undo().run()}
                  className="p-2 rounded-lg bg-white hover:bg-slate-200"
                >
                  <Undo2 size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => editor2?.chain().focus().redo().run()}
                  className="p-2 rounded-lg bg-white hover:bg-slate-200"
                >
                  <Redo2 size={18} />
                </button>

              </div>

              <EditorContent
                editor={editor2}
                className="rounded-b-2xl border border-slate-300 bg-white [&_.ProseMirror]:min-h-[320px] [&_.ProseMirror]:p-5 [&_.ProseMirror]:outline-none"
              />

              {/* Upload */}

              <div className="mt-6">

                <label className="block font-semibold mb-3">

                  Upload Question Paper (Optional)

                </label>

                <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 h-40 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition">

                  <Upload
                    size={42}
                    className="text-orange-500"
                  />

                  <p className="mt-3 font-semibold">

                    Click to Upload PDF / DOCX

                  </p>

                  <input
                    hidden
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e)=>
                      selectFile(
                        2,
                        e.target.files?.[0] || null
                      )
                    }
                  />

                </label>

                {(assignment2.selectedFile ||
                  assignment2.file_url) && (

                  <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-4">

                    <div className="flex justify-between">

                      <div>

                        <p className="font-semibold text-green-700">

                          Question Paper

                        </p>

                        <p className="text-sm">

                          {assignment2.selectedFile
                            ? assignment2.selectedFile.name
                            : "Existing Uploaded File"}

                        </p>

                      </div>

                      {assignment2.file_url && (

                        <a
                          href={assignment2.file_url}
                          target="_blank"
                          className="text-blue-600 font-semibold hover:underline"
                        >

                          Download

                        </a>

                      )}

                    </div>

                  </div>

                )}

              </div>

              {/* Last Date */}

              <div className="mt-6">

                <label className="block font-semibold mb-3">

                  Last Submission Date

                </label>

                <div className="relative">

                  <Calendar
                    size={20}
                    className="absolute left-4 top-4 text-gray-400"
                  />

                  <input
                    type="date"
                    value={assignment2.last_date}
                    onChange={(e)=>
                      setAssignment2({
                        ...assignment2,
                        last_date:e.target.value
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4"
                  />

                </div>

              </div>

              <button
                onClick={() =>
                  saveAssignment(assignment2)
                }
                disabled={saving}
                className="mt-8 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 text-white py-4 font-bold flex items-center justify-center gap-3"
              >

                <Save size={20} />

                {saving
                  ? "Saving..."
                  : "Save Assignment 2"}

              </button>

            </div>

          </div>

        </div>
                {/* Footer */}

        <footer className="mt-12 rounded-3xl bg-white shadow-xl p-8">

          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

            <div>

              <h2 className="text-2xl font-bold text-slate-800">

                GJU Smart Connect

              </h2>

              <p className="text-gray-500 mt-2">

                Teacher Assignment Management

              </p>

            </div>

            <div className="flex gap-8 text-center">

              <div>

                <h3 className="text-3xl font-bold text-indigo-600">

                  2

                </h3>

                <p className="text-gray-500">

                  Assignments

                </p>

              </div>

              <div>

                <h3 className="text-3xl font-bold text-green-600">

                  {saving ? "..." : "Ready"}

                </h3>

                <p className="text-gray-500">

                  Status

                </p>

              </div>

            </div>

            <div className="text-right">

              <p className="text-gray-500">

                © 2026 All Rights Reserved

              </p>

              <p className="mt-2">

                Developed By

                <span className="font-semibold text-indigo-600">

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