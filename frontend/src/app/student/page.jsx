"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRole } from "../../components/../store/roleContext";
import { Dashboard } from "../../components/dashboard";

const USER_STORAGE_KEY = "quizgen.currentUser";

export default function StudentPage() {
  const router = useRouter();
  const { role, setRole } = useRole();
  useEffect(() => {
    try {
      const u = localStorage.getItem(USER_STORAGE_KEY);
      if (!u) router.replace("/login");
    } catch {}
  }, [router]);
  // Force student role on this route
  useEffect(() => {
    if (role !== "student") setRole("student");
  }, [role, setRole]);
  return <Dashboard />;
}
