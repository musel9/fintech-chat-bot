#!/usr/bin/env node

/**
 * Test script for Gemini API integration with financial context
 */

const axios = require('axios');
const colors = require('colors');

const SERVER_URL = 'http://localhost:3000';

async function testGeminiIntegration() {
  console.log('🚀 Testing Gemini API Integration with Financial Context\n'.cyan.bold);

  try {
    // Test 1: Health Check
    console.log('1. Testing health endpoint...'.yellow);
    const healthResponse = await axios.get(`${SERVER_URL}/health`);
    console.log('✅ Health Status:'.green);
    console.log(JSON.stringify(healthResponse.data, null, 2));
    console.log();

    // Test 2: Basic Chat (Financial Query)
    console.log('2. Testing financial advice with user context...'.yellow);
    const chatTests = [
      {
        message: "Should I save more money based on my current spending patterns?",
        description: "Savings advice based on transaction history"
      },
      {
        message: "How much can I afford to invest this month?",
        description: "Investment capacity based on balance and spending"
      },
      {
        message: "What's my biggest spending category and how can I reduce it?",
        description: "Spending analysis and optimization"
      },
      {
        message: "Am I on track for my financial goals?",
        description: "Goal tracking with current financial status"
      }
    ];

    for (const test of chatTests) {
      console.log(`\n📝 Test: ${test.description}`.blue);
      console.log(`💬 Message: "${test.message}"`);
      
      try {
        const startTime = Date.now();
        const response = await axios.post(`${SERVER_URL}/chat`, {
          message: test.message,
          userId: 'test-user-123'
        });
        const endTime = Date.now();
        
        console.log(`✅ Response (${endTime - startTime}ms):`.green);
        console.log(`🤖 Model: ${response.data.model || 'unknown'}`);
        console.log(`📄 Response: ${response.data.response.substring(0, 200)}${response.data.response.length > 200 ? '...' : ''}`);
        
        if (response.data.response.length > 200) {
          console.log(`📏 Full response length: ${response.data.response.length} characters`);
        }
        
      } catch (error) {
        console.log(`❌ Error:`.red, error.response?.data || error.message);
      }
    }

    // Test 3: Fallback behavior (if Gemini fails)
    console.log('\n3. Testing fallback behavior...'.yellow);
    try {
      const response = await axios.post(`${SERVER_URL}/chat`, {
        message: "What's the weather like?", // Non-financial query
      });
      console.log('✅ Fallback Response:'.green);
      console.log(`🤖 Model: ${response.data.model}`);
      console.log(`📄 Response: ${response.data.response.substring(0, 150)}...`);
    } catch (error) {
      console.log(`❌ Fallback Error:`.red, error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:'.red, error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the server is running:'.yellow);
      console.log('   npm start'.cyan);
      console.log('   or');
      console.log('   GEMINI_API_KEY=your_key_here npm start'.cyan);
    }
  }
}

async function demonstrateSetup() {
  console.log('🔧 Gemini API Integration Setup Guide\n'.magenta.bold);
  
  console.log('1. Get a Gemini API key from Google AI Studio:'.yellow);
  console.log('   https://aistudio.google.com/app/apikey\n');
  
  console.log('2. Set the environment variable:'.yellow);
  console.log('   export GEMINI_API_KEY="your_api_key_here"'.cyan);
  console.log('   # or add it to your .env file\n');
  
  console.log('3. Start the server:'.yellow);
  console.log('   npm start'.cyan);
  console.log('   # or');
  console.log('   GEMINI_API_KEY=your_key npm start'.cyan);
  console.log();
  
  console.log('4. Test the integration:'.yellow);
  console.log('   node test-gemini-integration.js'.cyan);
  console.log();
  
  console.log('📋 Features:'.green.bold);
  console.log('• Gemini API enriched with user financial data');
  console.log('• Account balances and transaction history context');
  console.log('• Spending pattern analysis');
  console.log('• Personalized financial advice');
  console.log('• Automatic fallback to original advisor');
  console.log('• Health monitoring and API status');
  console.log();
}

// Check if server is likely running
async function checkServerStatus() {
  try {
    await axios.get(`${SERVER_URL}/health`, { timeout: 2000 });
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const serverRunning = await checkServerStatus();
  
  if (!serverRunning) {
    console.log('⚠️  Server not detected at http://localhost:3000\n'.yellow);
    await demonstrateSetup();
    console.log('🔄 Run this test again after starting the server.'.cyan);
    return;
  }
  
  await testGeminiIntegration();
  console.log('\n🎉 Integration test completed!'.green.bold);
  console.log('\n💡 Tips:'.yellow.bold);
  console.log('• Add your GEMINI_API_KEY to use Gemini AI');
  console.log('• Without the key, it falls back to the original advisor');
  console.log('• The system enriches prompts with user balance, transactions, and spending patterns');
  console.log('• Financial context makes responses more personalized and actionable');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testGeminiIntegration, demonstrateSetup };