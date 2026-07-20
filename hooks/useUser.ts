"use client";

import { useEffect, useState } from "react";

type User = {
  id?: string;
  name?: string;
  admin_name?: string;
  teacher_name?: string;
  student_name?: string;
  email?: string;
  role?: "admin" | "teacher" | "student";
};

export default function useUser() {

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const session =
      sessionStorage.getItem("user");

    if (!session) {

      setLoading(false);

      return;

    }

    try {

      const data =
        JSON.parse(session);

      setUser(data);

    } catch {

      sessionStorage.removeItem("user");

    }

    setLoading(false);

  }, []);

  const userName =
    user?.admin_name ||
    user?.teacher_name ||
    user?.student_name ||
    user?.name ||
    "User";

  const role =
    user?.role || "";

  return {

    user,

    userName,

    role,

    loading,

  };

}