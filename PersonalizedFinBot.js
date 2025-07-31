const natural = require('natural');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const regression = require('ml-regression');
const stats = require('simple-statistics');
const moment = require('moment');
const fs = require('fs');

class PersonalizedFinBot {
  constructor(dbPath = null) {
    // Advanced NLP Setup
    this.classifier = new natural.BayesClassifier();
    this.stemmer = natural.PorterStemmer;
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
    
    // Database connection
    this.dbPath = dbPath || path.join(__dirname, 'قاعدة بيانات بنكية وهمية شاملة وقابلة للتحويل', 'bank_database.db');
    this.db = new sqlite3.Database(this.dbPath);
    
    // User Management
    this.currentUser = null;
    this.userProfiles = new Map(); // Store user profiles in memory
    this.userModels = new Map(); // Store ML models per user
    this.userBehaviors = new Map(); // Store user behavior patterns
    
    // Categories and Templates
    this.categories = {
      'إيداع': { en: 'Deposit', ar: 'إيداع', color: 'green', type: 'income' },
      'سحب': { en: 'Withdrawal', ar: 'سحب', color: 'red', type: 'expense' },
      'دفع فواتير': { en: 'Bill Payment', ar: 'دفع فواتير', color: 'yellow', type: 'expense' },
      'تحويل': { en: 'Transfer', ar: 'تحويل', color: 'blue', type: 'transfer' }
    };
    
    this.accountTypes = {
      'جاري': { en: 'Checking', ar: 'حساب جاري' },
      'توفير': { en: 'Savings', ar: 'حساب توفير' },
      'استثمار': { en: 'Investment', ar: 'حساب استثماري' }
    };
    
    // Language templates
    this.templates = {
      ar: {
        balanceTitle: '💰 تحليل الحافظة المالية الشخصية',
        healthTitle: '🏥 تقييم الصحة المالية الشخصية',
        spendingTitle: '📈 تحليل أنماط الإنفاق الشخصية',
        welcomeBack: 'مرحباً بعودتك',
        personalizedInsights: 'رؤى شخصية مخصصة لك',
        behaviorAnalysis: 'تحليل سلوكك المالي'
      },
      en: {
        balanceTitle: '💰 Personalized Portfolio Analysis',
        healthTitle: '🏥 Personal Financial Health Assessment',
        spendingTitle: '📈 Personal Spending Pattern Analysis',
        welcomeBack: 'Welcome back',
        personalizedInsights: 'Personalized insights for you',
        behaviorAnalysis: 'Your financial behavior analysis'
      }
    };
    
    this.currentLanguage = 'ar';
    this.initializeBot();
  }

  async initializeBot() {
    this.trainAdvancedClassifier();
    // User profiles will be loaded on-demand when users login
  }

