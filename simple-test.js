const axios = require('axios');

async function testChat() {
  try {
    console.log('🧪 Testing Gemini integration...');
    
    const response = await axios.post('http://localhost:3002/chat', {
      message: "I have $10,000 saved. Should I invest it or keep saving?"
    });
    
    console.log('\n✅ Response received:');
    console.log('Model:', response.data.model);
    console.log('Source:', response.data.source);
    console.log('Success:', response.data.success);
    console.log('\nResponse preview:');
    console.log(response.data.response.substring(0, 300) + '...\n');
    
    if (response.data.model === 'gemini-1.5-flash') {
      console.log('🎉 SUCCESS: Gemini is working!');
    } else {
      console.log('⚠️  Using fallback model');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testChat();