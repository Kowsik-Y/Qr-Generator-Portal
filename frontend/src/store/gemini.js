import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

const config = {
  responseMimeType: "application/json",
  responseSchema: {
    type: "array",
    items: {
      type: "object",
      properties: {
        questionNumber: { type: "number" },
        questionText: { type: "string" },
        explanation: { type: "string" },
        choices: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              text: { type: "string" },
            },
            propertyOrdering: ["id", "text"],
          },
        },
        answer: { type: "integer" },
        difficulty: {
          type: "string",
          enum: ["easy", "medium", "hard"],
        },
      },
      propertyOrdering: ["questionNumber", "questionText", "explanation", "difficulty"],
    },
  },
};

/**
 * Retry helper with exponential backoff
 * @param {function} fn - Function that returns a Promise
 * @param {number} retries - Max retries
 * @param {number} delay - Initial delay in ms
 */
async function retryWithBackoff(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0 && err?.error?.status === "UNAVAILABLE") {
      console.warn(
        `Gemini overloaded. Retrying in ${delay}ms... (${retries} attempts left)`,
      );
      await new Promise((res) => setTimeout(res, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw err;
  }
}

/**
 * Low-level function to fetch structured content from Gemini
 * @param {string} prompt - The prompt to send to the model
 * @returns {Promise<Array>} Parsed JSON array of questions
 */
export async function fetchContent(prompt) {
  const response = await retryWithBackoff(() =>
    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config,
    }),
  );

  const text = response.text;
  if (!text) {
    throw new Error("No text was returned from generateContent");
  }

  let jsonStr = text.trim();
  const fenceRegex = /^```(?:json)?\s*\n([\s\S]*?)\n```$/i;
  const match = jsonStr.match(fenceRegex);
  if (match?.[1]) {
    jsonStr = match[1].trim();
  }

  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Failed to parse JSON from response.text:", text, err);
    throw new Error("Invalid JSON returned from Gemini");
  }
}

/**
 * React-friendly function to generate questions
 * @param {Object} params
 * @param {string} params.topic - The topic/paragraph to generate questions for
 * @param {number} params.number - Number of questions to generate
 * @param {string} params.type - The type of input ("topic" or "paragraph")
 * @param {function} params.setStatusMessage - Callback to set status message
 * @param {function} params.setQuestions - Callback to set questions state (JSON)
 * @param {function} params.setLoading - Callback to set loading state
 * @param {function} params.setQuestionsVisible - Callback to show/hide questions
 */
export async function generateQuestion({
  topic,
  number,
  type,
  setStatusMessage,
  setQuestions,
  setLoading,
  setQuestionsVisible,
}) {
  if (
    !topic ||
    topic.trim() === "" ||
    type.trim() === "" ||
    number === null ||
    number === undefined ||
    Number.isNaN(number) ||
    number < 1 ||
    !Number.isInteger(number)
  ) {
    setStatusMessage("Please, Enter a Valid Input.");
    setLoading(false);
    setQuestionsVisible(false);
    return;
  }

  setStatusMessage("");
  setQuestionsVisible(false);
  setQuestions([]);
  setLoading(true);

  try {
  const questionsPrompt = `Based on the following ${type}, generate exactly ${number} multiple-choice questions with:
 - A numbered question (questionNumber)
 - Clear question text (questionText)
 - 4-5 choices each as {id, text}
 - An integer 'answer' matching the correct choice id
 - A difficulty of 'easy' | 'medium' | 'hard' (30% easy, 50% medium, 20% hard)
 - An explanation string explaining the correct answer

Return strict JSON matching the provided schema, not markdown or code fences.

${type}:
"${topic}"`;

    const questions = await fetchContent(questionsPrompt);
    setQuestions(questions);
    setQuestionsVisible(true);
  } catch (error) {
    console.error("Failed to generate content:", error);
    setStatusMessage(
      error?.error?.status === "UNAVAILABLE"
        ? "The AI is busy right now. Please try again in a moment."
        : "An error occurred. Please try again later.",
    );
    setQuestionsVisible(false);
  } finally {
    setLoading(false);
  }
}
