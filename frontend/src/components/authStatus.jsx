"use client";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRole } from "../store/roleContext";

const USER_STORAGE_KEY = "quizgen.currentUser";

export function AuthStatus() {
  const router = useRouter();
  const { role, setRole } = useRole();
  const [user, setUser] = useState("");

  useEffect(() => {
    try {
      const u = localStorage.getItem(USER_STORAGE_KEY);
      if (u) setUser(u);
    } catch {}
  }, []);

  const logout = () => {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {}
    setRole("student");
    router.replace("/login");
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">
        {user} ({role})
      </span>
      <Button size="sm" variant="flat" color="default" onPress={logout}>
        Logout
      </Button>
    </div>
  );
}
