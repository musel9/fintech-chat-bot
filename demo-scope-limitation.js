#!/usr/bin/env node

// Interactive demo to showcase the scope limitation system
const EnhancedFinancialAdvisor = require('./enhanced-financial-advisor');
const readline = require('readline');
const colors = require('colors');

async function startDemo() {
  console.log('🏦 FINTECH CHATBOT - SCOPE LIMITATION DEMO\n'.cyan.bold);
  
  const advisor = new EnhancedFinancialAdvisor();
  await advisor.initializeUser();
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log('✅ Financial Advisor System Ready!\n'.green);
  console.log('📋 DEMO INSTRUCTIONS:'.yellow.bold);
  console.log('• Ask financial questions to see expert responses');
  console.log('• Ask non-financial questions to see scope limitation');
  console.log('• Type "exit" to quit the demo\n');
  
  console.log('💡 TRY THESE EXAMPLES:'.blue.bold);
  console.log('📊 Financial: "What\'s my balance?", "How should I invest $10,000?"');
  console.log('🚫 Non-Financial: "What\'s the weather?", "Tell me a joke"\n');
  
  const askQuestion = () => {
    rl.question('💬 You: '.green, async (input) => {
      if (input.toLowerCase().trim() === 'exit') {
        console.log('\n👋 Thank you for using Enhanced Financial Advisor!'.cyan.bold);
        advisor.db.close();
        rl.close();
        return;
      }
      
      try {
        console.log('\n🤖 Financial Advisor:'.blue.bold);
        const startTime = Date.now();
        const response = await advisor.processFinancialInput(input);
        const processingTime = Date.now() - startTime;
        
        console.log(response);
        console.log(`\n⚡ Processed in ${processingTime}ms`.gray);
        console.log(''.padEnd(80, '='));
        
      } catch (error) {
        console.error('❌ Error:'.red, error.message);
      }
      
      askQuestion();
    });
  };
  
  askQuestion();
}

// Start the demo
if (require.main === module) {
  startDemo();
}

module.exports = startDemo;