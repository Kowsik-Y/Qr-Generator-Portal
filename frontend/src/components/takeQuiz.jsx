"use client";
import { Button, Card, CardBody, Radio, RadioGroup } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import {
  countUserAttemptsForQuiz,
  getAttemptLimit,
  getQuiz,
  gradeAttempt,
  saveAttempt,
} from "../store/quizStore";

export function TakeQuiz({ quizId, onDone }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [attemptsLeft, setAttemptsLeft] = useState(null);
  useEffect(() => {
    (async () => setQuiz(await getQuiz(quizId)))();
  }, [quizId]);

  // Start timer if quiz.timeLimitSec is provided
  useEffect(() => {
    if (!quiz?.timeLimitSec) return;
    setTimeLeft(quiz.timeLimitSec);
  }, [quiz]);

  // Attempt limits: compute remaining attempts from client-side limits
  useEffect(() => {
    if (!quiz) return;
    const limit = Number(quiz.attemptLimit) || getAttemptLimit(quiz.id);
    if (!limit) {
      setAttemptsLeft(null); // unlimited
      return;
    }
    const used = countUserAttemptsForQuiz(quiz.id);
    setAttemptsLeft(Math.max(0, limit - used));
  }, [quiz]);

  const handleSubmit = useCallback(async () => {
    if (!quiz) return;
    // Enforce attempt limit (client-side)
  const limit = Number(quiz.attemptLimit) || getAttemptLimit(quiz.id);
    if (limit) {
      const used = countUserAttemptsForQuiz(quiz.id);
      if (used >= limit) {
        alert("Attempt limit reached for this quiz.");
        return;
      }
    }
    const result = gradeAttempt(quiz, answers);
    const attempt = await saveAttempt({ quizId, answers, result });
    setSubmitted(true);
    onDone?.(attempt.id);
  }, [quiz, answers, quizId, onDone]);

  useEffect(() => {
    if (timeLeft === null || submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => (s === null ? s : s - 1)), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, submitted, handleSubmit]);


  if (!quiz) return <p className="text-gray-500">Quiz not found.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{quiz.title || "Quiz"}</h2>
      {Array.isArray(quiz.questions) && quiz.questions.length > 0 ? (
        quiz.questions.map((q) => (
          <Card key={q.questionNumber}>
            <CardBody>
              <p className="font-medium mb-2">
                {q.questionNumber}. {q.questionText}
              </p>
              {!submitted && (
                <RadioGroup
                  value={answers[q.questionNumber] ?? null}
                  onValueChange={(val) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [q.questionNumber]: Number(val),
                    }))
                  }
                >
                  {Array.isArray(q.choices) ? (
                    q.choices.map((c) => (
                      <Radio key={c.id} value={String(c.id)}>
                        {c.text}
                      </Radio>
                    ))
                  ) : (
                    <p className="text-gray-500">No choices.</p>
                  )}
                </RadioGroup>
              )}

              {submitted && (
                <div className="mt-2 text-sm">
                  <p>
                    Your answer: {answers[q.questionNumber] ?? "-"} | Correct: {q.answer}
                  </p>
                  {q.explanation && (
                    <p className="text-gray-600 mt-1">Explanation: {q.explanation}</p>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">No questions found in this quiz.</p>
      )}
      {!submitted && (
        <div className="flex items-center gap-3">
          {typeof timeLeft === "number" && (
            <span className="text-sm text-gray-600">Time left: {timeLeft}s</span>
          )}
          {typeof attemptsLeft === "number" && (
            <span className="text-sm text-gray-600">
              Attempts left: {attemptsLeft}
            </span>
          )}
          <Button color="primary" onPress={handleSubmit}>
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}
