"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Dashboard } from "../components/dashboard";

const USER_STORAGE_KEY = "quizgen.currentUser";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    try {
      const u = localStorage.getItem(USER_STORAGE_KEY);
      if (!u) router.replace("/login");
    } catch {}
  }, [router]);
  return <Dashboard />;
}
