"use client";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ROLES, useRole } from "../../components/../store/roleContext";
import { api } from "../../store/apiClient";

const USER_STORAGE_KEY = "quizgen.currentUser";
const TOKEN_KEY = "quizgen.authToken";

export default function LoginPage() {
  const router = useRouter();
  const { role, setRole } = useRole();
  const [username, setUsername] = useState("");

  useEffect(() => {
    // If already logged in, redirect appropriately
    try {
      const u = localStorage.getItem(USER_STORAGE_KEY);
      if (u) {
        if (role === "student") router.replace("/student");
        else router.replace("/");
      }
    } catch {}
  }, [role, router]);

  const onSubmit = async () => {
    if (!username.trim()) return;
    try {
      localStorage.setItem(USER_STORAGE_KEY, username.trim());
      // get API token if API mode enabled
      if (api.isEnabled()) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/?$/, "")}/auth/login`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ username: username.trim() }),
          },
        );
        if (res.ok) {
          const data = await res.json();
          try {
            localStorage.setItem(TOKEN_KEY, data?.token || "");
          } catch {}
        }
      }
    } catch {}
    // Redirect by role
    if (role === "student") router.replace("/student");
    else router.replace("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardBody className="space-y-4">
          <h1 className="text-xl font-semibold">Login</h1>

          <Input
            label="Username"
            value={username}
            onValueChange={setUsername}
            placeholder="Enter your name"
          />

          <Select
            label="Role"
            selectedKeys={[role]}
            onSelectionChange={(keys) => {
              const k = Array.from(keys)[0];
              if (typeof k === "string") setRole(k);
            }}
          >
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </Select>

          <Button color="primary" onPress={onSubmit}>
            Continue
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
