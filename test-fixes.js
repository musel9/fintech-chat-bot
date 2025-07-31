#!/usr/bin/env node

// Test the specific fixes we just made
const IntelligentFintechAI = require('./intelligent-finbot');

async function testFixes() {
  console.log('🔧 Testing Fixed Commands\n'.yellow.bold);
  
  const finbot = new IntelligentFintechAI();
  
  try {
    await finbot.initializeUser();
    console.log('✅ AI system initialized\n'.green);
    
    const fixedCommands = [
      { cmd: "market data", expect: "📈 Investment Information" },
      { cmd: "insurance options", expect: "🛡️ Insurance Analysis" },
      { cmd: "life insurance", expect: "🛡️ Insurance Analysis" },
      { cmd: "insurance quote", expect: "🛡️ Insurance Analysis" },
      { cmd: "coverage options", expect: "🛡️ Insurance Analysis" }
    ];
    
    console.log('🎯 Testing Fixed Commands:'.bold);
    console.log('=========================\n');
    
    for (const test of fixedCommands) {
      console.log(`Testing: "${test.cmd}"`);
      
      try {
        const response = await finbot.processIntelligentInput(test.cmd);
        const firstLine = response.split('\n')[0];
        const startsCorrectly = response.startsWith(test.expect);
        
        if (startsCorrectly) {
          console.log('✅ FIXED - Now working correctly'.green);
          console.log(`Response: ${firstLine}\n`);
        } else {
          console.log('❌ STILL BROKEN'.red);
          console.log(`Expected: ${test.expect}`);
          console.log(`Got: ${firstLine}\n`);
        }
        
      } catch (error) {
        console.log('❌ ERROR'.red, error.message);
      }
    }
    
    finbot.db.close();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testFixes();
}

module.exports = testFixes;