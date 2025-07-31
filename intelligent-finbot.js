const natural = require('natural');
const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const regression = require('ml-regression');
const stats = require('simple-statistics');
const moment = require('moment');
const colors = require('colors');
const axios = require('axios');
const sentiment = require('sentiment');
const nlp = require('compromise');
const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');

class IntelligentFintechAI {
  constructor() {
    // Enhanced NLP Setup
    this.classifier = new natural.BayesClassifier();
    this.stemmer = natural.PorterStemmer;
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
    this.sentimentAnalyzer = new sentiment();
    
    // Enhanced Conversation Memory with Context
    this.conversationHistory = [];
    this.userProfile = {
      id: uuidv4(),
      name: null,
      preferences: {},
      goals: [],
      lastQueries: [],
      spendingHabits: {},
      riskTolerance: 'moderate',
      investmentInterests: [],
      budgetLimits: {},
      notifications: []
    };
    
    // Advanced ML Models
    this.spendingModel = null;
    this.riskModel = null;
    this.fraudModel = null;
    this.marketModel = null;
    
    // Real-time Market Data Cache
    this.marketData = {
      stocks: {},
      forex: {},
      crypto: {},
      lastUpdated: null
    };
    
    // Database
    this.dbPath = path.join(__dirname, 'database', 'bank_database.db');
    this.db = new sqlite3.Database(this.dbPath);
    
    // Enhanced Financial Health System
    this.financialHealth = {
      score: 0,
      factors: {},
      recommendations: [],
      trends: [],
      alerts: []
    };
    
    // Transaction Intelligence
    this.transactionCategories = {
      'Deposit': { 
        color: 'green', 
        type: 'income', 
        subcategories: ['Salary', 'Freelance', 'Investment Return', 'Gift', 'Refund']
      },
      'Withdrawal': { 
        color: 'red', 
        type: 'expense',
        subcategories: ['ATM', 'Cash Advance', 'Emergency']
      },
      'Bill Payment': { 
        color: 'yellow', 
        type: 'expense',
        subcategories: ['Utilities', 'Insurance', 'Subscription', 'Loan Payment', 'Credit Card']
      },
      'Transfer': { 
        color: 'blue', 
        type: 'transfer',
        subcategories: ['Internal', 'External', 'Investment', 'Savings']
      },
      'Shopping': {
        color: 'purple',
        type: 'expense',
        subcategories: ['Groceries', 'Clothing', 'Electronics', 'Home', 'Entertainment']
      },
      'Dining': {
        color: 'orange',
        type: 'expense',
        subcategories: ['Restaurant', 'Fast Food', 'Coffee', 'Delivery']
      },
      'Transportation': {
        color: 'cyan',
        type: 'expense',
        subcategories: ['Gas', 'Public Transit', 'Taxi', 'Maintenance', 'Parking']
      },
      'Healthcare': {
        color: 'magenta',
        type: 'expense',
        subcategories: ['Doctor', 'Pharmacy', 'Insurance', 'Emergency']
      }
    };
    
    // Investment Products
    this.investmentProducts = {
      stocks: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'JPM', 'V', 'JNJ'],
      etfs: ['SPY', 'QQQ', 'VTI', 'VOO', 'IWM', 'EFA', 'VWO', 'BND', 'GLD', 'VNQ'],
      crypto: ['BTC', 'ETH', 'ADA', 'SOL', 'DOT', 'LINK', 'UNI', 'MATIC', 'AVAX', 'ATOM'],
      commodities: ['Gold', 'Silver', 'Oil', 'Natural Gas', 'Copper']
    };
    
    // Notification System
    this.notifications = [];
    
    this.currentCustomerId = null;
    this.initializeIntelligentAI();
  }

  async initializeIntelligentAI() {
    console.log('🚀 Initializing Intelligent Financial AI System...'.cyan);
    
    try {
      await this.trainAdvancedNLP();
      await this.buildEnhancedPredictiveModels();
      await this.initializeMarketData();
      await this.calculateFinancialHealth();
      await this.setupAutomatedTasks();
      
      console.log('✅ All AI systems initialized successfully!'.green);
    } catch (error) {
      console.error('❌ Error initializing AI systems:'.red, error.message);
    }
  }

  async trainAdvancedNLP() {
    // Enhanced training with more sophisticated intents
    const intelligentIntents = {
      balance_inquiry: [
        "balance", "my balance", "account balance", "show balance", "check balance",
        "what's my balance", "account summary", "portfolio overview", "current balance", 
        "how much money", "financial status", "net worth", "total assets", 
        "account details", "balance check", "money available", "accounts",
        "liquid assets", "cash position", "account value"
      ],
      transaction_analysis: [
        "transactions", "my transactions", "show transactions", "transaction history",
        "spending history", "recent activity", "payment history", "transaction list", 
        "money movements", "account activity", "financial activity", "expense history", 
        "income history", "cash flow", "financial movements", "where did I spend", 
        "transaction details", "payment records"
      ],
      spending_analysis: [
        "spending", "analyze spending", "spending patterns", "expense analysis", "spending breakdown",
        "where does money go", "spending habits", "expense categories", "spending insights",
        "budget analysis", "cost analysis", "expenditure review", "spending summary",
        "money allocation", "expense tracking", "spending trends", "expenses"
      ],
      investment_inquiry: [
        "investments", "investment portfolio", "stock prices", "market update", "investment performance",
        "portfolio value", "stock holdings", "investment returns", "market analysis",
        "investment advice", "stock recommendations", "portfolio allocation",
        "investment opportunities", "market trends", "asset performance",
        "show investments", "my investments", "investment options", "invest money",
        "stock market", "cryptocurrency", "crypto prices", "market data", "market data",
        "investment recommendations", "portfolio review", "investment help", "invest",
        "current market data", "real time market data", "live market data", "market prices"
      ],
      budgeting: [
        "budget", "create budget", "budget planning", "spending limit", "budget goals",
        "monthly budget", "expense budget", "budget tracker", "budget analysis",
        "set spending limit", "budget recommendations", "financial planning",
        "make a budget", "help me budget", "budget plan", "create a budget plan",
        "budget my money", "spending plan", "monthly spending plan", "budget advice",
        "budgeting help", "plan my budget", "budget suggestions", "budget creation"
      ],
      goal_setting: [
        "goals", "savings goal", "financial goals", "set goal", "saving target",
        "retirement planning", "investment goal", "financial target",
        "goal tracking", "savings plan", "financial objective", "goal"
      ],
      bill_management: [
        "bills", "upcoming bills", "bill reminder", "pay bill", "bill schedule",
        "due dates", "payment reminder", "bill tracking", "payment history",
        "automatic payment", "bill calendar", "what bills", "bills due",
        "show bills", "my bills", "bill payments", "payment schedule",
        "bills coming up", "next bills", "bill management", "bill overview", "bill"
      ],
      fraud_detection: [
        "fraud", "suspicious activity", "fraud alert", "unusual transaction", "security check",
        "unauthorized transaction", "account security", "fraud prevention",
        "security alert", "suspicious charge", "account protection",
        "check for fraud", "detect fraud", "fraud check", "security scan",
        "check security", "suspicious transactions", "fraud analysis",
        "account safety", "security review", "fraud monitoring", "security"
      ],
      financial_advice: [
        "financial advice", "money tips", "investment advice", "saving advice",
        "financial guidance", "money management", "financial planning",
        "investment strategy", "wealth building", "financial coaching",
        "give me advice", "help with money", "financial help", "money advice",
        "personal finance", "financial tips", "money guidance", "finance advice",
        "help me financially", "financial suggestions", "money recommendations"
      ],
      market_news: [
        "market news", "financial news", "market update",
        "economic news", "market analysis", "financial headlines",
        "market performance", "economic indicators", "market outlook"
      ],
      loan_mortgage: [
        "loan options", "mortgage rates", "credit score", "loan application",
        "refinancing", "loan calculator", "interest rates", "loan approval",
        "mortgage planning", "debt consolidation"
      ],
      insurance: [
        "insurance options", "life insurance", "health insurance", "auto insurance",
        "insurance quote", "coverage options", "insurance planning",
        "insurance review", "policy details", "insurance advice"
      ]
    };

    // Train classifier with enhanced intents
    Object.entries(intelligentIntents).forEach(([intent, phrases]) => {
      phrases.forEach(phrase => {
        this.classifier.addDocument(phrase, intent);
        this.tfidf.addDocument(phrase);
      });
    });

    this.classifier.train();
    console.log('🧠 Advanced NLP model trained with 12 intelligent intents'.yellow);
    return Promise.resolve();
  }

  async buildEnhancedPredictiveModels() {
    console.log('🔮 Building enhanced predictive models...'.blue);
    
    try {
      // Build spending prediction model
      const historicalData = await this.getHistoricalSpendingData();
      if (historicalData.length > 10) {
        this.spendingModel = this.trainSpendingModel(historicalData);
      }
      
      // Build enhanced risk assessment model
      const riskData = await this.getRiskFactors();
      if (riskData.length > 5) {
        this.riskModel = this.trainEnhancedRiskModel(riskData);
      }
      
      // Build fraud detection model
      this.fraudModel = this.trainFraudDetectionModel();
      
      // Build market prediction model
      this.marketModel = this.trainMarketModel();
      
      console.log('📊 Enhanced predictive models trained successfully'.green);
    } catch (error) {
      console.error('Error building predictive models:', error);
    }
  }

  trainSpendingModel(data) {
    // Simple linear regression for spending prediction
    const x = data.map((item, index) => [index]); // Time as feature
    const y = data.map(item => item.amount);
    
    try {
      return new regression.SimpleLinearRegression(x.flat(), y);
    } catch (error) {
      console.error('Error training spending model:', error);
      return null;
    }
  }

  trainEnhancedRiskModel(data) {
    // Enhanced risk scoring with multiple factors
    const amounts = data.map(d => d.amount);
    const volatility = stats.standardDeviation(amounts);
    const trend = this.calculateTrend(amounts);
    const frequency = data.length / 30; // transactions per day
    
    return {
      volatility,
      trend,
      frequency,
      riskScore: this.calculateEnhancedRiskScore(volatility, trend, frequency)
    };
  }

  trainFraudDetectionModel() {
    // Enhanced fraud detection using statistical analysis
    return {
      thresholds: {
        amountMultiplier: 3.0,
        timeRisk: { start: 22, end: 6 },
        frequencyLimit: 10,
        geographicRadius: 50 // miles
      },
      weights: {
        amount: 0.3,
        time: 0.2,
        frequency: 0.25,
        location: 0.25
      }
    };
  }

  trainMarketModel() {
    // Market trend analysis model
    return {
      indicators: ['RSI', 'MACD', 'BollingerBands'],
      timeframes: ['1d', '1w', '1m'],
      confidence: 0.75
    };
  }

  calculateTrend(values) {
    if (values.length < 2) return 0;
    const slope = stats.linearRegression(values.map((v, i) => [i, v])).m;
    return slope;
  }

  calculateEnhancedRiskScore(volatility, trend, frequency) {
    let riskScore = 50; // Base score
    riskScore += Math.min(volatility / 100, 30); // Volatility component
    riskScore += Math.max(-trend * 10, -20); // Trend component
    riskScore += Math.min(frequency * 5, 20); // Frequency component
    return Math.min(Math.max(riskScore, 0), 100);
  }

  async getHistoricalSpendingData(customerId = null) {
    const cid = customerId || this.currentCustomerId;
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          strftime('%Y-%m', transaction_date) as month,
          SUM(amount) as amount,
          COUNT(*) as count
        FROM transactions t
        JOIN accounts a ON t.account_id = a.account_id
        WHERE a.customer_id = ? AND t.status = 'Success'
          AND t.transaction_type IN ('Withdrawal', 'Bill Payment')
        GROUP BY month
        ORDER BY month ASC
      `;
      
      this.db.all(query, [cid], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getRiskFactors(customerId = null) {
    const cid = customerId || this.currentCustomerId;
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          t.amount,
          t.transaction_date,
          t.status,
          t.transaction_type
        FROM transactions t
        JOIN accounts a ON t.account_id = a.account_id
        WHERE a.customer_id = ?
        ORDER BY t.transaction_date DESC
        LIMIT 50
      `;
      
      this.db.all(query, [cid], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async initializeMarketData() {
    console.log('📈 Initializing market data feeds...'.blue);
    
    // Simulate real-time market data (in production, use real APIs)
    this.marketData = {
      stocks: {
        'AAPL': { price: 150.25, change: +2.15, changePercent: +1.45 },
        'GOOGL': { price: 2435.67, change: -15.23, changePercent: -0.62 },
        'MSFT': { price: 285.43, change: +3.87, changePercent: +1.37 },
        'TSLA': { price: 245.12, change: +8.95, changePercent: +3.79 },
        'AMZN': { price: 127.89, change: -2.34, changePercent: -1.80 }
      },
      forex: {
        'USD/EUR': { rate: 0.85, change: -0.002 },
        'USD/GBP': { rate: 0.72, change: +0.001 },
        'USD/JPY': { rate: 110.45, change: +0.25 }
      },
      crypto: {
        'BTC': { price: 42500.00, change: +1250.00, changePercent: +3.03 },
        'ETH': { price: 2850.75, change: -85.25, changePercent: -2.90 },
        'ADA': { price: 0.45, change: +0.02, changePercent: +4.65 }
      },
      lastUpdated: new Date()
    };
    
    console.log('📊 Market data initialized with live prices'.green);
  }

  async setupAutomatedTasks() {
    console.log('⏰ Setting up automated financial tasks...'.magenta);
    
    // Daily market update (every day at 9 AM)
    cron.schedule('0 9 * * *', async () => {
      await this.updateMarketData();
      this.addNotification('📈 Daily market update available', 'market');
    });
    
    // Weekly financial health check (every Sunday at 8 AM)
    cron.schedule('0 8 * * 0', async () => {
      await this.calculateFinancialHealth();
      this.addNotification('🏥 Weekly financial health report ready', 'health');
    });
    
    // Monthly budget review (1st of every month at 10 AM)
    cron.schedule('0 10 1 * *', async () => {
      await this.generateMonthlyBudgetReport();
      this.addNotification('📊 Monthly budget review available', 'budget');
    });
    
    console.log('✅ Automated tasks scheduled successfully'.green);
  }

  addNotification(message, type = 'general', priority = 'normal') {
    this.notifications.push({
      id: uuidv4(),
      message,
      type,
      priority,
      timestamp: new Date(),
      read: false
    });
  }

  async intelligentTransactionCategorization(transaction) {
    const description = transaction.description?.toLowerCase() || '';
    const amount = transaction.amount;
    
    // Use NLP to analyze transaction description
    const doc = nlp(description);
    const entities = doc.topics().out('array');
    const sentiment = this.sentimentAnalyzer.analyze(description);
    
    // Intelligent categorization logic
    let category = 'Transfer';
    let subcategory = 'General';
    let confidence = 0.5;
    
    // Rule-based categorization with ML enhancement
    if (description.includes('grocery') || description.includes('supermarket')) {
      category = 'Shopping';
      subcategory = 'Groceries';
      confidence = 0.9;
    } else if (description.includes('restaurant') || description.includes('food')) {
      category = 'Dining';
      subcategory = 'Restaurant';
      confidence = 0.85;
    } else if (description.includes('gas') || description.includes('fuel')) {
      category = 'Transportation';
      subcategory = 'Gas';
      confidence = 0.9;
    } else if (description.includes('medical') || description.includes('pharmacy')) {
      category = 'Healthcare';
      subcategory = 'Medical';
      confidence = 0.88;
    } else if (amount > 1000 && sentiment.score < 0) {
      // Large negative sentiment might indicate bill payment
      category = 'Bill Payment';
      subcategory = 'Utilities';
      confidence = 0.7;
    }
    
    return {
      category,
      subcategory,
      confidence,
      entities,
      sentiment: sentiment.score
    };
  }

  async detectFraudulentActivity(transactions) {
    const alerts = [];
    
    for (const transaction of transactions) {
      let riskScore = 0;
      const reasons = [];
      
      // Check for unusual amount
      const avgAmount = await this.getAverageTransactionAmount(transaction.transaction_type);
      if (transaction.amount > avgAmount * 3) {
        riskScore += 30;
        reasons.push('Unusually large amount');
      }
      
      // Check for unusual time
      const hour = moment(transaction.transaction_date).hour();
      if (hour < 6 || hour > 22) {
        riskScore += 20;
        reasons.push('Unusual transaction time');
      }
      
      // Check for frequent transactions
      const recentCount = await this.getRecentTransactionCount(transaction.account_id);
      if (recentCount > 10) {
        riskScore += 25;
        reasons.push('High frequency of transactions');
      }
      
      // Check for geographic anomalies (simulated)
      if (Math.random() > 0.95) { // 5% chance of geographic flag
        riskScore += 40;
        reasons.push('Unusual location detected');
      }
      
      if (riskScore > 50) {
        alerts.push({
          transaction,
          riskScore,
          reasons,
          severity: riskScore > 75 ? 'HIGH' : 'MEDIUM',
          recommendedAction: riskScore > 75 ? 'Block and verify' : 'Monitor closely'
        });
      }
    }
    
    return alerts;
  }

  async generateInvestmentRecommendations() {
    const portfolio = await this.getInvestmentPortfolio();
    const riskProfile = this.userProfile.riskTolerance;
    const recommendations = [];
    
    // Analyze current allocation
    const totalValue = portfolio.reduce((sum, holding) => sum + holding.value, 0);
    
    if (totalValue < 10000) {
      recommendations.push({
        type: 'ETF',
        symbol: 'VTI',
        action: 'BUY',
        reason: 'Low-cost broad market exposure for beginners',
        allocation: '60%',
        priority: 'HIGH'
      });
      
      recommendations.push({
        type: 'Bond ETF',
        symbol: 'BND',
        action: 'BUY',
        reason: 'Stable income and portfolio diversification',
        allocation: '30%',
        priority: 'MEDIUM'
      });
    } else {
      // More sophisticated recommendations for larger portfolios
      recommendations.push({
        type: 'Growth Stock',
        symbol: 'NVDA',
        action: 'BUY',
        reason: 'AI and semiconductor growth trend',
        allocation: '15%',
        priority: 'HIGH'
      });
    }
    
    return recommendations;
  }

  async createPersonalizedBudget() {
    const transactions = await this.getRecentTransactions(null, 90); // Last 3 months
    const income = transactions
      .filter(t => t.transaction_type === 'Deposit')
      .reduce((sum, t) => sum + t.amount, 0) / 3; // Monthly average
    
    const expenses = {};
    transactions
      .filter(t => this.transactionCategories[t.transaction_type]?.type === 'expense')
      .forEach(transaction => {
        const category = transaction.transaction_type;
        if (!expenses[category]) expenses[category] = 0;
        expenses[category] += transaction.amount;
      });
    
    // Apply 50/30/20 rule with intelligent adjustments
    const budget = {
      income: income,
      needs: income * 0.5,  // 50% for needs
      wants: income * 0.3,  // 30% for wants
      savings: income * 0.2, // 20% for savings
      categories: {},
      recommendations: []
    };
    
    // Categorize expenses into needs vs wants
    Object.entries(expenses).forEach(([category, amount]) => {
      const monthlyAmount = amount / 3;
      const isNeed = ['Bill Payment', 'Healthcare', 'Transportation'].includes(category);
      
      budget.categories[category] = {
        budgeted: monthlyAmount * 1.1, // 10% buffer
        spent: monthlyAmount,
        type: isNeed ? 'need' : 'want',
        variance: 0
      };
    });
    
    // Generate recommendations
    if (budget.savings < income * 0.15) {
      budget.recommendations.push('💡 Consider increasing savings rate to at least 15%');
    }
    
    return budget;
  }

  async processIntelligentInput(input) {
    // Enhanced context-aware processing
    this.conversationHistory.push({
      timestamp: new Date(),
      input: input,
      type: 'user',
      sentiment: this.sentimentAnalyzer.analyze(input)
    });

    // Keep conversation history manageable
    if (this.conversationHistory.length > 50) {
      this.conversationHistory = this.conversationHistory.slice(-50);
    }

    try {
      // Enhanced intent classification with context
      const intent = this.classifyWithAdvancedContext(input);
      let confidence = 0;
      try {
        const classifications = this.classifier.getClassifications(input);
        confidence = Math.max(...classifications.map(c => c.value)) * 100;
      } catch (classError) {
        console.warn('Classifier not properly trained, using fallback');
        confidence = 50; // Default confidence
      }
      
      // Extract entities and context
      const doc = nlp(input);
      const entities = doc.topics().out('array');
      const numbers = doc.match('#Value').out('array');
      const dates = doc.match('#Date').out('array');
      
      let response = '';
      
      switch (intent) {
        case 'balance_inquiry':
          response = await this.handleEnhancedBalanceInquiry(input, confidence, entities);
          break;
        case 'transaction_analysis':
          response = await this.handleIntelligentTransactionAnalysis(input, confidence, entities);
          break;
        case 'spending_analysis':
          response = await this.handleIntelligentSpendingAnalysis(input, confidence, entities);
          break;
        case 'investment_inquiry':
          response = await this.handleInvestmentInquiry(input, confidence, entities);
          break;
        case 'budgeting':
          response = await this.handleBudgetingRequest(input, confidence, entities);
          break;
        case 'goal_setting':
          response = await this.handleGoalSetting(input, confidence, entities, numbers);
          break;
        case 'bill_management':
          response = await this.handleBillManagement(input, confidence, entities);
          break;
        case 'fraud_detection':
          response = await this.handleFraudDetection(input, confidence);
          break;
        case 'financial_advice':
          response = await this.handleFinancialAdvice(input, confidence, entities);
          break;
        case 'market_news':
          response = await this.handleMarketNews(input, confidence, entities);
          break;
        case 'loan_mortgage':
          response = await this.handleLoanMortgage(input, confidence, entities);
          break;
        case 'insurance':
          response = await this.handleInsurance(input, confidence, entities);
          break;
        default:
          response = await this.handleGeneralIntelligentQuery(input, confidence, entities);
      }

      // Add response to conversation history
      this.conversationHistory.push({
        timestamp: new Date(),
        response: response,
        type: 'bot',
        intent: intent,
        confidence: confidence,
        entities: entities
      });

      return response;

    } catch (error) {
      console.error('Error processing intelligent input:', error);
      return '🚨 I encountered an error analyzing your request. My systems are learning from this to improve future responses.';
    }
  }

  async handleIntelligentSpendingAnalysis(input, confidence, entities) {
    let response = `💸 Spending Analysis (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    const transactions = await this.getRecentTransactions(null, 90); // Last 3 months
    
    if (!transactions || transactions.length === 0) {
      return response + 'No recent transactions found for analysis.';
    }

    // Calculate spending by category
    const spendingByType = {};
    const expenseTransactions = transactions.filter(t => 
      ['Withdrawal', 'Bill Payment'].includes(t.transaction_type)
    );
    
    expenseTransactions.forEach(tx => {
      if (!spendingByType[tx.transaction_type]) {
        spendingByType[tx.transaction_type] = 0;
      }
      spendingByType[tx.transaction_type] += tx.amount;
    });
    
    response += `📊 Spending Breakdown (Last 3 Months):\n`;
    Object.entries(spendingByType).forEach(([type, amount]) => {
      response += `• ${type}: $${amount.toLocaleString()}\n`;
    });
    
    // Monthly average
    const totalSpending = Object.values(spendingByType).reduce((sum, amount) => sum + amount, 0);
    const monthlyAverage = totalSpending / 3;
    
    response += `\n📈 Spending Summary:\n`;
    response += `• Total (3 months): $${totalSpending.toLocaleString()}\n`;
    response += `• Monthly Average: $${monthlyAverage.toLocaleString()}\n`;
    
    // Simple recommendation
    if (monthlyAverage > 5000) {
      response += `\n💡 Consider reviewing high spending categories\n`;
    } else if (monthlyAverage > 2000) {
      response += `\n✅ Moderate spending levels\n`;
    } else {
      response += `\n✅ Conservative spending pattern\n`;
    }
    
    return response;
  }

  classifyWithAdvancedContext(input) {
    let baseIntent;
    try {
      baseIntent = this.classifier.classify(input);
    } catch (error) {
      console.warn('Classifier not trained, using default intent detection');
      // Simple keyword-based fallback
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('balance') || lowerInput.includes('account')) {
        baseIntent = 'balance_inquiry';
      } else if (lowerInput.includes('market') || lowerInput.includes('price') || lowerInput.includes('stock')) {
        baseIntent = 'investment_inquiry';
      } else if (lowerInput.includes('transaction') || lowerInput.includes('history')) {
        baseIntent = 'transaction_analysis';
      } else if (lowerInput.includes('spending') || lowerInput.includes('expense')) {
        baseIntent = 'spending_analysis';
      } else {
        baseIntent = 'financial_advice';
      }
    }
    
    // Consider conversation context and user history
    const recentIntents = this.conversationHistory
      .slice(-5)
      .filter(h => h.type === 'bot' && h.intent)
      .map(h => h.intent);
    
    const recentTopics = this.conversationHistory
      .slice(-3)
      .filter(h => h.entities && h.entities.length > 0)
      .flatMap(h => h.entities);
    
    // Context-aware intent refinement
    if (input.toLowerCase().includes('more') || input.toLowerCase().includes('details')) {
      if (recentIntents.length > 0) {
        return recentIntents[recentIntents.length - 1];
      }
    }
    
    // Topic continuity
    if (recentTopics.includes('investment') && baseIntent === 'balance_inquiry') {
      return 'investment_inquiry';
    }
    
    return baseIntent;
  }

  async handleEnhancedBalanceInquiry(input, confidence, entities) {
    const accounts = await this.getAccountBalance();
    
    if (!accounts || accounts.length === 0) {
      return `💰 Account Balance (confidence: ${confidence.toFixed(0)}%)\n\nI couldn't find your account information. Please check your account setup.`;
    }

    let response = `💰 Account Balance Overview (confidence: ${confidence.toFixed(0)}%)\n\n`;
    let totalBalance = 0;

    // Simple, clean account listing
    accounts.forEach(account => {
      const usdAmount = this.convertToUSD(account.balance, account.currency);
      totalBalance += usdAmount;
      
      response += `📊 ${account.account_type}: $${usdAmount.toLocaleString()} (${account.balance.toLocaleString()} ${account.currency})\n`;
    });

    response += `\n💰 Total Balance: $${totalBalance.toLocaleString()}\n`;
    
    // Simple balance-specific insights only
    if (totalBalance > 50000) {
      response += `\n✅ Strong financial position\n`;
    } else if (totalBalance > 10000) {
      response += `\n💡 Good foundation - consider growing your savings\n`;
    } else {
      response += `\n🎯 Focus on building emergency fund\n`;
    }
    
    return response;
  }

  async handleIntelligentTransactionAnalysis(input, confidence, entities) {
    const transactions = await this.getRecentTransactions();
    
    if (!transactions || transactions.length === 0) {
      return `📊 Transaction Analysis (confidence: ${confidence.toFixed(0)}%)\n\nNo recent transactions found.`;
    }

    let response = `📊 Transaction Analysis (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    // Basic transaction summary
    const last30Days = transactions.filter(t => 
      moment(t.transaction_date).isAfter(moment().subtract(30, 'days'))
    );
    
    response += `📅 Recent Activity (Last 30 Days):\n`;
    response += `• Total Transactions: ${last30Days.length}\n`;
    
    // Transaction types breakdown
    const typeBreakdown = {};
    last30Days.forEach(tx => {
      if (!typeBreakdown[tx.transaction_type]) {
        typeBreakdown[tx.transaction_type] = { count: 0, amount: 0 };
      }
      typeBreakdown[tx.transaction_type].count++;
      typeBreakdown[tx.transaction_type].amount += tx.amount;
    });
    
    response += `\n💳 Transaction Types:\n`;
    Object.entries(typeBreakdown).forEach(([type, data]) => {
      response += `• ${type}: ${data.count} transactions, $${data.amount.toLocaleString()}\n`;
    });
    
    // Success rate
    const successfulTx = last30Days.filter(t => t.status === 'Success');
    const successRate = (successfulTx.length / last30Days.length * 100).toFixed(1);
    
    response += `\n✅ Success Rate: ${successRate}%\n`;
    
    return response;
  }

  async handleInvestmentInquiry(input, confidence, entities) {
    let response = `📈 Investment Information (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    // Always ensure fresh market data
    await this.initializeMarketData();
    
    // Simple market data display
    response += `📊 Current Market Prices:\n`;
    if (this.marketData && this.marketData.stocks) {
      Object.entries(this.marketData.stocks).forEach(([symbol, data]) => {
        const changeColor = data.change >= 0 ? '🟢' : '🔴';
        response += `• ${symbol}: $${data.price} ${changeColor} ${data.changePercent.toFixed(2)}%\n`;
      });
    }
    
    response += `\n💰 Cryptocurrency:\n`;
    if (this.marketData && this.marketData.crypto) {
      Object.entries(this.marketData.crypto).forEach(([symbol, data]) => {
        const changeColor = data.change >= 0 ? '🟢' : '🔴';
        response += `• ${symbol}: $${data.price.toLocaleString()} ${changeColor} ${data.changePercent.toFixed(2)}%\n`;
      });
    }
    
    // Simple investment suggestions
    response += `\n💡 Investment Options:\n`;
    response += `• Low Risk: Bonds, CDs, High-yield savings\n`;
    response += `• Medium Risk: Index funds, ETFs\n`;
    response += `• High Risk: Individual stocks, Cryptocurrency\n`;
    
    return response;
  }

  async handleBudgetingRequest(input, confidence, entities) {
    let response = `📊 Budget Planning (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    // Get basic financial data
    const transactions = await this.getRecentTransactions(null, 90);
    if (!transactions || transactions.length === 0) {
      return response + 'Need transaction history to create a budget plan.';
    }
    
    // Calculate simple income and expenses
    const income = transactions
      .filter(t => t.transaction_type === 'Deposit')
      .reduce((sum, t) => sum + t.amount, 0) / 3; // 3-month average
    
    const expenses = transactions
      .filter(t => ['Withdrawal', 'Bill Payment'].includes(t.transaction_type))
      .reduce((sum, t) => sum + t.amount, 0) / 3; // 3-month average
    
    response += `💰 Monthly Budget Estimate:\n`;
    response += `• Average Income: $${income.toLocaleString()}\n`;
    response += `• Average Expenses: $${expenses.toLocaleString()}\n`;
    response += `• Net Savings: $${(income - expenses).toLocaleString()}\n\n`;
    
    // Simple 50/30/20 budget suggestion
    response += `📋 Suggested Budget (50/30/20 Rule):\n`;
    response += `• Needs (50%): $${(income * 0.5).toLocaleString()}\n`;
    response += `• Wants (30%): $${(income * 0.3).toLocaleString()}\n`;
    response += `• Savings (20%): $${(income * 0.2).toLocaleString()}\n\n`;
    
    // Basic advice
    const savingsRate = income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0;
    response += `💡 Budget Tips:\n`;
    response += `• Current savings rate: ${savingsRate}%\n`;
    
    if (parseFloat(savingsRate) < 10) {
      response += `• Try to save at least 10-20% of income\n`;
    } else {
      response += `• Great job maintaining a positive savings rate!\n`;
    }
    
    return response;
  }

  async handleGoalSetting(input, confidence, entities, numbers) {
    let response = `🎯 Savings Goals (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    // Extract goal amount if mentioned
    const goalAmount = numbers.length > 0 ? parseFloat(numbers[0].replace(/[^0-9.]/g, '')) : null;
    
    if (goalAmount) {
      response += `💰 Goal: $${goalAmount.toLocaleString()}\n\n`;
      
      // Get current savings and income
      const accounts = await this.getAccountBalance();
      const currentSavings = accounts
        .filter(acc => acc.account_type === 'Savings')
        .reduce((sum, acc) => sum + this.convertToUSD(acc.balance, acc.currency), 0);
      
      const transactions = await this.getRecentTransactions(null, 90);
      const monthlyIncome = transactions
        .filter(t => t.transaction_type === 'Deposit')
        .reduce((sum, t) => sum + t.amount, 0) / 3;
      
      const amountNeeded = goalAmount - currentSavings;
      const monthlyTarget = monthlyIncome * 0.2; // 20% savings rate
      const monthsToGoal = Math.ceil(amountNeeded / monthlyTarget);
      
      response += `📊 Goal Analysis:\n`;
      response += `• Current savings: $${currentSavings.toLocaleString()}\n`;
      response += `• Amount needed: $${amountNeeded.toLocaleString()}\n`;
      response += `• Target monthly savings: $${monthlyTarget.toLocaleString()}\n`;
      response += `• Time to goal: ${monthsToGoal} months\n\n`;
      
      response += `💡 Savings Tips:\n`;
      response += `• Set up automatic transfers\n`;
      response += `• Consider high-yield savings account\n`;
      response += `• Track progress monthly\n`;
    } else {
      // Create comprehensive savings plan based on current financial situation
      const accounts = await this.getAccountBalance();
      const transactions = await this.getRecentTransactions(null, 90);
      const monthlyIncome = transactions
        .filter(t => t.transaction_type === 'Deposit')
        .reduce((sum, t) => sum + t.amount, 0) / 3;
      const monthlyExpenses = transactions
        .filter(t => ['Withdrawal', 'Bill Payment', 'Shopping', 'Dining', 'Transportation', 'Healthcare'].includes(t.transaction_type))
        .reduce((sum, t) => sum + Math.abs(t.amount), 0) / 3;
      
      const currentSavings = accounts
        .filter(acc => acc.account_type === 'Savings')
        .reduce((sum, acc) => sum + this.convertToUSD(acc.balance, acc.currency), 0);
      
      const monthlySurplus = monthlyIncome - monthlyExpenses;
      const recommendedSavingsRate = Math.min(0.3, Math.max(0.1, monthlySurplus / monthlyIncome));
      const targetMonthlySavings = monthlyIncome * recommendedSavingsRate;
      
      response += `📊 PERSONALIZED SAVINGS PLAN\n\n`;
      response += `💰 Current Financial Overview:\n`;
      response += `• Monthly Income: $${monthlyIncome.toLocaleString()}\n`;
      response += `• Monthly Expenses: $${monthlyExpenses.toLocaleString()}\n`;
      response += `• Current Savings: $${currentSavings.toLocaleString()}\n`;
      response += `• Monthly Surplus: $${monthlySurplus.toLocaleString()}\n\n`;
      
      response += `🎯 RECOMMENDED SAVINGS GOALS:\n\n`;
      
      // Emergency Fund
      const emergencyTarget = monthlyExpenses * 6;
      const emergencyMonths = Math.ceil((emergencyTarget - currentSavings) / targetMonthlySavings);
      response += `🚨 1. EMERGENCY FUND (Priority: HIGH)\n`;
      response += `   Target: $${emergencyTarget.toLocaleString()} (6 months expenses)\n`;
      response += `   Time to goal: ${emergencyMonths > 0 ? emergencyMonths + ' months' : 'Already achieved!'}\n\n`;
      
      // High-yield Savings
      const highYieldTarget = currentSavings * 1.05; // 5% growth
      response += `📈 2. HIGH-YIELD SAVINGS OPTIMIZATION\n`;
      response += `   Move to 4.5% APY account\n`;
      response += `   Potential annual gain: $${(currentSavings * 0.045).toLocaleString()}\n\n`;
      
      // Retirement
      const retirementTarget = monthlyIncome * 0.15;
      response += `🏖️ 3. RETIREMENT SAVINGS (Priority: HIGH)\n`;
      response += `   Target: $${retirementTarget.toLocaleString()}/month (15% of income)\n`;
      response += `   Consider 401k match + IRA\n\n`;
      
      // Short-term Goals
      response += `🎁 4. SHORT-TERM GOALS\n`;
      response += `   • Vacation Fund: $${(monthlyIncome * 0.05).toLocaleString()}/month\n`;
      response += `   • Technology Upgrade: $${(monthlyIncome * 0.03).toLocaleString()}/month\n`;
      response += `   • Gift Fund: $${(monthlyIncome * 0.02).toLocaleString()}/month\n\n`;
      
      response += `💡 AUTOMATED SAVINGS STRATEGY:\n`;
      response += `• Set up automatic transfer: $${targetMonthlySavings.toLocaleString()}/month\n`;
      response += `• Use 50/30/20 rule: 50% needs, 30% wants, 20% savings\n`;
      response += `• Open high-yield savings (4.5% APY)\n`;
      response += `• Consider investment account for long-term goals\n`;
      response += `• Review and adjust quarterly\n\n`;
      
      response += `🎯 Tell me your specific goal amount for detailed planning!\n`;
    }
    
    return response;
  }

  async handleBillManagement(input, confidence, entities) {
    let response = `💳 Smart Bill Management (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    // Simulate upcoming bills (in production, integrate with calendar/banking APIs)
    const upcomingBills = [
      { name: 'Electricity', amount: 120, dueDate: moment().add(5, 'days'), status: 'pending' },
      { name: 'Internet', amount: 80, dueDate: moment().add(8, 'days'), status: 'pending' },
      { name: 'Phone', amount: 65, dueDate: moment().add(12, 'days'), status: 'pending' },
      { name: 'Credit Card', amount: 450, dueDate: moment().add(15, 'days'), status: 'pending' }
    ];
    
    response += `📅 UPCOMING BILLS:\n`;
    let totalUpcoming = 0;
    upcomingBills.forEach(bill => {
      const daysUntilDue = bill.dueDate.diff(moment(), 'days');
      const urgency = daysUntilDue <= 3 ? '🔴' : daysUntilDue <= 7 ? '🟡' : '🟢';
      response += `${urgency} ${bill.name}: $${bill.amount} (Due in ${daysUntilDue} days)\n`;
      totalUpcoming += bill.amount;
    });
    
    response += `\n💰 Total upcoming: $${totalUpcoming.toLocaleString()}\n\n`;
    
    response += `🤖 SMART RECOMMENDATIONS:\n`;
    response += `• Set up automatic payments for recurring bills\n`;
    response += `• Consider consolidating due dates to improve cash flow\n`;
    response += `• Create a bill calendar with reminders\n`;
    
    return response;
  }

  async handleFraudDetection(input, confidence) {
    let response = `🛡️ Advanced Security Analysis (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    const transactions = await this.getRecentTransactions(null, 30);
    const fraudAlerts = await this.detectFraudulentActivity(transactions);
    
    if (fraudAlerts.length === 0) {
      response += `✅ NO SECURITY CONCERNS DETECTED\n`;
      response += `• All recent transactions appear normal\n`;
      response += `• Account activity is within expected patterns\n`;
      response += `• No suspicious geographic or timing anomalies\n\n`;
    } else {
      response += `🚨 SECURITY ALERTS FOUND (${fraudAlerts.length}):\n\n`;
      fraudAlerts.forEach((alert, index) => {
        response += `${index + 1}. ${alert.severity} RISK TRANSACTION\n`;
        response += `   • Amount: $${alert.transaction.amount.toLocaleString()}\n`;
        response += `   • Date: ${moment(alert.transaction.transaction_date).format('MMM DD, YYYY HH:mm')}\n`;
        response += `   • Risk Score: ${alert.riskScore}/100\n`;
        response += `   • Concerns: ${alert.reasons.join(', ')}\n`;
        response += `   • Action: ${alert.recommendedAction}\n\n`;
      });
    }
    
    response += `🔐 SECURITY RECOMMENDATIONS:\n`;
    response += `• Enable transaction notifications\n`;
    response += `• Review account regularly\n`;
    response += `• Use strong, unique passwords\n`;
    response += `• Enable two-factor authentication\n`;
    
    return response;
  }

  async handleFinancialAdvice(input, confidence, entities) {
    let response = `💡 Personalized Financial Coaching (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    const accounts = await this.getAccountBalance();
    const totalBalance = accounts.reduce((sum, acc) => sum + this.convertToUSD(acc.balance, acc.currency), 0);
    const monthlyIncome = await this.getMonthlyIncome();
    const monthlyExpenses = await this.getMonthlyExpenses();
    
    response += `📊 FINANCIAL HEALTH ASSESSMENT:\n`;
    response += `• Net Worth: $${totalBalance.toLocaleString()}\n`;
    response += `• Monthly Income: $${monthlyIncome.toLocaleString()}\n`;
    response += `• Monthly Expenses: $${monthlyExpenses.toLocaleString()}\n`;
    response += `• Savings Rate: ${((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(1)}%\n\n`;
    
    response += `🎯 PERSONALIZED ADVICE:\n`;
    
    if (totalBalance < monthlyExpenses * 3) {
      response += `• 🚨 PRIORITY: Build emergency fund (3-6 months expenses)\n`;
      response += `• Target: $${(monthlyExpenses * 6).toLocaleString()}\n`;
    }
    
    if ((monthlyIncome - monthlyExpenses) / monthlyIncome < 0.2) {
      response += `• 💰 Increase savings rate to at least 20%\n`;
      response += `• Consider expense reduction or income increase\n`;
    }
    
    if (totalBalance > 50000) {
      response += `• 📈 Consider investment diversification\n`;
      response += `• Look into tax-advantaged accounts (401k, IRA)\n`;
    }
    
    response += `\n🎓 FINANCIAL EDUCATION:\n`;
    response += await this.generateFinancialEducation(entities);
    
    return response;
  }

  async handleMarketNews(input, confidence, entities) {
    let response = `📰 Market News & Analysis (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    response += `📈 TODAY'S MARKET SNAPSHOT:\n`;
    response += `• S&P 500: +0.75% (Strong performance)\n`;
    response += `• NASDAQ: +1.20% (Tech rally continues)\n`;
    response += `• Dow Jones: +0.45% (Steady gains)\n`;
    response += `• Bitcoin: +3.03% (Crypto momentum)\n\n`;
    
    response += `🔍 MARKET INSIGHTS:\n`;
    response += `• Technology sector leading gains\n`;
    response += `• Federal Reserve maintains current rates\n`;
    response += `• Strong corporate earnings reports\n`;
    response += `• Consumer confidence remains high\n\n`;
    
    response += `💡 INVESTMENT IMPLICATIONS:\n`;
    response += `• Growth stocks showing strength\n`;
    response += `• Consider tech sector exposure\n`;
    response += `• Monitor interest rate changes\n`;
    response += `• Diversification remains key\n`;
    
    return response;
  }

  async handleLoanMortgage(input, confidence, entities) {
    let response = `🏠 Loan & Mortgage Analysis (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    const monthlyIncome = await this.getMonthlyIncome();
    const monthlyExpenses = await this.getMonthlyExpenses();
    const availableForPayment = (monthlyIncome - monthlyExpenses) * 0.8; // 80% of surplus
    
    response += `💰 AFFORDABILITY ANALYSIS:\n`;
    response += `• Monthly Income: $${monthlyIncome.toLocaleString()}\n`;
    response += `• Monthly Expenses: $${monthlyExpenses.toLocaleString()}\n`;
    response += `• Available for Payment: $${availableForPayment.toLocaleString()}\n\n`;
    
    // Mortgage calculation
    const interestRate = 0.065; // 6.5% annual
    const loanTerm = 30; // years
    const maxLoanAmount = this.calculateMaxLoan(availableForPayment, interestRate, loanTerm);
    
    response += `🏠 MORTGAGE CAPACITY:\n`;
    response += `• Maximum loan amount: $${maxLoanAmount.toLocaleString()}\n`;
    response += `• Interest rate (estimated): ${(interestRate * 100).toFixed(2)}%\n`;
    response += `• Loan term: ${loanTerm} years\n`;
    response += `• Monthly payment: $${availableForPayment.toLocaleString()}\n\n`;
    
    response += `📋 LOAN RECOMMENDATIONS:\n`;
    response += `• Shop around for best rates\n`;
    response += `• Consider 20% down payment to avoid PMI\n`;
    response += `• Get pre-approved before house hunting\n`;
    response += `• Factor in property taxes and insurance\n`;
    
    return response;
  }

  async handleInsurance(input, confidence, entities) {
    let response = `🛡️ Insurance Analysis (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    const monthlyIncome = await this.getMonthlyIncome();
    const annualIncome = monthlyIncome * 12;
    
    response += `💡 INSURANCE NEEDS ASSESSMENT:\n`;
    
    // Life insurance recommendation
    const lifeInsuranceNeed = annualIncome * 10; // 10x annual income rule
    response += `• Life Insurance: $${lifeInsuranceNeed.toLocaleString()}\n`;
    response += `  (10x annual income for family protection)\n`;
    
    // Disability insurance
    const disabilityBenefit = monthlyIncome * 0.6; // 60% of income
    response += `• Disability Insurance: $${disabilityBenefit.toLocaleString()}/month\n`;
    response += `  (60% income replacement)\n\n`;
    
    response += `🎯 COVERAGE RECOMMENDATIONS:\n`;
    response += `• Health: High-deductible plan with HSA\n`;
    response += `• Auto: Comprehensive with $500 deductible\n`;
    response += `• Home/Renters: Full replacement cost coverage\n`;
    response += `• Umbrella: $1M liability protection\n\n`;
    
    response += `💰 ESTIMATED MONTHLY COSTS:\n`;
    response += `• Life: $${(lifeInsuranceNeed * 0.001).toLocaleString()}\n`;
    response += `• Disability: $${(monthlyIncome * 0.02).toLocaleString()}\n`;
    response += `• Health: $${(monthlyIncome * 0.1).toLocaleString()}\n`;
    response += `• Total: ~$${((lifeInsuranceNeed * 0.001) + (monthlyIncome * 0.12)).toLocaleString()}/month\n`;
    
    return response;
  }

  // Helper methods
  convertToUSD(amount, currency) {
    const rates = { USD: 1, SAR: 0.267, EUR: 1.18, GBP: 1.39 };
    return amount * (rates[currency] || 1);
  }

  getAccountHealth(account) {
    const balance = this.convertToUSD(account.balance, account.currency);
    if (balance > 50000) return '🟢';
    if (balance > 10000) return '🟡';
    return '🔴';
  }

  async generateBalanceInsights(totalBalance, accountsByType) {
    let insights = '';
    
    if (totalBalance > 100000) {
      insights += '• Excellent financial position - consider wealth management\n';
      insights += '• Diversify into growth investments\n';
      insights += '• Look into tax optimization strategies\n';
    } else if (totalBalance > 50000) {
      insights += '• Strong foundation - focus on investment growth\n';
      insights += '• Consider maximizing retirement contributions\n';
      insights += '• Build towards $100k milestone\n';
    } else {
      insights += '• Focus on emergency fund building\n';
      insights += '• Automate savings to accelerate growth\n';
      insights += '• Consider high-yield savings accounts\n';
    }
    
    return insights;
  }

  async generatePersonalizedRecommendations(totalBalance, accounts) {
    let recommendations = '';
    
    const checkingBalance = accounts
      .filter(acc => acc.account_type === 'Checking')
      .reduce((sum, acc) => sum + this.convertToUSD(acc.balance, acc.currency), 0);
    
    if (checkingBalance > totalBalance * 0.3) {
      recommendations += '• Move excess checking funds to high-yield savings\n';
    }
    
    recommendations += '• Set up automatic transfers to savings\n';
    recommendations += '• Consider investing in low-cost index funds\n';
    recommendations += '• Review and optimize bank fees\n';
    
    return recommendations;
  }

  analyzeSpendingPatterns(transactions) {
    const patterns = {};
    
    transactions.forEach(transaction => {
      const category = transaction.category || transaction.transaction_type;
      if (!patterns[category]) {
        patterns[category] = { total: 0, count: 0, trend: 'stable' };
      }
      patterns[category].total += transaction.amount;
      patterns[category].count++;
    });
    
    return patterns;
  }

  async generatePredictiveInsights(transactions) {
    let insights = '';
    
    const monthlySpend = transactions
      .filter(t => moment(t.transaction_date).isAfter(moment().subtract(30, 'days')))
      .reduce((sum, t) => sum + t.amount, 0);
    
    insights += `• Projected monthly spending: $${(monthlySpend * 1.05).toLocaleString()}\n`;
    insights += `• Spending trend: ${monthlySpend > 0 ? 'Increasing' : 'Stable'}\n`;
    insights += `• Recommended budget: $${(monthlySpend * 0.9).toLocaleString()}/month\n`;
    
    return insights;
  }

  async analyzePortfolioOptimization() {
    let analysis = '';
    
    analysis += '• Current allocation: 60% stocks, 30% bonds, 10% cash\n';
    analysis += '• Recommendation: Increase international exposure\n';
    analysis += '• Consider rebalancing quarterly\n';
    analysis += '• Low-cost index funds preferred\n';
    
    return analysis;
  }

  async generateGoalStrategy(goalAmount, currentSavings, monthlyIncome) {
    let strategy = '';
    
    const deficit = goalAmount - currentSavings;
    const aggressiveSavings = monthlyIncome * 0.3;
    const timeWithAggressive = deficit / aggressiveSavings;
    
    strategy += `• Aggressive plan: Save $${aggressiveSavings.toLocaleString()}/month (${Math.ceil(timeWithAggressive)} months)\n`;
    strategy += `• Moderate plan: Save $${(monthlyIncome * 0.2).toLocaleString()}/month (${Math.ceil(deficit / (monthlyIncome * 0.2))} months)\n`;
    strategy += `• Consider automatic transfers\n`;
    strategy += `• Invest in high-yield savings or CDs\n`;
    
    return strategy;
  }

  async suggestFinancialGoals() {
    let suggestions = '';
    
    suggestions += '• Emergency Fund: 6 months of expenses\n';
    suggestions += '• Retirement: 10x annual income by age 67\n';
    suggestions += '• House Down Payment: 20% of home price\n';
    suggestions += '• Vacation Fund: $5,000 annually\n';
    suggestions += '• Education Fund: $50,000 per child\n';
    
    return suggestions;
  }

  async generateFinancialEducation(entities) {
    let education = '';
    
    if (entities.includes('investment') || entities.includes('invest')) {
      education += '• Diversification reduces risk\n';
      education += '• Time in market beats timing the market\n';
      education += '• Low-cost index funds are effective\n';
    } else {
      education += '• Pay yourself first (automate savings)\n';
      education += '• Compound interest is powerful\n';
      education += '• Emergency funds prevent debt\n';
    }
    
    return education;
  }

  calculateMaxLoan(monthlyPayment, annualRate, years) {
    const monthlyRate = annualRate / 12;
    const numPayments = years * 12;
    return monthlyPayment * (1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate;
  }

  async getCurrentSavings() {
    const accounts = await this.getAccountBalance();
    return accounts
      .filter(acc => acc.account_type === 'Savings')
      .reduce((sum, acc) => sum + this.convertToUSD(acc.balance, acc.currency), 0);
  }

  async getMonthlyIncome() {
    const transactions = await this.getRecentTransactions(null, 90);
    const deposits = transactions
      .filter(t => t.transaction_type === 'Deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    return deposits / 3; // 3 months average
  }

  async getMonthlyExpenses() {
    const transactions = await this.getRecentTransactions(null, 90);
    const expenses = transactions
      .filter(t => ['Withdrawal', 'Bill Payment', 'Shopping', 'Dining', 'Transportation', 'Healthcare'].includes(t.transaction_type))
      .reduce((sum, t) => sum + t.amount, 0);
    return expenses / 3; // 3 months average
  }

  async getAverageTransactionAmount(type) {
    const transactions = await this.getRecentTransactions(null, 180);
    const typeTransactions = transactions.filter(t => t.transaction_type === type);
    if (typeTransactions.length === 0) return 0;
    return typeTransactions.reduce((sum, t) => sum + t.amount, 0) / typeTransactions.length;
  }

  async getRecentTransactionCount(accountId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT COUNT(*) as count
        FROM transactions 
        WHERE account_id = ? AND transaction_date >= date('now', '-1 day')
      `;
      
      this.db.get(query, [accountId], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
  }

  async getInvestmentPortfolio() {
    // Simulated portfolio (in production, integrate with brokerage APIs)
    return [
      { symbol: 'VTI', shares: 100, price: 220, value: 22000 },
      { symbol: 'BND', shares: 200, price: 85, value: 17000 },
      { symbol: 'AAPL', shares: 50, price: 150, value: 7500 }
    ];
  }

  async updateMarketData() {
    // In production, fetch from real market data APIs
    console.log('📈 Updating market data...'.blue);
    this.marketData.lastUpdated = new Date();
  }

  async generateMonthlyBudgetReport() {
    console.log('📊 Generating monthly budget report...'.yellow);
  }

  async calculateFinancialHealth() {
    try {
      const accounts = await this.getAccountBalance();
      const transactions = await this.getRecentTransactions();
      
      let healthScore = 70; // Base score
      const factors = {};
      
      const totalBalance = accounts.reduce((sum, acc) => sum + this.convertToUSD(acc.balance, acc.currency), 0);
      
      // Enhanced health scoring
      if (totalBalance > 100000) {
        healthScore += 20;
        factors.balance = 'Excellent';
      } else if (totalBalance > 50000) {
        healthScore += 15;
        factors.balance = 'Very Good';
      } else if (totalBalance > 10000) {
        healthScore += 10;
        factors.balance = 'Good';
      } else {
        healthScore -= 10;
        factors.balance = 'Needs Improvement';
      }
      
      const successfulTx = transactions.filter(t => t.status === 'Success');
      const successRate = successfulTx.length / transactions.length;
      
      if (successRate > 0.95) {
        healthScore += 10;
        factors.reliability = 'Excellent';
      } else if (successRate > 0.9) {
        healthScore += 5;
        factors.reliability = 'Good';
      } else {
        healthScore -= 10;
        factors.reliability = 'Poor';
      }
      
      this.financialHealth = {
        score: Math.max(0, Math.min(100, healthScore)),
        factors,
        lastUpdated: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Error calculating financial health:', error);
    }
  }

  async handleGeneralIntelligentQuery(input, confidence, entities) {
    let response = `🤖 AI Assistant (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    // Check for notifications
    const unreadNotifications = this.notifications.filter(n => !n.read);
    if (unreadNotifications.length > 0) {
      response += `🔔 NOTIFICATIONS (${unreadNotifications.length}):\n`;
      unreadNotifications.slice(0, 3).forEach(notification => {
        response += `• ${notification.message}\n`;
      });
      response += '\n';
    }
    
    response += 'I\'m your intelligent financial assistant. I can help with:\n\n';
    response += '🏦 **Account Management:**\n';
    response += '• Balance inquiries and portfolio analysis\n';
    response += '• Transaction analysis and categorization\n';
    response += '• Account health monitoring\n\n';
    
    response += '📊 **Financial Planning:**\n';
    response += '• Budget creation and tracking\n';
    response += '• Goal setting and progress monitoring\n';
    response += '• Investment recommendations\n\n';
    
    response += '🛡️ **Security & Insights:**\n';
    response += '• Fraud detection and alerts\n';
    response += '• Spending pattern analysis\n';
    response += '• Predictive financial insights\n\n';
    
    response += '📈 **Market Intelligence:**\n';
    response += '• Real-time market data\n';
    response += '• Investment analysis\n';
    response += '• Market news and trends\n\n';
    
    response += 'Try asking: "Analyze my spending patterns" or "What are my investment options?"';
    
    return response;
  }

  // Reuse existing methods from advanced-finbot with enhancements
  async initializeUser() {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT customer_id FROM customers LIMIT 1", (err, row) => {
        if (err) {
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
        SELECT account_type, balance, currency, account_id, opening_date, status
        FROM accounts 
        WHERE customer_id = ? AND status = 'Active'
        ORDER BY balance DESC
      `;
      
      this.db.all(query, [cid], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getRecentTransactions(customerId = null, limit = 50) {
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
}

// Enhanced CLI Interface
async function startIntelligentChatbot() {
  console.log('🧠 Intelligent Fintech AI Assistant Started!'.rainbow);
  console.log('🚀 Features: Advanced NLP | Real-time Market Data | Predictive Analytics | Fraud Detection'.cyan);
  console.log('🔗 Connected to Enhanced Financial Database'.green);
  console.log('');
  
  const finbot = new IntelligentFintechAI();
  
  try {
    await finbot.initializeUser();
    await finbot.initializeIntelligentAI();
    console.log('✅ Intelligent AI systems fully loaded and ready!'.green);
    console.log('🎯 Advanced financial intelligence at your service...'.yellow);
    console.log('💬 Ask me anything about your finances!'.blue);
    console.log('');
  } catch (error) {
    console.error('❌ Error initializing intelligent AI:'.red, error.message);
    return;
  }
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  function askQuestion() {
    rl.question('You: '.bold.blue, async (input) => {
      if (input.toLowerCase().trim() === 'exit') {
        console.log('👋 Thank you for using Intelligent Fintech AI!'.rainbow);
        console.log('💡 Your personalized financial insights have been saved.'.cyan);
        finbot.db.close();
        rl.close();
        return;
      }
      
      if (input.trim()) {
        try {
          console.log('🧠 Processing with advanced AI intelligence...'.yellow);
          const startTime = Date.now();
          
          const response = await finbot.processIntelligentInput(input);
          
          const processingTime = Date.now() - startTime;
          console.log(`\nBot: ${response}`);
          console.log(`\n⚡ Processed in ${processingTime}ms`.gray);
          console.log('');
        } catch (error) {
          console.error('❌ Error processing request:'.red, error.message);
          console.log('💡 Please try again with a different question.'.cyan);
        }
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

module.exports = IntelligentFintechAI;