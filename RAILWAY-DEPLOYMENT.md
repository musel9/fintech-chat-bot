# Railway Deployment Guide

## 🚀 Deploy Your Gemini-Powered Fintech Chatbot to Railway

### Step 1: Prepare for Railway Deployment

Your code is already Railway-ready! The server reads from `process.env.GEMINI_API_KEY` which works perfectly with Railway's environment variables.

### Step 2: Set Environment Variables on Railway

1. **Go to your Railway project dashboard**
2. **Click on your service/project**
3. **Navigate to "Variables" tab**
4. **Add the following environment variable:**

```
Variable Name: GEMINI_API_KEY
Variable Value: AIzaSyDAv-_7NZbS90Hx3jsr7zuu2c8civtwtGI
```

### Step 3: Optional Environment Variables

You can also set these for better configuration:

```
NODE_ENV=production
PORT=3000
```

Note: Railway automatically sets the PORT variable, so you might not need to set it manually.

### Step 4: Deployment Configuration

Your `railway.toml` file should look like this:

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### Step 5: Verify Deployment

After deployment, test your endpoints:

**Health Check:**
```
GET https://your-app.railway.app/health
```

**Chat Endpoint:**
```
POST https://your-app.railway.app/chat
Content-Type: application/json

{
  "message": "Should I invest more money this month?"
}
```

### Step 6: Security Best Practices

✅ **DO:**
- Set `GEMINI_API_KEY` in Railway environment variables
- Use Railway's built-in HTTPS
- Monitor API usage in Google AI Studio

❌ **DON'T:**
- Commit API keys to your repository
- Expose API keys in client-side code
- Share API keys in logs or error messages

### Step 7: Monitoring Your Deployment

**Check Logs:**
```bash
railway logs
```

**Monitor API Usage:**
- Visit [Google AI Studio](https://aistudio.google.com/)
- Check API usage and quotas
- Monitor costs and rate limits

### Step 8: Testing Production Deployment

Once deployed, test with curl:

```bash
# Health check
curl https://your-app.railway.app/health

# Chat test
curl -X POST https://your-app.railway.app/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What should I do with my savings?"}'
```

### Environment Variable Priority

Your app will load environment variables in this order:
1. **Railway environment variables** (production)
2. **Local .env file** (development)
3. **System environment variables** (fallback)

This means:
- ✅ On Railway: Uses Railway's `GEMINI_API_KEY`
- ✅ Locally: Uses `.env` file
- ✅ Secure: No API keys in code

### Troubleshooting

**If Gemini isn't working on Railway:**

1. **Check environment variable is set:**
   - Go to Railway dashboard → Variables
   - Verify `GEMINI_API_KEY` exists and has correct value

2. **Check logs:**
   ```bash
   railway logs
   ```
   Look for:
   - `✅ Gemini API service initialized successfully`
   - `🤖 Gemini will be used as primary model`

3. **Test health endpoint:**
   ```bash
   curl https://your-app.railway.app/health
   ```
   Should show: `"geminiAPI": "active"`

4. **Common issues:**
   - Missing environment variable
   - Invalid API key
   - Network/firewall issues
   - Rate limiting

### Production Features

Your deployed app includes:

✅ **Gemini AI Integration**
- Google's latest language model
- Financial context enrichment
- Personalized advice

✅ **Robust Fallback**
- If Gemini fails, uses original advisor
- Graceful error handling
- Always provides a response

✅ **Health Monitoring**
- `/health` endpoint for monitoring
- Service status checking
- API connectivity testing

✅ **Security**
- Environment variable configuration
- No sensitive data in code
- Production-ready error handling

### Next Steps

1. Deploy to Railway with environment variables
2. Test the production deployment
3. Monitor API usage and costs
4. Set up logging/monitoring if needed
5. Consider rate limiting for production traffic

Your fintech chatbot is now ready for production with Gemini AI! 🎉