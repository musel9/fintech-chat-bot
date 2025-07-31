#!/usr/bin/env node

// Test script to specifically verify single-word commands
const IntelligentFintechAI = require('./intelligent-finbot');

async function testSingleWordCommands() {
  console.log('🔍 Testing Single-Word Command Recognition\n'.yellow.bold);
  
  const finbot = new IntelligentFintechAI();
  
  try {
    await finbot.initializeUser();
    console.log('✅ AI system initialized\n'.green);
    
    const singleWordCommands = [
      { word: "balance", expected: "💰 Account Balance Overview" },
      { word: "transactions", expected: "📊 Transaction Analysis" },
      { word: "spending", expected: "💸 Spending Analysis" },
      { word: "investments", expected: "📈 Investment Information" },
      { word: "budget", expected: "📊 Budget Planning" },
      { word: "goals", expected: "🎯 Savings Goals" },
      { word: "bills", expected: "💳 Smart Bill Management" },
      { word: "fraud", expected: "🛡️ Advanced Security Analysis" }
    ];
    
    console.log('🎯 Testing Single Words:'.bold);
    console.log('========================\n');
    
    for (const test of singleWordCommands) {
      console.log(`Testing: "${test.word}"`);
      
      try {
        const response = await finbot.processIntelligentInput(test.word);
        const startsCorrectly = response.startsWith(test.expected);
        
        if (startsCorrectly) {
          console.log('✅ PASS - Correctly routed'.green);
        } else {
          console.log('❌ FAIL - Wrong handler'.red);
          console.log(`Expected: ${test.expected}`);
          console.log(`Got: ${response.split('\n')[0]}`);
        }
        
      } catch (error) {
        console.log('❌ ERROR'.red, error.message);
      }
      
      console.log('');
    }
    
    finbot.db.close();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testSingleWordCommands();
}

module.exports = testSingleWordCommands;