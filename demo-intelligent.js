#!/usr/bin/env node

// Demo script for the Intelligent Fintech AI Chatbot
// This showcases all the enhanced features and capabilities

const IntelligentFintechAI = require('./intelligent-finbot');

async function runIntelligentDemo() {
  console.log('🚀 Demonstrating Intelligent Fintech AI Capabilities\n'.rainbow);
  
  const finbot = new IntelligentFintechAI();
  
  try {
    await finbot.initializeUser();
    console.log('✅ AI systems initialized successfully!\n'.green);
    
    // Demo queries showcasing different capabilities
    const demoQueries = [
      {
        query: "What's my current financial status?",
        feature: "Enhanced Portfolio Analysis"
      },
      {
        query: "Show me my investment options",
        feature: "Investment Intelligence & Market Data"
      },
      {
        query: "Analyze my spending patterns",
        feature: "Intelligent Transaction Analysis"
      },
      {
        query: "Check for any fraudulent activity",
        feature: "Advanced Fraud Detection"
      },
      {
        query: "Create a personalized budget plan",
        feature: "Smart Budget Planning"
      },
      {
        query: "I want to save $50000 for a house",
        feature: "Goal Setting & Planning"
      },
      {
        query: "What bills do I have coming up?",
        feature: "Bill Management System"
      },
      {
        query: "Give me personalized financial advice",
        feature: "AI Financial Coaching"
      },
      {
        query: "Show me today's market news",
        feature: "Real-time Market Intelligence"
      },
      {
        query: "Help me with mortgage planning",
        feature: "Loan & Mortgage Analysis"
      }
    ];
    
    for (const demo of demoQueries) {
      console.log(`🎯 FEATURE: ${demo.feature}`.cyan.bold);
      console.log(`📝 Query: "${demo.query}"`);
      console.log('─'.repeat(80));
      
      const startTime = Date.now();
      const response = await finbot.processIntelligentInput(demo.query);
      const processingTime = Date.now() - startTime;
      
      console.log(response);
      console.log(`\n⚡ Processed in ${processingTime}ms`.gray);
      console.log('═'.repeat(80) + '\n');
      
      // Small delay between demos for readability
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Show summary of capabilities
    console.log('🎉 INTELLIGENT FINTECH AI CAPABILITIES SUMMARY'.rainbow.bold);
    console.log('═'.repeat(80));
    console.log('✅ Advanced Natural Language Processing (12 intent categories)'.green);
    console.log('✅ Real-time Market Data Integration'.green);
    console.log('✅ Intelligent Transaction Categorization'.green);
    console.log('✅ Advanced Fraud Detection & Security Alerts'.green);
    console.log('✅ Personalized Budget Planning & Optimization'.green);
    console.log('✅ Investment Portfolio Management & Recommendations'.green);
    console.log('✅ Goal Setting & Progress Tracking'.green);
    console.log('✅ Bill Management & Payment Reminders'.green);
    console.log('✅ AI-Powered Financial Coaching & Education'.green);
    console.log('✅ Predictive Analytics & Insights'.green);
    console.log('✅ Conversation Context & Memory'.green);
    console.log('✅ Automated Tasks & Notifications'.green);
    console.log('═'.repeat(80));
    
    finbot.db.close();
    
  } catch (error) {
    console.error('❌ Demo error:'.red, error.message);
  }
}

// Run the demo
if (require.main === module) {
  runIntelligentDemo();
}

module.exports = runIntelligentDemo;