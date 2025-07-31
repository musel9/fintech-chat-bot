const natural = require('natural');
const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class IntelligentFinancialAI {
  constructor() {
    this.classifier = new natural.BayesClassifier();
    this.stemmer = natural.PorterStemmer;
    this.tokenizer = new natural.WordTokenizer();
    // Remove problematic sentiment analyzer for now
    
    // Database connection
    this.dbPath = path.join(__dirname, 'قاعدة بيانات بنكية وهمية شاملة وقابلة للتحويل', 'bank_database.db');
    this.db = new sqlite3.Database(this.dbPath);
    
    // User context - will be set based on queries
    this.currentCustomerId = null;
    this.currentAccountId = null;
    
    this.trainClassifier();
  }

  trainClassifier() {
    // Enhanced training data with more sophisticated intents
    const intents = {
      balance: [
        "what's my balance", "show my balance", "check balance", "account balance",
        "how much money do I have", "current balance", "balance inquiry",
        "what's in my account", "account summary", "financial status"
      ],
      transactions: [
        "show transactions", "recent transactions", "transaction history", "spending history",
        "what did I spend", "recent spending", "account activity", "payment history",
        "where did my money go", "transaction summary", "spending breakdown"
      ],
      analysis: [
        "analyze my spending", "spending analysis", "financial analysis", "spending patterns",
        "spending trends", "monthly analysis", "budget analysis", "expense analysis",
        "where do I spend most", "spending insights", "financial insights"
      ],
      recommendations: [
        "financial advice", "saving tips", "budget recommendations", "spending advice",
        "how to save money", "financial suggestions", "improve my finances",
        "budget help", "money management tips", "financial planning"
      ],
      comparison: [
        "compare my spending", "spending comparison", "monthly comparison", "year over year",
        "spending vs last month", "compare expenses", "financial comparison",
        "spending trends over time", "expense comparison", "budget vs actual"
      ],
      transfer: [
        "send money", "transfer funds", "transfer money", "make payment", "wire money",
        "pay someone", "send payment", "money transfer", "fund transfer"
      ],
      help: [
        "help", "what can you do", "commands", "assistance", "guide me",
        "what are your features", "how to use", "help me", "instructions"
      ]
    };

    // Train classifier with all intents
    Object.keys(intents).forEach(intent => {
      intents[intent].forEach(phrase => {
        this.classifier.addDocument(phrase, intent);
      });
    });

    this.classifier.train();
  }

  async initializeUser() {
    // For demo, we'll use the first customer
    return new Promise((resolve, reject) => {
      this.db.get("SELECT customer_id FROM customers LIMIT 1", (err, row) => {
        if (err) {
          console.error("Database error:", err);
          reject(err);
        } else if (row) {
          this.currentCustomerId = row.customer_id;
          resolve();
        } else {
          reject(new Error("No customers found"));
        }
      });
    });
  }

  async getAccountBalance(customerId = null) {
    const cid = customerId || this.currentCustomerId;
    return new Promise((resolve, reject) => {
      const query = `
        SELECT account_type, balance, currency, account_id
        FROM accounts 
        WHERE customer_id = ? AND status = 'نشط'
      `;
      
      this.db.all(query, [cid], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getRecentTransactions(customerId = null, limit = 10) {
    const cid = customerId || this.currentCustomerId;
    return new Promise((resolve, reject) => {
      const query = `
        SELECT t.*, a.account_type, a.currency
        FROM transactions t
        JOIN accounts a ON t.account_id = a.account_id
        WHERE a.customer_id = ?
        ORDER BY t.transaction_date DESC
        LIMIT ?
      `;
      
      this.db.all(query, [cid, limit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async analyzeSpendingPatterns(customerId = null) {
    const cid = customerId || this.currentCustomerId;
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          transaction_type,
          COUNT(*) as transaction_count,
          SUM(amount) as total_amount,
          AVG(amount) as avg_amount,
          strftime('%Y-%m', transaction_date) as month
        FROM transactions t
        JOIN accounts a ON t.account_id = a.account_id
        WHERE a.customer_id = ? AND t.status = 'ناجحة'
        GROUP BY transaction_type, month
        ORDER BY month DESC, total_amount DESC
      `;
      
      this.db.all(query, [cid], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getSpendingTrends(customerId = null) {
    const cid = customerId || this.currentCustomerId;
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          strftime('%Y-%m', transaction_date) as month,
          SUM(CASE WHEN transaction_type = 'سحب' THEN amount ELSE 0 END) as withdrawals,
          SUM(CASE WHEN transaction_type = 'دفع فواتير' THEN amount ELSE 0 END) as bills,
          SUM(CASE WHEN transaction_type = 'تحويل' THEN amount ELSE 0 END) as transfers,
          SUM(CASE WHEN transaction_type = 'إيداع' THEN amount ELSE 0 END) as deposits,
          COUNT(*) as transaction_count
        FROM transactions t
        JOIN accounts a ON t.account_id = a.account_id
        WHERE a.customer_id = ? AND t.status = 'ناجحة'
        GROUP BY month
        ORDER BY month DESC
        LIMIT 6
      `;
      
      this.db.all(query, [cid], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  generateInsightfulResponse(intent, data, confidence) {
    let response = '';
    
    switch (intent) {
      case 'balance':
        response = this.generateBalanceInsight(data, confidence);
        break;
      case 'transactions':
        response = this.generateTransactionInsight(data, confidence);
        break;
      case 'analysis':
        response = this.generateAnalysisInsight(data, confidence);
        break;
      case 'recommendations':
        response = this.generateRecommendations(data, confidence);
        break;
      case 'comparison':
        response = this.generateComparisonInsight(data, confidence);
        break;
      default:
        response = `I understand you're asking about ${intent} (confidence: ${confidence.toFixed(0)}%). Let me help you with that.`;
    }
    
    return response;
  }

  generateBalanceInsight(accounts, confidence) {
    if (!accounts || accounts.length === 0) {
      return `I couldn't find your account information. (confidence: ${confidence.toFixed(0)}%)`;
    }

    let response = `💰 Your Account Summary (confidence: ${confidence.toFixed(0)}%)\n\n`;
    let totalBalance = 0;

    accounts.forEach(account => {
      const accountType = account.account_type === 'جاري' ? 'Checking' : 
                         account.account_type === 'توفير' ? 'Savings' : 'Investment';
      response += `${accountType}: ${account.balance.toLocaleString()} ${account.currency}\n`;
      
      // Convert to USD for total (simplified conversion)
      const usdAmount = account.currency === 'USD' ? account.balance : 
                       account.currency === 'SAR' ? account.balance / 3.75 : 
                       account.balance * 1.1;
      totalBalance += usdAmount;
    });

    response += `\n📊 Total Portfolio: ~$${totalBalance.toLocaleString('en-US', {maximumFractionDigits: 2})}\n`;
    
    // Add insights
    if (totalBalance > 100000) {
      response += `\n💡 Great job! You have a strong financial position. Consider diversifying your investments.`;
    } else if (totalBalance > 50000) {
      response += `\n💡 You're building wealth steadily. Consider setting aside more for emergency funds.`;
    } else {
      response += `\n💡 Focus on building your emergency fund to 3-6 months of expenses.`;
    }

    return response;
  }

  generateTransactionInsight(transactions, confidence) {
    if (!transactions || transactions.length === 0) {
      return `No recent transactions found. (confidence: ${confidence.toFixed(0)}%)`;
    }

    let response = `📊 Recent Financial Activity (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    // Group transactions by type
    const groupedTx = {};
    let totalSpending = 0;
    let totalDeposits = 0;

    transactions.forEach(tx => {
      const type = tx.transaction_type;
      if (!groupedTx[type]) groupedTx[type] = [];
      groupedTx[type].push(tx);
      
      if (type === 'سحب' || type === 'دفع فواتير') {
        totalSpending += tx.amount;
      } else if (type === 'إيداع') {
        totalDeposits += tx.amount;
      }
    });

    // Show recent transactions
    response += `Last ${transactions.length} transactions:\n`;
    transactions.slice(0, 5).forEach(tx => {
      const date = new Date(tx.transaction_date).toLocaleDateString();
      const type = tx.transaction_type === 'سحب' ? 'Withdrawal' :
                  tx.transaction_type === 'إيداع' ? 'Deposit' :
                  tx.transaction_type === 'دفع فواتير' ? 'Bill Payment' : 'Transfer';
      const sign = tx.transaction_type === 'إيداع' ? '+' : '-';
      response += `• ${date}: ${type} ${sign}${tx.amount.toLocaleString()} ${tx.currency}\n`;
    });

    // Add insights
    response += `\n💡 Financial Insights:\n`;
    response += `• Total spending: $${totalSpending.toLocaleString()}\n`;
    response += `• Total deposits: $${totalDeposits.toLocaleString()}\n`;
    
    if (totalSpending > totalDeposits) {
      response += `• ⚠️ You're spending more than you're earning recently. Consider reviewing your budget.`;
    } else {
      response += `• ✅ Good job! You're saving money this period.`;
    }

    return response;
  }

  generateAnalysisInsight(analysisData, confidence) {
    let response = `📈 Spending Pattern Analysis (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    if (!analysisData || analysisData.length === 0) {
      return response + "Not enough data for detailed analysis.";
    }

    // Analyze spending by category
    const spendingByType = {};
    analysisData.forEach(item => {
      if (!spendingByType[item.transaction_type]) {
        spendingByType[item.transaction_type] = 0;
      }
      spendingByType[item.transaction_type] += item.total_amount;
    });

    response += `Spending Breakdown:\n`;
    Object.entries(spendingByType).forEach(([type, amount]) => {
      const typeLabel = type === 'سحب' ? 'Withdrawals' :
                       type === 'دفع فواتير' ? 'Bill Payments' :
                       type === 'تحويل' ? 'Transfers' : type;
      response += `• ${typeLabel}: $${amount.toLocaleString()}\n`;
    });

    // Find highest spending category
    const highestSpending = Object.entries(spendingByType)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (highestSpending) {
      const [type, amount] = highestSpending;
      const typeLabel = type === 'سحب' ? 'withdrawals' :
                       type === 'دفع فواتير' ? 'bill payments' : 'transfers';
      response += `\n💡 Your highest spending is on ${typeLabel} ($${amount.toLocaleString()}).`;
      response += ` Consider setting a budget limit for this category.`;
    }

    return response;
  }

  generateRecommendations(data, confidence) {
    let response = `💰 Personalized Financial Recommendations (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    response += `Based on your financial patterns, here are my suggestions:\n\n`;
    response += `🎯 **Budgeting Tips:**\n`;
    response += `• Set up automatic transfers to savings (aim for 20% of income)\n`;
    response += `• Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings\n`;
    response += `• Review and categorize your expenses monthly\n\n`;
    
    response += `📊 **Smart Spending:**\n`;
    response += `• Track your largest expense categories\n`;
    response += `• Look for subscription services you can cancel\n`;
    response += `• Consider using cashback or rewards credit cards\n\n`;
    
    response += `💡 **Investment Ideas:**\n`;
    response += `• Build an emergency fund (3-6 months expenses)\n`;
    response += `• Consider low-cost index funds for long-term growth\n`;
    response += `• Diversify across different asset classes\n`;

    return response;
  }

  generateComparisonInsight(trendsData, confidence) {
    let response = `📊 Spending Trends Analysis (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    if (!trendsData || trendsData.length === 0) {
      return response + "Not enough historical data for comparison.";
    }

    response += `Monthly Trends (Last 6 months):\n`;
    trendsData.forEach(month => {
      response += `\n📅 ${month.month}:\n`;
      response += `• Withdrawals: $${month.withdrawals.toLocaleString()}\n`;
      response += `• Bill Payments: $${month.bills.toLocaleString()}\n`;
      response += `• Transfers: $${month.transfers.toLocaleString()}\n`;
      response += `• Deposits: $${month.deposits.toLocaleString()}\n`;
      response += `• Transactions: ${month.transaction_count}\n`;
    });

    // Calculate trends
    if (trendsData.length >= 2) {
      const recent = trendsData[0];
      const previous = trendsData[1];
      const totalSpendingRecent = recent.withdrawals + recent.bills + recent.transfers;
      const totalSpendingPrevious = previous.withdrawals + previous.bills + previous.transfers;
      
      const change = ((totalSpendingRecent - totalSpendingPrevious) / totalSpendingPrevious * 100);
      
      response += `\n💡 Trend Analysis:\n`;
      if (change > 10) {
        response += `• ⚠️ Your spending increased by ${change.toFixed(1)}% this month`;
      } else if (change < -10) {
        response += `• ✅ Great! Your spending decreased by ${Math.abs(change).toFixed(1)}% this month`;
      } else {
        response += `• 📊 Your spending is relatively stable (${change.toFixed(1)}% change)`;
      }
    }

    return response;
  }

  async processInput(input) {
    try {
      const intent = this.classifier.classify(input);
      const confidence = Math.max(...this.classifier.getClassifications(input).map(c => c.value)) * 100;
      
      let data = null;
      
      switch (intent) {
        case 'balance':
          data = await this.getAccountBalance();
          break;
        case 'transactions':
          data = await this.getRecentTransactions();
          break;
        case 'analysis':
          data = await this.analyzeSpendingPatterns();
          break;
        case 'recommendations':
          data = {}; // No specific data needed
          break;
        case 'comparison':
          data = await this.getSpendingTrends();
          break;
        case 'transfer':
          return this.handleTransferRequest(input, confidence);
        case 'help':
          return this.generateHelpResponse(confidence);
        default:
          return `I'm not sure how to help with that. Try asking about your balance, transactions, spending analysis, or financial recommendations. (confidence: ${confidence.toFixed(0)}%)`;
      }
      
      return this.generateInsightfulResponse(intent, data, confidence);
      
    } catch (error) {
      console.error('Error processing input:', error);
      return `I encountered an error processing your request. Please try again.`;
    }
  }

  handleTransferRequest(input, confidence) {
    // Extract amount and recipient (same logic as before but with database integration)
    return `I can help you with transfers. However, for security reasons, actual transfers require additional authentication. This is a demo system. (confidence: ${confidence.toFixed(0)}%)`;
  }

  generateHelpResponse(confidence) {
    let response = `🤖 Intelligent FinBot Help (confidence: ${confidence.toFixed(0)}%)\n\n`;
    response += `I'm your AI financial assistant with real data analysis capabilities:\n\n`;
    response += `💰 **Balance & Accounts**: "What's my balance?", "Account summary"\n`;
    response += `📊 **Transaction Analysis**: "Show recent transactions", "Spending history"\n`;
    response += `📈 **Smart Analysis**: "Analyze my spending", "Spending patterns"\n`;
    response += `💡 **Recommendations**: "Financial advice", "How to save money"\n`;
    response += `📊 **Trends**: "Compare my spending", "Monthly trends"\n`;
    response += `💸 **Transfers**: "Send money", "Transfer funds"\n\n`;
    response += `I analyze your real financial data to provide personalized insights and recommendations.\n`;
    response += `Type 'exit' to quit.`;
    
    return response;
  }
}

// Enhanced CLI Interface
async function startIntelligentChatbot() {
  console.log('🧠 Intelligent AI FinBot Started!');
  console.log('💡 I analyze your real financial data to provide personalized insights');
  console.log('');
  
  const finbot = new IntelligentFinancialAI();
  
  try {
    await finbot.initializeUser();
    console.log('✅ Connected to your financial data');
    console.log('');
  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    return;
  }
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  function askQuestion() {
    rl.question('You: ', async (input) => {
      if (input.toLowerCase().trim() === 'exit') {
        console.log('👋 Thanks for using Intelligent FinBot!');
        finbot.db.close();
        rl.close();
        return;
      }
      
      if (input.trim()) {
        console.log('🤔 Analyzing your request...');
        const response = await finbot.processInput(input);
        console.log(`\nBot: ${response}`);
        console.log('');
      }
      
      askQuestion();
    });
  }
  
  askQuestion();
}

// Start the intelligent chatbot
if (require.main === module) {
  startIntelligentChatbot();
}

module.exports = IntelligentFinancialAI;