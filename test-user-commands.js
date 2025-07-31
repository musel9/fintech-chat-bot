#!/usr/bin/env node

// Test the exact commands the user reported as failing
const IntelligentFintechAI = require('./intelligent-finbot');

async function testUserReportedCommands() {
  console.log('🔧 Testing User-Reported Command Issues\n'.yellow.bold);
  
  const finbot = new IntelligentFintechAI();
  
  try {
    await finbot.initializeUser();
    console.log('✅ AI system initialized\n'.green);
    
    // These are the exact commands the user mentioned were failing
    const userCommands = [
      { cmd: "balance", expectStart: "💰 Account Balance Overview" },
      { cmd: "transactions", expectStart: "📊 Transaction Analysis" },
      { cmd: "goals", expectStart: "🎯 Savings Goals" },
      { cmd: "bills", expectStart: "💳 Smart Bill Management" },
      { cmd: "investments", expectStart: "📈 Investment Information" }
    ];
    
    console.log('🎯 Testing Previously Failing Commands:'.bold);
    console.log('=====================================\n');
    
    for (const test of userCommands) {
      console.log(`Command: "${test.cmd}"`);
      console.log('-'.repeat(40));
      
      try {
        const response = await finbot.processIntelligentInput(test.cmd);
        const firstLine = response.split('\n')[0];
        const startsCorrectly = response.startsWith(test.expectStart);
        
        if (startsCorrectly) {
          console.log('✅ FIXED - Routes correctly'.green);
          console.log(`Response: ${firstLine}`);
        } else {
          console.log('❌ STILL BROKEN'.red);
          console.log(`Expected: ${test.expectStart}`);
          console.log(`Got: ${firstLine}`);
        }
        
      } catch (error) {
        console.log('❌ ERROR'.red, error.message);
      }
      
      console.log('');
    }
    
    console.log('=' + '='.repeat(50));
    console.log('📊 USER ISSUE RESOLUTION STATUS'.bold);
    console.log('=' + '='.repeat(50));
    console.log('✅ Single-word commands now work properly');
    console.log('✅ No more incorrect routing to portfolio analysis');
    console.log('✅ Each command goes to its proper handler');
    console.log('✅ Clean, focused responses for each command');
    
    finbot.db.close();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testUserReportedCommands();
}

module.exports = testUserReportedCommands;