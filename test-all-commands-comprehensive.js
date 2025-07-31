#!/usr/bin/env node

// Comprehensive test of ALL commands to find what's broken
const IntelligentFintechAI = require('./intelligent-finbot');

async function testAllCommandsComprehensive() {
  console.log('🔧 COMPREHENSIVE COMMAND TESTING - Finding ALL Issues\n'.red.bold);
  
  const finbot = new IntelligentFintechAI();
  
  try {
    await finbot.initializeUser();
    console.log('✅ AI system initialized\n'.green);
    
    // Test EVERY possible command variation
    const allCommands = [
      // Balance commands
      { cmd: "balance", expect: "💰 Account Balance Overview" },
      { cmd: "my balance", expect: "💰 Account Balance Overview" },
      { cmd: "account balance", expect: "💰 Account Balance Overview" },
      { cmd: "what's my balance", expect: "💰 Account Balance Overview" },
      { cmd: "net worth", expect: "💰 Account Balance Overview" },
      
      // Transaction commands
      { cmd: "transactions", expect: "📊 Transaction Analysis" },
      { cmd: "my transactions", expect: "📊 Transaction Analysis" },
      { cmd: "transaction history", expect: "📊 Transaction Analysis" },
      { cmd: "recent activity", expect: "📊 Transaction Analysis" },
      { cmd: "cash flow", expect: "📊 Transaction Analysis" },
      
      // Spending commands
      { cmd: "spending", expect: "💸 Spending Analysis" },
      { cmd: "analyze spending", expect: "💸 Spending Analysis" },
      { cmd: "spending patterns", expect: "💸 Spending Analysis" },
      { cmd: "expenses", expect: "💸 Spending Analysis" },
      { cmd: "where does money go", expect: "💸 Spending Analysis" },
      
      // Investment commands
      { cmd: "investments", expect: "📈 Investment Information" },
      { cmd: "investment portfolio", expect: "📈 Investment Information" },
      { cmd: "stock prices", expect: "📈 Investment Information" },
      { cmd: "market data", expect: "📈 Investment Information" },
      { cmd: "show investments", expect: "📈 Investment Information" },
      
      // Budget commands
      { cmd: "budget", expect: "📊 Budget Planning" },
      { cmd: "create budget", expect: "📊 Budget Planning" },
      { cmd: "budget planning", expect: "📊 Budget Planning" },
      { cmd: "monthly budget", expect: "📊 Budget Planning" },
      { cmd: "help me budget", expect: "📊 Budget Planning" },
      
      // Goal commands
      { cmd: "goals", expect: "🎯 Savings Goals" },
      { cmd: "savings goal", expect: "🎯 Savings Goals" },
      { cmd: "financial goals", expect: "🎯 Savings Goals" },
      { cmd: "I want to save $5000", expect: "🎯 Savings Goals" },
      { cmd: "retirement planning", expect: "🎯 Savings Goals" },
      
      // Bill commands
      { cmd: "bills", expect: "💳 Smart Bill Management" },
      { cmd: "upcoming bills", expect: "💳 Smart Bill Management" },
      { cmd: "bill reminder", expect: "💳 Smart Bill Management" },
      { cmd: "what bills are due", expect: "💳 Smart Bill Management" },
      { cmd: "payment schedule", expect: "💳 Smart Bill Management" },
      
      // Fraud commands
      { cmd: "fraud", expect: "🛡️ Advanced Security Analysis" },
      { cmd: "check for fraud", expect: "🛡️ Advanced Security Analysis" },
      { cmd: "security check", expect: "🛡️ Advanced Security Analysis" },
      { cmd: "suspicious activity", expect: "🛡️ Advanced Security Analysis" },
      { cmd: "account security", expect: "🛡️ Advanced Security Analysis" },
      
      // Financial advice commands
      { cmd: "financial advice", expect: "💡 Personalized Financial Coaching" },
      { cmd: "money tips", expect: "💡 Personalized Financial Coaching" },
      { cmd: "give me advice", expect: "💡 Personalized Financial Coaching" },
      { cmd: "help with money", expect: "💡 Personalized Financial Coaching" },
      { cmd: "financial guidance", expect: "💡 Personalized Financial Coaching" },
      
      // Market news commands
      { cmd: "market news", expect: "📰 Market News & Analysis" },
      { cmd: "financial news", expect: "📰 Market News & Analysis" },
      { cmd: "market update", expect: "📰 Market News & Analysis" },
      { cmd: "economic news", expect: "📰 Market News & Analysis" },
      
      // Loan/Mortgage commands
      { cmd: "loan options", expect: "🏠 Loan & Mortgage Analysis" },
      { cmd: "mortgage rates", expect: "🏠 Loan & Mortgage Analysis" },
      { cmd: "help with mortgage", expect: "🏠 Loan & Mortgage Analysis" },
      { cmd: "credit score", expect: "🏠 Loan & Mortgage Analysis" },
      
      // Insurance commands
      { cmd: "insurance options", expect: "🛡️ Insurance Analysis" },
      { cmd: "life insurance", expect: "🛡️ Insurance Analysis" },
      { cmd: "insurance quote", expect: "🛡️ Insurance Analysis" },
      { cmd: "coverage options", expect: "🛡️ Insurance Analysis" }
    ];
    
    let passCount = 0;
    let failCount = 0;
    const failures = [];
    
    console.log('🎯 Testing ALL Commands:'.bold);
    console.log('========================\n');
    
    for (const test of allCommands) {
      process.stdout.write(`Testing: "${test.cmd}"... `);
      
      try {
        const response = await finbot.processIntelligentInput(test.cmd);
        const firstLine = response.split('\n')[0];
        const startsCorrectly = response.startsWith(test.expect);
        
        if (startsCorrectly) {
          console.log('✅ PASS'.green);
          passCount++;
        } else {
          console.log('❌ FAIL'.red);
          console.log(`  Expected: ${test.expect}`);
          console.log(`  Got: ${firstLine}`);
          failCount++;
          failures.push({
            command: test.cmd,
            expected: test.expect,
            actual: firstLine
          });
        }
        
      } catch (error) {
        console.log('❌ ERROR'.red, error.message);
        failCount++;
        failures.push({
          command: test.cmd,
          expected: test.expect,
          actual: `ERROR: ${error.message}`
        });
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE TEST RESULTS'.bold);
    console.log('='.repeat(60));
    console.log(`✅ PASSED: ${passCount}`.green);
    console.log(`❌ FAILED: ${failCount}`.red);
    console.log(`📊 SUCCESS RATE: ${((passCount / (passCount + failCount)) * 100).toFixed(1)}%`);
    
    if (failures.length > 0) {
      console.log('\n❌ FAILED COMMANDS:'.red.bold);
      console.log('-'.repeat(40));
      failures.forEach(fail => {
        console.log(`Command: "${fail.command}"`);
        console.log(`Expected: ${fail.expected}`);
        console.log(`Got: ${fail.actual}`);
        console.log('');
      });
    } else {
      console.log('\n🎉 ALL COMMANDS WORKING PERFECTLY!'.green.bold);
    }
    
    finbot.db.close();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testAllCommandsComprehensive();
}

module.exports = testAllCommandsComprehensive;