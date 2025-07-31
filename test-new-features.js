const EnhancedFinancialAdvisor = require('./enhanced-financial-advisor');

// Test script for new savings goals and fraud detection features
async function testNewFeatures() {
  console.log('🧪 Testing New Features: Savings Goals & Fraud Detection\n'.cyan);
  
  const advisor = new EnhancedFinancialAdvisor();
  
  try {
    // Initialize the advisor
    console.log('📋 Initializing Financial Advisor...'.yellow);
    await advisor.initializeAdvancedSystem();
    
    // Try to initialize user (may fail if no database)
    try {
      await advisor.initializeUser();
      console.log('✅ User initialized successfully'.green);
    } catch (error) {
      console.log('⚠️ Using default user profile (no database connection)'.yellow);
    }
    
    console.log('\n--- TESTING SAVINGS GOALS FEATURE ---\n'.cyan);
    
    // Test 1: Creating a new savings goal
    console.log('🧪 Test 1: Creating a vacation savings goal');
    const savingsGoalTest1 = await advisor.processFinancialInput("I want to create a savings goal for a $5000 vacation");
    console.log(savingsGoalTest1);
    console.log('\n' + '─'.repeat(80) + '\n');
    
    // Test 2: General savings guidance
    console.log('🧪 Test 2: General savings advice');
    const savingsGoalTest2 = await advisor.processFinancialInput("help me with savings goals");
    console.log(savingsGoalTest2);
    console.log('\n' + '─'.repeat(80) + '\n');
    
    // Test 3: Emergency fund planning
    console.log('🧪 Test 3: Emergency fund planning');
    const savingsGoalTest3 = await advisor.processFinancialInput("how much should I save for emergency fund");
    console.log(savingsGoalTest3);
    console.log('\n' + '─'.repeat(80) + '\n');
    
    console.log('\n--- TESTING FRAUD DETECTION FEATURE ---\n'.cyan);
    
    // Test 4: Fraud detection analysis
    console.log('🧪 Test 4: Fraud detection analysis');
    const fraudTest1 = await advisor.processFinancialInput("check my account for fraud");
    console.log(fraudTest1);
    console.log('\n' + '─'.repeat(80) + '\n');
    
    // Test 5: Security advice
    console.log('🧪 Test 5: General fraud protection advice');
    const fraudTest2 = await advisor.processFinancialInput("fraud protection tips");
    console.log(fraudTest2);
    console.log('\n' + '─'.repeat(80) + '\n');
    
    // Test 6: Suspicious transaction inquiry
    console.log('🧪 Test 6: Suspicious transaction inquiry');
    const fraudTest3 = await advisor.processFinancialInput("I see suspicious activity on my account");
    console.log(fraudTest3);
    console.log('\n' + '─'.repeat(80) + '\n');
    
    console.log('✅ All feature tests completed successfully!'.green);
    
    // Test non-financial question to ensure filtering still works
    console.log('\n--- TESTING NON-FINANCIAL FILTERING ---\n'.cyan);
    console.log('🧪 Test 7: Non-financial question filtering');
    const nonFinancialTest = await advisor.processFinancialInput("what's the weather like today?");
    console.log(nonFinancialTest);
    
  } catch (error) {
    console.error('❌ Test Error:'.red, error.message);
  } finally {
    // Close database connection if open
    if (advisor.db) {
      advisor.db.close();
    }
  }
}

// Run the tests
if (require.main === module) {
  testNewFeatures().then(() => {
    console.log('\n🎉 Feature testing complete!'.rainbow);
  }).catch(error => {
    console.error('Test failed:', error);
  });
}

module.exports = testNewFeatures;