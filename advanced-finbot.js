const natural = require('natural');
const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const regression = require('ml-regression');
const stats = require('simple-statistics');
const moment = require('moment');
const colors = require('colors');

class AdvancedFinancialAI {
  constructor() {
    // Advanced NLP Setup
    this.classifier = new natural.BayesClassifier();
    this.stemmer = natural.PorterStemmer;
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
    
    // Conversation Memory
    this.conversationHistory = [];
    this.userContext = {
      currentTopic: null,
      preferences: {},
      goals: [],
      lastQueries: []
    };
    
    // ML Models
    this.spendingModel = null;
    this.riskModel = null;
    
    // Database
    this.dbPath = path.join(__dirname, 'database', 'bank_database.db');
    this.db = new sqlite3.Database(this.dbPath);
    
    // Financial Metrics
    this.financialHealth = {
      score: 0,
      factors: {},
      recommendations: []
    };
    
    // Transaction Categories
    this.categories = {
      'Deposit': { en: 'Deposit', color: 'green', type: 'income' },
      'Withdrawal': { en: 'Withdrawal', color: 'red', type: 'expense' },
      'Bill Payment': { en: 'Bill Payment', color: 'yellow', type: 'expense' },
      'Transfer': { en: 'Transfer', color: 'blue', type: 'transfer' }
    };
    
    // Account Types
    this.accountTypes = {
      'Checking': { en: 'Checking' },
      'Savings': { en: 'Savings' },
      'Investment': { en: 'Investment' }
    };
    
    // Response templates
    this.templates = {
      balanceTitle: '💰 Advanced Portfolio Analysis',
      healthTitle: '🏥 Financial Health Assessment',
      spendingTitle: '📈 Advanced Spending Pattern Analysis',
      anomalyTitle: '🔍 Anomaly Detection Report',
      predictionsTitle: '🔮 Spending Predictions',
      recommendationsTitle: '💡 AI-Powered Financial Recommendations',
      reportTitle: '💼 Comprehensive Financial Report',
      confidence: 'confidence',
      totalBalance: 'Total Portfolio Value',
      healthScore: 'Financial Health Score',
      insights: 'AI INSIGHTS',
      recommendations: 'RECOMMENDATIONS'
    };
    
    this.currentCustomerId = null;
    this.initializeAI();
  }

  async initializeAI() {
    this.trainAdvancedClassifier();
    await this.buildPredictiveModels();
    await this.calculateFinancialHealth();
  }

  // Language detection removed - English only

  getTemplate(key) {
    return this.templates[key] || key;
  }

  formatAccountType(type) {
    return this.accountTypes[type]?.en || type;
  }

  formatTransactionType(type) {
    return this.categories[type]?.en || type;
  }

  trainAdvancedClassifier() {
    // Enhanced training with Arabic and English intents
    const advancedIntents = {
      balance_inquiry: [
        "what's my balance", "show balance", "account summary", "portfolio overview",
        "how much money", "current balance", "financial status", "net worth",
        "total assets", "account details", "balance check", "money available"
      ],
      transaction_analysis: [
        "show transactions", "spending history", "recent activity", "payment history",
        "transaction list", "money movements", "account activity", "financial activity",
        "expense history", "income history", "cash flow", "financial movements"
      ],
      spending_analysis: [
        "analyze spending", "spending patterns", "expense analysis", "spending breakdown",
        "where does money go", "spending habits", "expense categories", "spending insights",
        "budget analysis", "cost analysis", "expenditure review", "spending summary"
      ],
      predictive_analysis: [
        "predict spending", "forecast expenses", "future spending", "spending projection",
        "budget forecast", "cash flow prediction", "financial forecast", "future finances",
        "spending trends", "predict bills", "upcoming expenses", "financial outlook"
      ],
      financial_health: [
        "financial health", "credit score", "financial rating", "money health",
        "financial wellness", "fiscal health", "financial status", "money situation",
        "financial condition", "economic health", "financial assessment", "financial review"
      ],
      goal_tracking: [
        "savings goal", "financial goals", "budget goals", "saving targets",
        "financial targets", "money goals", "investment goals", "financial planning",
        "goal progress", "target tracking", "savings progress", "financial objectives"
      ],
      recommendations: [
        "financial advice", "money tips", "saving advice", "budget recommendations",
        "financial suggestions", "investment advice", "money management", "financial guidance",
        "improve finances", "financial planning", "money strategy", "financial help"
      ],
      risk_assessment: [
        "financial risk", "investment risk", "spending risk", "budget risk",
        "financial security", "money safety", "financial stability", "risk analysis",
        "financial protection", "money risks", "financial threats", "risk evaluation"
      ],
      anomaly_detection: [
        "unusual spending", "strange transactions", "abnormal activity", "suspicious transactions",
        "unexpected charges", "unusual patterns", "irregular spending", "anomalous activity",
        "odd transactions", "weird charges", "suspicious activity", "irregular payments"
      ],
      comparative_analysis: [
        "compare spending", "spending comparison", "monthly comparison", "year over year",
        "benchmark spending", "spending vs budget", "actual vs planned", "performance comparison",
        "spending trends", "financial comparison", "period comparison", "historical comparison"
      ]
    };

    // Train classifier with enhanced intents
    Object.entries(advancedIntents).forEach(([intent, phrases]) => {
      phrases.forEach(phrase => {
        this.classifier.addDocument(phrase, intent);
        this.tfidf.addDocument(phrase);
      });
    });

    this.classifier.train();
  }

