require('dotenv').config();
const express = require('express');
const cors = require('cors');
const GeminiFinancialService = require('./gemini-service.js');

const app = express();
const PORT = 3001; // Use different port for testing

app.use(cors());
app.use(express.json());

// Initialize Gemini service
let geminiService = null;
console.log('🔍 Checking Gemini API key...');
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);

if (process.env.GEMINI_API_KEY) {
  try {
    geminiService = new GeminiFinancialService(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini API service initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Gemini service:', error.message);
  }
} else {
  console.error('❌ GEMINI_API_KEY not found in environment variables');
}

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('📨 Received message:', message);
    console.log('🤖 Using Gemini:', !!geminiService);

    if (geminiService) {
      // Mock financial data for testing
      const mockFinancialData = {
        balance: [
          { account_type: 'Checking', balance: 5240, currency: 'USD' },
          { account_type: 'Savings', balance: 8180, currency: 'USD' }
        ],
        transactions: [
          { amount: -120, description: 'Grocery Store', transaction_type: 'Debit' },
          { amount: -45, description: 'Gas Station', transaction_type: 'Debit' },
          { amount: 2500, description: 'Salary Deposit', transaction_type: 'Credit' }
        ],
        userProfile: {
          riskTolerance: 'moderate',
          investmentExperience: 'beginner'
        }
      };

      console.log('🔄 Calling Gemini API...');
      const geminiResponse = await geminiService.generateResponse(message, mockFinancialData);
      
      if (geminiResponse.success) {
        console.log('✅ Gemini response received');
        return res.json({
          success: true,
          response: geminiResponse.response,
          model: 'gemini-1.5-flash',
          source: 'gemini-api',
          timestamp: new Date().toISOString()
        });
      } else {
        console.error('❌ Gemini API failed:', geminiResponse.error);
        return res.json({
          success: false,
          error: 'Gemini API failed',
          fallback: true
        });
      }
    } else {
      return res.json({
        success: false,
        error: 'Gemini service not available',
        model: 'none'
      });
    }
  } catch (error) {
    console.error('❌ Error processing request:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/health', async (req, res) => {
  const status = {
    geminiService: !!geminiService,
    apiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  };

  if (geminiService) {
    try {
      const test = await geminiService.testConnection();
      status.geminiTest = test.success;
    } catch (error) {
      status.geminiTest = false;
      status.geminiError = error.message;
    }
  }

  res.json(status);
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`🔗 Test: curl -X POST http://localhost:${PORT}/chat -H "Content-Type: application/json" -d '{"message":"Should I invest more?"}'`);
});