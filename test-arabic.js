const AdvancedFinancialAI = require('./advanced-finbot.js');

async function testArabicSupport() {
  console.log('🇸🇦 Testing Arabic Language Support\n');
  
  const finbot = new AdvancedFinancialAI();
  
  try {
    await finbot.initializeUser();
    
    // Test Arabic queries
    const arabicQueries = [
      "ما رصيدي؟", 
      "اظهر المعاملات",
      "حلل إنفاقي",
      "تاريخ الإنفاق"
    ];
    
    console.log('🔍 Testing Arabic Queries:\n');
    
    for (let i = 0; i < arabicQueries.length; i++) {
      const query = arabicQueries[i];
      console.log(`${i + 1}. Arabic Query: "${query}"`);
      
      try {
        const response = await finbot.processAdvancedInput(query);
        console.log('   ✅ Arabic response generated');
        console.log(`   🔤 Language detected: ${finbot.currentLanguage}`);
        console.log(`   📝 Response preview: ${response.substring(0, 100)}...`);
        console.log('');
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        console.log('');
      }
    }
    
    console.log('🌟 Arabic language support test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    finbot.db.close();
  }
}

testArabicSupport();