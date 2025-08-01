const axios = require('axios');

async function testLocalServer() {
  const serverUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Local Gemini Integration\n');
  
  try {
    // Test 1: Health check
    console.log('1. Health Check...');
    const health = await axios.get(`${serverUrl}/health`);
    console.log('✅ Server Status:', health.data.status);
    console.log('🤖 Gemini API:', health.data.services.geminiAPI);
    console.log();
    
    // Test 2: Financial advice queries
    const testQueries = [
      {
        message: "Should I invest more money this month?",
        description: "Investment advice with financial context"
      },
      {
        message: "What's my biggest spending category?",
        description: "Spending analysis"
      },
      {
        message: "How can I save more money?",
        description: "Savings recommendations"
      }
    ];
    
    for (let i = 0; i < testQueries.length; i++) {
      const query = testQueries[i];
      console.log(`${i + 2}. ${query.description}...`);
      console.log(`💬 Question: "${query.message}"`);
      
      try {
        const startTime = Date.now();
        const response = await axios.post(`${serverUrl}/chat`, {
          message: query.message
        });
        const endTime = Date.now();
        
        console.log(`✅ Response received (${endTime - startTime}ms)`);
        console.log(`🤖 Model: ${response.data.model}`);
        console.log(`📄 Preview: ${response.data.response.substring(0, 200)}...`);
        
        // Check if it's using Gemini
        if (response.data.model === 'gemini-1.5-flash') {
          console.log('🎉 SUCCESS: Using Gemini API!');
        } else {
          console.log('⚠️  Using fallback model:', response.data.model);
        }
        
        console.log();
        
      } catch (error) {
        console.log('❌ Error:', error.response?.data?.error || error.message);
        console.log();
      }
    }
    
    console.log('🎯 Local test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running: npm start');
    }
  }
}

// Run the test
testLocalServer().catch(console.error);