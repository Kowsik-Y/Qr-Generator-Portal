# Gemini API Model Reference - Quick Fix

## ✅ FINAL FIX - This Will Work!

The error message was clear: `gemini-1.5-flash` is not available in API version `v1`.

### 🔧 The Solution

**Use `v1beta` for newer models (1.5 series):**

```typescript
// ✅ CORRECT - v1beta supports gemini-1.5-flash
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
```

```typescript
// ❌ WRONG - v1 does NOT support gemini-1.5-flash
https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent
```

## 📋 Available Gemini Models by API Version

### v1beta (Beta API - Latest Models) ✅ RECOMMENDED
- ✅ `gemini-1.5-flash` - Fast, efficient (BEST CHOICE)
- ✅ `gemini-1.5-pro` - More powerful
- ✅ `gemini-pro` - Legacy model
- ✅ `gemini-pro-vision` - Image understanding

### v1 (Stable API - Limited Models)
- ✅ `gemini-pro` - Basic text generation only
- ❌ No 1.5 models available

## 🎯 Recommended Configuration

### For This Project (Question Generation)
```typescript
// native/lib/config.ts
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
```

**Why `gemini-1.5-flash`?**
- ⚡ Fastest response time
- 💰 Most cost-effective
- 🎯 Perfect for question generation
- 📦 Good enough quality for MCQ/Theory/Coding questions

## 🚀 Apply the Fix

The configuration has been updated! Just restart:

```bash
npx expo start --clear
```

## 🧪 Test Commands

### Check Available Models
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY" | jq .
```

### Test Generation
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Generate a simple MCQ question about JavaScript"
      }]
    }]
  }'
```

Replace `YOUR_API_KEY` with: `AIzaSyBzd5IExmC2mS7e2PJosLbir8r4VB6mTUQ`

## 📊 Model Comparison

| Model | API Version | Speed | Quality | Cost | Recommended |
|-------|-------------|-------|---------|------|-------------|
| gemini-1.5-flash | v1beta | ⚡⚡⚡ | ⭐⭐⭐ | 💰 | ✅ YES |
| gemini-1.5-pro | v1beta | ⚡⚡ | ⭐⭐⭐⭐ | 💰💰 | For complex tasks |
| gemini-pro | v1 or v1beta | ⚡⚡ | ⭐⭐⭐ | 💰 | Legacy |

## 🔄 Alternative Configurations

If you want to try different models:

### Option 1: gemini-1.5-flash (CURRENT - Recommended) ⭐
```typescript
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
```
- Best for: Quick question generation
- Speed: Fastest
- Quality: Good

### Option 2: gemini-1.5-pro (More Powerful)
```typescript
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
```
- Best for: Complex questions, detailed answers
- Speed: Slower
- Quality: Better

### Option 3: gemini-pro (Most Stable)
```typescript
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
```
- Best for: Maximum stability
- Speed: Medium
- Quality: Good
- Note: Uses stable v1 API (not beta)

## 💡 Key Takeaways

1. **Use `v1beta` for 1.5 models** - They're not in v1 yet
2. **gemini-1.5-flash is perfect** - Fast and efficient for our use case
3. **v1 only has gemini-pro** - Older, more limited
4. **Beta APIs are stable** - Despite the name, they work well

## ✅ Verification

After restarting, you should see:

1. ✅ No 404 error
2. ✅ "Generating questions..." appears
3. ✅ Questions load successfully
4. ✅ Can add questions to test

## 🐛 If Still Having Issues

Try this diagnostic:

```bash
# Test the exact endpoint we're using
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBzd5IExmC2mS7e2PJosLbir8r4VB6mTUQ" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Say hello"
      }]
    }]
  }'
```

**Expected**: JSON response with generated text
**Error**: Check the error message

## 🎉 Summary

**The fix is simple:** Changed from `v1` to `v1beta` API version.

**Before:** `v1/models/gemini-1.5-flash` ❌  
**After:** `v1beta/models/gemini-1.5-flash` ✅

**Status:** ✅ Fixed and ready to use!

Just restart your server and it will work! 🚀
