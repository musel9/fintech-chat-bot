const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiFinancialService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // System prompt for financial advisory context
    this.systemPrompt = `You are an expert financial advisor with access to the user's complete financial profile. 
Provide personalized, actionable financial advice based on their specific situation. 

Key Guidelines:
- Always reference their actual financial data when relevant
- Provide specific recommendations based on their balance, transactions, and financial patterns
- Consider their risk tolerance and financial goals
- Explain complex financial concepts in simple terms
- Be encouraging but realistic about financial planning
- Suggest concrete next steps they can take

Always maintain a professional yet friendly tone that builds confidence in financial decision-making.`;
  }

  async enrichUserContext(userMessage, financialData) {
    const { balance, transactions, userProfile } = financialData;
    
    // Create comprehensive financial context
    const financialContext = this.buildFinancialContext(balance, transactions, userProfile);
    
    // Construct enriched prompt
    const enrichedPrompt = `
${this.systemPrompt}

CURRENT USER FINANCIAL PROFILE:
${financialContext}

USER'S QUESTION/REQUEST:
${userMessage}

Please provide a personalized response based on their specific financial situation.`;

    return enrichedPrompt;
  }

  buildFinancialContext(accounts, transactions, userProfile) {
    let context = '';
    
    // Account balances and summary
    if (accounts && accounts.length > 0) {
      const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
      context += `ACCOUNT SUMMARY:\n`;
      context += `Total Balance: $${totalBalance.toLocaleString()}\n`;
      context += `Active Accounts: ${accounts.length}\n`;
      
      accounts.forEach(acc => {
        context += `- ${acc.account_type}: $${acc.balance.toLocaleString()} ${acc.currency}\n`;
      });
      context += '\n';
    }

    // Recent transaction patterns
    if (transactions && transactions.length > 0) {
      const recentTransactions = transactions.slice(0, 10);
      const totalSpent = transactions
        .filter(t => t.transaction_type === 'Debit' || t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const totalEarned = transactions
        .filter(t => t.transaction_type === 'Credit' || t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

      context += `RECENT FINANCIAL ACTIVITY (Last ${transactions.length} transactions):\n`;
      context += `Total Income: $${totalEarned.toLocaleString()}\n`;
      context += `Total Spending: $${totalSpent.toLocaleString()}\n`;
      context += `Net Flow: $${(totalEarned - totalSpent).toLocaleString()}\n`;
      
      // Spending categories analysis
      const categories = this.analyzeSpendingCategories(transactions);
      if (Object.keys(categories).length > 0) {
        context += `Top Spending Categories:\n`;
        Object.entries(categories)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .forEach(([category, amount]) => {
            context += `- ${category}: $${amount.toLocaleString()}\n`;
          });
      }
      context += '\n';
    }

    // User profile information
    if (userProfile) {
      context += `USER PROFILE:\n`;
      if (userProfile.riskTolerance) context += `Risk Tolerance: ${userProfile.riskTolerance}\n`;
      if (userProfile.investmentExperience) context += `Investment Experience: ${userProfile.investmentExperience}\n`;
      if (userProfile.age) context += `Age: ${userProfile.age}\n`;
      if (userProfile.income) context += `Annual Income: $${userProfile.income.toLocaleString()}\n`;
      if (userProfile.financialGoals && userProfile.financialGoals.length > 0) {
        context += `Financial Goals: ${userProfile.financialGoals.join(', ')}\n`;
      }
      context += '\n';
    }

    return context;
  }

  analyzeSpendingCategories(transactions) {
    const categories = {};
    
    transactions.forEach(transaction => {
      if (transaction.amount < 0 || transaction.transaction_type === 'Debit') {
        // Simple category detection based on description
        const description = transaction.description?.toLowerCase() || '';
        let category = 'Other';
        
        if (description.includes('grocery') || description.includes('supermarket') || description.includes('food')) {
          category = 'Groceries & Food';
        } else if (description.includes('gas') || description.includes('fuel') || description.includes('transport')) {
          category = 'Transportation';
        } else if (description.includes('restaurant') || description.includes('dining')) {
          category = 'Dining Out';
        } else if (description.includes('utility') || description.includes('electric') || description.includes('water')) {
          category = 'Utilities';
        } else if (description.includes('rent') || description.includes('mortgage')) {
          category = 'Housing';
        } else if (description.includes('shopping') || description.includes('retail')) {
          category = 'Shopping';
        } else if (description.includes('medical') || description.includes('health')) {
          category = 'Healthcare';
        }
        
        categories[category] = (categories[category] || 0) + Math.abs(transaction.amount);
      }
    });
    
    return categories;
  }

  async generateResponse(userMessage, financialData) {
    try {
      const enrichedPrompt = await this.enrichUserContext(userMessage, financialData);
      
      const result = await this.model.generateContent(enrichedPrompt);
      const response = await result.response;
      const text = response.text();
      
      return {
        success: true,
        response: text,
        model: 'gemini-1.5-flash',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        success: false,
        error: 'Failed to generate response from Gemini API',
        fallback: true
      };
    }
  }

  // Health check method
  async testConnection() {
    try {
      const result = await this.model.generateContent("Say 'Hello' if you can receive this message.");
      const response = await result.response;
      return {
        success: true,
        message: 'Gemini API connection successful',
        response: response.text()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = GeminiFinancialService;