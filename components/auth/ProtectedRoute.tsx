"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  role: "admin" | "teacher" | "student";
  children: React.ReactNode;
};

export default function ProtectedRoute({ role, children }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    const savedRole = sessionStorage.getItem("role");

    if (!user || savedRole !== role) {
      router.replace(`/login?role=${role}`);
      return;
    }

    setLoading(false);
  }, [role, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}