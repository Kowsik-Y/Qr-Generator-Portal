# AI Question Generation Feature

## Overview
The view-questions page now includes an AI-powered question generation feature using Google's Gemini LLM API. This allows teachers and admins to quickly generate high-quality questions based on a simple prompt.

## Features

### ✨ AI Question Generation
- Generate multiple questions at once (1-20+)
- Support for three question types:
  - **MCQ** - Multiple Choice Questions with 4 options
  - **Theory** - Descriptive questions with model answers
  - **Coding** - Programming questions with sample solutions

### 📝 Smart Question Preview
- Preview all generated questions before adding
- Select/deselect individual questions
- See complete question details including:
  - Question text
  - Question type badge
  - Points/marks
  - Options (for MCQ)
  - Correct answers highlighted
  - Model answers (for Theory/Coding)

### 🎯 Selective Addition
- Choose which questions to add to your test
- Add multiple questions at once
- Regenerate if not satisfied with results

## Setup

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment

Create a `.env` file in the `native` directory:

```bash
cd native
cp .env.example .env
```

Edit `.env` and add your API key:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Alternative Configuration

If you don't want to use environment variables, you can directly edit `native/lib/config.ts`:

```typescript
export const GEMINI_API_KEY = 'your_actual_api_key_here';
```

⚠️ **Warning**: Don't commit your actual API key to version control!

## Usage

### For Teachers/Admins

1. **Navigate to View Questions Page**
   - Go to any test
   - Click "View Questions"

2. **Open AI Generator**
   - Click the purple "AI Generate" button in the header

3. **Configure Generation**
   - **Topic/Prompt**: Enter the topic or specific instructions
     - Example: "JavaScript arrays and methods"
     - Example: "Python loops and iterations with examples"
     - Example: "Data structures: stacks and queues"
   
   - **Question Type**: Select MCQ, Theory, or Coding
   
   - **Number of Questions**: Enter how many questions to generate (1-20)

4. **Generate Questions**
   - Click "Generate Questions"
   - Wait for AI to generate (usually 5-15 seconds)

5. **Review & Select**
   - Preview all generated questions
   - Questions are pre-selected by default
   - Tap any question to toggle selection
   - Review options and answers

6. **Add to Test**
   - Click "Add X Selected" button
   - Selected questions will be added to your test
   - You can generate new questions if needed

## UI Components

### Header Section
```
┌─────────────────────────────────────────┐
│ ← Questions                    [AI] [+] │
│   Test Name                              │
└─────────────────────────────────────────┘
```

### AI Generation Modal

#### Step 1: Configuration
```
┌─────────────────────────────────────────┐
│ 🪄 AI Question Generator            [X] │
│ Generate questions using AI              │
├─────────────────────────────────────────┤
│                                          │
│ Topic / Prompt                           │
│ ┌─────────────────────────────────────┐ │
│ │ JavaScript arrays and methods...    │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ Question Type                            │
│ [MCQ] [THEORY] [CODING]                  │
│                                          │
│ Number of Questions                      │
│ [5]                                      │
│                                          │
│ [ ✨ Generate Questions ]                │
└─────────────────────────────────────────┘
```

#### Step 2: Review & Select
```
┌─────────────────────────────────────────┐
│ 🪄 AI Question Generator            [X] │
├─────────────────────────────────────────┤
│ ✨ 5 questions generated! Select ones   │
│    you want to add.                      │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ [1] MCQ 10pts              [✓]      │ │
│ │ What is array.map() used for?       │ │
│ │ A. Delete elements                  │ │
│ │ B. Transform elements ✓             │ │
│ │ C. Sort elements                    │ │
│ │ D. Find elements                    │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ [Generate New]  [Add 3 Selected]         │
└─────────────────────────────────────────┘
```

## Example Prompts

### Good Prompts
✅ "JavaScript ES6 features: arrow functions, destructuring, and spread operator"
✅ "Python list comprehensions with filtering and mapping examples"
✅ "Database normalization up to 3NF with practical examples"
✅ "React hooks: useState and useEffect with real-world scenarios"
✅ "Binary search tree operations: insertion, deletion, and traversal"

