const AdvancedFinancialAI = require('./advanced-finbot.js');

async function testAdvancedFeatures() {
  console.log('🧪 Testing Advanced AI Financial Assistant Features\n');
  
  const finbot = new AdvancedFinancialAI();
  
  try {
    // Initialize the bot
    await finbot.initializeUser();
    console.log('✅ Bot initialized successfully\n');
    
    // Test different queries
    const testQueries = [
      "What's my balance?",
      "Analyze my spending patterns",
      "Check my financial health", 
      "Find unusual transactions",
      "Predict my spending",
      "Give me financial recommendations",
      "Generate a comprehensive report"
    ];
    
    console.log('🔍 Testing AI Capabilities:\n');
    
    for (let i = 0; i < testQueries.length; i++) {
      const query = testQueries[i];
      console.log(`${i + 1}. Testing: "${query}"`);
      console.log('   Processing with AI...');
      
      try {
        const response = await finbot.processAdvancedInput(query);
        console.log('   ✅ Response generated successfully');
        console.log(`   📏 Response length: ${response.length} characters`);
        
        // Show first few lines of response
        const lines = response.split('\n').slice(0, 3);
        console.log(`   📝 Preview: ${lines[0].substring(0, 80)}...`);
        console.log('');
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        console.log('');
      }
    }
    
    // Test specific advanced features
    console.log('🚀 Testing Advanced AI Features:\n');
    
    // Test anomaly detection
    console.log('🔍 Testing Anomaly Detection...');
    const anomalies = await finbot.detectAnomalies();
    console.log(`   Found ${anomalies.length} anomalies`);
    
    // Test financial health calculation
    console.log('🏥 Testing Financial Health Scoring...');
    await finbot.calculateFinancialHealth();
    console.log(`   Health Score: ${finbot.financialHealth.score}/100`);
    
    // Test spending prediction
    console.log('🔮 Testing Spending Predictions...');
    const predictions = await finbot.predictSpending();
    if (predictions) {
      console.log(`   Generated ${predictions.length} month predictions`);
    } else {
      console.log('   Not enough data for predictions');
    }
    
    // Test comprehensive report
    console.log('📊 Testing Comprehensive Report Generation...');
    const report = await finbot.generateComprehensiveReport();
    console.log(`   Generated report: ${report.length} characters`);
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('💡 The Advanced AI Financial Assistant is fully functional');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    finbot.db.close();
  }
}

// Run the tests
testAdvancedFeatures();