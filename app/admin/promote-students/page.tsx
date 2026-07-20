"use client";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import PromotionForm from "@/components/admin/promotion/PromotionForm";

export default function PromoteStudentsPage() {

  return (

    <div className="p-8">

      <div className="flex items-center gap-4 mb-8">

        <Link
          href="/admin"
          className="rounded-lg border p-2 hover:bg-gray-100"
        >

          <ArrowLeft size={20} />

        </Link>

        <div>

          <h1 className="text-4xl font-bold text-slate-800">

            Promote Students

          </h1>

          <p className="mt-2 text-slate-500">

            Promote all students to the next semester.

          </p>

        </div>

      </div>

      <PromotionForm />
<Footer />
    </div>

  );

}