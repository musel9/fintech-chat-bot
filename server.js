require('dotenv').config();
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
if (process.env.GEMINI_API_KEY) {
  try {
    geminiService = new GeminiFinancialService(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini API service initialized');
  } catch (error) {
    console.warn('⚠️ Failed to initialize Gemini service:', error.message);
  }
} else {
  console.warn('⚠️ GEMINI_API_KEY not found. Using fallback financial advisor.');
}

app.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    let response;
    
    // Try Gemini API first, fallback to original advisor
    if (geminiService) {
      try {
        // Gather user's financial context
        const financialData = await gatherUserFinancialContext(userId);
        
        // Generate response with Gemini + user context
        const geminiResponse = await geminiService.generateResponse(message, financialData);
        
        if (geminiResponse.success) {
          response = geminiResponse.response;
        } else {
          // Fallback to original advisor
          console.warn('Gemini API failed, using fallback advisor');
          response = await finbot.processFinancialInput(message);
        }
      } catch (geminiError) {
        console.error('Gemini service error:', geminiError);
        response = await finbot.processFinancialInput(message);
      }
    } else {
      // Use original advisor
      response = await finbot.processFinancialInput(message);
    }
    
    res.json({
      success: true,
      response: response,
      model: geminiService ? 'gemini-1.5-flash' : 'enhanced-financial-advisor',
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

// Helper function to gather user's financial context
async function gatherUserFinancialContext(userId) {
  try {
    // Get user's account balances
    const accounts = await finbot.getAccountBalance();
    
    // Get recent transactions
    const transactions = await finbot.getRecentTransactions(null, 100);
    
    // User profile from the financial advisor
    const userProfile = finbot.userProfile;
    
    return {
      balance: accounts || [],
      transactions: transactions || [],
      userProfile: userProfile || {}
    };
  } catch (error) {
    console.error('Error gathering financial context:', error);
    return {
      balance: [],
      transactions: [],
      userProfile: {}
    };
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