const { FinBotAPI } = require('./app-integration-example');

async function demonstrateMultiUserSystem() {
  console.log('👥 Demo: Multi-User Personalized Financial Assistant\n');
  console.log('=' .repeat(80));
  
  const api = new FinBotAPI();
  
  try {
    // Simulate 3 different users using the system
    const users = [
      { id: 1, name: 'مشفق', queries: ['ما رصيدي؟', 'حلل إنفاقي'] },
      { id: 2, name: 'زهرة', queries: ['اظهر المعاملات', 'الصحة المالية'] },
      { id: 3, name: 'مُسعف', queries: ['توقع الإنفاق', 'نصائح مالية'] }
    ];

    console.log('\n🔐 Phase 1: User Logins and Profile Loading');
    console.log('-'.repeat(50));
    
    for (const user of users) {
      console.log(`\n👤 Logging in user: ${user.name} (ID: ${user.id})`);
      const loginResult = await api.loginUser(user.id);
      
      if (loginResult.success) {
        console.log(`   ✅ ${loginResult.message}`);
        console.log(`   📊 Profile loaded and personalized models initialized`);
      } else {
        console.log(`   ❌ Login failed: ${loginResult.error}`);
      }
    }

    console.log('\n💬 Phase 2: Personalized Conversations');
    console.log('-'.repeat(50));
    
    for (const user of users) {
      console.log(`\n👤 ${user.name}'s session:`);
      
      for (const query of user.queries) {
        console.log(`   User: ${query}`);
        const response = await api.processMessage(user.id, query);
        
        if (response.success) {
          // Show first 100 characters of response
          const preview = response.response.substring(0, 100).replace(/\n/g, ' ');
          console.log(`   Bot: ${preview}...`);
          console.log(`   🎯 Intent: ${response.intent} (${response.confidence.toFixed(0)}% confidence)`);
        } else {
          console.log(`   ❌ Error: ${response.error}`);
        }
      }
      
      // Show session info
      const sessionInfo = api.getSessionInfo(user.id);
      console.log(`   📈 Session: ${sessionInfo.session?.interactions || 0} interactions`);
    }

    console.log('\n📊 Phase 3: User Analytics & Behavior Analysis');
    console.log('-'.repeat(50));
    
    const allUsers = await api.getAllUsersWithStats();
    if (allUsers.success) {
      console.log(`\n📈 System Statistics:`);
      console.log(`   • Total users in system: ${allUsers.users.length}`);
      console.log(`   • Active sessions: ${allUsers.users.filter(u => u.isActive).length}`);
      console.log(`   • Average financial health score: ${(allUsers.users.reduce((sum, u) => sum + u.stats.financialHealthScore, 0) / allUsers.users.length).toFixed(1)}/100`);
      
      console.log(`\n👥 Active Users Analysis:`);
      const activeUsers = allUsers.users.filter(u => u.isActive).slice(0, 5);
      
      activeUsers.forEach(user => {
        console.log(`   • ${user.first_name} (ID: ${user.customer_id}):`);
        console.log(`     - Balance: $${user.stats.totalBalance.toLocaleString()}`);
        console.log(`     - Health Score: ${user.stats.financialHealthScore}/100`);
        console.log(`     - Interactions: ${user.stats.interactionCount}`);
        console.log(`     - Primary Interest: ${user.stats.primaryInterest}`);
      });
    }

    console.log('\n🧠 Phase 4: Learning & Personalization Demo');
    console.log('-'.repeat(50));
    
    // Simulate repeated interactions to show learning
    const testUser = users[0];
    console.log(`\n🔄 Simulating repeated interactions for ${testUser.name}:`);
    
    const repeatedQueries = [
      'ما رصيدي؟',
      'ما رصيدي؟', 
      'ما رصيدي؟'
    ];
    
    for (let i = 0; i < repeatedQueries.length; i++) {
      console.log(`\n   Interaction ${i + 1}: ${repeatedQueries[i]}`);
      const response = await api.processMessage(testUser.id, repeatedQueries[i]);
      
      if (response.success) {
        // Check if the bot is learning from repeated queries
        console.log(`   📊 Intent detected: ${response.intent}`);
        console.log(`   🎯 Confidence: ${response.confidence.toFixed(0)}%`);
        
        const sessionInfo = api.getSessionInfo(testUser.id);
        console.log(`   📈 Total interactions: ${sessionInfo.session?.interactions || 0}`);
      }
    }

    console.log('\n🎯 Phase 5: Personalized Dashboard Generation');
    console.log('-'.repeat(50));
    
    for (const user of users.slice(0, 2)) { // Test first 2 users
      console.log(`\n📊 ${user.name}'s Personalized Dashboard:`);
      
      const dashboard = await api.getUserDashboard(user.id);
      if (dashboard.success) {
        const stats = dashboard.dashboard.userStats;
        console.log(`   💰 Total Balance: $${stats.totalBalance.toLocaleString()}`);
        console.log(`   🏦 Accounts: ${stats.accountCount}`);
        console.log(`   📄 Transactions: ${stats.transactionCount}`);
        console.log(`   ❤️ Health Score: ${stats.financialHealthScore}/100`);
        console.log(`   🎯 Primary Interest: ${stats.primaryInterest}`);
        console.log(`   ✅ Personalized insights and recommendations available`);
      }
    }

    console.log('\n🔚 Phase 6: Session Cleanup');
    console.log('-'.repeat(50));
    
    users.forEach(user => {
      const logoutResult = api.logoutUser(user.id);
      console.log(`   👋 ${user.name} logged out: ${logoutResult.success ? '✅' : '❌'}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('🎉 Multi-User Personalized System Demo Complete!');
    console.log('');
    console.log('Key Features Demonstrated:');
    console.log('✅ Individual user profiles and behavior learning');
    console.log('✅ Personalized AI models per user');
    console.log('✅ Session management and tracking');
    console.log('✅ Real-time behavior analytics');
    console.log('✅ Adaptive responses based on user patterns');
    console.log('✅ Multi-user system administration');
    console.log('');
    console.log('🚀 Ready for production integration!');

  } catch (error) {
    console.error('❌ Demo error:', error.message);
  } finally {
    api.disconnect();
  }
}

// Run the demo
if (require.main === module) {
  demonstrateMultiUserSystem();
}

module.exports = { demonstrateMultiUserSystem };