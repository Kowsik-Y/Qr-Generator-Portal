import { MarkdownRender } from "./markdownRender";
import { SkeletonQuestions } from "./skeletonQuestions";

export const OutputQuestion = ({ questions, visible, loading }) => {
  return (
    <div className="bg-white pt-8 px-8 border-l border-gray-300 overflow-y-auto h-screen">
      {!visible && (
        <div className="flex items-center justify-center h-full">
          {loading ? (
            <div className="w-full p-4 h-full space-y-10">
              <SkeletonQuestions />
              <SkeletonQuestions />
              <SkeletonQuestions />
              <SkeletonQuestions />
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              Generated questions will appear here.
              <br />
              <strong>Note: </strong>The questions will be generated based on
              the input provided on the left side.
            </p>
          )}
        </div>
      )}

      {!loading && visible && (
        <div className="h-full">
          {questions && questions.length > 0 ? (
            <ul className="space-y-4 pb-15">
              {questions.map((q) => (
                <li
                  key={q.questionNumber}
                  className="p-4 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <p className="font-medium text-gray-800">
                    {q.questionNumber}.{" "}
                  </p>
                  <MarkdownRender>{q.questionText}</MarkdownRender>

                  <span className="text-sm text-gray-500 italic">
                    Difficulty: {q.difficulty}
                  </span>
                  <div className="mt-2">
                    <p className="font-medium text-gray-800">Choices:</p>
                    {Array.isArray(q.choices) && q.choices.length > 0 ? (
                      <ul className="list-disc list-inside flex flex-col space-y-1">
                        {q.choices.map((choice) => (
                          <li
                            key={choice.id}
                            className="text-gray-700 list-none inline-flex space-x-2"
                          >
                            <span className="font-semibold">
                              {String.fromCharCode(96 + choice.id)}
                              {") "}
                            </span>
                            <MarkdownRender>{choice.text}</MarkdownRender>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No choices available.</p>
                    )}
                  </div>
                  <p className="mt-2 text-green-600">Answer: {q.answer}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">
              No questions generated yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
