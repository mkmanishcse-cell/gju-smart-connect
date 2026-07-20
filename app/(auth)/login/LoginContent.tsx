"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { login } from "@/lib/auth";
import Footer from "@/components/common/Footer";

export default function LoginContent() {

  const router = useRouter();

  const searchParams = useSearchParams();

  const role =
    searchParams.get("role") || "student";

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const config = {

    admin: {

      title: "Admin Login",

      subtitle: "Administrator Access",

      idLabel: "Admin ID",

      placeholder: "Enter Admin ID",

      color:
        "bg-red-600 hover:bg-red-700",

      button:
        "Login as Admin",

    },

    teacher: {

      title: "Teacher Login",

      subtitle: "Faculty Portal",

      idLabel: "Teacher ID",

      placeholder:
        "Enter Teacher ID",

      color:
        "bg-green-600 hover:bg-green-700",

      button:
        "Login as Teacher",

    },

    student: {

      title: "Student Login",

      subtitle: "Student Portal",

      idLabel: "Roll Number",

      placeholder:
        "Enter Roll Number",

      color:
        "bg-blue-600 hover:bg-blue-700",

      button:
        "Login as Student",

    },

  };

  const data =
    config[
      role as keyof typeof config
    ] || config.student;

  async function handleLogin(
    e?: React.FormEvent<HTMLFormElement>
  ) {

    e?.preventDefault();

    if (!username || !password) {

      alert(
        "Please enter your credentials."
      );

      return;

    }

    setLoading(true);

    try {

      const user =
        await login(
          role,
          username,
          password
        );

      if (!user) {

        alert(
          "Invalid ID or Password"
        );

        setLoading(false);

        return;

      }

      // sessionStorage instead of localStorage:
      // clears automatically when the tab is closed, so the
      // user must log in again the next time they open the site.
      sessionStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      sessionStorage.setItem(
        "role",
        role
      );

      switch (role) {

        case "admin":

          router.push("/admin");

          break;

        case "teacher":

          router.push("/teachers");

          break;

        case "student":

          router.push("/students");

          break;

        default:

          router.push("/");

      }

    }

    catch (error) {

      console.error(error);

      alert("Login Failed");

    }

    finally {

      setLoading(false);

    }

  }

  return (

    <main className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      <div className="flex-1 flex items-center justify-center p-6">

        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">

          <div className="text-center">

            <h1 className="text-3xl font-bold text-slate-800">
              {data.title}
            </h1>

            <p className="mt-2 text-gray-500">
              {data.subtitle}
            </p>

          </div>

          {/* Login Form */}

          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5"
          >

            <div>

              <label className="mb-2 block font-medium">
                {data.idLabel}
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder={data.placeholder}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                autoComplete="username"
                autoFocus
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter Password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                autoComplete="current-password"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-3 font-semibold text-white transition ${data.color} ${
                loading
                  ? "cursor-not-allowed opacity-70"
                  : ""
              }`}
            >
              {loading
                ? "Logging in..."
                : data.button}
            </button>

          </form>

          <div className="mt-8 flex items-center justify-between border-t pt-6">

            <Link
              href="/"
              className="font-medium text-blue-600 hover:underline"
            >
              ← Back to Home
            </Link>

            <span className="text-xs text-gray-400">
              GJU Smart Connect
            </span>

          </div>

        </div>

      </div>

      <Footer />

    </main>

  );

}