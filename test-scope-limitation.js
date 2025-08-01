#!/usr/bin/env node

// Test script to verify strict scope limitation works correctly
const EnhancedFinancialAdvisor = require('./enhanced-financial-advisor');
const colors = require('colors');

async function testScopeLimitation() {
  console.log('🧪 Testing Strict Financial Scope Limitation System\n'.yellow.bold);
  
  const advisor = new EnhancedFinancialAdvisor();
  
  try {
    await advisor.initializeUser();
    console.log('✅ Financial advisor system initialized\n'.green);
    
    // Test cases for OUT-OF-SCOPE queries (should be rejected)
    const outOfScopeQueries = [
      // General conversation
      "Hello, how are you?",
      "What's the weather like today?",
      "Tell me a joke",
      "What's your favorite color?",
      
      // Entertainment
      "What movies should I watch?",
      "Who won the game last night?",
      "What's trending on social media?",
      "Tell me about the latest celebrity news",
      
      // Technology
      "How do I code in Python?",
      "What's the best smartphone?",
      "Help me fix my computer",
      "Explain artificial intelligence",
      
      // Health & Medical
      "I have a headache, what should I do?",
      "What are the symptoms of flu?",
      "Recommend a good doctor",
      "Is this medicine safe?",
      
      // Food & Cooking
      "What should I cook for dinner?",
      "Give me a pizza recipe",
      "Where's the best restaurant?",
      "I'm hungry, what should I eat?",
      
      // Travel
      "Plan my vacation to Paris",
      "What's the best hotel in New York?",
      "How do I get a passport?",
      "Recommend tourist attractions",
      
      // Relationships & Personal
      "I'm having relationship problems",
      "How do I make friends?",
      "What should I wear to a party?",
      "I'm feeling sad today",
      
      // Education & Career (non-financial)
      "How do I write a resume?",
      "What college should I attend?",
      "Help me with my homework",
      "What career should I choose?"
    ];
    
    // Test cases for IN-SCOPE queries (should be processed)
    const inScopeQueries = [
      // Account & Balance
      "What's my account balance?",
      "Show me my portfolio",
      "Check my net worth",
      
      // Spending & Transactions  
      "Analyze my spending patterns",
      "Show recent transactions",
      "Where does my money go?",
      
      // Investment
      "How should I invest $10,000?",
      "What stocks should I buy?",
      "Analyze the crypto market",
      
      // Budget & Planning
      "Help me create a budget",
      "How much should I save?",
      "Plan my retirement",
      
      // Debt & Credit
      "How do I pay off debt?",
      "Improve my credit score",
      "Should I refinance my mortgage?",
      
      // Security
      "Check for fraud in my account",
      "Is my account secure?",
      "Suspicious activity alert"
    ];
    
    let outOfScopePass = 0;
    let outOfScopeFail = 0;
    let inScopePass = 0;
    let inScopeFail = 0;
    
    console.log('🚫 TESTING OUT-OF-SCOPE QUERIES (should be rejected):'.red.bold);
    console.log('='.repeat(60));
    
    for (const query of outOfScopeQueries) {
      process.stdout.write(`Testing: "${query}"... `);
      
      try {
        const response = await advisor.processFinancialInput(query);
        const isRejected = response.includes('🚫 I\'m a specialized Financial Advisor AI') || 
                          response.includes('MY EXPERTISE AREAS');
        
        if (isRejected) {
          console.log('✅ CORRECTLY REJECTED'.green);
          outOfScopePass++;
        } else {
          console.log('❌ INCORRECTLY PROCESSED'.red);
          console.log(`   Response: ${response.substring(0, 100)}...`);
          outOfScopeFail++;
        }
      } catch (error) {
        console.log('❌ ERROR'.red, error.message);
        outOfScopeFail++;
      }
    }
    
    console.log('\n📊 TESTING IN-SCOPE QUERIES (should be processed):'.green.bold);
    console.log('='.repeat(60));
    
    for (const query of inScopeQueries) {
      process.stdout.write(`Testing: "${query}"... `);
      
      try {
        const response = await advisor.processFinancialInput(query);
        const isProcessed = !response.includes('🚫 I\'m a specialized Financial Advisor AI') && 
                           !response.includes('MY EXPERTISE AREAS');
        
        if (isProcessed) {
          console.log('✅ CORRECTLY PROCESSED'.green);
          inScopePass++;
        } else {
          console.log('❌ INCORRECTLY REJECTED'.red);
          console.log(`   Response: ${response.substring(0, 100)}...`);
          inScopeFail++;
        }
      } catch (error) {
        console.log('❌ ERROR'.red, error.message);
        inScopeFail++;
      }
    }
    
    // Results Summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 SCOPE LIMITATION TEST RESULTS'.bold);
    console.log('='.repeat(70));
    
    const totalOutOfScope = outOfScopePass + outOfScopeFail;
    const totalInScope = inScopePass + inScopeFail;
    const outOfScopeAccuracy = (outOfScopePass / totalOutOfScope * 100).toFixed(1);
    const inScopeAccuracy = (inScopePass / totalInScope * 100).toFixed(1);
    const overallAccuracy = ((outOfScopePass + inScopePass) / (totalOutOfScope + totalInScope) * 100).toFixed(1);
    
    console.log(`🚫 OUT-OF-SCOPE REJECTION: ${outOfScopePass}/${totalOutOfScope} (${outOfScopeAccuracy}%)`.red);
    console.log(`📊 IN-SCOPE PROCESSING: ${inScopePass}/${totalInScope} (${inScopeAccuracy}%)`.green);
    console.log(`🎯 OVERALL ACCURACY: ${overallAccuracy}%`.cyan.bold);
    
    if (outOfScopeAccuracy >= 95 && inScopeAccuracy >= 90) {
      console.log('\n🎉 SCOPE LIMITATION SYSTEM WORKING EXCELLENTLY!'.green.bold);
    } else if (outOfScopeAccuracy >= 90 && inScopeAccuracy >= 85) {
      console.log('\n✅ SCOPE LIMITATION SYSTEM WORKING WELL'.green);
    } else {
      console.log('\n⚠️  SCOPE LIMITATION SYSTEM NEEDS IMPROVEMENT'.yellow);
    }
    
    // Test the feature list response
    console.log('\n📋 TESTING FEATURE LIST RESPONSE:'.cyan.bold);
    console.log('='.repeat(50));
    
    const sampleResponse = await advisor.processFinancialInput("What's the weather like?");
    console.log(sampleResponse);
    
    advisor.db.close();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testScopeLimitation();
}

module.exports = testScopeLimitation;