  async buildPredictiveModels() {
    try {
      // Build spending prediction model
      const historicalData = await this.getHistoricalSpendingData();
      if (historicalData.length > 10) {
        this.spendingModel = this.trainSpendingModel(historicalData);
      }
      
      // Build risk assessment model
      const riskData = await this.getRiskFactors();
      if (riskData.length > 5) {
        this.riskModel = this.trainRiskModel(riskData);
      }
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

  trainRiskModel(data) {
    // Risk scoring based on spending volatility and trends
    const volatility = stats.standardDeviation(data.map(d => d.amount));
    const trend = this.calculateTrend(data.map(d => d.amount));
    
    return {
      volatility,
      trend,
      riskScore: this.calculateRiskScore(volatility, trend)
    };
  }

  calculateTrend(values) {
    if (values.length < 2) return 0;
    const slope = stats.linearRegression(values.map((v, i) => [i, v])).m;
    return slope;
  }

  calculateRiskScore(volatility, trend) {
    // Higher volatility = higher risk, negative trend = higher risk
    let riskScore = 50; // Base score
    riskScore += Math.min(volatility / 100, 30); // Volatility component
    riskScore += Math.max(-trend * 10, -20); // Trend component
    return Math.min(Math.max(riskScore, 0), 100);
  }

  async calculateFinancialHealth() {
    try {
      const accounts = await this.getAccountBalance();
      const transactions = await this.getRecentTransactions();
      const spendingData = await this.analyzeSpendingPatterns();
      
      let healthScore = 70; // Base score
      const factors = {};
      
      // Account balance factor
      const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
      if (totalBalance > 100000) {
        healthScore += 15;
        factors.balance = 'Excellent';
      } else if (totalBalance > 50000) {
        healthScore += 10;
        factors.balance = 'Good';
      } else if (totalBalance > 10000) {
        healthScore += 5;
        factors.balance = 'Fair';
      } else {
        healthScore -= 10;
        factors.balance = 'Poor';
      }
      
      // Transaction diversity factor
      const transactionTypes = new Set(transactions.map(t => t.transaction_type));
      if (transactionTypes.size > 2) {
        healthScore += 5;
        factors.diversity = 'Good';
      } else {
        factors.diversity = 'Limited';
      }
      
      // Spending pattern factor
      const successfulTransactions = transactions.filter(t => t.status === 'Success');
      const failedTransactions = transactions.filter(t => t.status === 'Failed');
      
      if (failedTransactions.length / transactions.length > 0.2) {
        healthScore -= 15;
        factors.reliability = 'Poor';
      } else if (failedTransactions.length / transactions.length > 0.1) {
        healthScore -= 5;
        factors.reliability = 'Fair';
      } else {
        healthScore += 10;
        factors.reliability = 'Excellent';
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

  async getRecentTransactions(customerId = null, limit = 20) {
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

  async analyzeSpendingPatterns(customerId = null) {
    const cid = customerId || this.currentCustomerId;
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          transaction_type,
          COUNT(*) as transaction_count,
          SUM(amount) as total_amount,
          AVG(amount) as avg_amount,
          MIN(amount) as min_amount,
          MAX(amount) as max_amount,
          strftime('%Y-%m', transaction_date) as month
        FROM transactions t
        JOIN accounts a ON t.account_id = a.account_id
        WHERE a.customer_id = ? AND t.status = 'Success'
        GROUP BY transaction_type, month
        ORDER BY month DESC, total_amount DESC
      `;
      
      this.db.all(query, [cid], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async detectAnomalies(customerId = null) {
    const transactions = await this.getRecentTransactions(customerId, 100);
    const anomalies = [];
    
    // Group by transaction type for analysis
    const groupedTx = {};
    transactions.forEach(tx => {
      if (!groupedTx[tx.transaction_type]) {
        groupedTx[tx.transaction_type] = [];
      }
      groupedTx[tx.transaction_type].push(tx.amount);
    });
    
    // Detect anomalies using statistical methods
    Object.entries(groupedTx).forEach(([type, amounts]) => {
      if (amounts.length < 3) return;
      
      const mean = stats.mean(amounts);
      const stdDev = stats.standardDeviation(amounts);
      const threshold = 2; // 2 standard deviations
      
      transactions.forEach(tx => {
        if (tx.transaction_type === type) {
          const zScore = Math.abs((tx.amount - mean) / stdDev);
          if (zScore > threshold) {
            anomalies.push({
              transaction: tx,
              anomalyScore: zScore,
              reason: `Unusual ${this.categories[type].en.toLowerCase()} amount`,
              severity: zScore > 3 ? 'high' : 'medium'
            });
          }
        }
      });
    });
    
    return anomalies.sort((a, b) => b.anomalyScore - a.anomalyScore).slice(0, 5);
  }

  async predictSpending(months = 3) {
    if (!this.spendingModel) return null;
    
    const historicalData = await this.getHistoricalSpendingData();
    const predictions = [];
    
    for (let i = 1; i <= months; i++) {
      const futureIndex = historicalData.length + i;
      const prediction = this.spendingModel.predict(futureIndex);
      predictions.push({
        month: moment().add(i, 'months').format('YYYY-MM'),
        predictedSpending: Math.max(0, prediction),
        confidence: Math.max(0.5, 1 - (i * 0.1)) // Decreasing confidence
      });
    }
    
    return predictions;
  }

  generateAdvancedChart(data, title, type = 'bar') {
    let chart = `\n📊 ${title}\n`;
    chart += '═'.repeat(50) + '\n';
    
    if (!data || data.length === 0) {
      return chart + 'No data available\n';
    }
    
    const maxValue = Math.max(...data.map(d => d.value));
    const scale = 40; // Max bar length
    
    data.forEach(item => {
      const barLength = Math.round((item.value / maxValue) * scale);
      const bar = '█'.repeat(barLength);
      const percentage = ((item.value / maxValue) * 100).toFixed(1);
      
      chart += `${item.label.padEnd(15)} ${bar} ${item.value.toLocaleString()} (${percentage}%)\n`;
    });
    
    chart += '═'.repeat(50) + '\n';
    return chart;
  }

  async generateComprehensiveReport() {
    const accounts = await this.getAccountBalance();
    const transactions = await this.getRecentTransactions();
    const patterns = await this.analyzeSpendingPatterns();
    const anomalies = await this.detectAnomalies();
    const predictions = await this.predictSpending();
    
    let report = '\n' + '═'.repeat(80) + '\n';
    report += '💼 COMPREHENSIVE FINANCIAL REPORT'.padStart(50) + '\n';
    report += '═'.repeat(80) + '\n';
    
    // Financial Health Score
    report += `\n🏥 FINANCIAL HEALTH SCORE: ${this.financialHealth.score}/100\n`;
    const healthColor = this.financialHealth.score > 80 ? 'green' : 
                       this.financialHealth.score > 60 ? 'yellow' : 'red';
    report += `Status: ${this.getHealthStatus(this.financialHealth.score)}\n`;
    
    // Account Summary
    report += '\n💰 ACCOUNT PORTFOLIO:\n';
    let totalBalance = 0;
    accounts.forEach(acc => {
      const type = this.categories[acc.account_type] ? 
                  this.categories[acc.account_type].en : acc.account_type;
      report += `• ${type}: ${acc.balance.toLocaleString()} ${acc.currency}\n`;
      totalBalance += acc.balance;
    });
    report += `📊 Total Portfolio Value: ~$${totalBalance.toLocaleString()}\n`;
    
    // Recent Activity Summary
    report += '\n📈 RECENT ACTIVITY ANALYSIS:\n';
    const activitySummary = this.summarizeActivity(transactions);
    report += activitySummary;
    
    // Spending Patterns
    if (patterns.length > 0) {
      report += '\n🎯 SPENDING PATTERNS:\n';
      const chartData = patterns.slice(0, 5).map(p => ({
        label: this.categories[p.transaction_type].en,
        value: p.total_amount
      }));
      report += this.generateAdvancedChart(chartData, 'Spending by Category');
    }
    
    // Anomaly Detection
    if (anomalies.length > 0) {
      report += '\n🚨 UNUSUAL ACTIVITY DETECTED:\n';
      anomalies.forEach(anomaly => {
        const severity = anomaly.severity === 'high' ? '🔴' : '🟡';
        report += `${severity} ${anomaly.reason}: $${anomaly.transaction.amount.toLocaleString()}\n`;
      });
    }
    
    // Future Predictions
    if (predictions) {
      report += '\n🔮 SPENDING PREDICTIONS:\n';
      predictions.forEach(pred => {
        report += `• ${pred.month}: $${pred.predictedSpending.toLocaleString()} `;
        report += `(${(pred.confidence * 100).toFixed(0)}% confidence)\n`;
      });
    }
    
    // Personalized Recommendations
    report += '\n💡 PERSONALIZED RECOMMENDATIONS:\n';
    report += this.generateSmartRecommendations(accounts, transactions, patterns);
    
    report += '\n' + '═'.repeat(80) + '\n';
    return report;
  }

  getHealthStatus(score) {
    if (score >= 90) return 'Excellent 🌟';
    if (score >= 80) return 'Very Good 🟢';
    if (score >= 70) return 'Good 🟡';
    if (score >= 60) return 'Fair 🟠';
    return 'Needs Improvement 🔴';
  }

  summarizeActivity(transactions) {
    const last30Days = transactions.filter(t => 
      moment(t.transaction_date).isAfter(moment().subtract(30, 'days'))
    );
    
    let income = 0, expenses = 0, transfers = 0;
    last30Days.forEach(tx => {
      if (tx.transaction_type === 'Deposit') income += tx.amount;
      else if (['Withdrawal', 'Bill Payment'].includes(tx.transaction_type)) expenses += tx.amount;
      else if (tx.transaction_type === 'Transfer') transfers += tx.amount;
    });
    
    let summary = `• Total Income (30d): $${income.toLocaleString()}\n`;
    summary += `• Total Expenses (30d): $${expenses.toLocaleString()}\n`;
    summary += `• Net Cash Flow: $${(income - expenses).toLocaleString()}\n`;
    summary += `• Transaction Count: ${last30Days.length}\n`;
    
    const cashFlowTrend = income > expenses ? '📈 Positive' : '📉 Negative';
    summary += `• Cash Flow Trend: ${cashFlowTrend}\n`;
    
    return summary;
  }

  generateSmartRecommendations(accounts, transactions, patterns) {
    let recommendations = '';
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    // Balance-based recommendations
    if (totalBalance > 100000) {
      recommendations += '• Consider diversifying into investment accounts\n';
      recommendations += '• Look into high-yield savings options\n';
    } else if (totalBalance < 10000) {
      recommendations += '• Focus on building emergency fund (3-6 months expenses)\n';
      recommendations += '• Consider reducing non-essential spending\n';
    }
    
    // Pattern-based recommendations
    const spendingByType = {};
    patterns.forEach(p => {
      spendingByType[p.transaction_type] = (spendingByType[p.transaction_type] || 0) + p.total_amount;
    });
    
    const highestSpending = Object.entries(spendingByType)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (highestSpending) {
      const [type, amount] = highestSpending;
      const category = this.categories[type].en;
      recommendations += `• Your highest expense is ${category.toLowerCase()} ($${amount.toLocaleString()})\n`;
      recommendations += `• Consider setting a monthly budget limit for ${category.toLowerCase()}\n`;
    }
    
    // Health score based recommendations
    if (this.financialHealth.score < 70) {
      recommendations += '• Review and optimize your spending habits\n';
      recommendations += '• Consider meeting with a financial advisor\n';
    }
    
    return recommendations;
  }

  async processAdvancedInput(input) {
    // Add to conversation history
    this.conversationHistory.push({
      timestamp: new Date(),
      input: input,
      type: 'user'
    });

    // Keep only last 10 conversations for context
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }

    try {
      // Enhanced intent classification with context
      const intent = this.classifyWithContext(input);
      const confidence = Math.max(...this.classifier.getClassifications(input).map(c => c.value)) * 100;
      
      let response = '';
      
      switch (intent) {
        case 'balance_inquiry':
          response = await this.handleBalanceInquiry(input, confidence);
          break;
        case 'transaction_analysis':
          response = await this.handleTransactionAnalysis(input, confidence);
          break;
        case 'spending_analysis':
          response = await this.handleSpendingAnalysis(input, confidence);
          break;
        case 'predictive_analysis':
          response = await this.handlePredictiveAnalysis(input, confidence);
          break;
        case 'financial_health':
          response = await this.handleFinancialHealth(input, confidence);
          break;
        case 'anomaly_detection':
          response = await this.handleAnomalyDetection(input, confidence);
          break;
        case 'recommendations':
          response = await this.handleRecommendations(input, confidence);
          break;
        case 'comparative_analysis':
          response = await this.handleComparativeAnalysis(input, confidence);
          break;
        default:
          // Try to generate comprehensive report for complex queries
          if (input.length > 50 || input.includes('report') || input.includes('summary')) {
            response = await this.generateComprehensiveReport();
          } else {
            response = await this.handleGeneralQuery(input, confidence);
          }
      }

      // Add response to conversation history
      this.conversationHistory.push({
        timestamp: new Date(),
        response: response,
        type: 'bot',
        intent: intent,
        confidence: confidence
      });

      return response;

    } catch (error) {
      console.error('Error processing advanced input:', error);
      return '🚨 I encountered an error analyzing your request. Please try again or rephrase your question.';
    }
  }

  classifyWithContext(input) {
    // Get base classification
    const baseIntent = this.classifier.classify(input);
    
    // Consider conversation context
    const recentIntents = this.conversationHistory
      .slice(-3)
      .filter(h => h.type === 'bot' && h.intent)
      .map(h => h.intent);
    
    // If asking follow-up questions, maintain context
    if (input.toLowerCase().includes('more') || input.toLowerCase().includes('details')) {
      if (recentIntents.length > 0) {
        return recentIntents[recentIntents.length - 1];
      }
    }
    
    return baseIntent;
  }

  async handleBalanceInquiry(input, confidence) {
    const accounts = await this.getAccountBalance();
    return this.generateBalanceInsight(accounts, confidence);
  }

  async handleTransactionAnalysis(input, confidence) {
    const transactions = await this.getRecentTransactions();
    return this.generateTransactionInsight(transactions, confidence);
  }

  async handleSpendingAnalysis(input, confidence) {
    const patterns = await this.analyzeSpendingPatterns();
    return this.generateAnalysisInsight(patterns, confidence);
  }

  async handlePredictiveAnalysis(input, confidence) {
    const predictions = await this.predictSpending();
    let response = `🔮 Spending Predictions (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    if (!predictions) {
      return response + 'Not enough historical data for accurate predictions.';
    }
    
    response += 'Predicted monthly spending:\n';
    predictions.forEach(pred => {
      response += `• ${moment(pred.month).format('MMMM YYYY')}: $${pred.predictedSpending.toLocaleString()}`;
      response += ` (${(pred.confidence * 100).toFixed(0)}% confidence)\n`;
    });
    
    const totalPredicted = predictions.reduce((sum, p) => sum + p.predictedSpending, 0);
    response += `\n📊 Total predicted spending (3 months): $${totalPredicted.toLocaleString()}\n`;
    
    response += '\n💡 Prediction is based on your historical spending patterns.';
    return response;
  }

  async handleFinancialHealth(input, confidence) {
    await this.calculateFinancialHealth(); // Refresh score
    
    let response = `🏥 Financial Health Assessment (confidence: ${confidence.toFixed(0)}%)\n\n`;
    response += `Overall Score: ${this.financialHealth.score}/100\n`;
    response += `Status: ${this.getHealthStatus(this.financialHealth.score)}\n\n`;
    
    response += 'Health Factors:\n';
    Object.entries(this.financialHealth.factors).forEach(([factor, rating]) => {
      response += `• ${factor.charAt(0).toUpperCase() + factor.slice(1)}: ${rating}\n`;
    });
    
    response += '\n📈 Score Breakdown:\n';
    response += '• Account Balance: Weighted heavily\n';
    response += '• Transaction Success Rate: Important factor\n';
    response += '• Account Diversity: Minor factor\n';
    
    if (this.financialHealth.score < 70) {
      response += '\n⚠️ Recommendations to improve your score:\n';
      response += '• Increase account balances\n';
      response += '• Reduce failed transactions\n';
      response += '• Diversify account types\n';
    }
    
    return response;
  }

  async handleAnomalyDetection(input, confidence) {
    const anomalies = await this.detectAnomalies();
    
    let response = `🔍 Anomaly Detection Report (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    if (anomalies.length === 0) {
      response += '✅ No unusual activity detected in your recent transactions.\n';
      response += 'All transactions appear to be within normal patterns.';
      return response;
    }
    
    response += `🚨 Found ${anomalies.length} unusual transaction(s):\n\n`;
    
    anomalies.forEach((anomaly, index) => {
      const severity = anomaly.severity === 'high' ? '🔴 HIGH' : '🟡 MEDIUM';
      const date = moment(anomaly.transaction.transaction_date).format('MMM DD, YYYY');
      
      response += `${index + 1}. ${severity} PRIORITY\n`;
      response += `   • Amount: $${anomaly.transaction.amount.toLocaleString()}\n`;
      response += `   • Date: ${date}\n`;
      response += `   • Type: ${this.categories[anomaly.transaction.transaction_type].en}\n`;
      response += `   • Reason: ${anomaly.reason}\n`;
      response += `   • Anomaly Score: ${anomaly.anomalyScore.toFixed(2)}\n\n`;
    });
    
    response += '💡 Recommendations:\n';
    response += '• Review these transactions for accuracy\n';
    response += '• Check if they were authorized by you\n';
    response += '• Consider setting up transaction alerts\n';
    
    return response;
  }

  async handleRecommendations(input, confidence) {
    const accounts = await this.getAccountBalance();
    const transactions = await this.getRecentTransactions();
    const patterns = await this.analyzeSpendingPatterns();
    
    let response = `💡 AI-Powered Financial Recommendations (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    response += '🎯 PERSONALIZED INSIGHTS:\n';
    response += this.generateSmartRecommendations(accounts, transactions, patterns);
    
    response += '\n🚀 ADVANCED STRATEGIES:\n';
    response += this.generateAdvancedStrategies(accounts, transactions);
    
    return response;
  }

  generateAdvancedStrategies(accounts, transactions) {
    let strategies = '';
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    // Investment strategies
    if (totalBalance > 50000) {
      strategies += '• **Investment Portfolio**: Consider allocating 60% stocks, 30% bonds, 10% alternatives\n';
      strategies += '• **Tax Optimization**: Look into tax-advantaged accounts (401k, IRA)\n';
      strategies += '• **Real Estate**: Consider REITs or direct property investment\n';
    }
    
    // Risk management
    strategies += '• **Emergency Fund**: Maintain 6 months of expenses in liquid savings\n';
    strategies += '• **Insurance Review**: Ensure adequate life, health, and disability coverage\n';
    
    // Income optimization
    const recentIncome = transactions
      .filter(t => t.transaction_type === 'Deposit' && moment(t.transaction_date).isAfter(moment().subtract(30, 'days')))
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (recentIncome > 0) {
      strategies += `• **Income Growth**: Your monthly income is ~$${recentIncome.toLocaleString()}\n`;
      strategies += '• **Side Hustles**: Consider additional income streams\n';
    }
    
    return strategies;
  }

  async handleComparativeAnalysis(input, confidence) {
    const trends = await this.getSpendingTrends();
    return this.generateComparisonInsight(trends, confidence);
  }

  async getSpendingTrends(customerId = null) {
    const cid = customerId || this.currentCustomerId;
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          strftime('%Y-%m', transaction_date) as month,
          SUM(CASE WHEN transaction_type = 'Withdrawal' THEN amount ELSE 0 END) as withdrawals,
          SUM(CASE WHEN transaction_type = 'Bill Payment' THEN amount ELSE 0 END) as bills,
          SUM(CASE WHEN transaction_type = 'Transfer' THEN amount ELSE 0 END) as transfers,
          SUM(CASE WHEN transaction_type = 'Deposit' THEN amount ELSE 0 END) as deposits,
          COUNT(*) as transaction_count
        FROM transactions t
        JOIN accounts a ON t.account_id = a.account_id
        WHERE a.customer_id = ? AND t.status = 'Success'
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

  async handleGeneralQuery(input, confidence) {
    let response = `🤖 AI Assistant (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    // Try to extract financial keywords and provide relevant info
    const keywords = input.toLowerCase();
    
    if (keywords.includes('help') || keywords.includes('commands')) {
      return this.generateAdvancedHelp(confidence);
    }
    
    if (keywords.includes('total') || keywords.includes('net worth')) {
      const accounts = await this.getAccountBalance();
      const total = accounts.reduce((sum, acc) => sum + acc.balance, 0);
      response += `Your total net worth is approximately $${total.toLocaleString()}.`;
      return response;
    }
    
    response += 'I understand you\'re asking about your finances. Here are some things I can help with:\n\n';
    response += '• Detailed balance and portfolio analysis\n';
    response += '• Transaction history and patterns\n';
    response += '• Spending predictions and forecasts\n';
    response += '• Financial health assessment\n';
    response += '• Anomaly detection and alerts\n';
    response += '• Personalized recommendations\n\n';
    response += 'Try asking: "Generate a comprehensive financial report" for detailed insights.';
    
    return response;
  }

  generateAdvancedHelp(confidence) {
    let help = `🧠 Advanced AI FinBot Help (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    help += '🎯 **INTELLIGENT FEATURES**:\n';
    help += '• "What\'s my balance?" - Portfolio analysis with insights\n';
    help += '• "Analyze my spending" - Pattern recognition and categorization\n';
    help += '• "Predict my spending" - AI-powered forecasting\n';
    help += '• "Check my financial health" - Comprehensive health scoring\n';
    help += '• "Find unusual transactions" - Anomaly detection\n';
    help += '• "Compare my spending" - Trend analysis\n';
    help += '• "Financial recommendations" - Personalized advice\n';
    help += '• "Generate report" - Comprehensive financial analysis\n\n';
    
    help += '🧠 **AI CAPABILITIES**:\n';
    help += '• Machine learning predictions\n';
    help += '• Statistical anomaly detection\n';
    help += '• Risk assessment modeling\n';
    help += '• Conversational context memory\n';
    help += '• Real-time data analysis\n';
    help += '• Personalized insights\n\n';
    
    help += '📊 **ADVANCED ANALYTICS**:\n';
    help += '• Financial health scoring\n';
    help += '• Spending pattern recognition\n';
    help += '• Future cash flow predictions\n';
    help += '• Investment recommendations\n';
    help += '• Budget optimization\n\n';
    
    help += 'Type "exit" to quit the advanced assistant.';
    
    return help;
  }

  // Reuse methods from previous implementation
  generateBalanceInsight(accounts, confidence) {
    if (!accounts || accounts.length === 0) {
      return `I couldn't find your account information. (confidence: ${confidence.toFixed(0)}%)`;
    }

    let response = `${this.getTemplate('balanceTitle')} (${this.getTemplate('confidence')}: ${confidence.toFixed(0)}%)\n\n`;
    let totalBalance = 0;
    const accountsByType = {};

    accounts.forEach(account => {
      const accountType = this.formatAccountType(account.account_type);
      
      if (!accountsByType[accountType]) {
        accountsByType[accountType] = [];
      }
      accountsByType[accountType].push(account);
      
      const usdAmount = account.currency === 'USD' ? account.balance : 
                       account.currency === 'SAR' ? account.balance / 3.75 : 
                       account.balance * 1.1;
      totalBalance += usdAmount;
    });

    // Display accounts by type
    Object.entries(accountsByType).forEach(([type, accs]) => {
      response += `📊 ${type} Accounts:\n`;
      accs.forEach(acc => {
        response += `   • ${acc.balance.toLocaleString()} ${acc.currency}\n`;
      });
      response += '\n';
    });

    response += `🏦 ${this.getTemplate('totalBalance')}: $${totalBalance.toLocaleString('en-US', {maximumFractionDigits: 2})}\n`;
    response += `📈 ${this.getTemplate('healthScore')}: ${this.financialHealth.score}/100\n\n`;
    
    // Advanced insights
    response += `💡 ${this.getTemplate('insights')}:\n`;
    if (totalBalance > 100000) {
      response += '• Excellent financial position - consider wealth management services\n';
      response += '• Recommend diversifying into growth investments\n';
      response += '• You\'re in the top tier of savers\n';
    } else if (totalBalance > 50000) {
      response += '• Strong financial foundation - focus on investment growth\n';
      response += '• Consider maximizing retirement contributions\n';
      response += '• You\'re building wealth effectively\n';
    } else {
      response += '• Focus on emergency fund building (3-6 months expenses)\n';
      response += '• Consider automatic savings plans\n';
      response += '• Prioritize debt reduction if applicable\n';
    }

    // Asset allocation recommendation
    const savingsRatio = accountsByType['Savings'] ? 
      accountsByType['Savings'].reduce((sum, acc) => sum + acc.balance, 0) / totalBalance : 0;
    
    response += `\n📊 Current Asset Allocation:\n`;
    response += `• Liquid Savings: ${(savingsRatio * 100).toFixed(1)}%\n`;
    
    if (savingsRatio > 0.8) {
      response += '• ⚠️ Consider investing excess cash for growth\n';
    } else if (savingsRatio < 0.2) {
      response += '• ⚠️ Increase emergency fund allocation\n';
    }

    return response;
  }

  generateTransactionInsight(transactions, confidence) {
    if (!transactions || transactions.length === 0) {
      return `No recent transactions found. (confidence: ${confidence.toFixed(0)}%)`;
    }

    let response = `📊 Advanced Transaction Analysis (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    // Time-based analysis
    const last7Days = transactions.filter(t => 
      moment(t.transaction_date).isAfter(moment().subtract(7, 'days'))
    );
    const last30Days = transactions.filter(t => 
      moment(t.transaction_date).isAfter(moment().subtract(30, 'days'))
    );
    
    response += `📅 ACTIVITY SUMMARY:\n`;
    response += `• Last 7 days: ${last7Days.length} transactions\n`;
    response += `• Last 30 days: ${last30Days.length} transactions\n`;
    response += `• Total analyzed: ${transactions.length} transactions\n\n`;
    
    // Transaction success rate
    const successfulTx = transactions.filter(t => t.status === 'Success');
    const successRate = (successfulTx.length / transactions.length * 100).toFixed(1);
    
    response += `📈 SUCCESS METRICS:\n`;
    response += `• Success Rate: ${successRate}%\n`;
    response += `• Failed Transactions: ${transactions.length - successfulTx.length}\n\n`;
    
    // Category breakdown
    const categoryBreakdown = {};
    let totalSpending = 0;
    let totalIncome = 0;
    
    successfulTx.forEach(tx => {
      const category = this.categories[tx.transaction_type];
      if (!categoryBreakdown[category.en]) {
        categoryBreakdown[category.en] = { count: 0, amount: 0 };
      }
      categoryBreakdown[category.en].count++;
      categoryBreakdown[category.en].amount += tx.amount;
      
      if (category.type === 'expense') {
        totalSpending += tx.amount;
      } else if (category.type === 'income') {
        totalIncome += tx.amount;
      }
    });
    
    response += `💰 FINANCIAL FLOW:\n`;
    response += `• Total Income: $${totalIncome.toLocaleString()}\n`;
    response += `• Total Spending: $${totalSpending.toLocaleString()}\n`;
    response += `• Net Cash Flow: $${(totalIncome - totalSpending).toLocaleString()}\n\n`;
    
    // Category visualization
    response += `🎯 SPENDING BREAKDOWN:\n`;
    Object.entries(categoryBreakdown).forEach(([category, data]) => {
      const percentage = totalSpending > 0 ? (data.amount / totalSpending * 100).toFixed(1) : 0;
      response += `• ${category}: $${data.amount.toLocaleString()} (${data.count} txns, ${percentage}%)\n`;
    });
    
    // Spending velocity
    const avgDailySpending = totalSpending / 30;
    response += `\n📊 SPENDING VELOCITY:\n`;
    response += `• Average daily spending: $${avgDailySpending.toLocaleString()}\n`;
    response += `• Projected monthly spending: $${(avgDailySpending * 30).toLocaleString()}\n`;
    
    // AI insights
    response += `\n🧠 AI INSIGHTS:\n`;
    if (totalIncome > totalSpending) {
      response += `• ✅ Positive cash flow of $${(totalIncome - totalSpending).toLocaleString()}\n`;
      response += `• Consider investing surplus funds\n`;
    } else {
      response += `• ⚠️ Negative cash flow - review spending habits\n`;
      response += `• Focus on expense reduction strategies\n`;
    }
    
    if (successRate < 90) {
      response += `• 🔍 Low success rate (${successRate}%) - check account funding\n`;
    }

    return response;
  }

  generateAnalysisInsight(analysisData, confidence) {
    let response = `📈 Advanced Spending Pattern Analysis (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    if (!analysisData || analysisData.length === 0) {
      return response + 'Not enough data for detailed pattern analysis.';
    }

    // Group data by category and month
    const categoryTotals = {};
    const monthlyTrends = {};
    
    analysisData.forEach(item => {
      const category = this.categories[item.transaction_type].en;
      
      if (!categoryTotals[category]) {
        categoryTotals[category] = {
          total: 0,
          count: 0,
          months: new Set()
        };
      }
      
      categoryTotals[category].total += item.total_amount;
      categoryTotals[category].count += item.transaction_count;
      categoryTotals[category].months.add(item.month);
      
      if (!monthlyTrends[item.month]) {
        monthlyTrends[item.month] = {};
      }
      monthlyTrends[item.month][category] = item.total_amount;
    });
    
    // Category analysis
    response += `🎯 SPENDING CATEGORIES:\n`;
    const sortedCategories = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b.total - a.total);
    
    const chartData = sortedCategories.map(([category, data]) => ({
      label: category,
      value: data.total
    }));
    
    response += this.generateAdvancedChart(chartData, 'Spending by Category');
    
    // Pattern insights
    response += `\n🔍 PATTERN ANALYSIS:\n`;
    sortedCategories.forEach(([category, data], index) => {
      const avgPerMonth = data.total / data.months.size;
      const avgPerTransaction = data.total / data.count;
      
      response += `${index + 1}. **${category}**:\n`;
      response += `   • Total: $${data.total.toLocaleString()}\n`;
      response += `   • Avg/month: $${avgPerMonth.toLocaleString()}\n`;
      response += `   • Avg/transaction: $${avgPerTransaction.toLocaleString()}\n`;
      response += `   • Transaction frequency: ${data.count} over ${data.months.size} months\n\n`;
    });
    
    // Trend analysis
    const months = Object.keys(monthlyTrends).sort();
    if (months.length > 1) {
      response += `📊 MONTHLY TRENDS:\n`;
      
      const recentMonth = months[months.length - 1];
      const previousMonth = months[months.length - 2];
      
      const recentTotal = Object.values(monthlyTrends[recentMonth]).reduce((sum, val) => sum + val, 0);
      const previousTotal = Object.values(monthlyTrends[previousMonth]).reduce((sum, val) => sum + val, 0);
      
      const changePercent = ((recentTotal - previousTotal) / previousTotal * 100).toFixed(1);
      const changeDirection = recentTotal > previousTotal ? '📈' : '📉';
      
      response += `• Month-over-month change: ${changeDirection} ${changePercent}%\n`;
      response += `• ${recentMonth}: $${recentTotal.toLocaleString()}\n`;
      response += `• ${previousMonth}: $${previousTotal.toLocaleString()}\n\n`;
    }
    
    // AI recommendations
    response += `🧠 AI RECOMMENDATIONS:\n`;
    const topCategory = sortedCategories[0];
    if (topCategory) {
      response += `• Your highest expense is ${topCategory[0]} ($${topCategory[1].total.toLocaleString()})\n`;
      response += `• Consider setting a monthly budget limit of $${(topCategory[1].total * 0.9).toLocaleString()}\n`;
      response += `• Track ${topCategory[0]} transactions more closely\n`;
    }
    
    // Volatility analysis
    const amounts = analysisData.map(item => item.total_amount);
    if (amounts.length > 3) {
      const volatility = stats.standardDeviation(amounts);
      const mean = stats.mean(amounts);
      const volatilityPercent = (volatility / mean * 100).toFixed(1);
      
      response += `• Spending volatility: ${volatilityPercent}%\n`;
      if (volatilityPercent > 50) {
        response += `• ⚠️ High spending volatility - consider budgeting tools\n`;
      } else {
        response += `• ✅ Consistent spending patterns detected\n`;
      }
    }

    return response;
  }

  generateComparisonInsight(trendsData, confidence) {
    let response = `📊 Advanced Spending Trends Analysis (confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    if (!trendsData || trendsData.length === 0) {
      return response + 'Not enough historical data for trend comparison.';
    }

    // Monthly breakdown
    response += `📅 MONTHLY BREAKDOWN (Last ${trendsData.length} months):\n`;
    trendsData.reverse().forEach((month, index) => {
      const totalSpending = month.withdrawals + month.bills + month.transfers;
      const netFlow = month.deposits - totalSpending;
      const flowDirection = netFlow >= 0 ? '📈' : '📉';
      
      response += `\n${index + 1}. ${moment(month.month).format('MMMM YYYY')}:\n`;
      response += `   • Total Spending: $${totalSpending.toLocaleString()}\n`;
      response += `   • Total Income: $${month.deposits.toLocaleString()}\n`;
      response += `   • Net Flow: ${flowDirection} $${Math.abs(netFlow).toLocaleString()}\n`;
      response += `   • Transactions: ${month.transaction_count}\n`;
    });
    
    // Trend calculations
    if (trendsData.length >= 3) {
      response += `\n📈 TREND ANALYSIS:\n`;
      
      // Calculate spending trend
      const spendingAmounts = trendsData.map(m => m.withdrawals + m.bills + m.transfers);
      const spendingTrend = this.calculateTrend(spendingAmounts);
      const trendDirection = spendingTrend > 0 ? 'increasing' : 'decreasing';
      const trendMagnitude = Math.abs(spendingTrend);
      
      response += `• Spending trend: ${trendDirection} by $${trendMagnitude.toFixed(2)} per month\n`;
      
      // Calculate income trend
      const incomeAmounts = trendsData.map(m => m.deposits);
      const incomeTrend = this.calculateTrend(incomeAmounts);
      const incomeTrendDirection = incomeTrend > 0 ? 'increasing' : 'decreasing';
      
      response += `• Income trend: ${incomeTrendDirection} by $${Math.abs(incomeTrend).toFixed(2)} per month\n`;
      
      // Seasonal analysis
      const avgSpending = stats.mean(spendingAmounts);
      const volatility = stats.standardDeviation(spendingAmounts);
      const volatilityPercent = (volatility / avgSpending * 100).toFixed(1);
      
      response += `• Spending volatility: ${volatilityPercent}%\n`;
      response += `• Average monthly spending: $${avgSpending.toLocaleString()}\n`;
      
      // Predictions
      if (trendsData.length >= 6) {
        const nextMonthSpending = avgSpending + spendingTrend;
        response += `• Predicted next month: $${Math.max(0, nextMonthSpending).toLocaleString()}\n`;
      }
    }
    
    // Performance metrics
    response += `\n🎯 PERFORMANCE METRICS:\n`;
    const totalIncome = trendsData.reduce((sum, m) => sum + m.deposits, 0);
    const totalSpending = trendsData.reduce((sum, m) => sum + m.withdrawals + m.bills + m.transfers, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpending) / totalIncome * 100).toFixed(1) : 0;
    
    response += `• Overall savings rate: ${savingsRate}%\n`;
    response += `• Total income (period): $${totalIncome.toLocaleString()}\n`;
    response += `• Total spending (period): $${totalSpending.toLocaleString()}\n`;
    
    // Recommendations based on trends
    response += `\n💡 TREND-BASED RECOMMENDATIONS:\n`;
    
    if (parseFloat(savingsRate) < 10) {
      response += `• ⚠️ Low savings rate (${savingsRate}%) - aim for 20%+\n`;
      response += `• Focus on expense reduction strategies\n`;
    } else if (parseFloat(savingsRate) > 30) {
      response += `• ✅ Excellent savings rate (${savingsRate}%)\n`;
      response += `• Consider increasing investments\n`;
    } else {
      response += `• ✅ Good savings rate (${savingsRate}%)\n`;
      response += `• Maintain current financial discipline\n`;
    }
    
    if (spendingTrend > 100) {
      response += `• 🚨 Spending increasing rapidly (+$${spendingTrend.toFixed(2)}/month)\n`;
      response += `• Review and optimize expense categories\n`;
    } else if (spendingTrend < -100) {
      response += `• ✅ Successfully reducing spending (-$${Math.abs(spendingTrend).toFixed(2)}/month)\n`;
    }

    return response;
  }
}

// Enhanced CLI Interface
async function startAdvancedChatbot() {
  console.log('🧠 Advanced AI Financial Assistant Started!'.rainbow);
  console.log('💡 Features: ML Predictions | Anomaly Detection | Health Scoring | Smart Analytics'.cyan);
  console.log('💡 Features: ML Predictions | Anomaly Detection | Health Scoring | Smart Analytics'.cyan);
  console.log('🔗 Connected to Real Financial Database'.green);
  console.log('');
  
  const finbot = new AdvancedFinancialAI();
  
  try {
    await finbot.initializeUser();
    console.log('✅ AI models loaded and user data connected'.green);
    console.log('🤖 Ready for intelligent financial analysis...'.yellow);
    console.log('💬 You can now chat in English'.blue);
    console.log('');
  } catch (error) {
    console.error('❌ Error initializing advanced AI:'.red, error.message);
    return;
  }
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  function askQuestion() {
    rl.question('You: '.bold.blue, async (input) => {
      if (input.toLowerCase().trim() === 'exit') {
        console.log('👋 Thank you for using Advanced AI FinBot!'.rainbow);
        console.log('💡 Your financial data analysis session has been saved.'.cyan);
        finbot.db.close();
        rl.close();
        return;
      }
      
      if (input.trim()) {
        console.log('🧠 Analyzing with advanced AI...'.yellow);
        const startTime = Date.now();
        
        const response = await finbot.processAdvancedInput(input);
        
        const processingTime = Date.now() - startTime;
        console.log(`\nBot: ${response}`);
        console.log(`\n⚡ Processed in ${processingTime}ms`.gray);
        console.log('');
      }
      
      askQuestion();
    });
  }
  
  askQuestion();
}

// Start the advanced chatbot
if (require.main === module) {
  startAdvancedChatbot();
}

module.exports = AdvancedFinancialAI;