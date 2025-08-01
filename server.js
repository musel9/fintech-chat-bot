// Load environment variables (Railway automatically provides them)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const cors = require('cors');
const EnhancedFinancialAdvisor = require('./enhanced-financial-advisor.js');
const GeminiFinancialService = require('./gemini-service.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const finbot = new EnhancedFinancialAdvisor();

// Initialize Gemini service (requires GEMINI_API_KEY environment variable)
let geminiService = null;
console.log('🔍 Checking GEMINI_API_KEY:', !!process.env.GEMINI_API_KEY);
if (process.env.GEMINI_API_KEY) {
  try {
    geminiService = new GeminiFinancialService(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini API service initialized successfully');
    console.log('🤖 Gemini will be used as primary model');
  } catch (error) {
    console.error('❌ Failed to initialize Gemini service:', error.message);
    geminiService = null;
  }
} else {
  console.warn('⚠️ GEMINI_API_KEY not found. Using fallback financial advisor only.');
}

app.post('/chat', async (req, res) => {
  try {
    const { message, userId, stream } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    let response;
    let modelUsed = 'enhanced-financial-advisor';
    
    console.log('📨 Processing message:', message.substring(0, 50) + '...');
    console.log('🤖 Gemini available:', !!geminiService);
    console.log('🌊 Streaming requested:', !!stream);
    
    // Try Gemini API first, fallback to original advisor
    if (geminiService) {
      try {
        console.log('🔄 Using Gemini API...');
        // Gather user's financial context
        const financialData = await gatherUserFinancialContext(userId);
        
        // Use streaming if requested
        if (stream && res.writeHead) {
          return handleStreamingResponse(res, message, financialData, geminiService);
        }
        
        // Generate response with Gemini + user context
        const geminiResponse = await geminiService.generateResponse(message, financialData);
        
        if (geminiResponse.success) {
          console.log('✅ Gemini response successful');
          response = geminiResponse.response;
          modelUsed = 'gemini-1.5-flash';
        } else {
          // Fallback to original advisor
          console.warn('⚠️ Gemini API failed, using fallback advisor');
          response = await finbot.processFinancialInput(message);
        }
      } catch (geminiError) {
        console.error('❌ Gemini service error:', geminiError.message);
        console.log('🔄 Falling back to original advisor...');
        response = await finbot.processFinancialInput(message);
      }
    } else {
      // Use original advisor
      console.log('🔄 Using original financial advisor...');
      response = await finbot.processFinancialInput(message);
    }
    
    res.json({
      success: true,
      response: response,
      model: modelUsed,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Streaming response handler
async function handleStreamingResponse(res, message, financialData, geminiService) {
  try {
    console.log('🌊 Starting streaming response...');
    
    // Set headers for streaming
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    const streamingResponse = await geminiService.generateStreamingResponse(message, financialData);
    
    if (streamingResponse.success && streamingResponse.stream) {
      for await (const chunk of streamingResponse.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          res.write(chunkText);
        }
      }
      res.end();
      console.log('✅ Streaming response completed');
    } else {
      res.write('Error: Unable to stream response');
      res.end();
    }
  } catch (error) {
    console.error('❌ Streaming error:', error);
    res.write('Error: Streaming failed');
    res.end();
  }
}

// Helper function to gather user's financial context
async function gatherUserFinancialContext(userId) {
  try {
    // Use comprehensive mock user data
    const mockUserData = require('./mock-user-data.js');
    
    console.log(`📊 Loading financial data for user: ${mockUserData.userProfile.name}`);
    console.log(`💰 Total balance: ${mockUserData.balance.reduce((sum, acc) => sum + (acc.currency === 'AED' ? acc.balance : acc.balance * 3.67), 0).toLocaleString()} AED`);
    console.log(`📈 Transactions loaded: ${mockUserData.transactions.length}`);
    
    return {
      balance: mockUserData.balance,
      transactions: mockUserData.transactions,
      userProfile: mockUserData.userProfile,
      savingsGoals: mockUserData.savingsGoals,
      debts: mockUserData.debts,
      insurance: mockUserData.insurance,
      alerts: mockUserData.alerts
    };
  } catch (error) {
    console.error('Error gathering financial context:', error);
    
    // Fallback to database if mock data fails
    try {
      const accounts = await finbot.getAccountBalance();
      const transactions = await finbot.getRecentTransactions(null, 100);
      const userProfile = finbot.userProfile;
      
      return {
        balance: accounts || [],
        transactions: transactions || [],
        userProfile: userProfile || {}
      };
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return {
        balance: [],
        transactions: [],
        userProfile: {}
      };
    }
  }
}

app.get('/health', async (req, res) => {
  const healthStatus = {
    status: 'healthy',
    services: {
      financialAdvisor: 'active',
      geminiAPI: geminiService ? 'active' : 'disabled',
      database: 'unknown'
    },
    timestamp: new Date().toISOString()
  };

  // Test Gemini connection if available
  if (geminiService) {
    try {
      const geminiTest = await geminiService.testConnection();
      healthStatus.services.geminiAPI = geminiTest.success ? 'active' : 'error';
    } catch (error) {
      healthStatus.services.geminiAPI = 'error';
    }
  }

  res.json(healthStatus);
});

app.get('/', (req, res) => {
  res.json({
    message: 'Fintech Chatbot API',
    endpoints: {
      'POST /chat': 'Send a message to the chatbot',
      'GET /health': 'Health check endpoint'
    },
    usage: {
      'POST /chat': {
        body: { message: 'Your message here' },
        response: { success: true, response: 'Bot response', timestamp: 'ISO date' }
      }
    }
  });
});

async function startServer() {
  try {
    // Initialize the financial advisor
    await finbot.initializeUser();
    console.log('✅ Enhanced Financial Advisor initialized');
    
    app.listen(PORT, () => {
      console.log(`🚀 Fintech Chatbot API running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
      console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/chat`);
      console.log(`🏦 Ready to provide financial advice!`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize financial advisor:', error.message);
    console.log('🔄 Starting server without full initialization...');
    
    app.listen(PORT, () => {
      console.log(`🚀 Fintech Chatbot API running on port ${PORT} (limited mode)`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
      console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/chat`);
    });
  }
}

// Start the server
startServer();

module.exports = app;