### Specific Prompts for Better Results
✅ "Generate MCQ questions about HTTP methods (GET, POST, PUT, DELETE) with real API examples"
✅ "Create theory questions about OOP principles (encapsulation, inheritance, polymorphism) with Java examples"
✅ "Generate coding questions about string manipulation in Python with test cases"

### Avoid
❌ Too vague: "Programming"
❌ Too broad: "Everything about JavaScript"
❌ Single word: "Arrays"

## API Configuration

### Gemini API Settings
Located in `native/lib/config.ts`:

```typescript
export const geminiConfig = {
  temperature: 0.7,      // Creativity level (0.0 - 1.0)
  maxOutputTokens: 2048, // Maximum response length
  topP: 0.95,           // Nucleus sampling
  topK: 40,             // Top-k sampling
};
```

### Customization
You can adjust these parameters for different results:
- **Higher temperature** (0.8-0.9): More creative/varied questions
- **Lower temperature** (0.3-0.5): More focused/consistent questions
- **More tokens**: Longer, more detailed questions

## Troubleshooting

### "Failed to generate questions"
1. Check your API key is correct
2. Verify your internet connection
3. Check Gemini API quota/limits
4. Try a simpler prompt

### "Invalid response from AI"
1. The AI might have returned non-JSON format
2. Try regenerating with a clearer prompt
3. Check console logs for details

### Questions not matching prompt
1. Make your prompt more specific
2. Include examples in your prompt
3. Specify difficulty level or context

### API Key Issues
1. Ensure `.env` file exists in native directory
2. Restart Expo development server after adding API key
3. Check for typos in environment variable name
4. Try setting key directly in `config.ts` for testing

## Best Practices

### 1. Prompt Engineering
- Be specific about the topic
- Include difficulty level if needed
- Mention any specific concepts to cover
- Add context (e.g., "for beginners", "advanced concepts")

### 2. Review Generated Questions
- Always review questions before adding
- Check for accuracy and clarity
- Verify correct answers
- Ensure difficulty matches your test

### 3. Batch Generation
- Generate 5-10 questions at a time
- Review and select the best ones
- Regenerate if needed rather than accepting all

### 4. Mix Question Types
- Use MCQ for quick knowledge checks
- Use Theory for deeper understanding
- Use Coding for practical skills

## Technical Details

### Architecture
```
View Questions Page
    ↓
AI Generate Button
    ↓
Modal Opens
    ↓
User Enters Prompt
    ↓
generateQuestionsWithGemini()
    ↓
Gemini API Call
    ↓
Parse JSON Response
    ↓
Display in Modal
    ↓
User Selects Questions
    ↓
Add to Test via questionAPI
```

### Data Flow
```typescript
// Generated question format
interface GeneratedQuestion {
  question_text: string;
  question_type: 'mcq' | 'coding' | 'theory';
  options?: string[];
  correct_answer?: string;
  points: number;
  selected?: boolean;
}
```

## Future Enhancements

- [ ] Difficulty level selection
- [ ] Custom points per question
- [ ] Language/framework specification
- [ ] Question templates
- [ ] Bulk edit before adding
- [ ] Save favorite prompts
- [ ] AI-powered question improvement
- [ ] Multi-language support

## Security Notes

1. **API Key Protection**
   - Never commit `.env` file to git
   - Use environment variables
   - Rotate keys periodically

2. **Rate Limiting**
   - Gemini has free tier limits
   - Implement retry logic
   - Consider caching results

3. **Content Validation**
   - Always review AI-generated content
   - Verify accuracy before using in tests
   - Edit questions as needed

## Support

For issues or questions:
1. Check console logs for errors
2. Verify API key configuration
3. Test with simple prompts first
4. Check Gemini API status

## License

This feature uses Google's Gemini API. Please review [Google's Terms of Service](https://ai.google.dev/terms).
