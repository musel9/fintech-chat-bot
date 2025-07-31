const express = require('express');
const cors = require('cors');
const FinancialAI = require('./chatbot.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const finbot = new FinancialAI();

app.post('/chat', (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    const response = finbot.processInput(message);
    
    res.json({
      success: true,
      response: response,
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

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
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

app.listen(PORT, () => {
  console.log(`🚀 Fintech Chatbot API running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/chat`);
});

module.exports = app;