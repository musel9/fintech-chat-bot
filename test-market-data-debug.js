#!/usr/bin/env node

// Debug why "market data" is routing wrong
const IntelligentFintechAI = require('./intelligent-finbot');

async function debugMarketData() {
  console.log('🔍 Debugging "market data" command routing\n'.yellow.bold);
  
  const finbot = new IntelligentFintechAI();
  
  try {
    await finbot.initializeUser();
    
    // Test the classifier directly
    const classifications = finbot.classifier.getClassifications("market data");
    console.log('📊 Classification results for "market data":');
    classifications.forEach(result => {
      console.log(`  ${result.label}: ${(result.value * 100).toFixed(2)}%`);
    });
    
    console.log('\n🎯 Full response:');
    const response = await finbot.processIntelligentInput("market data");
    console.log(response);
    
    finbot.db.close();
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

// Run the test
debugMarketData();