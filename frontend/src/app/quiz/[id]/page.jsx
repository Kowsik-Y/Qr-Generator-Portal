"use client";
import { Button, Card, CardBody, Radio, RadioGroup } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getQuiz,
  gradeAttempt,
  saveAttempt,
} from "../../../components/../store/quizStore";
import { useRole } from "../../../components/../store/roleContext";

const USER_STORAGE_KEY = "quizgen.currentUser";

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const { role } = useRole();
  const isStudent = role === "student";
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    try {
      const u = localStorage.getItem(USER_STORAGE_KEY);
      if (!u) return router.replace("/login");
    } catch {}
  }, [router]);

  useEffect(() => {
    (async () => {
      const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
      if (!id) return;
      const q = await getQuiz(String(id));
      setQuiz(q || null);
    })();
  }, [params]);

  const submit = async () => {
    if (!quiz) return;
    const result = gradeAttempt(quiz, answers);
    await saveAttempt({ quizId: quiz.id, answers, result });
    router.replace("/validate");
  };

  if (!quiz) return <p className="p-4 text-gray-500">Quiz not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">{quiz.title || "Quiz"}</h1>
      {Array.isArray(quiz.questions) && quiz.questions.length > 0 ? (
        quiz.questions.map((q) => (
          <Card key={q.questionNumber}>
            <CardBody>
              <p className="font-medium mb-2">
                {q.questionNumber}. {q.questionText}
              </p>
              {isStudent ? (
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
              ) : (
                <div>
                  <p className="text-sm text-gray-600">Preview (manager)</p>
                  <ul className="list-disc list-inside">
                    {Array.isArray(q.choices) ? (
                      q.choices.map((c) => (
                        <li key={c.id}>
                          {String.fromCharCode(96 + c.id)}) {c.text}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No choices</li>
                    )}
                  </ul>
                  <p className="mt-2 text-green-700">Answer: {q.answer}</p>
                </div>
              )}
            </CardBody>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">No questions.</p>
      )}
      {isStudent && (
        <Button color="primary" onPress={submit}>
          Submit
        </Button>
      )}
    </div>
  );
}
