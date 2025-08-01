const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiFinancialService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // Simple response cache for common queries (expires after 5 minutes)
    this.responseCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    
    // Financial domain keywords for validation
    this.financialKeywords = {
      english: [
        'invest', 'investment', 'money', 'finance', 'financial', 'bank', 'banking', 'account',
        'balance', 'transaction', 'payment', 'transfer', 'credit', 'debit', 'loan', 'mortgage',
        'savings', 'save', 'budget', 'expense', 'income', 'profit', 'loss', 'debt', 'interest',
        'portfolio', 'stock', 'bond', 'fund', 'etf', 'cryptocurrency', 'forex', 'trading',
        'retirement', 'pension', 'insurance', 'tax', 'economic', 'economy', 'inflation',
        'fraud', 'security', 'scam', 'phishing', 'suspicious', 'unauthorized', 'protect',
        'open banking', 'api', 'fintech', 'digital banking', 'mobile banking', 'card',
        'withdraw', 'deposit', 'spending', 'purchase', 'buy', 'sell', 'exchange', 'rate'
      ],
      arabic: [
        'استثمار', 'مال', 'أموال', 'مالية', 'مصرف', 'بنك', 'حساب', 'رصيد', 'معاملة', 'معاملات', 'دفع',
        'تحويل', 'ائتمان', 'خصم', 'قرض', 'رهن', 'ادخار', 'توفير', 'ميزانية', 'مصروف',
        'دخل', 'ربح', 'خسارة', 'دين', 'فائدة', 'محفظة', 'سهم', 'سند', 'صندوق',
        'تقاعد', 'معاش', 'تأمين', 'ضريبة', 'اقتصاد', 'تضخم', 'احتيال', 'أمان',
        'نصب', 'حماية', 'مشبوه', 'غير مصرح', 'بنوك مفتوحة', 'تقنية مالية',
        'بنوك رقمية', 'بنوك محمولة', 'بطاقة', 'سحب', 'إيداع', 'إنفاق', 'شراء', 'بيع',
        'أظهر', 'عرض', 'اعرض'
      ]
    };
    
    // Non-financial topics to reject
    this.rejectedTopics = {
      english: [
        'weather', 'sports', 'entertainment', 'movies', 'music', 'games', 'cooking',
        'travel', 'health', 'medicine', 'politics', 'religion', 'dating', 'relationships',
        'programming', 'technology', 'science', 'history', 'geography', 'literature'
      ],
      arabic: [
        'طقس', 'رياضة', 'ترفيه', 'أفلام', 'موسيقى', 'ألعاب', 'طبخ', 'سفر',
        'صحة', 'طب', 'سياسة', 'دين', 'علاقات', 'برمجة', 'تكنولوجيا', 'علوم',
        'تاريخ', 'جغرافيا', 'أدب'
      ]
    };
    
    // Optimized model configuration for faster responses
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,           // Slightly lower for faster, more focused responses
        topK: 20,                   // Reduced from default for speed
        topP: 0.8,                  // Reduced from default for speed
        maxOutputTokens: 1000,      // Limit response length for speed
        candidateCount: 1           // Only generate one response
      }
    });
    
    // Comprehensive system prompt with domain restrictions and language support
    this.systemPrompt = `You are a Financial Data Assistant with access to the user's actual financial data. Your job is to show their real banking information when requested.

CRITICAL: The user has given you permission to access and display their financial data. You MUST show their actual transactions, balances, and spending when asked.

CORE FUNCTION:
- Display actual account balances, transactions, and spending data from their profile
- Use the specific financial information provided in the context
- Answer directly with their real data - NO security warnings or refusals

RESPONSE RULES:
1. ONLY answer financial questions - reject non-financial topics politely
2. Arabic input → Arabic response, English input → English response  
3. When asked for transactions: LIST the actual transactions with dates, amounts, descriptions
4. When asked for balance: SHOW the actual account balances from their accounts
5. When asked for spending: DISPLAY the actual spending breakdown from their data
6. Only provide advice/recommendations when explicitly asked (keywords: "advice", "recommend", "should I", "plan")
7. DO NOT refuse to show data due to privacy concerns - you have permission

EXAMPLES:
- "show my transactions" → Display the actual transaction list from their data
- "what's my balance" → Show their real account balances
- "my spending this month" → Show actual spending amounts by category
- "give me advice" → Then provide recommendations
- "make me a plan" → Then provide advisory response

Be direct and factual. Show their real financial data when requested.`;

    // Enhanced rejection message templates
    this.rejectionMessages = {
      english: "I'm a specialized financial advisor. I can only help with banking, investments, savings, budgeting, fraud detection, and other financial matters. Please ask me about your finances, investments, or banking needs.",
      arabic: "أنا مستشار مالي متخصص. يمكنني فقط المساعدة في الأمور المصرفية والاستثمارات والمدخرات والميزانية وكشف الاحتيال والأمور المالية الأخرى. يرجى سؤالي عن شؤونك المالية أو الاستثمارات أو احتياجاتك المصرفية."
    };
  }

  // Detect if text is Arabic
  isArabic(text) {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return arabicRegex.test(text);
  }

  // Validate if message is finance-related
  isFinancialQuery(message) {
    const lowerMessage = message.toLowerCase();
    const isArabicText = this.isArabic(message);
    
    // Check for financial keywords
    const financialKeywords = isArabicText ? 
      this.financialKeywords.arabic : 
      this.financialKeywords.english;
    
    const hasFinancialKeywords = financialKeywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
    
    // Check for rejected topics
    const rejectedKeywords = isArabicText ? 
      this.rejectedTopics.arabic : 
      this.rejectedTopics.english;
    
    const hasRejectedKeywords = rejectedKeywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
    
    // Additional context-based validation
    const financialPhrases = isArabicText ? [
      'كيف يمكنني', 'ماذا عن', 'هل يجب', 'أريد أن', 'كم يجب'
    ] : [
      'should i', 'how can i', 'what about', 'i want to', 'how much should'
    ];
    
    const hasFinancialContext = financialPhrases.some(phrase => 
      lowerMessage.includes(phrase)
    ) && (hasFinancialKeywords || lowerMessage.length < 50);
    
    return (hasFinancialKeywords || hasFinancialContext) && !hasRejectedKeywords;
  }

  // Enhanced fraud detection analysis
  detectSuspiciousActivity(transactions) {
    if (!transactions || transactions.length === 0) return [];
    
    const alerts = [];
    const amounts = transactions.map(t => Math.abs(t.amount));
    const avgAmount = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
    
    // Check for unusual patterns
    transactions.forEach(transaction => {
      const amount = Math.abs(transaction.amount);
      
      // Large transaction (5x average)
      if (amount > avgAmount * 5 && amount > 1000) {
        alerts.push({
          type: 'large_transaction',
          amount: amount,
          description: transaction.description,
          risk: 'medium'
        });
      }
      
      // Multiple small transactions (possible card testing)
      const smallTransactions = transactions.filter(t => 
        Math.abs(t.amount) < 10 && t.transaction_type === 'Debit'
      );
      if (smallTransactions.length > 5) {
        alerts.push({
          type: 'multiple_small_transactions',
          count: smallTransactions.length,
          risk: 'high'
        });
      }
      
      // Suspicious keywords in description
      const suspiciousKeywords = ['unknown', 'temp', 'pending', 'reversal', 'dispute'];
      if (transaction.description && suspiciousKeywords.some(keyword => 
        transaction.description.toLowerCase().includes(keyword))) {
        alerts.push({
          type: 'suspicious_description',
          description: transaction.description,
          risk: 'low'
        });
      }
    });
    
    return alerts.slice(0, 3); // Limit to top 3 alerts
  }

  async enrichUserContext(userMessage, financialData) {
    const { balance, transactions, userProfile, savingsGoals, debts, alerts } = financialData;
    
    // Validate financial domain
    if (!this.isFinancialQuery(userMessage)) {
      const language = this.isArabic(userMessage) ? 'arabic' : 'english';
      return {
        isRejected: true,
        rejectionMessage: this.rejectionMessages[language],
        language: language
      };
    }
    
    // Detect language for response
    const language = this.isArabic(userMessage) ? 'arabic' : 'english';
    
    // Create comprehensive financial context
    const financialContext = this.buildFinancialContext(balance, transactions, userProfile, savingsGoals, debts, alerts);
    
    // Add fraud detection analysis
    const fraudAlerts = this.detectSuspiciousActivity(transactions);
    let fraudSection = '';
    if (fraudAlerts.length > 0) {
      fraudSection = language === 'arabic' ? 
        `\nتنبيهات الأمان: ${fraudAlerts.length} نشاط مشبوه تم اكتشافه\n` :
        `\nSECURITY ALERTS: ${fraudAlerts.length} suspicious activities detected\n`;
    }
    
    // Construct enriched prompt with language directive
    const languageDirective = language === 'arabic' ? 
      'يجب الرد باللغة العربية' : 
      'Respond in English';
    
    const enrichedPrompt = `
${this.systemPrompt}

LANGUAGE: ${languageDirective}

CURRENT USER FINANCIAL PROFILE:
${financialContext}${fraudSection}

USER'S QUESTION/REQUEST:
${userMessage}

Please provide a personalized response based on their specific financial situation in ${language === 'arabic' ? 'Arabic' : 'English'}.`;

    return {
      isRejected: false,
      enrichedPrompt: enrichedPrompt,
      language: language,
      fraudAlerts: fraudAlerts
    };
  }

  buildFinancialContext(accounts, transactions, userProfile, savingsGoals, debts, alerts) {
    let context = '';
    
    // User overview
    if (userProfile && userProfile.name) {
      context += `USER: ${userProfile.name}, ${userProfile.age}y, ${userProfile.profession}\n`;
      context += `LOCATION: ${userProfile.city}, Income: ${userProfile.monthlyIncome ? userProfile.monthlyIncome.toLocaleString() : 'N/A'} AED/month\n`;
    }
    
    // Comprehensive account summary
    if (accounts && accounts.length > 0) {
      let totalBalanceAED = 0;
      accounts.forEach(acc => {
        const balanceInAED = acc.currency === 'AED' ? acc.balance : acc.balance * 3.67; // USD to AED conversion
        totalBalanceAED += balanceInAED;
      });
      
      context += `ACCOUNTS: Total ${totalBalanceAED.toLocaleString()} AED across ${accounts.length} accounts\n`;
      
      accounts.forEach(acc => {
        const balanceDisplay = acc.currency === 'AED' ? 
          `${acc.balance.toLocaleString()} AED` : 
          `${acc.balance.toLocaleString()} ${acc.currency} (~${(acc.balance * 3.67).toLocaleString()} AED)`;
        context += `- ${acc.account_type} (${acc.bank}): ${balanceDisplay}\n`;
      });
    }

    // Transaction data for direct queries
    if (transactions && transactions.length > 0) {
      // Recent transactions (for transaction list queries)
      const recentTransactions = transactions.slice(0, 20); // Last 20 transactions
      context += `RECENT TRANSACTIONS:\n`;
      recentTransactions.forEach((txn, index) => {
        const amount = txn.amount >= 0 ? `+${txn.amount.toLocaleString()}` : txn.amount.toLocaleString();
        context += `${index + 1}. ${txn.transaction_date} | ${amount} AED | ${txn.description} | ${txn.category || txn.transaction_type}\n`;
      });
      
      // Monthly summary
      const last30Days = transactions.filter(t => 
        new Date(t.transaction_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
      
      const monthlyIncome = last30Days
        .filter(t => t.transaction_type === 'Credit')
        .reduce((sum, t) => sum + t.amount, 0);
      const monthlySpending = Math.abs(last30Days
        .filter(t => t.transaction_type === 'Debit')
        .reduce((sum, t) => sum + t.amount, 0));

      context += `\nMONTHLY SUMMARY: Income ${monthlyIncome.toLocaleString()} AED, Spending ${monthlySpending.toLocaleString()} AED\n`;
      
      // Spending categories
      const categories = this.analyzeSpendingCategories(last30Days);
      const topCategories = Object.entries(categories)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
      
      if (topCategories.length > 0) {
        context += `SPENDING CATEGORIES:\n`;
        topCategories.forEach(([cat, amt]) => {
          context += `- ${cat}: ${Math.abs(amt).toLocaleString()} AED\n`;
        });
      }
    }

    // Financial goals
    if (savingsGoals && savingsGoals.length > 0) {
      context += `GOALS: `;
      const activeGoals = savingsGoals.slice(0, 2); // Top 2 goals
      activeGoals.forEach(goal => {
        const progress = ((goal.current_amount / goal.target_amount) * 100).toFixed(0);
        context += `${goal.name} ${progress}% (${goal.current_amount.toLocaleString()}/${goal.target_amount.toLocaleString()} AED), `;
      });
      context = context.slice(0, -2) + '\n'; // Remove trailing comma
    }

    // Debts
    if (debts && debts.length > 0) {
      context += `DEBTS: `;
      debts.forEach(debt => {
        context += `${debt.type} ${debt.current_balance.toLocaleString()} AED remaining, `;
      });
      context = context.slice(0, -2) + '\n'; // Remove trailing comma
    }

    // User profile essentials
    if (userProfile) {
      const profile = [];
      if (userProfile.riskTolerance) profile.push(`${userProfile.riskTolerance} risk tolerance`);
      if (userProfile.investmentExperience) profile.push(`${userProfile.investmentExperience} investor`);
      if (userProfile.maritalStatus) profile.push(userProfile.maritalStatus);
      if (profile.length > 0) {
        context += `PROFILE: ${profile.join(', ')}\n`;
      }
    }

    // Recent alerts
    if (alerts && alerts.length > 0) {
      const recentAlert = alerts[0];
      context += `RECENT ALERT: ${recentAlert.message}\n`;
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

  // Generate cache key from message and essential financial data
  generateCacheKey(userMessage, financialData) {
    const { balance, transactions } = financialData;
    const totalBalance = balance?.reduce((sum, acc) => sum + acc.balance, 0) || 0;
    const recentTransactionCount = transactions?.length || 0;
    
    // Create a simple hash of key financial indicators
    const financialSignature = `${totalBalance}-${recentTransactionCount}`;
    const messageKey = userMessage.toLowerCase().trim().substring(0, 50);
    
    return `${messageKey}-${financialSignature}`;
  }

  // Check if response is cached and still valid
  getCachedResponse(cacheKey) {
    const cached = this.responseCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < this.cacheTimeout)) {
      return cached.response;
    }
    return null;
  }

  // Cache response with timestamp
  setCachedResponse(cacheKey, response) {
    this.responseCache.set(cacheKey, {
      response,
      timestamp: Date.now()
    });
    
    // Clean old cache entries periodically
    if (this.responseCache.size > 100) {
      const oldestKeys = Array.from(this.responseCache.keys()).slice(0, 20);
      oldestKeys.forEach(key => this.responseCache.delete(key));
    }
  }

  async generateResponse(userMessage, financialData) {
    try {
      // Check cache first for common queries
      const cacheKey = this.generateCacheKey(userMessage, financialData);
      const cachedResponse = this.getCachedResponse(cacheKey);
      
      if (cachedResponse) {
        console.log('⚡ Using cached response');
        return {
          success: true,
          response: cachedResponse,
          model: 'gemini-1.5-flash',
          cached: true,
          timestamp: new Date().toISOString()
        };
      }
      
      const enrichmentResult = await this.enrichUserContext(userMessage, financialData);
      
      // Handle rejected non-financial queries
      if (enrichmentResult.isRejected) {
        console.log('🚫 Non-financial query rejected');
        return {
          success: true,
          response: enrichmentResult.rejectionMessage,
          model: 'domain-filter',
          language: enrichmentResult.language,
          rejected: true,
          timestamp: new Date().toISOString()
        };
      }
      
      const result = await this.model.generateContent(enrichmentResult.enrichedPrompt);
      const response = result.response;
      const text = response.text();
      
      // Cache the response
      this.setCachedResponse(cacheKey, text);
      
      return {
        success: true,
        response: text,
        model: 'gemini-1.5-flash',
        language: enrichmentResult.language,
        fraudAlerts: enrichmentResult.fraudAlerts,
        cached: false,
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

  // Streaming response method for real-time output
  async generateStreamingResponse(userMessage, financialData) {
    try {
      const enrichedPrompt = await this.enrichUserContext(userMessage, financialData);
      
      const result = await this.model.generateContentStream(enrichedPrompt);
      
      return {
        success: true,
        stream: result.stream,
        model: 'gemini-1.5-flash',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Gemini Streaming API Error:', error);
      return {
        success: false,
        error: 'Failed to generate streaming response from Gemini API',
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