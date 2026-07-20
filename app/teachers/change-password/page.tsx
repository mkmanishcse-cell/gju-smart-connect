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

    <main className="min-h-screen flex flex-col bg-slate-100">

      <div className="flex-1 max-w-3xl mx-auto w-full p-6">

        {/* Header */}

        <div className="mb-6 flex items-center gap-4">

          <Link

            href="/teachers"

            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold shadow hover:bg-slate-50"

          >

            <ArrowLeft size={18}/>

            Back

          </Link>

          <div>

            <h1 className="text-3xl font-bold">

              Change Password

            </h1>

            <p className="text-slate-500">

              Update your account password

            </p>

          </div>

        </div>

        {/* Card */}

        <div className="rounded-3xl bg-white shadow">

          <div className="border-b px-6 py-5">

            <div className="flex items-center gap-3">

              <LockKeyhole size={24}/>

              <h2 className="text-2xl font-bold">

                Password Details

              </h2>

            </div>

          </div>

          <div className="space-y-6 p-6">

            <div>

              <label className="mb-2 block font-medium">

                Current Password

              </label>

              <input

                type="password"

                value={oldPassword}

                onChange={(e)=>setOldPassword(e.target.value)}

                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"

              />

            </div>

            <div>

              <label className="mb-2 block font-medium">

                New Password

              </label>

              <input

                type="password"

                value={newPassword}

                onChange={(e)=>setNewPassword(e.target.value)}

                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"

              />

            </div>

            <div>

              <label className="mb-2 block font-medium">

                Confirm Password

              </label>

              <input

                type="password"

                value={confirmPassword}

                onChange={(e)=>setConfirmPassword(e.target.value)}

                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"

              />

            </div>

            <div className="flex justify-end">

              <button

                onClick={changePassword}

                disabled={loading}

                className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"

              >

                {loading

                  ? "Updating..."

                  : "Update Password"}

              </button>

            </div>

          </div>

        </div>

      </div>

      <Footer/>

    </main>

  );

}