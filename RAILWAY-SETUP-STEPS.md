# 🚀 Railway Deployment Steps

## Step-by-Step Guide to Deploy Your Gemini-Powered Chatbot

### 1. Push Your Code to Repository
```bash
git add .
git commit -m "Add Gemini API integration with Railway support"
git push origin main
```

### 2. Create Railway Project
1. Go to [Railway.app](https://railway.app)
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository

### 3. Set Environment Variables in Railway
**Critical Step:** In Railway dashboard:
1. Click on your deployed service
2. Go to "Variables" tab  
3. Click "Add Variable"
4. Add this variable:

```
Name: GEMINI_API_KEY
Value: AIzaSyDAv-_7NZbS90Hx3jsr7zuu2c8civtwtGI
```

**Optional variables:**
```
NODE_ENV: production
```

### 4. Deploy and Test
Railway will automatically deploy. After deployment:

**Test Health:**
```bash
curl https://your-app.railway.app/health
```

**Test Chat:**
```bash
curl -X POST https://your-app.railway.app/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Should I invest more money?"}'
```

### 5. Verify Gemini is Working
In the response, check:
- `"model": "gemini-1.5-flash"` ✅
- `"success": true` ✅
- Response contains personalized financial advice ✅

### 🔍 Troubleshooting

**If you see fallback model instead of Gemini:**
1. Check Railway Variables tab has `GEMINI_API_KEY`
2. Redeploy after adding the variable
3. Check Railway logs for errors

**Check Railway Logs:**
```bash
# In Railway dashboard
Click "Deployments" → Click latest deployment → View logs
```

Look for these success messages:
- `✅ Gemini API service initialized successfully`
- `🤖 Gemini will be used as primary model`
- `✅ Gemini response successful`

### 🎯 Production Checklist

✅ Code pushed to GitHub
✅ Railway project created  
✅ `GEMINI_API_KEY` set in Railway variables
✅ Health endpoint returns "geminiAPI": "active"
✅ Chat responses show "model": "gemini-1.5-flash"
✅ Responses are personalized with financial context

### 📊 Your Production Features

🤖 **Gemini AI Integration**
- Latest Google AI model
- Financial context enrichment
- Personalized responses

🛡️ **Production Security**
- API key in Railway environment variables
- No secrets in code repository
- HTTPS by default

🚀 **Railway Benefits**
- Auto-scaling
- Built-in monitoring
- Easy deployments
- Custom domains

### 💡 Next Steps After Deployment

1. **Monitor API Usage:** Check Google AI Studio for usage
2. **Set Up Monitoring:** Use Railway's built-in metrics
3. **Custom Domain:** Add your own domain in Railway
4. **Rate Limiting:** Consider adding rate limits for production
5. **Logging:** Set up structured logging for better debugging

Your Gemini-powered fintech chatbot is ready for Railway! 🎉