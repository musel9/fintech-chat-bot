const GeminiFinancialService = require('./gemini-service.js');

async function quickTest() {
  try {
    console.log('🧪 Testing Gemini API integration...');
    
    // Test with your API key
    const gemini = new GeminiFinancialService(process.env.GEMINI_API_KEY || 'AIzaSyDAv-_7NZbS90Hx3jsr7zuu2c8civtwtGI');
    
    // Test basic connection
    console.log('1. Testing API connection...');
    const healthCheck = await gemini.testConnection();
    console.log('✅ Health check:', healthCheck);
    
    // Test with financial context
    console.log('\n2. Testing with financial context...');
    const mockFinancialData = {
      balance: [
        { account_type: 'Checking', balance: 5240, currency: 'USD' },
        { account_type: 'Savings', balance: 8180, currency: 'USD' }
      ],
      transactions: [
        { amount: -120, description: 'Grocery Store', transaction_type: 'Debit' },
        { amount: -45, description: 'Gas Station', transaction_type: 'Debit' },
        { amount: 2500, description: 'Salary Deposit', transaction_type: 'Credit' }
      ],
      userProfile: {
        riskTolerance: 'moderate',
        investmentExperience: 'beginner'
      }
    };
    
    const response = await gemini.generateResponse(
      "Should I invest more money this month?", 
      mockFinancialData
    );
    
    console.log('✅ Gemini Response:', response);
    
    if (response.success) {
      console.log('\n🎉 Integration successful!');
      console.log('Response preview:', response.response.substring(0, 200) + '...');
    } else {
      console.log('❌ Integration failed:', response.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

if (require.main === module) {
  quickTest();
}