  // User Management Methods
  async setCurrentUser(customerId) {
    try {
      // Get user info from database
      const userInfo = await this.getUserInfo(customerId);
      if (!userInfo) {
        throw new Error(`User with ID ${customerId} not found`);
      }

      this.currentUser = {
        id: customerId,
        info: userInfo,
        sessionStart: new Date(),
        interactionCount: 0,
        preferences: {
          language: 'ar',
          preferredCurrency: 'SAR',
          reportFrequency: 'weekly'
        }
      };

      // Load or create user profile
      await this.loadUserProfile(customerId);
      
      // Update user behavior tracking
      await this.updateUserBehavior(customerId, 'login', { timestamp: new Date() });
      
      return {
        success: true,
        user: this.currentUser.info,
        message: `${this.templates[this.currentLanguage].welcomeBack} ${userInfo.first_name}!`
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getUserInfo(customerId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT customer_id, first_name, last_name, date_of_birth, gender, 
               email, nationality, registration_date
        FROM customers 
        WHERE customer_id = ?
      `;
      
      this.db.get(query, [customerId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async loadUserProfile(customerId) {
    // Check if user profile exists in memory
    if (this.userProfiles.has(customerId)) {
      return this.userProfiles.get(customerId);
    }

    // Create or load user profile
    const profile = {
      id: customerId,
      createdAt: new Date(),
      totalInteractions: 0,
      preferredTopics: [],
      financialGoals: [],
      spendingPatterns: {},
      behaviorMetrics: {
        avgSessionLength: 0,
        preferredQueryTypes: {},
        responsePreferences: {}
      },
      personalInsights: [],
      customRecommendations: []
    };

    // Load historical behavior if exists
    const behaviorData = await this.getUserBehaviorHistory(customerId);
    if (behaviorData.length > 0) {
      profile.totalInteractions = behaviorData.length;
      profile.behaviorMetrics = this.analyzeBehaviorMetrics(behaviorData);
    }

    // Load financial data for profile
    const accounts = await this.getAccountBalance(customerId);
    const transactions = await this.getRecentTransactions(customerId, 100);
    
    profile.spendingPatterns = await this.analyzeUserSpendingPatterns(customerId);
    profile.financialHealth = await this.calculateUserFinancialHealth(customerId);
    
    // Store in memory
    this.userProfiles.set(customerId, profile);
    
    // Build personalized ML models
    await this.buildUserSpecificModels(customerId, transactions);
    
    return profile;
  }

  async buildUserSpecificModels(customerId, transactions) {
    if (transactions.length < 10) return; // Need minimum data

    // Build spending prediction model for this user
    const historicalData = await this.getUserHistoricalSpendingData(customerId);
    if (historicalData.length > 5) {
      const spendingModel = this.trainUserSpendingModel(historicalData);
      
      // Build risk model for this user
      const riskFactors = await this.getUserRiskFactors(customerId);
      const riskModel = this.trainUserRiskModel(riskFactors);
      
      this.userModels.set(customerId, {
        spendingModel,
        riskModel,
        lastUpdated: new Date(),
        accuracy: this.calculateModelAccuracy(historicalData, spendingModel)
      });
    }
  }

  trainUserSpendingModel(data) {
    try {
      const x = data.map((item, index) => [index]);
      const y = data.map(item => item.amount);
      return new regression.SimpleLinearRegression(x.flat(), y);
    } catch (error) {
      console.error('Error training user spending model:', error);
      return null;
    }
  }

  trainUserRiskModel(data) {
    if (data.length < 5) return null;
    
    const amounts = data.map(d => d.amount);
    const volatility = stats.standardDeviation(amounts);
    const trend = this.calculateTrend(amounts);
    
    return {
      volatility,
      trend,
      riskScore: this.calculateRiskScore(volatility, trend),
      personalFactors: this.analyzePersonalRiskFactors(data)
    };
  }

  analyzePersonalRiskFactors(data) {
    const factors = {
      transactionFrequency: data.length,
      averageAmount: stats.mean(data.map(d => d.amount)),
      failureRate: data.filter(d => d.status === 'فاشلة').length / data.length,
      preferredTransactionTypes: {}
    };

    // Analyze preferred transaction types
    data.forEach(tx => {
      if (!factors.preferredTransactionTypes[tx.transaction_type]) {
        factors.preferredTransactionTypes[tx.transaction_type] = 0;
      }
      factors.preferredTransactionTypes[tx.transaction_type]++;
    });

    return factors;
  }

  calculateModelAccuracy(historicalData, model) {
    if (!model || historicalData.length < 3) return 0;
    
    try {
      let totalError = 0;
      let predictions = 0;
      
      for (let i = 2; i < historicalData.length; i++) {
        const predicted = model.predict(i);
        const actual = historicalData[i].amount;
        totalError += Math.abs(predicted - actual) / actual;
        predictions++;
      }
      
      return Math.max(0, 100 - (totalError / predictions * 100));
    } catch (error) {
      return 0;
    }
  }

  // Behavior Tracking
  async updateUserBehavior(customerId, action, data) {
    const behavior = {
      customerId,
      action,
      timestamp: new Date(),
      data: JSON.stringify(data)
    };

    // Store in memory
    if (!this.userBehaviors.has(customerId)) {
      this.userBehaviors.set(customerId, []);
    }
    this.userBehaviors.get(customerId).push(behavior);

    // Keep last 100 behaviors per user
    const userBehaviors = this.userBehaviors.get(customerId);
    if (userBehaviors.length > 100) {
      this.userBehaviors.set(customerId, userBehaviors.slice(-100));
    }
  }

  async getUserBehaviorHistory(customerId) {
    return this.userBehaviors.get(customerId) || [];
  }

  analyzeBehaviorMetrics(behaviorData) {
    const metrics = {
      avgSessionLength: 0,
      preferredQueryTypes: {},
      responsePreferences: {},
      mostActiveTime: null,
      interactionPattern: 'regular'
    };

    // Analyze query types
    behaviorData.forEach(behavior => {
      if (behavior.action === 'query') {
        const data = JSON.parse(behavior.data);
        const queryType = data.intent || 'unknown';
        metrics.preferredQueryTypes[queryType] = (metrics.preferredQueryTypes[queryType] || 0) + 1;
      }
    });

    // Find most preferred query type
    const sortedQueries = Object.entries(metrics.preferredQueryTypes)
      .sort(([,a], [,b]) => b - a);
    
    if (sortedQueries.length > 0) {
      metrics.primaryInterest = sortedQueries[0][0];
    }

    return metrics;
  }

  // Financial Content Filtering
  isFinancialQuery(input) {
    const language = this.detectLanguage(input);
    const inputLower = input.toLowerCase();
    
    // Check for non-financial keywords (immediate rejection)
    const nonFinancialWords = this.nonFinancialKeywords[language] || [];
    const hasNonFinancial = nonFinancialWords.some(word => 
      inputLower.includes(word.toLowerCase())
    );
    
    if (hasNonFinancial) {
      return { isFinancial: false, reason: 'non_financial_keywords' };
    }
    
    // Check for financial keywords (immediate acceptance)
    const financialWords = this.financialKeywords[language] || [];
    const hasFinancial = financialWords.some(word => 
      inputLower.includes(word.toLowerCase())
    );
    
    if (hasFinancial) {
      return { isFinancial: true, reason: 'financial_keywords' };
    }
    
    // Use ML classifier confidence for borderline cases
    const classification = this.classifier.getClassifications(input);
    const maxConfidence = Math.max(...classification.map(c => c.value));
    
    // If confidence is too low, likely not financial
    if (maxConfidence < 0.3) {
      return { isFinancial: false, reason: 'low_confidence', confidence: maxConfidence };
    }
    
    return { isFinancial: true, reason: 'ml_classification', confidence: maxConfidence };
  }

  generateNonFinancialResponse(input, userId) {
    const language = this.currentLanguage;
    const userName = this.currentUser?.info?.first_name || '';
    
    // Creative responses based on what they asked about
    const inputLower = input.toLowerCase();
    let specificResponse = '';
    
    if (language === 'ar') {
      // Weather-related
      if (inputLower.includes('طقس') || inputLower.includes('شمس') || inputLower.includes('مطر')) {
        specificResponse = 'أعلم أن الطقس مهم، لكن تخصصي هو في الشؤون المالية! 🌤️💰 ';
      }
      // Food-related
      else if (inputLower.includes('طعام') || inputLower.includes('أكل') || inputLower.includes('طبخ')) {
        specificResponse = 'الطبخ فن جميل، لكن فني هو في إدارة الأموال! 🍽️💰 ';
      }
      // Sports-related
      else if (inputLower.includes('رياضة') || inputLower.includes('كرة') || inputLower.includes('تمرين')) {
        specificResponse = 'الرياضة مفيدة للصحة، لكن أنا مختص في صحة محفظتك المالية! ⚽💰 ';
      }
      // Health-related
      else if (inputLower.includes('صحة') || inputLower.includes('طبيب') || inputLower.includes('مرض')) {
        specificResponse = 'الصحة أهم من المال، لكن تخصصي في الصحة المالية فقط! 🏥💰 ';
      }
      // Technology-related
      else if (inputLower.includes('تقنية') || inputLower.includes('كمبيوتر') || inputLower.includes('برمجة')) {
        specificResponse = 'التقنية رائعة، لكن أنا متخصص في التقنيات المالية! 💻💰 ';
      }
      
      const responses = [
        `${userName}، ${specificResponse}أنا مساعدك المالي الذكي وأركز فقط على الأمور المالية والمصرفية. 🏦`,
        `${userName}، سؤال مثير للاهتمام! لكن تخصصي في مساعدتك في الشؤون المالية فقط. 💳 هل تريد معرفة رصيدك؟`,
        `${userName}، ${specificResponse}دعني أساعدك في إدارة أموالك بدلاً من ذلك! 💰 جرب سؤالي عن رصيدك أو تحليل إنفاقك.`,
        `عذراً ${userName}، ${specificResponse}أنا مساعد مالي متخصص. يمكنني مساعدتك في: رصيدك، معاملاتك، تحليل الإنفاق، والنصائح المالية! 📊`,
        `${userName}، ${specificResponse}أنا هنا لأكون مستشارك المالي الشخصي! جرب سؤالي: "ما رصيدي؟" أو "حلل إنفاقي" 🤖💰`
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
      
    } else {
      // English responses
      if (inputLower.includes('weather') || inputLower.includes('sun') || inputLower.includes('rain')) {
        specificResponse = 'I know weather is important, but I specialize in financial matters! ☀️💰 ';
      }
      else if (inputLower.includes('food') || inputLower.includes('cooking') || inputLower.includes('recipe')) {
        specificResponse = 'Cooking is a great skill, but my expertise is in managing your money! 🍽️💰 ';
      }
      else if (inputLower.includes('sports') || inputLower.includes('football') || inputLower.includes('exercise')) {
        specificResponse = 'Sports are great for health, but I specialize in your financial health! ⚽💰 ';
      }
      
      const responses = [
        `${userName}, ${specificResponse}I'm your intelligent financial assistant and I focus only on banking and financial matters. 🏦`,
        `${userName}, interesting question! But I specialize in helping you with financial matters only. 💳 Want to check your balance?`,
        `${userName}, ${specificResponse}Let me help you manage your money instead! 💰 Try asking about your balance or spending analysis.`,
        `Sorry ${userName}, ${specificResponse}I'm a specialized financial assistant. I can help with: balance, transactions, spending analysis, and financial advice! 📊`,
        `${userName}, ${specificResponse}I'm here to be your personal financial advisor! Try asking: "What's my balance?" or "Analyze my spending" 🤖💰`
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // Personalized Processing
  async processPersonalizedInput(input, customerId = null) {
    if (!customerId && !this.currentUser) {
      return {
        success: false,
        error: 'No user context available. Please set current user first.'
      };
    }

    const userId = customerId || this.currentUser.id;
    
    // Detect language
    this.detectLanguage(input);
    
    // Check if query is financial - SMART FILTERING
    const financialCheck = this.isFinancialQuery(input);
    
    // Track user interaction (including non-financial attempts)
    await this.updateUserBehavior(userId, 'query', {
      input,
      language: this.currentLanguage,
      isFinancial: financialCheck.isFinancial,
      filterReason: financialCheck.reason,
      timestamp: new Date()
    });

    // If not financial, return polite redirect response
    if (!financialCheck.isFinancial) {
      const redirectResponse = this.generateNonFinancialResponse(input, userId);
      
      // Track the redirect
      await this.updateUserBehavior(userId, 'non_financial_redirect', {
        originalQuery: input,
        reason: financialCheck.reason,
        confidence: financialCheck.confidence
      });

      return {
        success: true,
        response: redirectResponse,
        intent: 'non_financial_redirect',
        confidence: 100,
        userId,
        personalized: true,
        filtered: true,
        filterReason: financialCheck.reason
      };
    }

    try {
      // Get intent with user context
      const intent = this.classifyWithUserContext(input, userId);
      const confidence = Math.max(...this.classifier.getClassifications(input).map(c => c.value)) * 100;
      
      // Generate personalized response
      const response = await this.generatePersonalizedResponse(intent, input, confidence, userId);
      
      // Track response
      await this.updateUserBehavior(userId, 'response', {
        intent,
        confidence,
        responseLength: response.length
      });

      // Update user interaction count
      if (this.currentUser && this.currentUser.id === userId) {
        this.currentUser.interactionCount++;
      }

      return {
        success: true,
        response,
        intent,
        confidence,
        userId,
        personalized: true
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  classifyWithUserContext(input, userId) {
    const baseIntent = this.classifier.classify(input);
    
    // Get user profile for context
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) return baseIntent;

    // Adjust intent based on user behavior
    const behaviorMetrics = userProfile.behaviorMetrics;
    if (behaviorMetrics.primaryInterest && confidence < 70) {
      // If confidence is low, consider user's primary interest
      const preferredTypes = Object.keys(behaviorMetrics.preferredQueryTypes);
      if (preferredTypes.includes(baseIntent)) {
        return baseIntent;
      }
    }

    return baseIntent;
  }

  async generatePersonalizedResponse(intent, input, confidence, userId) {
    const userProfile = this.userProfiles.get(userId);
    const userModel = this.userModels.get(userId);
    
    let response = '';

    // Add personalized greeting
    if (this.currentUser && userProfile) {
      const userName = this.currentUser.info.first_name;
      response += `👋 ${userName}، `;
    }

    switch (intent) {
      case 'balance_inquiry':
        response += await this.generatePersonalizedBalanceInsight(userId, confidence);
        break;
      case 'transaction_analysis':
        response += await this.generatePersonalizedTransactionAnalysis(userId, confidence);
        break;
      case 'spending_analysis':
        response += await this.generatePersonalizedSpendingAnalysis(userId, confidence);
        break;
      case 'predictive_analysis':
        response += await this.generatePersonalizedPredictions(userId, confidence, userModel);
        break;
      case 'financial_health':
        response += await this.generatePersonalizedHealthAssessment(userId, confidence);
        break;
      case 'recommendations':
        response += await this.generatePersonalizedRecommendations(userId, confidence, userProfile);
        break;
      default:
        response += await this.generatePersonalizedGeneralResponse(input, confidence, userId);
    }

    // Add behavior-based insights
    if (userProfile && userProfile.totalInteractions > 10) {
      response += await this.addBehaviorBasedInsights(userId, userProfile);
    }

    return response;
  }

  async generatePersonalizedBalanceInsight(userId, confidence) {
    const accounts = await this.getAccountBalance(userId);
    const userProfile = this.userProfiles.get(userId);
    
    let response = `${this.templates[this.currentLanguage].balanceTitle} (${confidence.toFixed(0)}%)\n\n`;
    
    if (!accounts || accounts.length === 0) {
      return response + 'لم أتمكن من العثور على بيانات حساباتك.';
    }

    // Show accounts with personal context
    let totalBalance = 0;
    const accountsByType = {};

    accounts.forEach(account => {
      const accountType = this.formatAccountType(account.account_type);
      if (!accountsByType[accountType]) {
        accountsByType[accountType] = [];
      }
      accountsByType[accountType].push(account);
      
      const usdAmount = this.convertToUSD(account.balance, account.currency);
      totalBalance += usdAmount;
    });

    // Display with personal insights
    Object.entries(accountsByType).forEach(([type, accs]) => {
      response += `📊 ${type}:\n`;
      accs.forEach(acc => {
        response += `   • ${acc.balance.toLocaleString()} ${acc.currency}`;
        
        // Add personal insight based on user history
        if (userProfile && userProfile.spendingPatterns[acc.account_id]) {
          const pattern = userProfile.spendingPatterns[acc.account_id];
          response += ` (متوسط الإنفاق الشهري: ${pattern.avgMonthlySpending?.toLocaleString() || 'غير محدد'})`;
        }
        response += '\n';
      });
      response += '\n';
    });

    response += `🏦 إجمالي حافظتك المالية: $${totalBalance.toLocaleString()}\n`;
    
    // Add personalized insights based on user's financial health
    if (userProfile && userProfile.financialHealth) {
      response += `📈 نقاط صحتك المالية الشخصية: ${userProfile.financialHealth.score}/100\n\n`;
      
      // Personalized advice based on user's specific situation
      response += '💡 نصائح شخصية مخصصة لك:\n';
      if (totalBalance > userProfile.financialHealth.targetEmergencyFund || 50000) {
        response += '• وضعك المالي ممتاز! فكر في تنويع استثماراتك\n';
      } else {
        response += '• ركز على بناء صندوق الطوارئ الخاص بك\n';
      }
    }

    return response;
  }

  async generatePersonalizedSpendingAnalysis(userId, confidence) {
    const patterns = await this.analyzeUserSpendingPatterns(userId);
    const userProfile = this.userProfiles.get(userId);
    
    let response = `${this.templates[this.currentLanguage].spendingTitle} (${confidence.toFixed(0)}%)\n\n`;
    
    if (!patterns || patterns.length === 0) {
      return response + 'لا توجد بيانات كافية لتحليل أنماط إنفاقك الشخصية.';
    }

    // Add personal spending insights
    response += '🎯 تحليل إنفاقك الشخصي:\n';
    
    const categoryTotals = {};
    patterns.forEach(item => {
      const category = this.formatTransactionType(item.transaction_type);
      categoryTotals[category] = (categoryTotals[category] || 0) + item.total_amount;
    });

    // Compare with user's historical patterns
    if (userProfile && userProfile.spendingPatterns.historical) {
      response += '\n📊 مقارنة مع سلوكك السابق:\n';
      Object.entries(categoryTotals).forEach(([category, amount]) => {
        const historical = userProfile.spendingPatterns.historical[category];
        if (historical) {
          const change = ((amount - historical) / historical * 100).toFixed(1);
          const trend = amount > historical ? '📈' : '📉';
          response += `• ${category}: ${trend} ${Math.abs(change)}% ${amount > historical ? 'زيادة' : 'نقصان'}\n`;
        }
      });
    }

    // Personal recommendations based on spending behavior
    response += '\n💡 توصيات شخصية لتحسين إنفاقك:\n';
    const topSpending = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (topSpending) {
      const [category, amount] = topSpending;
      response += `• أعلى إنفاق لديك في فئة ${category} ($${amount.toLocaleString()})\n`;
      response += `• نقترح وضع حد شهري لهذه الفئة: $${(amount * 0.9).toLocaleString()}\n`;
    }

    return response;
  }

  async generatePersonalizedPredictions(userId, confidence, userModel) {
    let response = `🔮 توقعات الإنفاق الشخصية (${confidence.toFixed(0)}%)\n\n`;
    
    if (!userModel || !userModel.spendingModel) {
      return response + 'نحتاج المزيد من البيانات التاريخية لإنشاء توقعات شخصية دقيقة لك.';
    }

    const predictions = await this.predictUserSpending(userId, userModel.spendingModel);
    if (!predictions) {
      return response + 'لا يمكن إنشاء توقعات في الوقت الحالي.';
    }

    response += 'توقعات إنفاقك للأشهر القادمة:\n';
    predictions.forEach(pred => {
      response += `• ${moment(pred.month).format('MMMM YYYY')}: $${pred.predictedSpending.toLocaleString()}`;
      response += ` (دقة النموذج: ${userModel.accuracy?.toFixed(0) || 'غير محدد'}%)\n`;
    });

    // Add personal insights based on predictions
    const totalPredicted = predictions.reduce((sum, p) => sum + p.predictedSpending, 0);
    response += `\n📊 إجمالي الإنفاق المتوقع (3 أشهر): $${totalPredicted.toLocaleString()}\n`;
    
    // Personal budgeting advice
    const userProfile = this.userProfiles.get(userId);
    if (userProfile && userProfile.spendingPatterns.avgMonthly) {
      const avgMonthly = userProfile.spendingPatterns.avgMonthly;
      const predictedMonthly = totalPredicted / 3;
      
      if (predictedMonthly > avgMonthly * 1.1) {
        response += '\n⚠️ تحذير شخصي: الإنفاق المتوقع أعلى من متوسطك الشهري\n';
        response += '💡 نصيحة: راجع ميزانيتك وفكر في تقليل المصروفات غير الضرورية\n';
      } else {
        response += '\n✅ إنفاقك المتوقع ضمن النطاق الطبيعي لسلوكك المالي\n';
      }
    }

    return response;
  }

  async generatePersonalizedRecommendations(userId, confidence, userProfile) {
    let response = `💡 التوصيات المالية الشخصية المخصصة لك (${confidence.toFixed(0)}%)\n\n`;
    
    if (!userProfile) {
      return response + 'نحتاج المزيد من الوقت لتحليل سلوكك المالي وتقديم توصيات شخصية.';
    }

    const accounts = await this.getAccountBalance(userId);
    const totalBalance = accounts.reduce((sum, acc) => sum + this.convertToUSD(acc.balance, acc.currency), 0);
    
    response += '🎯 بناءً على تحليل سلوكك المالي الشخصي:\n\n';
    
    // Personalized recommendations based on user's behavior
    if (userProfile.behaviorMetrics.primaryInterest === 'balance_inquiry') {
      response += '💰 **إدارة الأموال** (لاحظنا اهتمامك بمراقبة الأرصدة):\n';
      response += '• قم بإعداد تنبيهات يومية لأرصدة حساباتك\n';
      response += '• فكر في تطبيقات تتبع المصروفات التلقائية\n';
    }
    
    if (userProfile.behaviorMetrics.primaryInterest === 'spending_analysis') {
      response += '📊 **تحليل الإنفاق** (نلاحظ اهتمامك بأنماط الإنفاق):\n';
      response += '• ضع ميزانية شهرية مفصلة لكل فئة إنفاق\n';
      response += '• استخدم قاعدة 50/30/20 للميزانية\n';
    }

    // Financial health based recommendations
    if (userProfile.financialHealth) {
      const healthScore = userProfile.financialHealth.score;
      response += `\n🏥 **تحسين صحتك المالية** (نقاطك الحالية: ${healthScore}/100):\n`;
      if (healthScore < 70) {
        response += '• أولوية: بناء صندوق طوارئ يكفي 6 أشهر\n';
        response += '• قلل من المعاملات الفاشلة بمراقبة الأرصدة\n';
      } else {
        response += '• وضعك المالي جيد! فكر في الاستثمار طويل المدى\n';
        response += '• نوع محفظتك الاستثمارية\n';
      }
    }

    // Behavior-based suggestions
    if (userProfile.totalInteractions > 20) {
      response += '\n🤖 **اقتراحات ذكية** (بناءً على استخدامك المتكرر):\n';
      response += '• يمكنك تفعيل التقارير الأسبوعية التلقائية\n';
      response += '• فكر في الحصول على استشارة مالية متقدمة\n';
    }

    return response;
  }

  async addBehaviorBasedInsights(userId, userProfile) {
    let insights = '\n\n🧠 رؤى سلوكية شخصية:\n';
    
    const behaviorMetrics = userProfile.behaviorMetrics;
    
    // Interaction pattern analysis
    if (userProfile.totalInteractions > 50) {
      insights += '• أنت من المستخدمين النشطين - نقدر اهتمامك بأموالك!\n';
    }
    
    // Primary interest insights
    if (behaviorMetrics.primaryInterest) {
      const interest = behaviorMetrics.primaryInterest;
      insights += `• اهتمامك الأساسي: ${this.getIntentDescription(interest)}\n`;
    }
    
    // Usage patterns
    const daysSinceFirstUse = Math.floor((new Date() - new Date(userProfile.createdAt)) / (1000 * 60 * 60 * 24));
    if (daysSinceFirstUse > 30) {
      insights += `• أنت معنا منذ ${daysSinceFirstUse} يوم - عميل مخلص!\n`;
    }

    return insights;
  }

  getIntentDescription(intent) {
    const descriptions = {
      'balance_inquiry': 'مراقبة الأرصدة والحسابات',
      'spending_analysis': 'تحليل أنماط الإنفاق',
      'transaction_analysis': 'مراجعة المعاملات',
      'financial_health': 'تقييم الصحة المالية',
      'predictive_analysis': 'التوقعات المالية'
    };
    return descriptions[intent] || intent;
  }

  // Utility Methods
  detectLanguage(input) {
    const arabicPattern = /[\u0600-\u06FF]/;
    this.currentLanguage = arabicPattern.test(input) ? 'ar' : 'en';
    return this.currentLanguage;
  }

  formatAccountType(type) {
    const accountType = this.accountTypes[type];
    return this.currentLanguage === 'ar' ? accountType?.ar || type : accountType?.en || type;
  }

  formatTransactionType(type) {
    const transactionType = this.categories[type];
    return this.currentLanguage === 'ar' ? transactionType?.ar || type : transactionType?.en || type;
  }

  convertToUSD(amount, currency) {
    const rates = { 'USD': 1, 'SAR': 0.27, 'EUR': 1.1 };
    return amount * (rates[currency] || 1);
  }

  calculateTrend(values) {
    if (values.length < 2) return 0;
    const slope = stats.linearRegression(values.map((v, i) => [i, v])).m;
    return slope;
  }

  calculateRiskScore(volatility, trend) {
    let riskScore = 50;
    riskScore += Math.min(volatility / 100, 30);
    riskScore += Math.max(-trend * 10, -20);
    return Math.min(Math.max(riskScore, 0), 100);
  }

  // Database Methods (Reuse from previous implementation)
  async getAccountBalance(customerId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT account_type, balance, currency, account_id, opening_date, status
        FROM accounts 
        WHERE customer_id = ? AND status = 'نشط'
        ORDER BY balance DESC
      `;
      
      this.db.all(query, [customerId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getRecentTransactions(customerId, limit = 20) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT t.*, a.account_type, a.currency
        FROM transactions t
        JOIN accounts a ON t.account_id = a.account_id
        WHERE a.customer_id = ?
        ORDER BY t.transaction_date DESC
        LIMIT ?
      `;
      
      this.db.all(query, [customerId, limit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async analyzeUserSpendingPatterns(customerId) {
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
        WHERE a.customer_id = ? AND t.status = 'ناجحة'
        GROUP BY transaction_type, month
        ORDER BY month DESC, total_amount DESC
      `;
      
      this.db.all(query, [customerId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async calculateUserFinancialHealth(customerId) {
    try {
      const accounts = await this.getAccountBalance(customerId);
      const transactions = await this.getRecentTransactions(customerId);
      
      let healthScore = 70;
      const factors = {};
      
      const totalBalance = accounts.reduce((sum, acc) => sum + this.convertToUSD(acc.balance, acc.currency), 0);
      
      if (totalBalance > 100000) {
        healthScore += 15;
        factors.balance = 'ممتاز';
      } else if (totalBalance > 50000) {
        healthScore += 10;
        factors.balance = 'جيد';
      } else if (totalBalance > 10000) {
        healthScore += 5;
        factors.balance = 'مقبول';
      } else {
        healthScore -= 10;
        factors.balance = 'يحتاج تحسين';
      }
      
      const successfulTx = transactions.filter(t => t.status === 'ناجحة');
      const failedTx = transactions.filter(t => t.status === 'فاشلة');
      
      if (failedTx.length / transactions.length > 0.2) {
        healthScore -= 15;
        factors.reliability = 'ضعيف';
      } else if (failedTx.length / transactions.length > 0.1) {
        healthScore -= 5;
        factors.reliability = 'مقبول';
      } else {
        healthScore += 10;
        factors.reliability = 'ممتاز';
      }
      
      return {
        score: Math.max(0, Math.min(100, healthScore)),
        factors,
        targetEmergencyFund: totalBalance * 0.2,
        lastUpdated: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Error calculating user financial health:', error);
      return { score: 0, factors: {}, error: error.message };
    }
  }

  async getUserHistoricalSpendingData(customerId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          strftime('%Y-%m', transaction_date) as month,
          SUM(amount) as amount,
          COUNT(*) as count
        FROM transactions t
        JOIN accounts a ON t.account_id = a.account_id
        WHERE a.customer_id = ? AND t.status = 'ناجحة'
          AND t.transaction_type IN ('سحب', 'دفع فواتير')
        GROUP BY month
        ORDER BY month ASC
      `;
      
      this.db.all(query, [customerId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getUserRiskFactors(customerId) {
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
      
      this.db.all(query, [customerId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async predictUserSpending(customerId, model, months = 3) {
    if (!model) return null;
    
    const historicalData = await this.getUserHistoricalSpendingData(customerId);
    const predictions = [];
    
    for (let i = 1; i <= months; i++) {
      const futureIndex = historicalData.length + i;
      const prediction = model.predict(futureIndex);
      predictions.push({
        month: moment().add(i, 'months').format('YYYY-MM'),
        predictedSpending: Math.max(0, prediction),
        confidence: Math.max(0.5, 1 - (i * 0.1))
      });
    }
    
    return predictions;
  }

  // Training method (simplified)
  trainAdvancedClassifier() {
    // Financial intents - what we support
    const financialIntents = {
      balance_inquiry: [
        "what's my balance", "show balance", "account summary", "portfolio overview",
        "ما رصيدي", "اظهر الرصيد", "كم أملك", "ما هو رصيد حسابي"
      ],
      transaction_analysis: [
        "show transactions", "spending history", "recent activity",
        "اظهر المعاملات", "تاريخ الإنفاق", "النشاط الأخير"
      ],
      spending_analysis: [
        "analyze spending", "spending patterns", "expense analysis",
        "حلل إنفاقي", "أنماط الإنفاق", "تحليل المصروفات"
      ],
      predictive_analysis: [
        "predict spending", "forecast expenses", "future spending",
        "توقع الإنفاق", "تنبؤ المصروفات", "الإنفاق المستقبلي"
      ],
      financial_health: [
        "financial health", "credit score", "financial rating",
        "الصحة المالية", "التقييم المالي", "حالتي المالية"
      ],
      recommendations: [
        "financial advice", "money tips", "saving advice",
        "نصائح مالية", "إرشادات المال", "نصائح الادخار"
      ]
    };

    // Train financial classifier
    Object.entries(financialIntents).forEach(([intent, phrases]) => {
      phrases.forEach(phrase => {
        this.classifier.addDocument(phrase, intent);
        this.tfidf.addDocument(phrase);
      });
    });

    this.classifier.train();

    // Non-financial keywords for filtering
    this.nonFinancialKeywords = {
      ar: [
        'طقس', 'جو', 'مطر', 'شمس', 'قمر', 'نجوم', 'سماء', 'غيوم',
        'طبخ', 'أكل', 'طعام', 'وصفة', 'مطبخ', 'فطور', 'غداء', 'عشاء',
        'رياضة', 'كرة', 'تمرين', 'لعب', 'سباحة', 'جري', 'كرة قدم',
        'سيارة', 'سفر', 'طيران', 'قطار', 'باص', 'رحلة', 'سياحة',
        'صحة', 'مرض', 'دواء', 'طبيب', 'مستشفى', 'علاج', 'ألم',
        'تعليم', 'مدرسة', 'جامعة', 'درس', 'امتحان', 'كتاب', 'دراسة',
        'تقنية', 'كمبيوتر', 'برمجة', 'إنترنت', 'تطبيق', 'موقع',
        'فن', 'موسيقى', 'رسم', 'شعر', 'كتابة', 'أدب', 'ثقافة',
        'حيوان', 'قط', 'كلب', 'طير', 'سمك', 'حديقة', 'زهور'
      ],
      en: [
        'weather', 'rain', 'sun', 'moon', 'stars', 'sky', 'clouds', 'hot', 'cold',
        'cooking', 'food', 'recipe', 'kitchen', 'breakfast', 'lunch', 'dinner',
        'sports', 'football', 'basketball', 'exercise', 'gym', 'running', 'swimming',
        'car', 'travel', 'flight', 'train', 'bus', 'trip', 'vacation', 'tourism',
        'health', 'medicine', 'doctor', 'hospital', 'treatment', 'disease', 'pain',
        'education', 'school', 'university', 'lesson', 'exam', 'book', 'study',
        'technology', 'computer', 'programming', 'internet', 'app', 'website',
        'art', 'music', 'painting', 'poetry', 'writing', 'literature', 'culture',
        'animal', 'cat', 'dog', 'bird', 'fish', 'garden', 'flowers', 'nature'
      ]
    };

    // Financial keywords for validation
    this.financialKeywords = {
      ar: [
        'مال', 'فلوس', 'رصيد', 'حساب', 'بنك', 'مصرف', 'إيداع', 'سحب',
        'تحويل', 'دفع', 'مصروف', 'إنفاق', 'ميزانية', 'ادخار', 'استثمار',
        'قرض', 'دين', 'فوائد', 'ربح', 'خسارة', 'تكلفة', 'سعر', 'ثمن',
        'راتب', 'دخل', 'مكافأة', 'عمولة', 'ضريبة', 'تأمين', 'معاش',
        'أسهم', 'سندات', 'عملة', 'صرف', 'تبادل', 'محفظة', 'حافظة'
      ],
      en: [
        'money', 'cash', 'balance', 'account', 'bank', 'deposit', 'withdrawal',
        'transfer', 'payment', 'expense', 'spending', 'budget', 'savings', 'investment',
        'loan', 'debt', 'interest', 'profit', 'loss', 'cost', 'price', 'amount',
        'salary', 'income', 'bonus', 'commission', 'tax', 'insurance', 'pension',
        'stocks', 'bonds', 'currency', 'exchange', 'portfolio', 'finance', 'financial'
      ]
    };
  }

  // API Methods for App Integration
  async getAllUsers() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT customer_id, first_name, last_name, email, registration_date
        FROM customers 
        ORDER BY registration_date DESC
      `;
      
      this.db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getUserStats(customerId) {
    const accounts = await this.getAccountBalance(customerId);
    const transactions = await this.getRecentTransactions(customerId, 100);
    const profile = this.userProfiles.get(customerId);
    
    return {
      totalBalance: accounts.reduce((sum, acc) => sum + this.convertToUSD(acc.balance, acc.currency), 0),
      accountCount: accounts.length,
      transactionCount: transactions.length,
      interactionCount: profile?.totalInteractions || 0,
      financialHealthScore: profile?.financialHealth?.score || 0,
      primaryInterest: profile?.behaviorMetrics?.primaryInterest || 'unknown',
      lastActivity: profile?.lastActivity || null
    };
  }

  // Cleanup
  disconnect() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = PersonalizedFinBot;