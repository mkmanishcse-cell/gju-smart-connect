"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

import Footer from "@/components/common/Footer";

export default function ChangePasswordPage() {

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function changePassword() {

    setLoading(true);

    setError("");

    setMessage("");

    try {

      const session =
        sessionStorage.getItem("user");

      if (!session) {

        window.location.href =
          "/login?role=student";

        return;

      }

      const loginUser =
        JSON.parse(session);

      const {

        data: student,

        error: studentError,

      } = await supabase

        .from("students")

        .select("id,password")

        .eq("id", loginUser.id)

        .single();

      if (studentError || !student) {

        setError("Student not found.");

        setLoading(false);

        return;

      }
            /* Validate Current Password */

      if (student.password !== currentPassword) {

        setError("Current password is incorrect.");

        setLoading(false);

        return;

      }

      /* Validate New Password */

      if (newPassword.length < 6) {

        setError(
          "New password must be at least 6 characters."
        );

        setLoading(false);

        return;

      }

      /* Confirm Password */

      if (newPassword !== confirmPassword) {

        setError(
          "New password and confirm password do not match."
        );

        setLoading(false);

        return;

      }

      /* Update Password */

      const {

        error: updateError,

      } = await supabase

        .from("students")

        .update({

          password: newPassword,

        })

        .eq(
          "id",
          student.id
        );

      if (updateError) {

        setError(
          "Failed to update password."
        );

        setLoading(false);

        return;

      }

      setMessage(
        "Password changed successfully."
      );

      setCurrentPassword("");

      setNewPassword("");

      setConfirmPassword("");

    } catch (err) {

      console.error(err);

      setError(
        "Something went wrong."
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <main className="space-y-6 sm:space-y-8">

      <div className="mx-auto max-w-2xl space-y-6 sm:space-y-8 px-3 py-4 sm:p-6">

        {/* Change Password Card */}

        <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-sky-100 bg-white shadow-sm">

          <div className="border-b border-sky-100 bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 px-4 py-4 sm:px-6 sm:py-5">

            <h2 className="text-lg sm:text-2xl font-bold text-slate-800">
              Change Password
            </h2>

            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500">
              Update your account password securely.
            </p>

          </div>

          <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">

            {/* Current Password */}

            <div>

              <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-slate-700">
                Current Password
              </label>

              <input
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                placeholder="Enter current password"
              />

            </div>

            {/* New Password */}

            <div>

              <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-slate-700">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                placeholder="Enter new password"
              />

            </div>

            {/* Confirm Password */}

            <div>

              <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-slate-700">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                placeholder="Confirm new password"
              />

            </div>

            {/* Error */}

            {error && (

              <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-red-600">

                {error}

              </div>

            )}

            {/* Success */}

            {message && (

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium text-emerald-700">

                {message}

              </div>

            )}

            {/* Button */}

            <button
              onClick={changePassword}
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-sm transition hover:from-sky-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading
                ? "Updating..."
                : "Change Password"}

            </button>

          </div>

        </div>

      </div>

      {/* Footer: outside the padded/max-w container so it's edge-to-edge on both mobile + desktop */}
        <div className="-mx-2 sm:-mx-4 md:-mx-6 lg:-mx-8 mt-78">
                     <Footer />
      </div>

    </main>

  );

}