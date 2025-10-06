"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/?$/, "");
const TOKEN_KEY = "quizgen.authToken";

function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

function isEnabled() {
  return typeof window !== "undefined" && !!API_BASE;
}

async function http(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

export const api = {
  isEnabled,
  async listQuizzes() {
    return http("/quizzes");
  },
  async getQuiz(id) {
    return http(`/quizzes/${encodeURIComponent(id)}`);
  },
  async saveQuiz(quiz) {
    return http("/quizzes", { method: "POST", body: JSON.stringify(quiz) });
  },
  async removeQuiz(id) {
    return http(`/quizzes/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
  async listAttemptsForQuiz(quizId) {
    return http(`/attempts/${encodeURIComponent(quizId)}`);
  },
  async saveAttempt({ quizId, answers }) {
    // Attach current user if provided via options.body or localStorage
    const user = (() => {
      try {
        return localStorage.getItem("quizgen.currentUser") || "";
      } catch {
        return "";
      }
    })();
    return http("/attempts", {
      method: "POST",
      body: JSON.stringify({ quizId, answers, user }),
    });
  },
};
