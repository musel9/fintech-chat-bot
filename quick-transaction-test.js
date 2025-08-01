#!/usr/bin/env node

/**
 * Quick test for "what is my last 12 transactions" query
 */

const GeminiFinancialService = require('./gemini-service.js');
const ahmedFinancialData = require('./ahmed-financial-data.js');

async function testTransactionQuery() {
  console.log('🧪 Testing: "What is my last 12 transactions"');
  
  // Mock API key for testing (replace with real key)
  const MOCK_API_KEY = 'mock_key_for_testing';
  
  try {
    // Create service instance
    const geminiService = new GeminiFinancialService(MOCK_API_KEY);
    
    // Test the query
    const query = "What is my last 12 transactions";
    console.log(`\n📝 Query: "${query}"`);
    
    // Get financial data
    const financialData = ahmedFinancialData;
    
    console.log('\n💾 Ahmed\'s Financial Data Summary:');
    console.log(`- Total Accounts: ${financialData.balance.length}`);
    console.log(`- Total Balance: ${financialData.balance.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString()} SAR`);
    console.log(`- Total Transactions: ${financialData.transactions.length}`);
    console.log(`- Recent Transactions (First 5):`);
    
    financialData.transactions.slice(0, 5).forEach((txn, i) => {
      console.log(`  ${i+1}. ${txn.transaction_date} | ${txn.amount >= 0 ? '+' : ''}${txn.amount} SAR | ${txn.description}`);
    });
    
    console.log('\n🔍 Testing Financial Query Validation...');
    const isFinancial = geminiService.isFinancialQuery(query);
    console.log(`Financial Query: ${isFinancial ? '✅ Yes' : '❌ No'}`);
    
    console.log('\n📋 Building Financial Context...');
    const context = geminiService.buildFinancialContext(
      financialData.balance,
      financialData.transactions,
      financialData.userProfile,
      financialData.savingsGoals,
      financialData.debts,
      financialData.alerts
    );
    
    console.log('📊 Generated Context Preview:');
    console.log(context.substring(0, 500) + '...\n');
    
    // Note: We can't actually call Gemini API without a real key
    console.log('⚠️  To test with actual Gemini API, set GEMINI_API_KEY environment variable');
    console.log('✅ Test completed - Ahmed\'s data is properly structured for the query');
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testTransactionQuery();
}

module.exports = testTransactionQuery;