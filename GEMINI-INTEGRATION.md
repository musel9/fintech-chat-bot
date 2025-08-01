# Gemini API Integration Guide

This fintech chatbot now supports Google's Gemini AI as the primary language model, with your existing system serving as a smart frontend that enriches user prompts with their financial context.

## 🎯 How It Works

1. **User sends a message** → Frontend receives the prompt
2. **System gathers financial context** → Account balances, transaction history, spending patterns
3. **Context enrichment** → User's financial data is added to the prompt
4. **Gemini API call** → Enhanced prompt sent to Gemini with full financial context
5. **Personalized response** → Gemini returns advice based on actual user data
6. **Fallback protection** → If Gemini fails, original advisor takes over

## 🚀 Quick Setup

### 1. Get Gemini API Key
Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and create a new API key.

### 2. Set Environment Variable
```bash
export GEMINI_API_KEY="your_api_key_here"
```

Or create a `.env` file:
```
GEMINI_API_KEY=your_api_key_here
```

### 3. Start the Server
```bash
npm start
# or with inline key
GEMINI_API_KEY=your_key npm start
```

### 4. Test the Integration
```bash
node test-gemini-integration.js
```

## 📡 API Usage

### Chat Endpoint
```bash
POST /chat
Content-Type: application/json

{
  "message": "Should I invest more money this month?",
  "userId": "optional-user-id"
}
```

### Response Format
```json
{
  "success": true,
  "response": "Based on your current balance of $5,240 and recent spending of $2,100...",
  "model": "gemini-1.5-flash",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Health Check
```bash
GET /health
```

Response includes Gemini API status:
```json
{
  "status": "healthy",
  "services": {
    "financialAdvisor": "active",
    "geminiAPI": "active",
    "database": "unknown"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🎨 Financial Context Enhancement

The system automatically enriches every user prompt with:

### Account Information
- Total balance across all accounts
- Individual account balances by type
- Account status and currency

### Transaction Analysis
- Recent transaction history (last 100)
- Income vs spending breakdown
- Spending category analysis
- Net cash flow

### User Profile
- Risk tolerance
- Investment experience
- Financial goals
- Age and income (if available)

### Example Context
```
CURRENT USER FINANCIAL PROFILE:
ACCOUNT SUMMARY:
Total Balance: $15,420
Active Accounts: 3
- Checking: $5,240 USD
- Savings: $8,180 USD
- Investment: $2,000 USD

RECENT FINANCIAL ACTIVITY (Last 50 transactions):
Total Income: $4,200
Total Spending: $2,850
Net Flow: $1,350
Top Spending Categories:
- Groceries & Food: $680
- Transportation: $420
- Dining Out: $310

USER PROFILE:
Risk Tolerance: moderate
Investment Experience: beginner

USER'S QUESTION/REQUEST:
Should I invest more money this month?
```

## 🔧 Configuration Options

### Gemini Model Selection
Default: `gemini-1.5-flash` (fast and cost-effective)

To use a different model, modify `gemini-service.js`:
```javascript
this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
```

### Context Length Control
Adjust transaction history in `server.js`:
```javascript
const transactions = await finbot.getRecentTransactions(null, 50); // Reduce from 100
```

### System Prompt Customization
Modify the system prompt in `gemini-service.js` to change the AI's behavior:
```javascript
this.systemPrompt = `You are a conservative financial advisor...`
```

## 🛡️ Fallback Behavior

The system includes robust fallback mechanisms:

1. **No API Key** → Uses original financial advisor
2. **Gemini API Error** → Automatically falls back to original advisor
3. **Network Issues** → Graceful degradation with error logging
4. **Invalid Responses** → Fallback with error tracking

## 📊 Example Interactions

### Investment Advice
**User**: "How much should I invest this month?"
**System Context**: Current balance, spending patterns, investment experience
**Gemini Response**: "Based on your $15,420 total balance and $1,350 positive cash flow this month, with your moderate risk tolerance and beginner experience, I recommend starting with $300-500 in a diversified index fund..."

### Spending Analysis  
**User**: "Am I spending too much on food?"
**System Context**: Transaction categories, spending breakdown
**Gemini Response**: "Your food spending of $680 this month (groceries + dining) represents 24% of your total expenses. For someone with your income level, this is slightly above the recommended 15-20%..."

### Goal Planning
**User**: "How can I save for a house down payment?"
**System Context**: Current savings, income, expenses, savings goals
**Gemini Response**: "With your current savings rate of $1,350/month and $8,180 in savings, for a 20% down payment on a $300k home ($60k needed), you could reach this goal in 38 months by maintaining your current pace..."

## 🚨 Security & Privacy

- Financial data stays on your server
- Only enriched prompts (not raw data) sent to Gemini
- API key stored as environment variable
- User data anonymized in prompts
- All responses logged locally for audit

## 📈 Monitoring & Analytics

### Health Monitoring
- Gemini API connectivity status
- Response time tracking
- Error rate monitoring
- Fallback usage statistics

### Usage Analytics
```bash
# View server logs for usage patterns
tail -f logs/server.log | grep "gemini"
```

## 🔄 Development & Testing

### Local Development
```bash
# Start in development mode
npm run dev

# Run specific tests
node test-gemini-integration.js
node test-financial-filter.js
```

### Debugging
Enable detailed logging by setting:
```bash
export NODE_ENV=development
export DEBUG=gemini:*
```

## 💡 Tips & Best Practices

1. **Monitor API Usage** - Gemini API has usage limits and costs
2. **Cache Responses** - Consider caching for frequently asked questions
3. **Validate Input** - Always validate user input before sending to API
4. **Error Handling** - Log all errors for debugging and monitoring
5. **User Privacy** - Be transparent about data usage in prompts
6. **Rate Limiting** - Implement rate limiting to prevent API abuse

## 🆘 Troubleshooting

### Common Issues

**"No API key found"**
- Set GEMINI_API_KEY environment variable
- Check .env file exists and is loaded

**"Gemini API Error: 400"**
- Check API key validity
- Verify prompt length (Gemini has limits)
- Check for sensitive content in prompts

**"Connection timeout"**
- Check internet connectivity
- Verify Gemini API service status
- Consider increasing timeout values

**"Fallback advisor always used"**
- Check GEMINI_API_KEY is set correctly
- Verify Gemini service initialization in logs
- Test API key with curl or Postman

### Debug Mode
```bash
GEMINI_API_KEY=your_key DEBUG=1 npm start
```

## 📚 Additional Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [API Pricing](https://ai.google.dev/pricing)
- [Best Practices](https://ai.google.dev/docs/best_practices)

---

**Need help?** Open an issue or check the test script for working examples!