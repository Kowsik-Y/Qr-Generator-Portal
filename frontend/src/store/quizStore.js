"use client";
import { api } from "./apiClient";

const QUIZ_STORAGE_KEY = "quizgen.quizzes.v1";
const ATTEMPT_STORAGE_KEY = "quizgen.attempts.v1";
const ATTEMPT_LIMITS_KEY = "quizgen.attemptLimits.v1"; // { [quizId]: number }
const USER_STORAGE_KEY = "quizgen.currentUser";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export async function listQuizzes() {
  if (api.isEnabled()) return api.listQuizzes();
  return read(QUIZ_STORAGE_KEY, []);
}

export async function saveQuiz(quiz) {
  if (api.isEnabled()) return api.saveQuiz(quiz);
  const quizzes = await listQuizzes();
  const id = quiz.id ?? `q_${Date.now()}`;
  const next = { ...quiz, id, createdAt: quiz.createdAt ?? Date.now() };
  const idx = quizzes.findIndex((q) => q.id === id);
  if (idx >= 0) quizzes[idx] = next;
  else quizzes.push(next);
  write(QUIZ_STORAGE_KEY, quizzes);
  return next;
}

export async function getQuiz(id) {
  if (api.isEnabled()) return api.getQuiz(id);
  const quizzes = await listQuizzes();
  return quizzes.find((q) => q.id === id) || null;
}

export async function removeQuiz(id) {
  if (api.isEnabled()) return api.removeQuiz(id);
  const quizzes = (await listQuizzes()).filter((q) => q.id !== id);
  write(QUIZ_STORAGE_KEY, quizzes);
}

export function listAttempts() {
  return read(ATTEMPT_STORAGE_KEY, []);
}

export async function saveAttempt(attempt) {
  if (api.isEnabled()) return api.saveAttempt(attempt);
  const attempts = listAttempts();
  const id = attempt.id ?? `a_${Date.now()}`;
  const user = (() => {
    try {
      return localStorage.getItem(USER_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  })();
  const next = { ...attempt, id, user, createdAt: attempt.createdAt ?? Date.now() };
  const idx = attempts.findIndex((a) => a.id === id);
  if (idx >= 0) attempts[idx] = next;
  else attempts.push(next);
  write(ATTEMPT_STORAGE_KEY, attempts);
  return next;
}

export async function listAttemptsForQuiz(quizId) {
  if (api.isEnabled()) return api.listAttemptsForQuiz(quizId);
  return listAttempts().filter((a) => a.quizId === quizId);
}

export function gradeAttempt(quiz, answers) {
  // quiz.questions: [{questionNumber, questionText, choices:[{id, text}], answer}]
  const qs = Array.isArray(quiz?.questions) ? quiz.questions : [];
  let correct = 0;
  const details = qs.map((q) => {
    const given = answers?.[q.questionNumber];
    const isCorrect = Number(given) === Number(q.answer);
    if (isCorrect) correct += 1;
    return { qn: q.questionNumber, correctAnswer: q.answer, given, isCorrect };
  });
  return { correct, total: qs.length, details };
}

// Attempt limits helpers (client-side fallback)
export function getAttemptLimit(quizId) {
  const limits = read(ATTEMPT_LIMITS_KEY, {});
  return Number(limits?.[quizId]) || 0;
}

export function setAttemptLimit(quizId, limit) {
  const limits = read(ATTEMPT_LIMITS_KEY, {});
  limits[quizId] = Number(limit) || 0;
  write(ATTEMPT_LIMITS_KEY, limits);
}

export function countUserAttemptsForQuiz(quizId) {
  const user = (() => {
    try {
      return localStorage.getItem(USER_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  })();
  if (!user) return 0;
  return listAttempts().filter((a) => a.quizId === quizId && a.user === user).length;
}
