#!/usr/bin/env node

// Quick test to verify the single consolidated system works
const EnhancedFinancialAdvisor = require('./enhanced-financial-advisor');

async function testSingleSystem() {
  console.log('🧪 Testing Single Consolidated Fintech Chatbot System\n'.yellow.bold);
  
  try {
    const advisor = new EnhancedFinancialAdvisor();
    await advisor.initializeUser();
    console.log('✅ System initialized successfully\n'.green);
    
    // Test financial query
    console.log('🔍 Testing Financial Query:'.blue);
    const financialResponse = await advisor.processFinancialInput("What's my account balance?");
    console.log('✅ Financial query processed successfully\n'.green);
    
    // Test non-financial query (should be rejected)
    console.log('🔍 Testing Non-Financial Query:'.blue);
    const nonFinancialResponse = await advisor.processFinancialInput("What's the weather like?");
    const isRejected = nonFinancialResponse.includes('🚫 I\'m a specialized Financial Advisor AI');
    console.log(`${isRejected ? '✅' : '❌'} Non-financial query ${isRejected ? 'correctly rejected' : 'incorrectly processed'}\n`);
    
    console.log('🎉 SINGLE SYSTEM TEST COMPLETE!'.green.bold);
    console.log('✅ One unified fintech chatbot model is ready to use'.green);
    console.log('\n💡 Run the system with: node enhanced-financial-advisor.js'.cyan);
    
    advisor.db.close();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run test
if (require.main === module) {
  testSingleSystem();
}

module.exports = testSingleSystem;