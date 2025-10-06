"use client";
import { Button, Card, CardBody, Input } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { listQuizzes, removeQuiz, saveQuiz } from "../store/quizStore";

export function QuizList({ onOpen, canManage }) {
  const [quizzes, setQuizzes] = useState([]);
  const [query, setQuery] = useState("");
  const refresh = useCallback(async () => setQuizzes(await listQuizzes()), []);
  useEffect(() => {
    refresh();
  }, [refresh]);

  const importQuiz = async () => {
    try {
      const json = prompt("Paste quiz JSON");
      if (!json) return;
      const data = JSON.parse(json);
      const saved = await saveQuiz({
        title: data.title || "Imported Quiz",
        questions: Array.isArray(data.questions) ? data.questions : [],
      });
      await refresh();
      onOpen?.(saved.id);
    } catch {
      alert("Invalid quiz JSON");
    }
  };

  const handleRemove = async (id) => {
    await removeQuiz(id);
    await refresh();
  };

  const filtered = quizzes.filter((q) =>
    (q.title || "").toLowerCase().includes(query.toLowerCase())
  );

  if (!filtered.length)
    return <p className="text-gray-500">No saved quizzes.</p>;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {canManage && (
          <Button size="sm" variant="flat" onPress={importQuiz}>
            Import Quiz
          </Button>
        )}
        <Input
          size="sm"
          placeholder="Search quizzes..."
          value={query}
          onValueChange={setQuery}
          className="max-w-xs"
        />
      </div>
      {filtered.map((q) => (
        <Card key={q.id}>
          <CardBody className="flex items-center justify-between">
            <div>
              <p className="font-medium">{q.title || "Untitled Quiz"}</p>
              <p className="text-xs text-gray-500">
                {new Date(q.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onPress={() => onOpen(q.id)}>
                Open
              </Button>
              <Button
                size="sm"
                variant="flat"
                onPress={() =>
                  navigator.clipboard.writeText(
                    `${location.origin}/quiz/${q.id}`,
                  )
                }
              >
                Copy Link
              </Button>
              <Button
                size="sm"
                variant="flat"
                onPress={() => {
                  const blob = new Blob([JSON.stringify(q, null, 2)], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${q.title || "quiz"}.json`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                }}
              >
                Export
              </Button>
              {canManage && (
                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  onPress={() => handleRemove(q.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
