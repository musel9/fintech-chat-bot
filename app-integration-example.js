const PersonalizedFinBot = require('./PersonalizedFinBot');

// Example of how to integrate the chatbot into your existing application
class FinBotAPI {
  constructor(databasePath = null) {
    this.bot = new PersonalizedFinBot(databasePath);
    this.activeSessions = new Map(); // Track active user sessions
  }

  // Initialize a user session (call when user logs into your app)
  async loginUser(customerId) {
    try {
      const result = await this.bot.setCurrentUser(customerId);
      
      if (result.success) {
        this.activeSessions.set(customerId, {
          loginTime: new Date(),
          sessionId: `session_${customerId}_${Date.now()}`,
          interactions: 0
        });
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Process user chat message
  async processMessage(customerId, message) {
    try {
      // Check if user has active session
      if (!this.activeSessions.has(customerId)) {
        // Auto-login if needed
        const loginResult = await this.loginUser(customerId);
        if (!loginResult.success) {
          return loginResult;
        }
      }

      // Process the message
      const response = await this.bot.processPersonalizedInput(message, customerId);
      
      // Update session tracking
      if (this.activeSessions.has(customerId)) {
        const session = this.activeSessions.get(customerId);
        session.interactions++;
        session.lastActivity = new Date();
        this.activeSessions.set(customerId, session);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user's financial dashboard data
  async getUserDashboard(customerId) {
    try {
      await this.bot.setCurrentUser(customerId);
      const stats = await this.bot.getUserStats(customerId);
      
      // Get recent insights
      const balanceInsight = await this.bot.processPersonalizedInput("ما رصيدي؟", customerId);
      const spendingInsight = await this.bot.processPersonalizedInput("حلل إنفاقي", customerId);
      
      return {
        success: true,
        dashboard: {
          userStats: stats,
          quickInsights: {
            balance: balanceInsight.response?.substring(0, 200) + '...',
            spending: spendingInsight.response?.substring(0, 200) + '...'
          },
          recommendations: await this.getQuickRecommendations(customerId)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get personalized recommendations for user
  async getQuickRecommendations(customerId) {
    try {
      const response = await this.bot.processPersonalizedInput("أعطني نصائح مالية", customerId);
      return response.success ? response.response : 'لا توجد توصيات متاحة حالياً';
    } catch (error) {
      return 'خطأ في جلب التوصيات';
    }
  }

  // Get all users for admin panel
  async getAllUsersWithStats() {
    try {
      const users = await this.bot.getAllUsers();
      const usersWithStats = [];

      for (const user of users) {
        const stats = await this.bot.getUserStats(user.customer_id);
        usersWithStats.push({
          ...user,
          stats: stats,
          isActive: this.activeSessions.has(user.customer_id)
        });
      }

      return {
        success: true,
        users: usersWithStats
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Logout user (cleanup session)
  logoutUser(customerId) {
    this.activeSessions.delete(customerId);
    return {
      success: true,
      message: 'User session ended'
    };
  }

  // Get session info
  getSessionInfo(customerId) {
    const session = this.activeSessions.get(customerId);
    return {
      success: true,
      session: session || null,
      isActive: !!session
    };
  }

  // Cleanup resources
  disconnect() {
    this.bot.disconnect();
    this.activeSessions.clear();
  }
}

// Demo usage for testing
async function demonstrateIntegration() {
  console.log('🚀 Demo: Integrating PersonalizedFinBot into your app\n');
  
  const api = new FinBotAPI();
  
  try {
    // 1. Login user (simulate user logging into your app)
    console.log('1. User Login...');
    const loginResult = await api.loginUser(1);
    console.log('Login Result:', loginResult.success ? '✅ Success' : '❌ Failed');
    if (loginResult.success) {
      console.log(`Welcome message: ${loginResult.message}\n`);
    }

    // 2. Process chat messages
    console.log('2. Processing chat messages...');
    const messages = [
      "ما رصيدي؟",
      "حلل إنفاقي",
      "أعطني نصائح مالية"
    ];

    for (const message of messages) {
      console.log(`User: ${message}`);
      const response = await api.processMessage(1, message);
      if (response.success) {
        console.log(`Bot: ${response.response.substring(0, 100)}...\n`);
      }
    }

    // 3. Get user dashboard
    console.log('3. Getting user dashboard...');
    const dashboard = await api.getUserDashboard(1);
    if (dashboard.success) {
      console.log('Dashboard stats:', dashboard.dashboard.userStats);
      console.log('Quick insights available ✅\n');
    }

    // 4. Get all users (admin feature)
    console.log('4. Getting all users with stats...');
    const allUsers = await api.getAllUsersWithStats();
    if (allUsers.success) {
      console.log(`Found ${allUsers.users.length} users in system`);
      console.log(`Active sessions: ${allUsers.users.filter(u => u.isActive).length}\n`);
    }

    // 5. Check session info
    console.log('5. Session information:');
    const sessionInfo = api.getSessionInfo(1);
    console.log('Session active:', sessionInfo.isActive);
    console.log('Interactions:', sessionInfo.session?.interactions || 0);

  } catch (error) {
    console.error('Demo error:', error.message);
  } finally {
    api.disconnect();
  }
}

// Export for use in your application
module.exports = {
  PersonalizedFinBot,
  FinBotAPI
};

// Run demo if called directly
if (require.main === module) {
  demonstrateIntegration();
}