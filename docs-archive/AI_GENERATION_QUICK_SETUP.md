# Quick Setup Guide - AI Question Generation

## ⚡ 5-Minute Setup

### Step 1: Get Gemini API Key (2 minutes)

1. Go to **[Google AI Studio](https://makersuite.google.com/app/apikey)**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the API key (starts with `AIza...`)

### Step 2: Configure Project (2 minutes)

#### Option A: Using Environment Variables (Recommended)

1. Navigate to the native directory:
```bash
cd native
```

2. Create `.env` file from example:
```bash
cp .env.example .env
```

3. Edit `.env` and add your key:
```env
EXPO_PUBLIC_GEMINI_API_KEY=AIza...your_actual_key_here
```

4. Restart Expo dev server:
```bash
# Stop current server (Ctrl+C)
npx expo start --clear
```

#### Option B: Direct Configuration (Quick Test)

1. Open `native/lib/config.ts`
2. Replace the line:
```typescript
export const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
```

With:
```typescript
export const GEMINI_API_KEY = 'AIza...your_actual_key_here';
```

3. Save and refresh your app

⚠️ **Warning**: Don't commit this file with your actual API key!

### Step 3: Test It (1 minute)

1. Open your app
2. Navigate to any test → **View Questions**
3. Click the purple **"AI Generate"** button
4. Enter a prompt: `"JavaScript arrays"`
5. Click **"Generate Questions"**
6. Wait 5-10 seconds
7. See your AI-generated questions! ✨

---

## 🚀 Quick Start Commands

```bash
# Clone/Pull latest changes
git pull

# Navigate to native directory
cd native

# Install dependencies (if needed)
npm install

# Create environment file
cp .env.example .env

# Edit .env file (add your API key)
# On Windows:
notepad .env
# On Mac/Linux:
nano .env

# Start Expo dev server
npx expo start --clear
```

---

## 🎯 First Test

### Try this prompt:
```
Generate MCQ questions about JavaScript array methods like map, filter, and reduce
```

### Expected Result:
- 5 questions generated
- All selected by default
- Preview with options
- Correct answers highlighted
- Ready to add to your test

---

## ✅ Verification Checklist

- [ ] API key obtained from Google AI Studio
- [ ] `.env` file created in `native` directory
- [ ] API key added to `.env` file
- [ ] Expo dev server restarted
- [ ] App opened and logged in
- [ ] "AI Generate" button visible in View Questions
- [ ] Test generation works with sample prompt
- [ ] Questions can be added to test

---

## 🔧 Troubleshooting

### "Failed to generate questions"

**Solution 1**: Check API Key
```bash
# Print your .env file (first few characters)
# On Windows:
type .env
# On Mac/Linux:
cat .env
```
Make sure it shows: `EXPO_PUBLIC_GEMINI_API_KEY=AIza...`

**Solution 2**: Restart Server
```bash
# Stop server (Ctrl+C)
# Clear cache and restart
npx expo start --clear
```

**Solution 3**: Check Internet Connection
- Ensure you're connected to the internet
- Try accessing https://ai.google.dev/ in browser

### "Button doesn't appear"

**Check Role**: Only teachers and admins can see the AI Generate button.

**Check Login**: Make sure you're logged in as teacher/admin.

### "Questions not adding"

**Check Test ID**: Make sure you're in a valid test's questions page.

**Check Network**: Ensure backend server is running.

---

## 📱 Platform-Specific Setup

### iOS
```bash
# Make sure you're using iOS simulator or device
npx expo start --ios
```

### Android
```bash
# For Android emulator or device
npx expo start --android
```

### Web
```bash
# For web browser
npx expo start --web
```

---

## 🔐 Security Best Practices

### DO ✅
- Use environment variables (`.env` file)
- Keep `.env` in `.gitignore`
- Rotate API keys periodically
- Review generated questions before use

### DON'T ❌
- Commit `.env` file to Git
- Share API keys publicly
- Hardcode keys in source code (except for testing)
- Use same key for multiple projects

---

## 📊 Usage Limits

### Gemini API Free Tier
- **60 requests per minute**
- **1,500 requests per day**
- **2 million tokens per minute**

For this app:
- Each generation = 1 request
- Average: 5-10 questions per request
- Plenty for normal usage!

### Rate Limiting Tips
1. Generate 5-10 questions at a time
2. Don't spam the generate button
3. Review questions before regenerating
4. Use meaningful, specific prompts

---

## 🎓 Example Prompts to Try

### Beginner
```
JavaScript variables and data types
Python basic syntax and print statements
HTML tags and structure
```

### Intermediate
```
React hooks useState and useEffect with examples
Python list comprehensions and lambda functions
CSS Flexbox and Grid layout
```

### Advanced
```
Design patterns: Singleton, Factory, Observer
Database normalization up to 3NF
Algorithm time complexity analysis
```

---

## 📞 Getting Help

### If you're stuck:

1. **Check Console Logs**
   - Open browser/app console
   - Look for error messages
   - Note the error details

2. **Verify Setup**
   - API key is correct
   - `.env` file exists
   - Server restarted after changes

3. **Test Simple Prompt**
   - Try: "JavaScript basics"
   - Select MCQ type
   - Generate 3 questions only

4. **Check API Status**
   - Visit https://status.cloud.google.com/
   - Ensure Gemini AI is operational

---

## 🎉 Success Indicators

You know it's working when:
- ✅ "AI Generate" button appears (purple)
- ✅ Modal opens smoothly
- ✅ Loading spinner shows during generation
- ✅ Questions appear in preview
- ✅ Questions can be selected
- ✅ Selected questions add to test
- ✅ Success message appears
- ✅ Questions list refreshes

---

## 📚 Next Steps

Once setup is complete:

1. **Read Full Documentation**
   - `docs-archive/AI_QUESTION_GENERATION.md`
   - Comprehensive usage guide
   - Best practices
   - Advanced features

2. **Experiment with Prompts**
   - Try different topics
   - Test all question types
   - Find what works best

3. **Integrate into Workflow**
   - Use for regular test creation
   - Build question banks
   - Save time on test preparation

---

## 🔄 Updating

To get the latest version:

```bash
# Pull latest changes
git pull origin main

# Update dependencies
cd native
npm install

# Restart server
npx expo start --clear
```

---

## 💡 Pro Tips

1. **Be Specific**: Better prompts = better questions
   - ❌ "Programming"
   - ✅ "JavaScript array methods with practical examples"

2. **Review Before Adding**: Always check generated questions
   - Verify accuracy
   - Check difficulty level
   - Edit if needed

3. **Mix Generation Methods**:
   - Use AI for bulk questions
   - Manually add custom questions
   - Edit AI questions to fit your needs

4. **Save Good Prompts**: Keep a list of prompts that work well for reuse

---

## ✨ You're Ready!

Your AI question generation feature is now set up and ready to use. Start generating questions and save hours of test preparation time!

**First task**: Generate 5 questions about your favorite programming topic! 🚀
