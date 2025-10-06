"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const RoleContext = createContext({ role: "student", setRole: () => {} });

const ROLE_STORAGE_KEY = "quizgen.currentRole";

export function RoleProvider({ children }) {
  const [role, setRole] = useState("student");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ROLE_STORAGE_KEY);
      if (saved) setRole(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
    } catch {}
  }, [role]);

  const value = useMemo(() => ({ role, setRole }), [role]);
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}

export const ROLES = ["student", "teacher", "admin"];
