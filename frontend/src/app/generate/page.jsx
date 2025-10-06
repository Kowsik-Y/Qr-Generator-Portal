"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRole } from "../../components/../store/roleContext";
import { Dashboard } from "../../components/dashboard";

const USER_STORAGE_KEY = "quizgen.currentUser";

export default function GeneratePage() {
  const router = useRouter();
  const { role } = useRole();
  const canManage = role === "teacher" || role === "admin";

  useEffect(() => {
    try {
      const u = localStorage.getItem(USER_STORAGE_KEY);
      if (!u) return router.replace("/login");
      if (!canManage) return router.replace("/");
    } catch {}
  }, [router, canManage]);

  return <Dashboard initialTab="generate" />;
}
