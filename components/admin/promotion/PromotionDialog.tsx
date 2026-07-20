"use client";

import { useState } from "react";
import { promoteStudents } from "@/lib/promotion";

interface Props {

  open: boolean;

  onClose: () => void;

  onSuccess: () => void;

  departmentId: string;

  courseId: string;

  semesterId: string;

  studentsCount: number;

  nextSemester: string;

}

export default function PromotionDialog({

  open,

  onClose,

  onSuccess,

  departmentId,

  courseId,

  semesterId,

  studentsCount,

  nextSemester,

}: Props) {

  const [loading,setLoading]=useState(false);

  async function handlePromote(){

    try{

      setLoading(true);

      await promoteStudents(

        departmentId,

        courseId,

        semesterId

      );

      alert(

        `${studentsCount} students promoted successfully.`

      );

      onSuccess();

    }

    catch(error:any){

      alert(

        error.message

      );

    }

    finally{

      setLoading(false);

    }

  }

  if(!open) return null;

  return(

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

<div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">

<h2 className="text-2xl font-bold text-slate-800">

Confirm Promotion

</h2>

<p className="mt-3 text-slate-500">

Please verify the details before promoting students.

</p>

<div className="mt-8 space-y-4">

<div className="flex justify-between">

<span className="font-medium">

Students Found

</span>

<span className="font-bold text-blue-600">

{studentsCount}

</span>

</div>

<div className="flex justify-between">

<span className="font-medium">

Next Semester

</span>

<span className="font-bold text-green-600">

{nextSemester}

</span>

</div>

</div>

<div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4">

<p className="text-sm text-red-600">

⚠ This action will promote all selected students.

This action cannot be undone.

</p>

</div>

<div className="mt-8 flex justify-end gap-4">

<button

onClick={onClose}

disabled={loading}

className="rounded-xl border px-6 py-3 font-semibold hover:bg-gray-100"

>

Cancel

</button>

<button

onClick={handlePromote}

disabled={loading}

className="rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-700 disabled:opacity-50"

>

{loading

? "Promoting..."

: "Promote Students"}

</button>

</div>

</div>

</div>

);

}