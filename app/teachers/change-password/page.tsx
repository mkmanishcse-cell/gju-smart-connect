"use client";

import { useState } from "react";
import Link from "next/link";

import { ArrowLeft, LockKeyhole } from "lucide-react";

import { supabase } from "@/lib/supabase";

import Footer from "@/components/common/Footer";

export default function TeacherChangePasswordPage() {

  const [oldPassword,setOldPassword]=useState("");

  const [newPassword,setNewPassword]=useState("");

  const [confirmPassword,setConfirmPassword]=useState("");

  const [loading,setLoading]=useState(false);

  async function changePassword(){

    try{

      setLoading(true);

      const session=

        sessionStorage.getItem("user");

      if(!session){

        alert("Login Required");

        return;

      }

      const teacher=

        JSON.parse(session);

      const teacherId=teacher.id;

      const {

        data,

        error,

      }=await supabase

      .from("teachers")

      .select("password")

      .eq("id",teacherId)

      .single();

      if(error||!data){

        alert("Teacher Not Found");

        return;

      }

      if(data.password!==oldPassword){

        alert("Current Password is Incorrect");

        return;

      }

      if(newPassword.length<6){

        alert("Password must be at least 6 characters.");

        return;

      }

      if(newPassword!==confirmPassword){

        alert("Passwords do not match.");

        return;

      }
      const { error: updateError } = await supabase

        .from("teachers")

        .update({

          password: newPassword,

        })

        .eq("id", teacherId);

      if(updateError){

        alert("Failed to Update Password");

        return;

      }

      alert("Password Updated Successfully");

      sessionStorage.removeItem("user");

      window.location.href="/";

    }catch(error){

      console.log(error);

      alert("Something went wrong.");

    }finally{

      setLoading(false);

    }

  }

  return(
<main className="min-h-screen bg-slate-100">
  <div className="mx-auto w-full max-w-lg px-4 py-4 sm:px-6">

        {/* Header */}

      <div className="mb-4 rounded-3xl bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-4 shadow-xl">
  <div className="flex items-center gap-4">
    <Link
      href="/teachers"
      className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300 text-slate-800 shadow-md transition hover:bg-cyan-200"
    >
      <ArrowLeft size={18} />
    </Link>

    <div>
      <h1 className="text-2xl font-bold text-white">
        Change Password
      </h1>
      <p className="text-sm text-cyan-100">
        Update your account password
      </p>
    </div>
  </div>
</div>

        {/* Card */}
<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl mb-2">
  
</div>
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

          <div className="border-b bg-slate-50 px-6 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
    <LockKeyhole className="text-blue-600" size={24} />
</div>
              <h2 className="text-2xl font-bold">

                Password Details

              </h2>

            </div>

          </div>

         <div className="space-y-4 p-5">

            <div>

              <label className="mb-1 block text-sm font-semibold text-slate-700">

                Current Password

              </label>

              <input

                type="password"

                value={oldPassword}

                onChange={(e)=>setOldPassword(e.target.value)}

               className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"    />

            </div>

            <div>

              <label className="mb-1 block font-medium">

                New Password

              </label>

              <input

                type="password"

                value={newPassword}

                onChange={(e)=>setNewPassword(e.target.value)}

               className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"   />

            </div>

            <div>

              <label className="mb-1 block font-medium">

                Confirm Password

              </label>

              <input

                type="password"

                value={confirmPassword}

                onChange={(e)=>setConfirmPassword(e.target.value)}

              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"  />

            </div>

            <div className="mt-2 flex justify-end">

              <button

                onClick={changePassword}

                disabled={loading}

              className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:opacity-50">
                {loading

                  ? "Updating..."

                  : "Update Password"}

              </button>

            </div>

          </div>

        </div>

      </div>

      <div className="mt-40 mb-0">
  <Footer />
</div>

    </main>

  );

}