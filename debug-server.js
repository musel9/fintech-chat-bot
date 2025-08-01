require('dotenv').config();
const express = require('express');
const cors = require('cors');
const GeminiFinancialService = require('./gemini-service.js');
const EnhancedFinancialAdvisor = require('./enhanced-financial-advisor.js');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

console.log('🔍 Debug: Environment check');
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('GEMINI_API_KEY value:', process.env.GEMINI_API_KEY ? 'AIzaSy...tGI' : 'undefined');

// Initialize services
let geminiService = null;
let finbot = null;

// Initialize Gemini
if (process.env.GEMINI_API_KEY) {
  try {
    console.log('🔄 Initializing Gemini service...');
    geminiService = new GeminiFinancialService(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini service created successfully');
  } catch (error) {
    console.error('❌ Gemini initialization failed:', error.message);
  }
} else {
  console.warn('⚠️ No GEMINI_API_KEY found');
}

// Initialize financial advisor (as fallback)
try {
  console.log('🔄 Initializing Financial Advisor...');
  finbot = new EnhancedFinancialAdvisor();
  console.log('✅ Financial Advisor created');
} catch (error) {
  console.error('❌ Financial Advisor failed:', error.message);
}

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('\n📨 New chat request:', message);
    console.log('🤖 Gemini available:', !!geminiService);
    console.log('🏦 Fallback available:', !!finbot);

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    // FORCE use Gemini first
    if (geminiService) {
      console.log('🔄 Using Gemini API...');
      
      // Simple mock data for testing
      const mockData = {
        balance: [{ account_type: 'Checking', balance: 5000, currency: 'USD' }],
        transactions: [{ amount: -100, description: 'Test purchase' }],
        userProfile: { riskTolerance: 'moderate' }
      };

      try {
        const geminiResponse = await geminiService.generateResponse(message, mockData);
        console.log('📄 Gemini response success:', geminiResponse.success);
        
        if (geminiResponse.success) {
          console.log('✅ Returning Gemini response');
          return res.json({
            success: true,
            response: geminiResponse.response,
            model: 'gemini-1.5-flash',
            source: 'gemini-api',
            timestamp: new Date().toISOString()
          });
        } else {
          console.log('❌ Gemini failed, using fallback');
        }
      } catch (geminiError) {
        console.error('❌ Gemini error:', geminiError.message);
      }
    }

    // Fallback to original advisor
    if (finbot) {
      console.log('🔄 Using fallback advisor...');
      const fallbackResponse = await finbot.processFinancialInput(message);
      return res.json({
        success: true,
        response: fallbackResponse,
        model: 'enhanced-financial-advisor',
        source: 'fallback',
        timestamp: new Date().toISOString()
      });
    }

    return res.status(500).json({ error: 'No services available' });

  } catch (error) {
    console.error('❌ Request error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/debug', (req, res) => {
  res.json({
    geminiService: !!geminiService,
    finbot: !!finbot,
    apiKey: !!process.env.GEMINI_API_KEY,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Debug server running on port ${PORT}`);
  console.log(`🔍 Debug info: http://localhost:${PORT}/debug`);
  console.log(`💬 Test chat: curl -X POST http://localhost:${PORT}/chat -H "Content-Type: application/json" -d '{"message":"test"}'`);
  console.log(`\n🎯 Service Status:`);
  console.log(`   Gemini: ${geminiService ? '✅ Ready' : '❌ Not available'}`);
  console.log(`   Fallback: ${finbot ? '✅ Ready' : '❌ Not available'}`);
});