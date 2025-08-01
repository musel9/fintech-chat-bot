#!/usr/bin/env node

/**
 * Demo showing what Ahmed's "last 12 transactions" response would look like
 */

const ahmedFinancialData = require('./ahmed-financial-data.js');

function mockGeminiResponse() {
  console.log('🔍 Query: "What is my last 12 transactions"\n');
  
  // Get last 12 transactions
  const last12 = ahmedFinancialData.transactions.slice(0, 12);
  
  console.log('📋 Expected Gemini Response (English):');
  console.log('─'.repeat(50));
  
  let response = '';
  last12.forEach((txn, index) => {
    const amount = txn.amount >= 0 ? `+${txn.amount.toLocaleString()}` : txn.amount.toLocaleString();
    response += `${index + 1}. ${txn.transaction_date} | ${amount} SAR | ${txn.description}\n`;
  });
  
  console.log(response);
  console.log('─'.repeat(50));
  
  // Arabic version
  console.log('\n🔍 Arabic Query: "أظهر لي آخر 12 معاملة"\n');
  console.log('📋 Expected Gemini Response (Arabic):');
  console.log('─'.repeat(50));
  
  let arabicResponse = '';
  last12.forEach((txn, index) => {
    const amount = txn.amount >= 0 ? `+${txn.amount.toLocaleString()}` : txn.amount.toLocaleString();
    arabicResponse += `${index + 1}. ${txn.transaction_date} | ${amount} ريال | ${txn.description}\n`;
  });
  
  console.log(arabicResponse);
  console.log('─'.repeat(50));
  
  // Show spending summary for context
  console.log('\n📊 Spending Analysis (Last 12 Transactions):');
  const homeSpending = last12.filter(t => t.category === 'Home & Garden').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalSpending = last12.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const income = last12.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  
  console.log(`💰 Total Income: ${income.toLocaleString()} SAR`);
  console.log(`💸 Total Spending: ${totalSpending.toLocaleString()} SAR`);
  console.log(`🏠 Home & Garden: ${homeSpending.toLocaleString()} SAR (${((homeSpending/totalSpending)*100).toFixed(1)}%)`);
  
  console.log('\n✅ This demonstrates the concise, direct response format');
  console.log('   - No extra explanations');
  console.log('   - Only the requested transaction list');
  console.log('   - Automatic language matching');
}

// Run the demo
if (require.main === module) {
  mockGeminiResponse();
}

module.exports = mockGeminiResponse;