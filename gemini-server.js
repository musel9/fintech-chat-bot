require('dotenv').config();
const express = require('express');
const cors = require('cors');
const GeminiFinancialService = require('./gemini-service.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Gemini service
let geminiService = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiService = new GeminiFinancialService(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini API service initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Gemini service:', error.message);
  }
} else {
  console.error('❌ GEMINI_API_KEY not found in environment variables');
  process.exit(1);
}

// Ahmed's comprehensive financial data
const ahmedFinancialData = require('./ahmed-financial-data.js');

async function getAhmedFinancialData() {
  return ahmedFinancialData;
}

app.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    console.log(`📨 New chat request: "${message}"`);

    if (!geminiService) {
      return res.status(500).json({
        error: 'Gemini service not available'
      });
    }

    // Get Ahmed's financial context
    const financialData = await getAhmedFinancialData();
    
    // Generate response with Gemini
    const geminiResponse = await geminiService.generateResponse(message, financialData);
    
    if (geminiResponse.success) {
      console.log('✅ Gemini response generated successfully');
      res.json({
        success: true,
        response: geminiResponse.response,
        model: 'gemini-1.5-flash',
        source: 'gemini-api',
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ Gemini API failed:', geminiResponse.error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate response',
        details: geminiResponse.error
      });
    }
  } catch (error) {
    console.error('❌ Error processing chat request:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/health', async (req, res) => {
  const healthStatus = {
    status: 'healthy',
    services: {
      geminiAPI: geminiService ? 'active' : 'disabled'
    },
    timestamp: new Date().toISOString()
  };

  if (geminiService) {
    try {
      const geminiTest = await geminiService.testConnection();
      healthStatus.services.geminiAPI = geminiTest.success ? 'active' : 'error';
      healthStatus.geminiTest = geminiTest;
    } catch (error) {
      healthStatus.services.geminiAPI = 'error';
      healthStatus.geminiError = error.message;
    }
  }

  res.json(healthStatus);
});

app.get('/', (req, res) => {
  res.json({
    message: 'Fintech Chatbot API - Powered by Gemini',
    model: 'gemini-1.5-flash',
    endpoints: {
      'POST /chat': 'Send a message to get financial advice',
      'GET /health': 'Health check endpoint'
    },
    features: [
      'Gemini AI integration',
      'Financial context enrichment',
      'Personalized advice based on account data',
      'Transaction pattern analysis'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Gemini-powered Fintech Chatbot running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/chat`);
  console.log(`🤖 Model: gemini-1.5-flash`);
  console.log(`🏦 Ready to provide AI-powered financial advice!`);
});

module.exports = app;