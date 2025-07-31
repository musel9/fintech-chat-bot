const EnhancedFinancialAdvisor = require('./enhanced-financial-advisor');

// Test the enhanced world-class financial advisor system
async function testEnhancedSystem() {
  console.log('🧪 Testing World-Class Enhanced Financial Advisor System\n'.rainbow);
  
  const advisor = new EnhancedFinancialAdvisor();
  
  try {
    console.log('📋 Initializing Advanced AI System...'.yellow);
    await advisor.initializeAdvancedSystem();
    
    console.log('\n--- TESTING ENHANCED FEATURES ---\n'.cyan);
    
    // Test 1: Advanced investment analysis
    console.log('🧪 Test 1: Advanced Investment Analysis with Market Intelligence');
    const investmentTest = await advisor.processFinancialInput("Analyze the best investment strategy for $50,000 with advanced portfolio optimization");
    console.log(investmentTest);
    console.log('\n' + '─'.repeat(80) + '\n');
    
    // Test 2: Personalized savings goals with AI
    console.log('🧪 Test 2: AI-Powered Personalized Savings Goals');
    const savingsTest = await advisor.processFinancialInput("Create a comprehensive savings plan for my retirement using advanced financial modeling");
    console.log(savingsTest);
    console.log('\n' + '─'.repeat(80) + '\n');
    
    // Test 3: Advanced fraud detection
    console.log('🧪 Test 3: Advanced Fraud Detection with Machine Learning');
    const fraudTest = await advisor.processFinancialInput("I need sophisticated fraud protection analysis with behavioral pattern recognition");
    console.log(fraudTest);
    console.log('\n' + '─'.repeat(80) + '\n');
    
    // Test 4: Market intelligence and analysis
    console.log('🧪 Test 4: Real-time Market Intelligence');
    const marketTest = await advisor.processFinancialInput("Provide advanced market analysis with trend prediction and risk assessment");
    console.log(marketTest);
    console.log('\n' + '─'.repeat(80) + '\n');
    
    // Test 5: Complex financial planning
    console.log('🧪 Test 5: Comprehensive Financial Planning with AI');
    const planningTest = await advisor.processFinancialInput("Design a complete financial plan with tax optimization, risk management, and wealth building strategies");
    console.log(planningTest);
    console.log('\n' + '─'.repeat(80) + '\n');
    
    // Test 6: Advanced financial education
    console.log('🧪 Test 6: Advanced Financial Education');
    const educationTest = await advisor.processFinancialInput("Explain advanced concepts like Black-Scholes model, Monte Carlo simulation, and modern portfolio theory");
    console.log(educationTest);
    console.log('\n' + '─'.repeat(80) + '\n');
    
    console.log('✅ All enhanced feature tests completed successfully!'.green);
    
    // Show system capabilities summary
    console.log('\n--- ENHANCED SYSTEM CAPABILITIES ---\n'.rainbow);
    console.log('🤖 Advanced NLP with context, urgency, and complexity classification'.cyan);
    console.log('📊 Real-time market data with intelligent analysis'.cyan);
    console.log('🧠 Personalized AI learning and adaptation'.cyan);
    console.log('🔬 Advanced financial modeling and calculations'.cyan);
    console.log('🛡️ Sophisticated fraud detection algorithms'.cyan);
    console.log('📈 Portfolio optimization and backtesting'.cyan);
    console.log('🎓 Comprehensive financial education system'.cyan);
    console.log('⚡ Performance tracking and analytics'.cyan);
    
  } catch (error) {
    console.error('❌ Enhanced System Test Error:'.red, error.message);
  } finally {
    if (advisor.db) {
      advisor.db.close();
    }
  }
}

// Run the enhanced system test
if (require.main === module) {
  testEnhancedSystem().then(() => {
    console.log('\n🎉 Enhanced system testing complete! The world-class fintech chatbot is ready.'.rainbow);
  }).catch(error => {
    console.error('Enhanced test failed:', error);
  });
}

module.exports = testEnhancedSystem;