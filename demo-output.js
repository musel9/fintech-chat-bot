const AdvancedFinancialAI = require('./advanced-finbot.js');

async function showSampleOutputs() {
  console.log('🎯 ADVANCED AI FINANCIAL ASSISTANT - SAMPLE OUTPUTS\n');
  console.log('=' .repeat(80));
  
  const finbot = new AdvancedFinancialAI();
  
  try {
    await finbot.initializeUser();
    
    // Sample 1: Balance Analysis
    console.log('\n🔸 SAMPLE 1: Advanced Balance Analysis');
    console.log('-'.repeat(50));
    const balance = await finbot.processAdvancedInput("What's my balance?");
    console.log(balance);
    
    // Sample 2: Financial Health
    console.log('\n🔸 SAMPLE 2: Financial Health Assessment');
    console.log('-'.repeat(50));
    const health = await finbot.processAdvancedInput("Check my financial health");
    console.log(health);
    
    // Sample 3: Spending Analysis
    console.log('\n🔸 SAMPLE 3: Advanced Spending Analysis');
    console.log('-'.repeat(50));
    const spending = await finbot.processAdvancedInput("Analyze my spending patterns");
    console.log(spending.substring(0, 800) + '...\n[Truncated for demo]');
    
    // Sample 4: Comprehensive Report
    console.log('\n🔸 SAMPLE 4: Comprehensive Financial Report');
    console.log('-'.repeat(50));
    const report = await finbot.generateComprehensiveReport();
    console.log(report.substring(0, 1000) + '...\n[Truncated for demo]');
    
    console.log('\n' + '='.repeat(80));
    console.log('✨ This demonstrates the AI\'s real analytical capabilities!');
    console.log('🚀 Ready for interactive use with: npm run advanced');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    finbot.db.close();
  }
}

showSampleOutputs();