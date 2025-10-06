"use client";
import { Card, CardBody } from "@heroui/react";
import { useEffect, useState } from "react";
import { getQuiz, listAttemptsForQuiz } from "../store/quizStore";

export function ValidateAttempts({ quizId }) {
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  useEffect(() => {
    (async () => {
      setQuiz(await getQuiz(quizId));
      setAttempts(await listAttemptsForQuiz(quizId));
    })();
  }, [quizId]);

  if (!quiz) return <p className="text-gray-500">Quiz not found.</p>;
  if (!Array.isArray(attempts) || attempts.length === 0)
    return <p className="text-gray-500">No attempts yet.</p>;

  return (
    <div className="space-y-3">
      {attempts.map((a) => (
        <Card key={a.id}>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Attempt {a.id}</p>
                <p className="text-xs text-gray-500">
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="text-sm">
                Score: {a.result.correct}/{a.result.total}
              </div>
            </div>
            <div className="mt-2 space-y-1">
              {Array.isArray(a?.result?.details) ? (
                a.result.details.map((d) => (
                  <div
                    key={d.qn}
                    className={d.isCorrect ? "text-green-700" : "text-red-700"}
                  >
                    Q{d.qn}:{" "}
                    {d.isCorrect
                      ? "Correct"
                      : `Wrong (correct: ${d.correctAnswer}, yours: ${d.given ?? "-"})`}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No per-question details.</p>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
