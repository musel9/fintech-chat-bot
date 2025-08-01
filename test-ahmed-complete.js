#!/usr/bin/env node

/**
 * Complete test for Ahmed's financial data with bilingual responses
 */

const axios = require('axios');
const colors = require('colors');

const SERVER_URL = 'http://localhost:3000';

async function testAhmedProfile() {
  console.log('🧪 Testing Ahmed\'s Financial Profile - Complete System Test\n'.cyan.bold);

  try {
    // Test balance queries
    console.log('=== BALANCE TESTS ==='.yellow.bold);
    
    const balanceTests = [
      {
        message: "What is my balance?",
        description: "English balance query",
        language: "English"
      },
      {
        message: "ما هو رصيدي؟",
        description: "Arabic balance query", 
        language: "Arabic"
      },
      {
        message: "Show me all my accounts",
        description: "English accounts overview",
        language: "English"
      },
      {
        message: "أظهر لي جميع حساباتي",
        description: "Arabic accounts overview",
        language: "Arabic"
      }
    ];

    for (const test of balanceTests) {
      console.log(`\n📊 ${test.description} (${test.language})`.blue);
      console.log(`💬 "${test.message}"`);
      
      try {
        const response = await axios.post(`${SERVER_URL}/chat`, {
          message: test.message
        });
        
        console.log('✅ Response:'.green);
        console.log(response.data.response);
        console.log(`⚡ Model: ${response.data.model}`.gray);
      } catch (error) {
        console.log('❌ Error:'.red, error.response?.data || error.message);
      }
    }

    // Test transaction queries  
    console.log('\n\n=== TRANSACTION TESTS ==='.yellow.bold);
    
    const transactionTests = [
      {
        message: "Show me my last 12 transactions",
        description: "English - Last 12 transactions",
        language: "English"
      },
      {
        message: "أظهر لي آخر 12 معاملة",
        description: "Arabic - Last 12 transactions",
        language: "Arabic"
      },
      {
        message: "What did I spend on IKEA?",
        description: "English - IKEA spending",
        language: "English"
      },
      {
        message: "كم أنفقت في ايكيا؟",
        description: "Arabic - IKEA spending",
        language: "Arabic"
      }
    ];

    for (const test of transactionTests) {
      console.log(`\n📝 ${test.description} (${test.language})`.blue);
      console.log(`💬 "${test.message}"`);
      
      try {
        const response = await axios.post(`${SERVER_URL}/chat`, {
          message: test.message
        });
        
        console.log('✅ Response:'.green);
        console.log(response.data.response);
        console.log(`⚡ Model: ${response.data.model}`.gray);
      } catch (error) {
        console.log('❌ Error:'.red, error.response?.data || error.message);
      }
    }

    // Test savings plan queries
    console.log('\n\n=== SAVINGS PLAN TESTS ==='.yellow.bold);
    
    const savingsTests = [
      {
        message: "Make me a savings plan",
        description: "English - Savings plan",
        language: "English"
      },
      {
        message: "اعمل لي خطة ادخار",
        description: "Arabic - Savings plan", 
        language: "Arabic"
      },
      {
        message: "How much should I save monthly?",
        description: "English - Monthly savings advice",
        language: "English"
      },
      {
        message: "كم يجب أن أدخر شهرياً؟",
        description: "Arabic - Monthly savings advice",
        language: "Arabic"
      }
    ];

    for (const test of savingsTests) {
      console.log(`\n💰 ${test.description} (${test.language})`.blue);
      console.log(`💬 "${test.message}"`);
      
      try {
        const response = await axios.post(`${SERVER_URL}/chat`, {
          message: test.message
        });
        
        console.log('✅ Response:'.green);
        console.log(response.data.response);
        console.log(`⚡ Model: ${response.data.model}`.gray);
      } catch (error) {
        console.log('❌ Error:'.red, error.response?.data || error.message);
      }
    }

    // Test spending analysis
    console.log('\n\n=== SPENDING ANALYSIS TESTS ==='.yellow.bold);
    
    const spendingTests = [
      {
        message: "Analyze my spending patterns",
        description: "English - Spending analysis",
        language: "English"
      },
      {
        message: "حلل أنماط إنفاقي",
        description: "Arabic - Spending analysis",
        language: "Arabic"
      },
      {
        message: "What is my biggest expense category?",
        description: "English - Top expense category",
        language: "English"
      },
      {
        message: "ما هي أكبر فئة مصروفات لدي؟",
        description: "Arabic - Top expense category",
        language: "Arabic"
      }
    ];

    for (const test of spendingTests) {
      console.log(`\n📈 ${test.description} (${test.language})`.blue);
      console.log(`💬 "${test.message}"`);
      
      try {
        const response = await axios.post(`${SERVER_URL}/chat`, {
          message: test.message
        });
        
        console.log('✅ Response:'.green);
        console.log(response.data.response);
        console.log(`⚡ Model: ${response.data.model}`.gray);
      } catch (error) {
        console.log('❌ Error:'.red, error.response?.data || error.message);
      }
    }

    console.log('\n🎉 Ahmed Profile Test Complete!'.green.bold);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testAhmedProfile();
}

module.exports = testAhmedProfile;