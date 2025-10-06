"use client";
import { Button, Input, Tab, Tabs } from "@heroui/react";
import { useEffect, useState } from "react";
import { generateQuestion } from "../store/gemini";
import { getQuiz, saveQuiz } from "../store/quizStore";
import { useRole } from "../store/roleContext";
import { AuthStatus } from "./authStatus";
import { OutputQuestion } from "./questionOutput";
import { QuizList } from "./quizList";
import { RoleSwitcher } from "./roleSwitcher";
import { TakeQuiz } from "./takeQuiz";
import { UserInputSide } from "./userInput";
import { ValidateAttempts } from "./validateAttempts";

export function Dashboard({
  showGenerate: showGenerateProp,
  showValidate: showValidateProp,
  initialTab,
}) {
  const { role } = useRole();
  const [statusMessage, setStatusMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionsVisible, setQuestionsVisible] = useState(false);
  const [topic, setTopic] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [selectedQuizTitle, setSelectedQuizTitle] = useState("");
  const [activeTab, setActiveTab] = useState(initialTab ?? "generate");

  const onSubmit = async (inputType, inputNumber, inputText) => {
    setTopic(inputText);
    await generateQuestion({
      topic: inputText,
      number: inputNumber,
      type: inputType,
      setStatusMessage,
      setQuestions,
      setLoading,
      setQuestionsVisible,
    });
  };

  const canManage = role === "teacher" || role === "admin";
  const isStudent = role === "student";
  // Determine which tabs to show: default is based on role, overridden by props if provided
  const showGenerate = showGenerateProp ?? !isStudent; // hide generate for students by default
  const showValidate = showValidateProp ?? canManage; // validate only for teachers/admins by default

  useEffect(() => {
    if (!selectedQuizId) {
      setSelectedQuizTitle("");
      return;
    }
    (async () => {
      const q = await getQuiz(selectedQuizId);
      setSelectedQuizTitle(q?.title || "");
    })();
  }, [selectedQuizId]);

  // Keep active tab valid when visibility changes
  useEffect(() => {
    const visibleTabs = [
      showGenerate ? "generate" : null,
      "quizzes",
      showValidate ? "validate" : null,
    ].filter(Boolean);
    const desired = initialTab ?? activeTab;
    if (!visibleTabs.includes(desired)) {
      setActiveTab(visibleTabs[0]);
    } else if (desired !== activeTab) {
      setActiveTab(desired);
    }
  }, [showGenerate, showValidate, activeTab, initialTab]);

  const handleSaveQuiz = async () => {
    if (!questions?.length) return;
    const saved = await saveQuiz({
      title: quizTitle || topic?.slice(0, 40) || "Generated Quiz",
      questions,
    });
    setSelectedQuizId(saved.id);
    setActiveTab("quizzes");
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quiz Generator</h1>
        <div className="flex items-center gap-3">
          <AuthStatus />
          <RoleSwitcher />
        </div>
      </div>

      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(k) => setActiveTab(String(k))}
        className="mt-4"
      >
        {showGenerate && (
          <Tab key="generate" title="Generate">
            <div className="grid grid-cols-2 gap-4">
              <UserInputSide
                onSubmit={onSubmit}
                loading={loading}
                statusMessage={statusMessage}
              />
              <div>
                <OutputQuestion
                  questions={questions}
                  visible={questionsVisible}
                  loading={loading}
                />
                {canManage && !!questions?.length && (
                  <div className="mt-3 flex items-center gap-2">
                    <Input
                      size="sm"
                      label="Quiz title"
                      value={quizTitle}
                      onValueChange={setQuizTitle}
                    />
                    <Button color="primary" onPress={handleSaveQuiz}>
                      Save Quiz
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Tab>
        )}
        <Tab key="quizzes" title="Quizzes">
          <QuizList
            onOpen={(id) => setSelectedQuizId(id)}
            canManage={canManage}
          />
          {selectedQuizId && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">
                Selected quiz: {selectedQuizTitle || ""}
              </h3>
              {isStudent ? (
                <TakeQuiz
                  quizId={selectedQuizId}
                  onDone={() => setActiveTab("validate")}
                />
              ) : (
                <p className="text-gray-500">
                  Open this quiz as a Student to take it.
                </p>
              )}
            </div>
          )}
        </Tab>
        {showValidate && (
          <Tab key="validate" title="Validate">
            {canManage ? (
              selectedQuizId ? (
                <ValidateAttempts quizId={selectedQuizId} />
              ) : (
                <p className="text-gray-500">
                  Open a quiz from the Quizzes tab to validate attempts.
                </p>
              )
            ) : (
              <p className="text-gray-500">
                Only teachers/admins can validate attempts.
              </p>
            )}
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
