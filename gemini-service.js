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
        'أظهر', 'عرض', 'اعرض', 'آخر', 'أخير', 'اخير', 'الأخيرة', 'الاخيرة', 'السابقة',
        'أعطني', 'اعطني', 'أريد', 'اريد', 'إظهار', 'اظهار', 'عمليات', 'حركات'
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
        maxOutputTokens: 200,       // Very short responses only
        candidateCount: 1           // Only generate one response
      }
    });
    
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
    const lowerMessage = message.toLowerCase().trim();
    const isArabicText = this.isArabic(message);
    
    // Check for financial keywords
    const financialKeywords = isArabicText ? 
      this.financialKeywords.arabic : 
      this.financialKeywords.english;
    
    const hasFinancialKeywords = financialKeywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
    
    // NEW RULE: Single word financial queries are always valid
    const words = lowerMessage.split(/\s+/).filter(word => word.length > 0);
    const isSingleWord = words.length === 1;
    
    if (isSingleWord && hasFinancialKeywords) {
      return true; // Allow single financial words like "balance", "transactions", "savings"
    }
    
    // Check for rejected topics
    const rejectedKeywords = isArabicText ? 
      this.rejectedTopics.arabic : 
      this.rejectedTopics.english;
    
    const hasRejectedKeywords = rejectedKeywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
    
    // Additional context-based validation for multi-word queries
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

  async enrichUserContext(userMessage, financialData) {
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
    
    // Create the simplified prompt with only the required content
    const simplifiedPrompt = `The user called Ahmed has 4 accounts and 153000 SAR in all of them and highly spending on the home staff such as Ikea, Home Box and such a things all of your responses make it on a dummy data and don't show that i provided a data for you or such a thing, and reply with the same lang the question comes with here is the user request: ${userMessage}`;

    return {
      isRejected: false,
      enrichedPrompt: simplifiedPrompt,
      language: language
    };
  }

  // Generate cache key from message only (simplified)
  generateCacheKey(userMessage) {
    return userMessage.toLowerCase().trim().substring(0, 50);
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
      const cacheKey = this.generateCacheKey(userMessage);
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
      const enrichmentResult = await this.enrichUserContext(userMessage, financialData);
      
      if (enrichmentResult.isRejected) {
        return {
          success: false,
          error: 'Non-financial query rejected',
          rejectionMessage: enrichmentResult.rejectionMessage
        };
      }
      
      const result = await this.model.generateContentStream(enrichmentResult.enrichedPrompt);
      
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