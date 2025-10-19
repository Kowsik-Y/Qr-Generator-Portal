# Fixing Gemini API 404 Error

## ✅ What Was Fixed

The 404 error was caused by using an outdated Gemini API model name. Here's what was updated:

### Before (Outdated):
```typescript
// Old model - DEPRECATED
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
```

### After (Fixed):
```typescript
// New model - CURRENT
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
```

## 🔄 Changes Made

1. **Updated Model Name**: Changed from `gemini-pro` to `gemini-1.5-flash`
2. **Updated API Version**: Changed from `v1beta` to `v1`
3. **Enhanced Error Messages**: Better error reporting with details

## 🚀 How to Apply the Fix

### Option 1: Automatic (Recommended)
The changes have already been applied to your code! Just restart your app:

```bash
# Stop the current server (Ctrl+C)
npx expo start --clear
```

### Option 2: Manual Verification
Check if the fix is applied:

1. Open `native/lib/config.ts`
2. Look for line 7
3. Should see: `gemini-1.5-flash` (not `gemini-pro`)

## 🧪 Test the Fix

After restarting, try generating questions again:

1. Navigate to View Questions
2. Click "AI Generate"
3. Enter prompt: "JavaScript basics"
4. Generate questions
5. Should work now! ✨

## 🔍 Alternative Models (If Still Having Issues)

If you still get errors, try these alternative models in `config.ts`:

### Option A: Gemini 1.5 Flash (Fast, Recommended)
```typescript
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
```

### Option B: Gemini 1.5 Pro (More Powerful)
```typescript
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';
```

### Option C: Gemini 1.0 Pro (Legacy)
```typescript
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
```

## 🐛 Troubleshooting Guide

### Still Getting 404?

#### 1. Verify API Key is Valid
```bash
# Check your .env file
cat native/.env
# Should show: EXPO_PUBLIC_GEMINI_API_KEY=AIza...
```

#### 2. Test API Key Directly
You can test your API key with curl:

```bash
curl "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Say hello"}]}]}'
```

Replace `YOUR_API_KEY_HERE` with your actual key.

**Expected Response**: JSON with generated text  
**Error Response**: Check the error message

#### 3. Check API Key Permissions
Go to: https://console.cloud.google.com/apis/credentials

Make sure:
- ✅ Generative Language API is enabled
- ✅ API key has no restrictions blocking the API
- ✅ API key is active (not deleted/disabled)

#### 4. Enable Generative Language API
If your API key is new:

1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Click "Enable"
3. Wait a few minutes for it to activate
4. Try again

### Getting 403 Error?
- API key is invalid or restricted
- Check quotas: https://console.cloud.google.com/iam-admin/quotas
- Generate a new API key

### Getting 429 Error?
- Rate limit exceeded
- Wait a few minutes
- Reduce number of questions per request

### Getting 500 Error?
- Google's servers are having issues
- Try again in a few minutes
- Check status: https://status.cloud.google.com/

## 📊 API Model Comparison

| Model | Speed | Quality | Use Case |
|-------|-------|---------|----------|
| gemini-1.5-flash | ⚡⚡⚡ Fast | ⭐⭐⭐ Good | General use (Recommended) |
| gemini-1.5-pro | ⚡⚡ Medium | ⭐⭐⭐⭐ Better | Complex questions |
| gemini-pro | ⚡⚡ Medium | ⭐⭐⭐ Good | Legacy (may be deprecated) |

## 🔐 Security Checklist

- [ ] `.env` file exists in `native` directory
- [ ] API key is in `.env` file (not hardcoded)
- [ ] `.env` is in `.gitignore`
- [ ] Server restarted after adding key
- [ ] API key starts with `AIza`

## 📝 Quick Reference

### Current Configuration
```typescript
// Location: native/lib/config.ts

// API Key (from .env)
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyBzd5IExmC2mS7e2PJosLbir8r4VB6mTUQ

// API Endpoint
https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent

// Model: gemini-1.5-flash
// Version: v1 (stable)
```

## 🎯 Success Indicators

You know it's working when:
- ✅ No 404 error
- ✅ Loading spinner appears
- ✅ Questions are generated
- ✅ Questions appear in preview
- ✅ Can add questions to test

## 💡 Pro Tips

1. **Use gemini-1.5-flash**: Fastest and most reliable
2. **Clear cache**: Always restart with `--clear` flag
3. **Test with simple prompts first**: "JavaScript basics"
4. **Check console logs**: Look for detailed error messages
5. **Keep API key secure**: Never commit to Git

## 🔄 If You Need to Switch Models

Edit `native/lib/config.ts`:

```typescript
// Line 7 - Change this line:
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/MODEL_NAME_HERE:generateContent';
```

Replace `MODEL_NAME_HERE` with:
- `gemini-1.5-flash` (Recommended)
- `gemini-1.5-pro` (More powerful)
- `gemini-pro` (Legacy)

Then restart: `npx expo start --clear`

## 📞 Still Having Issues?

1. **Check Error Logs**: Look at your terminal/console
2. **Verify Environment**: `echo $EXPO_PUBLIC_GEMINI_API_KEY`
3. **Test API Key**: Use the curl command above
4. **Try New Key**: Generate a fresh API key
5. **Check API Status**: Visit Google Cloud status page

## ✅ Verification Steps

Run through this checklist:

```bash
# 1. Check file exists
ls native/.env

# 2. Check key is set
cat native/.env | grep GEMINI

# 3. Check config file
cat native/lib/config.ts | grep GEMINI_API_URL

# 4. Restart server
cd native
npx expo start --clear
```

## 🎉 You're All Set!

The 404 error should now be fixed. Try generating questions again and it should work perfectly! 🚀
