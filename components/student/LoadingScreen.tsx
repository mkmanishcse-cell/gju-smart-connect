"use client";

import { GraduationCap } from "lucide-react";

export default function LoadingScreen() {

  return (

    <div className="min-h-[80vh] flex items-center justify-center">

      <div className="w-full max-w-7xl">

        {/* Logo */}

        <div className="flex flex-col items-center">

          <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-2xl animate-pulse">

            <GraduationCap

              size={46}

              className="text-white"

            />

          </div>

          <h2 className="mt-8 text-3xl font-bold text-slate-800">

            Loading Dashboard...

          </h2>

          <p className="mt-2 text-slate-500">

            Please wait while we prepare your workspace

          </p>

        </div>

        {/* Skeleton */}

        <div className="mt-16 space-y-8 animate-pulse">

          {/* Student Card */}

          <div className="h-56 rounded-[30px] bg-slate-200"/>

          {/* Stats */}

          <div className="grid grid-cols-4 gap-6">

            <div className="h-40 rounded-[28px] bg-slate-200"/>

            <div className="h-40 rounded-[28px] bg-slate-200"/>

            <div className="h-40 rounded-[28px] bg-slate-200"/>

            <div className="h-40 rounded-[28px] bg-slate-200"/>

          </div>

          {/* Quick Actions */}

          <div className="grid grid-cols-4 gap-6">

            <div className="h-52 rounded-[28px] bg-slate-200"/>

            <div className="h-52 rounded-[28px] bg-slate-200"/>

            <div className="h-52 rounded-[28px] bg-slate-200"/>

            <div className="h-52 rounded-[28px] bg-slate-200"/>

          </div>

          {/* Announcements */}

          <div className="h-96 rounded-[30px] bg-slate-200"/>

        </div>

      </div>

    </div>

  );

}