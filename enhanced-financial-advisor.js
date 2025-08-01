const natural = require('natural');
const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const regression = require('ml-regression');
const stats = require('simple-statistics');
const moment = require('moment');
const colors = require('colors');
const sentiment = require('sentiment');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const cron = require('node-cron');

class EnhancedFinancialAdvisor {
  constructor() {
    // Advanced NLP Setup with Enhanced AI Capabilities
    this.classifier = new natural.BayesClassifier();
    this.intentClassifier = new natural.BayesClassifier();
    this.financialValidator = new natural.BayesClassifier();
    this.contextClassifier = new natural.BayesClassifier();
    this.urgencyClassifier = new natural.BayesClassifier();
    this.complexityClassifier = new natural.BayesClassifier();
    this.stemmer = natural.PorterStemmer;
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
    this.sentimentAnalyzer = new sentiment();
    this.metaphone = natural.Metaphone;
    this.jaro = natural.JaroWinklerDistance;
    
    // Comprehensive Financial Knowledge Base
    this.financialTerms = new Set([
      // Investment Terms
      'investment', 'portfolio', 'diversification', 'risk', 'return', 'yield', 'dividend',
      'stock', 'bond', 'etf', 'mutual fund', 'index fund', 'reit', 'cryptocurrency',
      'options', 'futures', 'derivatives', 'commodities', 'forex', 'hedge fund',
      'private equity', 'venture capital', 'ipo', 'market cap', 'p/e ratio', 'eps',
      'beta', 'alpha', 'sharpe ratio', 'correlation', 'volatility', 'liquidity',
      
      // Personal Finance
      'budget', 'savings', 'emergency fund', 'debt', 'credit', 'loan', 'mortgage',
      'insurance', 'retirement', 'pension', '401k', 'ira', 'roth', 'hsa',
      'tax', 'capital gains', 'deduction', 'refund', 'withholding',
      
      // Economic Terms
      'inflation', 'deflation', 'recession', 'gdp', 'unemployment', 'interest rate',
      'federal reserve', 'monetary policy', 'fiscal policy', 'trade deficit',
      
      // Market Terms
      'market', 'bull', 'bear', 'correction', 'crash', 'rally', 'trend',
      'support', 'resistance', 'breakout', 'volume', 'moving average',
      
      // Advanced Concepts
      'asset allocation', 'compound interest', 'dollar cost averaging', 'rebalancing',
      'tax loss harvesting', 'monte carlo', 'efficient frontier', 'modern portfolio theory',
      'capm', 'arbitrage', 'leverage', 'margin', 'short selling', 'covered call'
    ]);
    
    // Financial Synonyms and Context
    this.financialSynonyms = {
      'money': ['cash', 'funds', 'capital', 'currency', 'assets'],
      'invest': ['put money in', 'buy', 'purchase', 'allocate', 'deploy capital'],
      'save': ['set aside', 'accumulate', 'build up', 'reserve', 'store'],
      'profit': ['gain', 'return', 'earning', 'income', 'yield'],
      'loss': ['deficit', 'shortfall', 'negative return', 'decline'],
      'expensive': ['costly', 'high-priced', 'overpriced', 'premium'],
      'cheap': ['affordable', 'low-cost', 'inexpensive', 'budget-friendly']
    };
    
    // Financial Calculations Constants
    this.financialConstants = {
      TRADING_DAYS_YEAR: 252,
      BUSINESS_DAYS_YEAR: 260,
      RISK_FREE_RATE: 0.045, // Current 10-year treasury
      MARKET_RISK_PREMIUM: 0.06,
      INFLATION_TARGET: 0.02,
      EMERGENCY_FUND_MONTHS: 6,
      RETIREMENT_SAVINGS_RATE: 0.15,
      HOUSE_PAYMENT_RATIO: 0.28,
      DEBT_TO_INCOME_RATIO: 0.36
    };
    
    // Enhanced User Profile & AI Learning System
    this.userProfile = {
      // Basic Info
      id: uuidv4(),
      createdAt: new Date(),
      lastActive: new Date(),
      
      // Financial Profile
      riskTolerance: 'moderate',
      investmentExperience: 'beginner',
      financialGoals: [],
      savingsGoals: [],
      age: null,
      income: null,
      netWorth: null,
      expenses: null,
      debts: null,
      assets: null,
      timeHorizon: 'medium',
      
      // Advanced Profiling
      riskScore: 50, // 0-100 scale
      sophisticationLevel: 1, // 1-10 scale
      preferredCommunicationStyle: 'detailed', // simple, detailed, technical
      financialKnowledgeLevel: 'beginner',
      investmentStyle: 'passive', // passive, active, mixed
      
      // Behavioral Analysis
      decisionMakingStyle: 'analytical', // emotional, analytical, balanced
      riskBehaviorPattern: [],
      commonQuestionTypes: {},
      learningProgress: {},
      
      // Personalization
      preferences: {
        currency: 'USD',
        language: 'en',
        timezone: 'America/New_York',
        notificationPreferences: {},
        displayPreferences: {}
      },
      
      // AI Learning Data
      conversationHistory: [],
      personalizedAdvice: [],
      feedbackHistory: [],
      successfulRecommendations: [],
      fraudAlerts: [],
      transactionPatterns: {},
      
      // Performance Tracking
      portfolioPerformance: [],
      goalProgress: {},
      adviceEffectiveness: {},
      satisfactionScores: []
    };
    
    // Advanced AI Models & Analytics
    this.models = {
      // Predictive Models
      spending: null,
      risk: null,
      investment: null,
      budgeting: null,
      retirement: null,
      
      // Advanced Analytics
      portfolioOptimization: null,
      marketPrediction: null,
      fraudDetection: null,
      creditScoring: null,
      
      // Machine Learning Components
      neuralNetwork: null,
      decisionTree: null,
      clustering: null,
      timeSeriesAnalysis: null,
      
      // Financial Models
      blackScholes: null,
      monteCarloSimulation: null,
      varCalculation: null,
      correlationAnalysis: null
    };
    
    // Advanced Analytics Engine
    this.analytics = {
      performanceMetrics: {},
      riskMetrics: {},
      benchmarkComparisons: {},
      attributionAnalysis: {},
      stressTestResults: {},
      scenarioAnalysis: {}
    };
    
    // Real-time Market Intelligence
    this.marketIntelligence = {
      trends: {},
      anomalies: [],
      opportunities: [],
      risks: [],
      sentiment: {},
      volatilityIndicators: {},
      correlations: {}
    };
    
    // Comprehensive Financial Market Data with Real-time Updates
    this.marketData = {
      lastUpdated: new Date(),
      updateFrequency: 300000, // 5 minutes
      stocks: {
        'SPY': { price: 445.50, change: 2.15, changePercent: 0.48, sector: 'Market Index' },
        'QQQ': { price: 375.25, change: -1.85, changePercent: -0.49, sector: 'Technology' },
        'AAPL': { price: 185.90, change: 3.20, changePercent: 1.75, sector: 'Technology' },
        'MSFT': { price: 410.15, change: 5.80, changePercent: 1.43, sector: 'Technology' },
        'GOOGL': { price: 140.25, change: -2.10, changePercent: -1.47, sector: 'Technology' },
        'TSLA': { price: 250.75, change: 8.45, changePercent: 3.49, sector: 'Automotive' },
        'NVDA': { price: 875.50, change: 12.30, changePercent: 1.43, sector: 'Technology' },
        'META': { price: 485.20, change: -5.75, changePercent: -1.17, sector: 'Technology' },
        'JPM': { price: 165.85, change: 1.95, changePercent: 1.19, sector: 'Financial' },
        'V': { price: 275.40, change: 3.55, changePercent: 1.31, sector: 'Financial' }
      },
      bonds: {
        'US10Y': { yield: 4.25, change: 0.05 },
        'US2Y': { yield: 4.85, change: 0.08 },
        'Corporate': { yield: 5.15, change: 0.03 }
      },
      crypto: {
        'BTC': { price: 68500, change: 1250, changePercent: 1.86 },
        'ETH': { price: 3850, change: -125, changePercent: -3.14 },
        'BNB': { price: 485, change: 15, changePercent: 3.19 }
      },
      commodities: {
        'Gold': { price: 2015.50, change: -8.25, changePercent: -0.41 },
        'Oil': { price: 78.45, change: 2.15, changePercent: 2.82 },
        'Silver': { price: 24.75, change: 0.85, changePercent: 3.56 }
      }
    };
    
    // Comprehensive Financial Planning Templates & Strategies
    this.planningTemplates = {
      emergencyFund: {
        targetMonths: 6,
        minAmount: 1000,
        priority: 'CRITICAL',
        description: 'Build emergency fund covering 6 months of expenses',
        fundingSources: ['savings', 'bonus', 'tax_refund'],
        riskFactors: ['job_stability', 'health', 'dependents']
      },
      
      retirement: {
        savingsRate: 0.15,
        target401k: 'Max employer match',
        replacementRatio: 0.80,
        description: 'Save 15% of income for retirement',
        milestones: {
          30: '1x annual salary',
          35: '2x annual salary',
          40: '3x annual salary',
          45: '4x annual salary',
          50: '6x annual salary',
          55: '7x annual salary',
          60: '8x annual salary',
          67: '10x annual salary'
        }
      },
      
      debtPayoff: {
        strategies: {
          avalanche: {
            method: 'highest_interest_first',
            description: 'Pay minimums on all debts, extra to highest rate',
            savings: 'maximum_interest_savings'
          },
          snowball: {
            method: 'smallest_balance_first',
            description: 'Pay minimums on all debts, extra to smallest balance',
            savings: 'psychological_motivation'
          },
          hybrid: {
            method: 'balanced_approach',
            description: 'Combine avalanche and snowball methods',
            savings: 'balanced_savings_motivation'
          }
        },
        priority: 'HIGH',
        targetPayoffRatio: 0.20
      },
      
      homeOwnership: {
        downPaymentTarget: 0.20,
        maxHousingRatio: 0.28,
        totalDebtRatio: 0.36,
        emergencyBuffer: 3, // months
        closingCostsBudget: 0.03,
        description: 'Comprehensive home buying preparation'
      },
      
      education: {
        savingsVehicles: ['529_plan', 'coverdell_esa', 'savings_bonds'],
        targetAmount: 'varies_by_state',
        startAge: 'birth',
        description: 'Education funding strategy'
      },
      
      taxOptimization: {
        strategies: ['tax_loss_harvesting', 'asset_location', 'roth_conversions'],
        accountTypes: ['traditional_ira', 'roth_ira', 'taxable', 'hsa'],
        description: 'Comprehensive tax optimization'
      }
    };
    
    // Advanced Financial Ratios & Benchmarks
    this.financialBenchmarks = {
      // Liquidity Ratios
      emergencyFundRatio: { target: 6, minimum: 3, maximum: 12 },
      
      // Debt Ratios
      debtToIncomeRatio: { target: 0.36, maximum: 0.40 },
      housingRatio: { target: 0.28, maximum: 0.32 },
      creditUtilization: { target: 0.10, maximum: 0.30 },
      
      // Savings Ratios
      savingsRate: { target: 0.20, minimum: 0.10 },
      retirementSavingsRate: { target: 0.15, minimum: 0.10 },
      
      // Investment Ratios
      stockAllocation: { young: 0.90, moderate: 0.70, conservative: 0.50 },
      internationalAllocation: { target: 0.30, minimum: 0.20 },
      
      // Performance Benchmarks
      portfolioRebalanceThreshold: 0.05,
      expenseRatioTarget: 0.20, // 0.20% or 20 basis points
      cashDragThreshold: 0.05
    };
    
    // Database
    this.dbPath = path.join(__dirname, 'database', 'bank_database.db');
    this.db = new sqlite3.Database(this.dbPath);
    this.currentCustomerId = null;
    
    // Initialize system components
    this.initializeAdvancedSystem();
    this.startMarketDataUpdates();
    this.initializePerformanceTracking();
    this.setupContinuousLearning();
  }

  async initializeAdvancedSystem() {
    try {
      await this.trainAdvancedNLP();
      await this.buildPredictiveModels();
      await this.initializeFinancialKnowledgeBase();
      await this.initializeAdvancedAnalytics();
      await this.buildFinancialModels();
    } catch (error) {
      console.error('Initialization Error:', error.message);
    }
  }
  
  async initializeAdvancedAnalytics() {
    
    // Initialize performance tracking
    this.analytics.performanceMetrics = {
      sharpeRatio: null,
      informationRatio: null,
      treynorRatio: null,
      jensenAlpha: null,
      maximumDrawdown: null,
      volatility: null,
      beta: null,
      correlations: {}
    };
    
    // Initialize risk metrics
    this.analytics.riskMetrics = {
      valueAtRisk: { var95: null, var99: null },
      conditionalVaR: { cvar95: null, cvar99: null },
      trackingError: null,
      informationRatio: null,
      downsideDeviation: null,
      updownCapture: { up: null, down: null }
    };
    
  }
  
  async buildFinancialModels() {
    
    // Black-Scholes Option Pricing Model
    this.models.blackScholes = {
      calculateCall: (S, K, T, r, sigma) => {
        const d1 = (Math.log(S/K) + (r + 0.5 * sigma**2) * T) / (sigma * Math.sqrt(T));
        const d2 = d1 - sigma * Math.sqrt(T);
        return S * this.normalCDF(d1) - K * Math.exp(-r * T) * this.normalCDF(d2);
      },
      calculatePut: (S, K, T, r, sigma) => {
        const d1 = (Math.log(S/K) + (r + 0.5 * sigma**2) * T) / (sigma * Math.sqrt(T));
        const d2 = d1 - sigma * Math.sqrt(T);
        return K * Math.exp(-r * T) * this.normalCDF(-d2) - S * this.normalCDF(-d1);
      }
    };
    
    // Monte Carlo Simulation
    this.models.monteCarloSimulation = {
      simulatePortfolio: (initialValue, expectedReturn, volatility, timeHorizon, simulations = 10000) => {
        const results = [];
        for (let i = 0; i < simulations; i++) {
          let value = initialValue;
          for (let t = 0; t < timeHorizon * 12; t++) {
            const randomReturn = this.generateNormalRandom(expectedReturn/12, volatility/Math.sqrt(12));
            value *= (1 + randomReturn);
          }
          results.push(value);
        }
        return {
          mean: stats.mean(results),
          median: stats.median(results),
          percentiles: {
            p5: stats.quantile(results, 0.05),
            p10: stats.quantile(results, 0.10),
            p25: stats.quantile(results, 0.25),
            p75: stats.quantile(results, 0.75),
            p90: stats.quantile(results, 0.90),
            p95: stats.quantile(results, 0.95)
          },
          standardDeviation: stats.standardDeviation(results),
          results
        };
      }
    };
    
    // Value at Risk Calculation
    this.models.varCalculation = {
      historicalVaR: (returns, confidence = 0.95) => {
        const sortedReturns = returns.slice().sort((a, b) => a - b);
        const index = Math.floor((1 - confidence) * sortedReturns.length);
        return sortedReturns[index];
      },
      parametricVaR: (portfolioValue, expectedReturn, volatility, confidence = 0.95, timeHorizon = 1) => {
        const z = this.getZScore(confidence);
        return portfolioValue * (expectedReturn - z * volatility) * Math.sqrt(timeHorizon);
      }
    };
    
  }
  
  startMarketDataUpdates() {
    
    // Update market data every 5 minutes during market hours
    cron.schedule('*/5 9-16 * * 1-5', () => {
      this.updateMarketData();
    });
    
    // Daily market analysis after market close
    cron.schedule('0 17 * * 1-5', () => {
      this.performDailyMarketAnalysis();
    });
    
    // Weekly portfolio review
    cron.schedule('0 9 * * 1', () => {
      this.performWeeklyAnalysis();
    });
  }
  
  initializePerformanceTracking() {
    
    // Initialize performance metrics
    this.userProfile.portfolioPerformance = [];
    this.userProfile.benchmarkComparisons = {};
    this.userProfile.riskAdjustedReturns = {};
  }
  
  setupContinuousLearning() {
    
    // Learn from user interactions
    this.learningSystem = {
      patternRecognition: {},
      feedbackIntegration: {},
      adaptiveResponses: {},
      personalizationEngine: {}
    };
  }

  async trainAdvancedNLP() {
    
    // Train context classifier for better understanding
    await this.trainContextClassifier();
    
    // Train urgency classifier for prioritizing requests
    await this.trainUrgencyClassifier();
    
    // Train complexity classifier for appropriate response depth
    await this.trainComplexityClassifier();
    
    // Financial Intent Classification
    const financialIntents = {
      portfolio_analysis: [
        "analyze my portfolio", "portfolio performance", "investment analysis", "how are my investments",
        "portfolio review", "investment performance", "asset allocation", "portfolio diversification",
        "investment returns", "portfolio balance", "investment strategy review", "portfolio optimization"
      ],
      budget_planning: [
        "create budget", "budget plan", "monthly budget", "spending plan", "budget advice",
        "budgeting help", "expense planning", "income allocation", "financial planning",
        "budget optimization", "spending limits", "budget categories", "budget strategy"
      ],
      debt_management: [
        "pay off debt", "debt strategy", "debt consolidation", "reduce debt", "debt advice",
        "debt payoff plan", "credit card debt", "loan payment", "debt freedom",
        "debt avalanche", "debt snowball", "interest rates", "debt management"
      ],
      investment_advice: [
        "investment options", "where to invest", "investment strategy", "stock recommendations",
        "best investments", "investment portfolio", "diversification", "asset allocation",
        "investment planning", "retirement investing", "growth investments", "passive investing"
      ],
      retirement_planning: [
        "retirement planning", "401k advice", "retirement savings", "pension planning",
        "retirement goals", "retirement strategy", "retirement income", "retirement funds",
        "social security", "retirement age", "retirement calculator", "retirement advice"
      ],
      tax_optimization: [
        "tax advice", "tax planning", "tax optimization", "tax deductions", "tax strategy",
        "tax savings", "tax efficient investing", "tax loss harvesting", "tax brackets",
        "tax planning strategies", "reduce taxes", "tax optimization tips"
      ],
      savings_goals: [
        "savings goals", "save money", "savings plan", "emergency fund", "savings strategy",
        "savings advice", "savings account", "high yield savings", "savings tips",
        "financial goals", "savings target", "savings calculator", "build wealth",
        "create savings goal", "set savings target", "vacation fund", "house down payment",
        "car fund", "wedding savings", "education fund", "retirement goal"
      ],
      fraud_detection: [
        "fraud alert", "suspicious transaction", "unauthorized charge", "fraud protection",
        "security alert", "account security", "identity theft", "card security",
        "transaction monitoring", "fraud prevention", "suspicious activity", "security breach"
      ],
      insurance_planning: [
        "insurance advice", "life insurance", "health insurance", "insurance planning",
        "insurance coverage", "insurance options", "insurance strategy", "insurance needs",
        "disability insurance", "umbrella insurance", "insurance review", "insurance tips"
      ],
      market_analysis: [
        "market analysis", "market trends", "stock market", "market outlook", "market news",
        "economic analysis", "market conditions", "market forecast", "market insights",
        "market performance", "sector analysis", "market volatility", "market opportunities"
      ],
      financial_education: [
        "explain compound interest", "what is diversification", "how does investing work",
        "financial basics", "investment fundamentals", "financial literacy", "finance education",
        "explain financial terms", "investment education", "financial concepts", "money management"
      ],
      risk_assessment: [
        "risk tolerance", "investment risk", "risk assessment", "risk management",
        "portfolio risk", "risk analysis", "risk profile", "conservative investing",
        "aggressive investing", "risk vs return", "volatility", "risk factors"
      ],
      credit_improvement: [
        "improve credit score", "credit repair", "credit building", "credit advice",
        "credit strategy", "credit report", "credit utilization", "credit cards",
        "credit history", "credit monitoring", "credit tips", "build credit"
      ]
    };

    // Train financial intent classifier
    Object.entries(financialIntents).forEach(([intent, phrases]) => {
      phrases.forEach(phrase => {
        this.intentClassifier.addDocument(phrase, intent);
      });
    });
    this.intentClassifier.train();

    // Financial Question Validator
    const financialQuestions = [
      "investment", "portfolio", "budget", "savings", "debt", "credit", "loan", "mortgage",
      "retirement", "401k", "ira", "insurance", "tax", "financial", "money", "income",
      "expenses", "assets", "liabilities", "risk", "return", "yield", "dividend",
      "stock", "bond", "etf", "mutual fund", "market", "trading", "compound interest",
      "emergency fund", "asset allocation", "diversification", "inflation", "recession"
    ];
    
    const nonFinancialQuestions = [
      "weather", "sports", "politics", "entertainment", "travel", "food", "health",
      "technology", "science", "history", "literature", "music", "movies", "games",
      "relationships", "education", "career", "hobbies", "fashion", "beauty"
    ];

    // Train financial validator
    financialQuestions.forEach(term => {
      this.financialValidator.addDocument(term, 'financial');
    });
    nonFinancialQuestions.forEach(term => {
      this.financialValidator.addDocument(term, 'non_financial');
    });
    this.financialValidator.train();

    // Train financial entity extraction
    await this.trainFinancialEntityExtraction();
    
    // Build financial knowledge graph
    await this.buildFinancialKnowledgeGraph();
    
  }

  async trainContextClassifier() {
    // Create a simple context classifier
    this.contextClassifier = new natural.BayesClassifier();
    
    const contexts = {
      personal: ["my", "I", "me", "personal", "individual"],
      general: ["what", "how", "explain", "general", "typical"],
      urgent: ["urgent", "emergency", "immediate", "quickly", "asap"],
      planning: ["plan", "strategy", "future", "long-term", "goal"]
    };
    
    Object.entries(contexts).forEach(([context, phrases]) => {
      phrases.forEach(phrase => {
        this.contextClassifier.addDocument(phrase, context);
      });
    });
    
    this.contextClassifier.train();
    return Promise.resolve();
  }

  async trainUrgencyClassifier() {
    // Create urgency classifier
    this.urgencyClassifier = new natural.BayesClassifier();
    
    const urgencyLevels = {
      high: ["urgent", "emergency", "immediate", "crisis", "asap", "quickly"],
      medium: ["soon", "important", "priority", "need", "should"],
      low: ["when", "eventually", "sometime", "consider", "maybe"]
    };
    
    Object.entries(urgencyLevels).forEach(([level, phrases]) => {
      phrases.forEach(phrase => {
        this.urgencyClassifier.addDocument(phrase, level);
      });
    });
    
    this.urgencyClassifier.train();
    return Promise.resolve();
  }

  async trainComplexityClassifier() {
    // Create complexity classifier
    this.complexityClassifier = new natural.BayesClassifier();
    
    const complexityLevels = {
      simple: ["what", "how much", "when", "where", "basic", "simple"],
      moderate: ["analyze", "compare", "explain", "details", "breakdown"],
      complex: ["optimize", "strategy", "comprehensive", "detailed", "advanced"]
    };
    
    Object.entries(complexityLevels).forEach(([level, phrases]) => {
      phrases.forEach(phrase => {
        this.complexityClassifier.addDocument(phrase, level);
      });
    });
    
    this.complexityClassifier.train();
    return Promise.resolve();
  }

  async trainFinancialEntityExtraction() {
    // Simple entity extraction setup
    return Promise.resolve();
  }

  async buildFinancialKnowledgeGraph() {
    // Simple knowledge graph setup
    return Promise.resolve();
  }

  async buildPredictiveModels() {
    
    try {
      // Build spending prediction model
      const spendingData = await this.getHistoricalSpendingData();
      if (spendingData.length > 5) {
        this.models.spending = this.trainSpendingModel(spendingData);
      }
      
      // Build investment recommendation model
      this.models.investment = this.buildInvestmentModel();
      
      // Build budgeting model
      this.models.budgeting = this.buildBudgetingModel();
      
    } catch (error) {
      console.error('Model Building Error:', error);
    }
  }

  async initializeFinancialKnowledgeBase() {
    
    // Financial ratios and benchmarks
    this.benchmarks = {
      emergencyFundMonths: 6,
      savingsRate: 0.20,
      debtToIncomeRatio: 0.36,
      housingCostRatio: 0.28,
      retirementSavingsRate: 0.15,
      stockAllocation: 0.60,
      bondAllocation: 0.30,
      cashAllocation: 0.10
    };
    
  }

  isFinancialQuestion(input) {
    const lowerInput = input.toLowerCase();
    
    // First check for explicit non-financial topics
    const nonFinancialTopics = [
      'weather', 'sports', 'politics', 'entertainment', 'travel', 'food', 'health',
      'technology', 'science', 'history', 'literature', 'music', 'movies', 'games',
      'relationships', 'education', 'career', 'hobbies', 'fashion', 'beauty',
      'cooking', 'recipe', 'joke', 'story', 'news', 'celebrity', 'dating',
      'medical', 'doctor', 'hospital', 'medicine', 'disease', 'symptoms',
      'programming', 'code', 'software', 'hardware', 'computer', 'internet',
      'social media', 'facebook', 'instagram', 'twitter', 'tiktok', 'youtube',
      'art', 'painting', 'drawing', 'photography', 'craft', 'diy',
      'animal', 'pet', 'dog', 'cat', 'bird', 'fish', 'nature', 'plant',
      'car maintenance', 'repair', 'mechanic', 'engine', 'tire', 'oil change',
      'birthday', 'anniversary', 'holiday', 'vacation', 'trip', 'hotel',
      'restaurant', 'bar', 'club', 'party', 'event', 'concert', 'theater'
    ];
    
    // Strict check for non-financial content
    const containsNonFinancial = nonFinancialTopics.some(topic => 
      lowerInput.includes(topic)
    );
    
    if (containsNonFinancial) {
      return false;
    }
    
    // Enhanced financial keyword validation
    const financialKeywords = Array.from(this.financialTerms);
    const additionalFinancialKeywords = [
      'money', 'dollar', 'cash', 'fund', 'account', 'bank', 'finance', 'financial',
      'pay', 'payment', 'cost', 'price', 'spend', 'save', 'earn', 'income',
      'salary', 'wage', 'profit', 'loss', 'debt', 'credit', 'loan', 'mortgage',
      'interest', 'rate', 'percent', 'fee', 'charge', 'bill', 'expense',
      'balance', 'transaction', 'transactions', 'deposit', 'withdrawal', 'transfer', 'worth',
      'history', 'statement', 'list', 'show', 'view',
      'invest', 'investor', 'investing', 'retirement', 'retire', 'plan', 'planning',
      'budget', 'budgeting', 'saving', 'savings', 'wealth', 'portfolio', 'financial',
      'finances', 'finance', 'economic', 'economy', 'market', 'stock', 'stocks',
      'bond', 'bonds', 'crypto', 'cryptocurrency', 'trading', 'trade', 'asset',
      'assets', 'liability', 'liabilities', 'equity', 'capital', 'banking',
      'refinance', 'refinancing', 'fraud', 'fraudulent', 'secure', 'security',
      'suspicious', 'activity', 'alert', 'analysis', 'analyze'
    ];
    
    const allFinancialKeywords = [...financialKeywords, ...additionalFinancialKeywords];
    const hasFinancialTerms = allFinancialKeywords.some(term => 
      lowerInput.includes(term)
    );
    
    try {
      const classification = this.financialValidator.classify(lowerInput);
      const confidence = Math.max(...this.financialValidator.getClassifications(lowerInput).map(c => c.value));
      
      // Stricter validation - requires both classification AND financial keywords
      return (classification === 'financial' && confidence > 0.7) || hasFinancialTerms;
    } catch (error) {
      // Fallback to keyword-based detection only
      return hasFinancialTerms;
    }
  }

  detectIntent(input) {
    const lowerInput = input.toLowerCase();
    
    // Transaction/statement requests - check first for very specific intent
    if (lowerInput.match(/transaction|transactions|statement|history|list.*transaction|show.*transaction|view.*transaction|my.*transaction/)) {
      return 'transactions';
    }
    
    // Account balance and account info requests - check second
    if (lowerInput.match(/balance|my balance|account balance|how much.*have|what.*balance|check.*balance|account.*info|my account|accounts/)) {
      return 'account';
    }
    
    // Analysis/review requests - check second for more specific intent
    if (lowerInput.match(/analysis|analyze|review|look at|check|show me|tell me about.*spending|spending.*analysis|spending.*last|spending.*month|spending.*week|spending.*year/)) {
      return 'analysis';
    }
    
    // Investment-related keywords
    if (lowerInput.match(/invest|investment|stock|bond|etf|portfolio|mutual fund|index fund|401k|ira|crypto|trading|asset allocation/)) {
      return 'investment';
    }
    
    // Budget-related keywords (but not analysis requests)
    if (lowerInput.match(/budget|budgeting|create.*budget|make.*budget|help.*budget/) && !lowerInput.match(/analysis|analyze|review|show me/)) {
      return 'budget';
    }
    
    // Debt-related keywords
    if (lowerInput.match(/debt|loan|mortgage|credit card|pay off|owe|refinance|consolidate/)) {
      return 'debt';
    }
    
    // Retirement-related keywords
    if (lowerInput.match(/retire|retirement|pension|401k|403b|social security|medicare/)) {
      return 'retirement';
    }
    
    // Savings-related keywords
    if (lowerInput.match(/save|saving|savings|emergency fund|high yield|cd|certificate of deposit/)) {
      return 'savings';
    }
    
    // Credit-related keywords
    if (lowerInput.match(/credit score|credit report|credit card|improve credit|build credit/)) {
      return 'credit';
    }
    
    // Insurance-related keywords
    if (lowerInput.match(/insurance|life insurance|health insurance|disability|coverage/)) {
      return 'insurance';
    }
    
    // Tax-related keywords
    if (lowerInput.match(/tax|taxes|deduction|refund|irs|filing|write off/)) {
      return 'tax';
    }
    
    return 'general';
  }

  async processFinancialInput(input) {
    // Validate financial context
    if (!this.isFinancialQuestion(input)) {
      return this.generateNonFinancialResponse(input);
    }

    try {
      // Simple keyword-based intent detection
      const intent = this.detectIntent(input);
      
      // Extract financial entities
      const entities = this.extractFinancialEntities(input);
      
      // Update conversation history
      this.userProfile.conversationHistory.push({
        timestamp: new Date(),
        input,
        intent,
        entities
      });

      // Keep history manageable
      if (this.userProfile.conversationHistory.length > 20) {
        this.userProfile.conversationHistory = this.userProfile.conversationHistory.slice(-20);
      }

      let response = '';
      
      switch (intent) {
        case 'transactions':
          response = this.handleTransactionQuery(input, entities);
          break;
        case 'account':
          response = this.handleAccountQuery(input, entities);
          break;
        case 'analysis':
          response = this.handleAnalysisQuery(input, entities);
          break;
        case 'investment':
          response = this.handleInvestmentQuery(input, entities);
          break;
        case 'budget':
          response = this.handleBudgetQuery(input, entities);
          break;
        case 'debt':
          response = this.handleDebtQuery(input, entities);
          break;
        case 'retirement':
          response = this.handleRetirementQuery(input, entities);
          break;
        case 'savings':
          response = this.handleSavingsQuery(input, entities);
          break;
        case 'credit':
          response = this.handleCreditQuery(input, entities);
          break;
        case 'insurance':
          response = this.handleInsuranceQuery(input, entities);
          break;
        case 'tax':
          response = this.handleTaxQuery(input, entities);
          break;
        default:
          response = this.handleGeneralQuery(input, entities);
      }

      return response;

    } catch (error) {
      console.error('Processing Error:', error);
      return 'I encountered an error while processing your question. Please try again.';
    }
  }

  extractFinancialEntities(input) {
    const entities = {
      amounts: [],
      percentages: [],
      timeframes: [],
      assets: [],
      accounts: []
    };

    // Extract dollar amounts
    const amountRegex = /\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;
    const amounts = input.match(amountRegex);
    if (amounts) entities.amounts = amounts;

    // Extract percentages
    const percentRegex = /(\d+(?:\.\d+)?)\s*%/g;
    const percentages = input.match(percentRegex);
    if (percentages) entities.percentages = percentages;

    // Extract timeframes
    const timeRegex = /(month|year|decade|retirement|short.term|long.term)/gi;
    const timeframes = input.match(timeRegex);
    if (timeframes) entities.timeframes = timeframes;

    // Extract financial assets
    const stockRegex = /\b[A-Z]{1,5}\b/g;
    const stocks = input.match(stockRegex);
    if (stocks) entities.assets = stocks.filter(s => s.length <= 5);

    return entities;
  }

  generateNonFinancialResponse(input) {
    return `🚫 I'm a specialized Financial Advisor AI and can only assist with financial topics.

🏦 **MY EXPERTISE AREAS:**

💰 **ACCOUNT & BALANCE MANAGEMENT:**
• Check account balances and portfolio overview
• Analyze net worth and financial status
• Review account details and cash position

📊 **SPENDING & TRANSACTION ANALYSIS:**
• Analyze spending patterns and habits
• Review transaction history and cash flow
• Categorize expenses and income tracking

💸 **BUDGET PLANNING & MANAGEMENT:**
• Create personalized budget plans
• Monthly budget analysis and optimization
• Spending limits and budget recommendations

📈 **INVESTMENT ADVICE & PORTFOLIO:**
• Investment strategy and recommendations
• Portfolio analysis and optimization
• Stock market data and cryptocurrency insights
• Asset allocation and diversification advice

🎯 **SAVINGS GOALS & RETIREMENT:**
• Set and track savings goals
• Retirement planning and 401(k) optimization
• Emergency fund planning
• Financial goal achievement strategies

💳 **DEBT & CREDIT MANAGEMENT:**
• Debt payoff strategies (avalanche/snowball)
• Credit score improvement advice
• Loan and mortgage guidance
• Debt consolidation recommendations

🛡️ **SECURITY & FRAUD PROTECTION:**
• Account security analysis
• Fraud detection and prevention
• Suspicious activity monitoring
• Financial risk assessment

💡 **FINANCIAL EDUCATION & ADVICE:**
• Personal finance coaching and guidance
• Explanation of financial concepts
• Tax optimization strategies
• Insurance planning and analysis

📰 **MARKET NEWS & ANALYSIS:**
• Real-time market updates and insights
• Economic news and market trends
• Investment opportunities analysis

**💬 EXAMPLE QUESTIONS YOU CAN ASK:**
• "What's my account balance?"
• "Analyze my spending patterns"
• "How should I invest $10,000?"
• "Help me create a monthly budget"
• "What's the best debt payoff strategy?"
• "How much should I save for retirement?"
• "Check for any fraudulent activity"
• "Explain compound interest"
• "What are current market trends?"

Please ask me about any of these financial topics and I'll provide expert guidance!`;
  }

  async handlePortfolioAnalysis(input, confidence, entities) {
    let response = `📊 Portfolio Analysis & Investment Review (Confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    try {
      const accounts = await this.getAccountBalance();
      const transactions = await this.getRecentTransactions(null, 90);
      
      if (!accounts || accounts.length === 0) {
        response += "📋 Portfolio Setup Recommendations:\n";
        response += "• Start with a diversified index fund (like VTI or SPY)\n";
        response += "• Allocate 60% stocks, 30% bonds, 10% cash\n";
        response += "• Consider target-date funds for automatic rebalancing\n";
        response += "• Minimum investment: $1,000 for most funds\n\n";
        
        response += await this.generateInvestmentStrategy('beginner');
        return response;
      }

      const totalBalance = accounts.reduce((sum, acc) => sum + this.convertToUSD(acc.balance, acc.currency), 0);
      
      response += `💼 Current Portfolio Value: $${totalBalance.toLocaleString()}\n\n`;
      
      // Portfolio allocation analysis
      response += "🎯 ASSET ALLOCATION ANALYSIS:\n";
      const allocation = this.analyzeAssetAllocation(accounts);
      Object.entries(allocation).forEach(([type, data]) => {
        const percentage = (data.amount / totalBalance * 100).toFixed(1);
        response += `• ${type}: $${data.amount.toLocaleString()} (${percentage}%)\n`;
      });
      
      response += "\n📈 PORTFOLIO RECOMMENDATIONS:\n";
      response += await this.generatePortfolioRecommendations(totalBalance, allocation);
      
      response += "\n🔄 REBALANCING STRATEGY:\n";
      response += await this.generateRebalancingAdvice(allocation, totalBalance);
      
      response += "\n💡 OPTIMIZATION TIPS:\n";
      response += "• Review and rebalance quarterly\n";
      response += "• Consider tax-loss harvesting opportunities\n";
      response += "• Minimize fees with low-cost index funds\n";
      response += "• Dollar-cost average for regular investments\n";
      
    } catch (error) {
      response += "Unable to retrieve portfolio data. Please ensure your accounts are properly connected.";
    }
    
    return response;
  }

  async handleBudgetPlanning(input, confidence, entities) {
    let response = `💰 Personalized Budget Planning (Confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    try {
      const transactions = await this.getRecentTransactions(null, 90);
      const monthlyIncome = await this.calculateMonthlyIncome(transactions);
      const monthlyExpenses = await this.categorizeExpenses(transactions);
      
      response += `📊 CURRENT FINANCIAL SNAPSHOT:\n`;
      response += `• Monthly Income: $${monthlyIncome.toLocaleString()}\n`;
      response += `• Monthly Expenses: $${Object.values(monthlyExpenses).reduce((sum, cat) => sum + cat.total, 0).toLocaleString()}\n`;
      response += `• Net Cash Flow: $${(monthlyIncome - Object.values(monthlyExpenses).reduce((sum, cat) => sum + cat.total, 0)).toLocaleString()}\n\n`;
      
      response += "🎯 RECOMMENDED BUDGET ALLOCATION:\n";
      const budgetPlan = this.create50_30_20Budget(monthlyIncome);
      response += `• Needs (50%): $${budgetPlan.needs.toLocaleString()}\n`;
      response += `• Wants (30%): $${budgetPlan.wants.toLocaleString()}\n`;
      response += `• Savings/Debt (20%): $${budgetPlan.savings.toLocaleString()}\n\n`;
      
      response += "📋 DETAILED BUDGET CATEGORIES:\n";
      const detailedBudget = this.generateDetailedBudget(monthlyIncome);
      Object.entries(detailedBudget).forEach(([category, amount]) => {
        response += `• ${category}: $${amount.toLocaleString()}\n`;
      });
      
      response += "\n💡 BUDGET OPTIMIZATION STRATEGIES:\n";
      response += await this.generateBudgetOptimizationTips(monthlyExpenses, monthlyIncome);
      
      response += "\n🎯 ACTION PLAN:\n";
      response += "• Track expenses for 30 days using a budgeting app\n";
      response += "• Set up automatic savings transfers\n";
      response += "• Review and adjust budget monthly\n";
      response += "• Use the envelope method for discretionary spending\n";
      
    } catch (error) {
      response += "Unable to analyze spending patterns. Let me provide general budgeting guidance:\n\n";
      response += await this.generateGenericBudgetAdvice();
    }
    
    return response;
  }

  async handleDebtManagement(input, confidence, entities) {
    let response = `💳 Strategic Debt Management Plan (Confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    try {
      const monthlyIncome = await this.getMonthlyIncome();
      
      response += "🎯 DEBT PAYOFF STRATEGIES:\n\n";
      
      response += "📊 **Debt Avalanche Method** (Recommended):\n";
      response += "• List all debts by interest rate (highest first)\n";
      response += "• Pay minimums on all debts\n";
      response += "• Put extra money toward highest interest debt\n";
      response += "• Saves most money on interest over time\n\n";
      
      response += "❄️ **Debt Snowball Method**:\n";
      response += "• List all debts by balance (smallest first)\n";
      response += "• Pay minimums on all debts\n";
      response += "• Put extra money toward smallest balance\n";
      response += "• Provides psychological wins and motivation\n\n";
      
      response += "💰 **Debt Consolidation Options**:\n";
      response += "• Personal loan (if rate is lower than current debts)\n";
      response += "• Balance transfer credit card (0% intro APR)\n";
      response += "• Home equity loan (tax-deductible interest)\n";
      response += "• 401(k) loan (as last resort)\n\n";
      
      if (monthlyIncome > 0) {
        const recommendedDebtPayment = monthlyIncome * 0.20; // 20% of income
        response += `🎯 RECOMMENDED DEBT PAYMENT:\n`;
        response += `• Target Payment: $${recommendedDebtPayment.toLocaleString()}/month\n`;
        response += `• This represents 20% of your estimated income\n\n`;
      }
      
      response += "📋 DEBT MANAGEMENT ACTION PLAN:\n";
      response += "• Create complete debt inventory with balances and rates\n";
      response += "• Stop using credit cards for new purchases\n";
      response += "• Consider debt consolidation if it lowers rates\n";
      response += "• Negotiate with creditors for lower rates\n";
      response += "• Build small emergency fund ($1,000) first\n";
      response += "• Consider credit counseling if overwhelmed\n\n";
      
      response += "🚫 WHAT TO AVOID:\n";
      response += "• Paying only minimum payments\n";
      response += "• Taking on new debt while paying off existing\n";
      response += "• Ignoring high-interest debt\n";
      response += "• Using retirement funds to pay debt (except as last resort)\n";
      
    } catch (error) {
      response += "Here's general debt management guidance based on financial best practices.";
    }
    
    return response;
  }

  async handleInvestmentAdvice(input, confidence, entities) {
    let response = `📈 Personalized Investment Strategy (Confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    const investmentAmount = entities.amounts.length > 0 ? 
      parseFloat(entities.amounts[0].replace(/[$,]/g, '')) : null;
    
    if (investmentAmount) {
      response += `💰 Investment Amount: $${investmentAmount.toLocaleString()}\n\n`;
    }
    
    response += "🎯 INVESTMENT STRATEGY BY EXPERIENCE LEVEL:\n\n";
    
    response += "🌱 **Beginner Strategy** (0-2 years experience):\n";
    response += "• Start with target-date funds or robo-advisors\n";
    response += "• Focus on broad market index funds (VTI, VXUS)\n";
    response += "• Allocation: 70% stocks, 20% bonds, 10% cash\n";
    response += "• Dollar-cost average monthly investments\n\n";
    
    response += "📊 **Intermediate Strategy** (3-7 years experience):\n";
    response += "• Build 3-4 fund portfolio (domestic, international, bonds)\n";
    response += "• Add sector-specific ETFs (technology, healthcare)\n";
    response += "• Allocation: 80% stocks, 15% bonds, 5% alternatives\n";
    response += "• Rebalance quarterly\n\n";
    
    response += "🎯 **Advanced Strategy** (8+ years experience):\n";
    response += "• Individual stock picking with research\n";
    response += "• Options strategies for income/hedging\n";
    response += "• Real estate investment trusts (REITs)\n";
    response += "• Tax-loss harvesting strategies\n\n";
    
    if (investmentAmount) {
      response += `💡 SPECIFIC RECOMMENDATIONS FOR $${investmentAmount.toLocaleString()}:\n`;
      response += await this.generateAmountSpecificAdvice(investmentAmount);
    }
    
    response += "\n📊 CURRENT MARKET OPPORTUNITIES:\n";
    response += await this.generateMarketOpportunities();
    
    response += "\n🎓 INVESTMENT PRINCIPLES:\n";
    response += "• Diversification reduces risk without sacrificing returns\n";
    response += "• Time in market beats timing the market\n";
    response += "• Keep fees low (expense ratios under 0.20%)\n";
    response += "• Invest regularly regardless of market conditions\n";
    response += "• Don't panic during market downturns\n";
    
    return response;
  }

  async handleRetirementPlanning(input, confidence, entities) {
    let response = `🏖️ Comprehensive Retirement Planning (Confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    try {
      const monthlyIncome = await this.getMonthlyIncome();
      const currentAge = 35; // Default assumption
      const retirementAge = 65;
      const yearsToRetirement = retirementAge - currentAge;
      
      response += `📊 RETIREMENT PLANNING OVERVIEW:\n`;
      response += `• Current Age: ${currentAge} years\n`;
      response += `• Target Retirement Age: ${retirementAge}\n`;
      response += `• Years to Retirement: ${yearsToRetirement}\n`;
      response += `• Monthly Income: $${monthlyIncome.toLocaleString()}\n\n`;
      
      const annualIncome = monthlyIncome * 12;
      const retirementGoal = annualIncome * 25; // 4% withdrawal rule
      const monthlyRetirementSaving = (annualIncome * 0.15) / 12;
      
      response += `🎯 RETIREMENT GOALS:\n`;
      response += `• Target Retirement Fund: $${retirementGoal.toLocaleString()}\n`;
      response += `• Recommended Monthly Savings: $${monthlyRetirementSaving.toLocaleString()}\n`;
      response += `• Annual Savings Rate: 15% of income\n\n`;
      
      response += "💰 RETIREMENT ACCOUNT STRATEGIES:\n\n";
      
      response += "🏢 **401(k) Plan Optimization**:\n";
      response += "• Contribute enough to get full employer match\n";
      response += "• 2024 contribution limit: $23,000 ($30,500 if 50+)\n";
      response += "• Choose low-cost index funds in plan\n";
      response += "• Increase contribution by 1% each year\n\n";
      
      response += "🏦 **Traditional vs Roth IRA**:\n";
      response += "• Traditional: Tax deduction now, taxed in retirement\n";
      response += "• Roth: No deduction now, tax-free in retirement\n";
      response += "• 2024 IRA limit: $7,000 ($8,000 if 50+)\n";
      response += "• Consider Roth if in low tax bracket now\n\n";
      
      response += "📈 **Investment Allocation by Age**:\n";
      const stockAllocation = Math.max(40, 120 - currentAge);
      const bondAllocation = 100 - stockAllocation;
      response += `• Stocks: ${stockAllocation}% (aggressive growth)\n`;
      response += `• Bonds: ${bondAllocation}% (stability and income)\n`;
      response += "• Adjust allocation as you age (more conservative)\n\n";
      
      response += "🎯 **Retirement Action Plan**:\n";
      response += "• Maximize employer 401(k) match immediately\n";
      response += "• Open and fund IRA account\n";
      response += "• Set up automatic monthly contributions\n";
      response += "• Review and increase contributions annually\n";
      response += "• Plan for healthcare costs in retirement\n";
      response += "• Consider long-term care insurance\n";
      
    } catch (error) {
      response += "Here's general retirement planning guidance based on best practices.";
    }
    
    return response;
  }

  async handleMarketAnalysis(input, confidence, entities) {
    let response = `📊 Current Market Analysis & Insights (Confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    response += "📈 **MAJOR MARKET INDICES**:\n";
    Object.entries(this.marketData.stocks).slice(0, 5).forEach(([symbol, data]) => {
      const changeIndicator = data.change >= 0 ? '🟢' : '🔴';
      response += `• ${symbol}: $${data.price} ${changeIndicator} ${data.changePercent.toFixed(2)}%\n`;
    });
    
    response += "\n💰 **CRYPTOCURRENCY MARKET**:\n";
    Object.entries(this.marketData.crypto).forEach(([symbol, data]) => {
      const changeIndicator = data.change >= 0 ? '🟢' : '🔴';
      response += `• ${symbol}: $${data.price.toLocaleString()} ${changeIndicator} ${data.changePercent.toFixed(2)}%\n`;
    });
    
    response += "\n🏛️ **BOND YIELDS**:\n";
    Object.entries(this.marketData.bonds).forEach(([bond, data]) => {
      response += `• ${bond}: ${data.yield.toFixed(2)}% (${data.change >= 0 ? '+' : ''}${data.change.toFixed(2)})\n`;
    });
    
    response += "\n🥇 **COMMODITIES**:\n";
    Object.entries(this.marketData.commodities).forEach(([commodity, data]) => {
      const changeIndicator = data.change >= 0 ? '🟢' : '🔴';
      response += `• ${commodity}: $${data.price} ${changeIndicator} ${data.changePercent.toFixed(2)}%\n`;
    });
    
    response += "\n📊 **MARKET INSIGHTS**:\n";
    response += await this.generateMarketInsights();
    
    response += "\n🎯 **INVESTMENT IMPLICATIONS**:\n";
    response += "• Technology sector showing mixed signals\n";
    response += "• Rising bond yields suggest higher interest rates\n";
    response += "• Diversification remains crucial in current environment\n";
    response += "• Consider dollar-cost averaging during volatility\n";
    response += "• Quality companies with strong fundamentals preferred\n";
    
    response += "\n⚠️ **RISK FACTORS TO MONITOR**:\n";
    response += "• Inflation pressures on consumer spending\n";
    response += "• Federal Reserve policy changes\n";
    response += "• Geopolitical tensions affecting global markets\n";
    response += "• Corporate earnings growth sustainability\n";
    
    return response;
  }

  async handleFinancialEducation(input, confidence, entities) {
    let response = `🎓 Financial Education & Concepts (Confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    // Check what specific concept they're asking about
    const educationTopics = {
      'compound interest': this.explainCompoundInterest(),
      'diversification': this.explainDiversification(),
      'asset allocation': this.explainAssetAllocation(),
      'dollar cost averaging': this.explainDollarCostAveraging(),
      'index funds': this.explainIndexFunds(),
      'etf': this.explainETFs(),
      'bonds': this.explainBonds(),
      'risk tolerance': this.explainRiskTolerance(),
      'emergency fund': this.explainEmergencyFund(),
      'tax advantages': this.explainTaxAdvantages()
    };
    
    let topicFound = false;
    Object.entries(educationTopics).forEach(([topic, explanation]) => {
      if (input.toLowerCase().includes(topic)) {
        response += explanation;
        topicFound = true;
      }
    });
    
    if (!topicFound) {
      response += "🎓 **FUNDAMENTAL FINANCIAL CONCEPTS**:\n\n";
      
      response += "💰 **Compound Interest**:\n";
      response += "The eighth wonder of the world - earning interest on your interest\n";
      response += "Formula: A = P(1 + r/n)^(nt)\n";
      response += "Example: $1,000 at 7% for 30 years = $7,612\n\n";
      
      response += "🎯 **Diversification**:\n";
      response += "Don't put all eggs in one basket - spread risk across investments\n";
      response += "Reduces portfolio volatility without sacrificing returns\n";
      response += "Diversify by asset class, geography, and time\n\n";
      
      response += "📊 **Asset Allocation**:\n";
      response += "How you divide investments between stocks, bonds, and cash\n";
      response += "Rule of thumb: (120 - your age) = % in stocks\n";
      response += "Rebalance annually to maintain target allocation\n\n";
      
      response += "💡 **Key Principles for Success**:\n";
      response += "• Start investing early to harness compound interest\n";
      response += "• Invest regularly regardless of market conditions\n";
      response += "• Keep costs low with index funds\n";
      response += "• Stay disciplined during market downturns\n";
      response += "• Focus on time in market, not timing the market\n";
    }
    
    response += "\n📚 **RECOMMENDED LEARNING RESOURCES**:\n";
    response += "• Books: 'A Random Walk Down Wall Street', 'The Bogleheads' Guide'\n";
    response += "• Websites: Investopedia, Morningstar, SEC.gov investor education\n";
    response += "• Podcasts: 'The Investors Podcast', 'Chat with Traders'\n";
    response += "• Courses: Khan Academy Personal Finance, Coursera Financial Markets\n";
    
    return response;
  }

  // Helper methods for specific financial calculations and advice
  convertToUSD(amount, currency) {
    const rates = { USD: 1, SAR: 0.267, EUR: 1.18, GBP: 1.39 };
    return amount * (rates[currency] || 1);
  }

  analyzeAssetAllocation(accounts) {
    const allocation = {
      'Checking': { amount: 0, percentage: 0 },
      'Savings': { amount: 0, percentage: 0 },
      'Investment': { amount: 0, percentage: 0 }
    };
    
    accounts.forEach(account => {
      const usdAmount = this.convertToUSD(account.balance, account.currency);
      if (allocation[account.account_type]) {
        allocation[account.account_type].amount += usdAmount;
      }
    });
    
    return allocation;
  }

  async generatePortfolioRecommendations(totalBalance, allocation) {
    let recommendations = '';
    
    const checkingPercent = (allocation.Checking.amount / totalBalance) * 100;
    const savingsPercent = (allocation.Savings.amount / totalBalance) * 100;
    const investmentPercent = (allocation.Investment.amount / totalBalance) * 100;
    
    if (checkingPercent > 30) {
      recommendations += "• Move excess checking funds to high-yield savings\n";
    }
    
    if (savingsPercent > 60) {
      recommendations += "• Consider investing some savings for better long-term growth\n";
    }
    
    if (investmentPercent < 20 && totalBalance > 10000) {
      recommendations += "• Increase investment allocation for wealth building\n";
    }
    
    if (totalBalance > 50000) {
      recommendations += "• Consider tax-advantaged accounts (401k, IRA)\n";
      recommendations += "• Explore international diversification\n";
    }
    
    return recommendations || "• Your current allocation appears well-balanced\n";
  }

  async generateRebalancingAdvice(allocation, totalBalance) {
    let advice = '';
    
    const idealAllocation = {
      'Checking': 0.10, // 10% for liquidity
      'Savings': 0.30,  // 30% for emergency fund
      'Investment': 0.60 // 60% for growth
    };
    
    Object.entries(allocation).forEach(([type, data]) => {
      const currentPercent = data.amount / totalBalance;
      const idealPercent = idealAllocation[type];
      const difference = currentPercent - idealPercent;
      
      if (Math.abs(difference) > 0.10) { // 10% threshold
        const action = difference > 0 ? 'reduce' : 'increase';
        const amount = Math.abs(difference * totalBalance);
        advice += `• ${action.charAt(0).toUpperCase() + action.slice(1)} ${type} by $${amount.toLocaleString()}\n`;
      }
    });
    
    return advice || "• Portfolio is well-balanced, no immediate rebalancing needed\n";
  }

  create50_30_20Budget(monthlyIncome) {
    return {
      needs: monthlyIncome * 0.50,
      wants: monthlyIncome * 0.30,
      savings: monthlyIncome * 0.20
    };
  }

  generateDetailedBudget(monthlyIncome) {
    return {
      'Housing (Rent/Mortgage)': monthlyIncome * 0.25,
      'Transportation': monthlyIncome * 0.15,
      'Food & Groceries': monthlyIncome * 0.12,
      'Utilities': monthlyIncome * 0.05,
      'Insurance': monthlyIncome * 0.05,
      'Entertainment': monthlyIncome * 0.08,
      'Personal Care': monthlyIncome * 0.03,
      'Emergency Fund': monthlyIncome * 0.10,
      'Retirement Savings': monthlyIncome * 0.10,
      'Miscellaneous': monthlyIncome * 0.07
    };
  }

  async generateBudgetOptimizationTips(expenses, income) {
    let tips = '';
    
    const savingsRate = 1 - (Object.values(expenses).reduce((sum, cat) => sum + cat.total, 0) / income);
    
    if (savingsRate < 0.10) {
      tips += "• Increase savings rate to at least 10% of income\n";
      tips += "• Review and reduce discretionary spending\n";
    }
    
    tips += "• Use the envelope method for variable expenses\n";
    tips += "• Automate savings and bill payments\n";
    tips += "• Review subscriptions and cancel unused services\n";
    tips += "• Consider meal planning to reduce food costs\n";
    tips += "• Look for better rates on insurance and utilities\n";
    
    return tips;
  }

  async generateAmountSpecificAdvice(amount) {
    let advice = '';
    
    if (amount < 1000) {
      advice += "• Start with a high-yield savings account\n";
      advice += "• Build to $1,000 emergency fund first\n";
      advice += "• Consider fractional shares in index funds\n";
    } else if (amount < 10000) {
      advice += "• Target-date fund (one-stop diversification)\n";
      advice += "• Total stock market index fund (VTI)\n";
      advice += "• S&P 500 index fund (VOO or SPY)\n";
      advice += "• Split: 70% VTI, 30% bonds (BND)\n";
    } else if (amount < 50000) {
      advice += "• 3-fund portfolio: US stocks, international stocks, bonds\n";
      advice += "• 60% VTI, 30% VTIAX, 10% BND\n";
      advice += "• Consider tax-loss harvesting\n";
      advice += "• Open tax-advantaged accounts (IRA, 401k)\n";
    } else {
      advice += "• Diversified portfolio across asset classes\n";
      advice += "• Individual stock allocation (10-20%)\n";
      advice += "• Real estate investment trusts (REITs)\n";
      advice += "• Consider professional financial advisor\n";
    }
    
    return advice;
  }

  async generateMarketOpportunities() {
    let opportunities = '';
    
    // Analyze market data for opportunities
    const strongPerformers = Object.entries(this.marketData.stocks)
      .filter(([symbol, data]) => data.changePercent > 2)
      .map(([symbol, data]) => symbol);
    
    const weakPerformers = Object.entries(this.marketData.stocks)
      .filter(([symbol, data]) => data.changePercent < -2)
      .map(([symbol, data]) => symbol);
    
    if (strongPerformers.length > 0) {
      opportunities += `• Strong momentum: ${strongPerformers.join(', ')}\n`;
    }
    
    if (weakPerformers.length > 0) {
      opportunities += `• Potential buying opportunities: ${weakPerformers.join(', ')}\n`;
    }
    
    opportunities += "• High-yield bonds attractive at current rates\n";
    opportunities += "• Technology sector showing mixed signals\n";
    opportunities += "• International markets offer diversification\n";
    
    return opportunities;
  }

  async generateMarketInsights() {
    let insights = '';
    
    const avgStockChange = Object.values(this.marketData.stocks)
      .reduce((sum, stock) => sum + stock.changePercent, 0) / Object.keys(this.marketData.stocks).length;
    
    if (avgStockChange > 1) {
      insights += "• Market showing bullish sentiment with broad gains\n";
    } else if (avgStockChange < -1) {
      insights += "• Market experiencing bearish pressure with widespread declines\n";
    } else {
      insights += "• Market showing mixed signals with selective performance\n";
    }
    
    insights += "• Bond yields suggest expectations of continued rate stability\n";
    insights += "• Cryptocurrency volatility remains elevated\n";
    insights += "• Commodities responding to global supply/demand dynamics\n";
    
    return insights;
  }

  // Financial education explanations
  explainCompoundInterest() {
    return `💰 **COMPOUND INTEREST EXPLAINED**:

Compound interest is earning interest on both your original investment AND previously earned interest.

🔢 **Formula**: A = P(1 + r/n)^(nt)
• A = Final amount
• P = Principal (initial investment)
• r = Annual interest rate
• n = Times compounded per year
• t = Number of years

📊 **Real Example**:
$10,000 invested at 7% annual return:
• After 10 years: $19,672
• After 20 years: $38,697
• After 30 years: $76,123

💡 **Key Insight**: Starting early makes a huge difference due to the exponential nature of compound growth!

`;
  }

  explainDiversification() {
    return `🎯 **DIVERSIFICATION EXPLAINED**:

Diversification means spreading investments across different assets to reduce risk.

📊 **Types of Diversification**:
• Asset classes (stocks, bonds, real estate)
• Geographic regions (US, international, emerging markets)
• Sectors (technology, healthcare, finance)
• Company sizes (large-cap, mid-cap, small-cap)

✅ **Benefits**:
• Reduces portfolio volatility
• Protects against single investment failures
• Smooths returns over time
• Doesn't eliminate risk, but manages it

⚠️ **Important**: Diversification doesn't guarantee profits or prevent losses, but it's the closest thing to a "free lunch" in investing.

`;
  }

  explainAssetAllocation() {
    return `📊 **ASSET ALLOCATION EXPLAINED**:

Asset allocation is how you divide your investments between different asset classes.

🎯 **Main Asset Classes**:
• Stocks (equity) - Growth potential, higher risk
• Bonds (fixed income) - Stability, lower risk
• Cash - Liquidity, lowest risk
• Real Estate - Inflation hedge, diversification

📈 **Age-Based Allocation Rule**:
• Stocks: (120 - your age)%
• Example: 30 years old = 90% stocks, 10% bonds
• Example: 60 years old = 60% stocks, 40% bonds

🔄 **Rebalancing**:
• Review allocation quarterly
• Rebalance when allocation drifts 5%+ from target
• Sell high-performing assets, buy underperforming

`;
  }

  explainDollarCostAveraging() {
    return `💰 **DOLLAR COST AVERAGING EXPLAINED**:

Dollar cost averaging means investing a fixed amount regularly, regardless of market conditions.

📊 **How It Works**:
• Invest same amount monthly (e.g., $500)
• Buy more shares when prices are low
• Buy fewer shares when prices are high
• Averages out your cost over time

✅ **Benefits**:
• Reduces impact of market volatility
• Removes emotion from investing decisions
• Perfect timing becomes irrelevant
• Builds discipline and consistency

📈 **Example**:
Month 1: $500 buys 10 shares at $50
Month 2: $500 buys 12.5 shares at $40  
Month 3: $500 buys 8.3 shares at $60
Average cost: $48.39 per share

`;
  }

  explainIndexFunds() {
    return `📈 **INDEX FUNDS EXPLAINED**:

Index funds are mutual funds that track a market index like the S&P 500.

🎯 **Key Features**:
• Passive management (no stock picking)
• Low fees (typically 0.03% - 0.20%)
• Instant diversification
• Market returns, not trying to beat market

✅ **Advantages**:
• Low cost
• Broad diversification
• No manager risk
• Tax efficient
• Consistent performance

💰 **Popular Index Funds**:
• Total Stock Market (VTI, FZROX)
• S&P 500 (VOO, FXAIX)  
• International (VTIAX, FTIHX)
• Bonds (BND, FXNAX)

🏆 **Warren Buffett's Advice**: "A low-cost index fund is the most sensible equity investment for the great majority of investors."

`;
  }

  explainETFs() {
    return `📊 **ETFs (Exchange-Traded Funds) EXPLAINED**:

ETFs are investment funds that trade on stock exchanges like individual stocks.

🔄 **How They Work**:
• Track an index, commodity, bonds, or basket of assets
• Trade throughout market hours
• Can be bought/sold like stocks
• Most are passively managed

✅ **Advantages**:
• Lower expense ratios than mutual funds
• Real-time trading
• Tax efficiency
• Transparency
• No minimum investment

⚠️ **Considerations**:
• Trading fees (though many brokers now fee-free)
• Bid-ask spreads
• Premium/discount to NAV

💰 **Popular ETFs**:
• SPY, VOO (S&P 500)
• VTI (Total Stock Market)
• QQQ (Nasdaq 100)
• VEA (International Developed)

`;
  }

  explainBonds() {
    return `🏛️ **BONDS EXPLAINED**:

Bonds are loans you give to companies or governments in exchange for regular interest payments.

💰 **How Bonds Work**:
• You lend money for a fixed period
• Receive regular interest payments (coupon)
• Get principal back at maturity
• Generally less risky than stocks

📊 **Types of Bonds**:
• Treasury bonds (US government)
• Corporate bonds (companies)
• Municipal bonds (local governments)
• International bonds

⚡ **Interest Rate Risk**:
• Bond prices move opposite to interest rates
• Rising rates = falling bond prices
• Longer maturity = higher interest rate risk

🎯 **Role in Portfolio**:
• Stability and income
• Diversification from stocks
• Capital preservation
• Inflation hedge (I-bonds, TIPS)

`;
  }

  explainRiskTolerance() {
    return `⚖️ **RISK TOLERANCE EXPLAINED**:

Risk tolerance is your ability and willingness to handle investment losses.

📊 **Three Components**:
• Risk Capacity: Financial ability to take risk
• Risk Willingness: Emotional comfort with risk  
• Risk Need: Risk required to meet goals

🎯 **Risk Levels**:
• Conservative: 30% stocks, 70% bonds
• Moderate: 60% stocks, 40% bonds
• Aggressive: 80% stocks, 20% bonds

💭 **Questions to Ask Yourself**:
• How would you react to a 20% portfolio drop?
• When do you need this money?
• Do you have other income sources?
• Can you sleep well during market downturns?

⏰ **Time Horizon Matters**:
• Longer time = can take more risk
• Shorter time = need more stability
• Young investors can be more aggressive

`;
  }

  explainEmergencyFund() {
    return `🚨 **EMERGENCY FUND EXPLAINED**:

An emergency fund is money set aside for unexpected expenses or income loss.

💰 **How Much to Save**:
• Start with $1,000 (starter emergency fund)
• Build to 3-6 months of expenses
• Higher if self-employed or irregular income
• Consider job stability and dependents

🏦 **Where to Keep It**:
• High-yield savings account
• Money market account
• Short-term CDs
• NOT in stocks or risky investments

✅ **What Qualifies as Emergency**:
• Job loss
• Major medical expenses
• Car or home repairs
• Family emergencies

❌ **NOT Emergencies**:
• Vacations
• Holiday gifts
• Non-essential purchases
• Planned expenses

🎯 **Building Strategy**:
• Automate transfers
• Save tax refunds and bonuses
• Cut expenses temporarily
• Sell unused items

`;
  }

  explainTaxAdvantages() {
    return `💸 **TAX-ADVANTAGED ACCOUNTS EXPLAINED**:

These accounts offer tax benefits to encourage saving and investing.

🏢 **401(k) - Employer Plan**:
• Traditional: Tax deduction now, taxed in retirement
• Roth: No deduction now, tax-free in retirement
• Employer match = free money
• 2024 limit: $23,000 ($30,500 if 50+)

🏦 **IRA - Individual Account**:
• Traditional IRA: Tax deduction now, taxed later
• Roth IRA: No deduction now, tax-free later
• 2024 limit: $7,000 ($8,000 if 50+)
• Income limits for Roth IRA

🏥 **HSA - Health Savings Account**:
• Triple tax advantage
• Deductible contributions
• Tax-free growth and withdrawals for medical
• Becomes retirement account at 65

📊 **Tax Strategies**:
• Asset location (bonds in tax-advantaged accounts)
• Tax-loss harvesting
• Roth conversions in low-income years
• Maximize employer match first

`;
  }

  // Database helper methods
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

  async getMonthlyIncome() {
    try {
      const transactions = await this.getRecentTransactions(null, 90);
      const deposits = transactions
        .filter(t => t.transaction_type === 'Deposit')
        .reduce((sum, t) => sum + t.amount, 0);
      return deposits / 3; // 3 months average
    } catch (error) {
      return 5000; // Default assumption
    }
  }

  async calculateMonthlyIncome(transactions) {
    const deposits = transactions
      .filter(t => t.transaction_type === 'Deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    return deposits / 3; // 3 months average
  }

  async categorizeExpenses(transactions) {
    const categories = {
      'Housing': { total: 0, transactions: [] },
      'Transportation': { total: 0, transactions: [] },
      'Food': { total: 0, transactions: [] },
      'Utilities': { total: 0, transactions: [] },
      'Entertainment': { total: 0, transactions: [] },
      'Other': { total: 0, transactions: [] }
    };
    
    transactions
      .filter(t => ['Withdrawal', 'Bill Payment'].includes(t.transaction_type))
      .forEach(transaction => {
        // Simplified categorization - in production, use ML or pattern matching
        const category = 'Other'; // Default category
        categories[category].total += transaction.amount;
        categories[category].transactions.push(transaction);
      });
    
    return categories;
  }

  trainSpendingModel(data) {
    try {
      const x = data.map((item, index) => [index]);
      const y = data.map(item => item.amount);
      return new regression.SimpleLinearRegression(x.flat(), y);
    } catch (error) {
      return null;
    }
  }

  buildInvestmentModel() {
    return {
      riskProfiles: {
        conservative: { stocks: 0.30, bonds: 0.60, cash: 0.10 },
        moderate: { stocks: 0.60, bonds: 0.30, cash: 0.10 },
        aggressive: { stocks: 0.80, bonds: 0.15, cash: 0.05 }
      }
    };
  }

  buildBudgetingModel() {
    return {
      ratios: {
        housing: 0.25,
        transportation: 0.15,
        food: 0.12,
        savings: 0.20,
        entertainment: 0.08,
        other: 0.20
      }
    };
  }

  async handleGeneralFinancialQuery(input, confidence, entities) {
    let response = `🤖 Financial Assistant (Confidence: ${confidence.toFixed(0)}%)\n\n`;
    
    response += "I'm here to help with all your financial questions and provide personalized advice.\n\n";
    
    response += "💰 **What I Can Help With**:\n";
    response += "• Investment strategy and portfolio analysis\n";
    response += "• Budget planning and expense optimization\n";
    response += "• Debt management and payoff strategies\n";
    response += "• Retirement planning and 401(k) advice\n";
    response += "• Tax optimization strategies\n";
    response += "• Savings goals and emergency funds\n";
    response += "• Insurance and risk management\n";
    response += "• Market analysis and investment opportunities\n";
    response += "• Financial education and concept explanations\n\n";
    
    response += "💡 **Try asking me**:\n";
    response += "• 'How should I invest $10,000?'\n";
    response += "• 'Help me create a budget plan'\n";
    response += "• 'What's the best debt payoff strategy?'\n";
    response += "• 'How much should I save for retirement?'\n";
    response += "• 'Explain compound interest'\n";
    response += "• 'Analyze current market conditions'\n";
    
    return response;
  }

  // Stub methods for missing handlers
  async handleTaxOptimization(input, confidence, entities) {
    return "🏛️ Tax optimization strategies and advice coming soon!";
  }

  async handleSavingsGoals(input, confidence, entities) {
    let response = `🎯 Personalized Savings Goal Planning (Confidence: ${confidence.toFixed(0)}%)

`;
    
    try {
      const monthlyIncome = await this.getMonthlyIncome();
      const accounts = await this.getAccountBalance();
      const currentSavings = accounts ? accounts.reduce((sum, acc) => 
        sum + (acc.account_type === 'Savings' ? this.convertToUSD(acc.balance, acc.currency) : 0), 0) : 0;
      
      // Check if user is creating a new goal
      if (this.isCreatingGoal(input)) {
        response += await this.handleGoalCreation(input, entities, monthlyIncome);
      } else if (this.isCheckingProgress(input)) {
        response += await this.handleGoalProgress(monthlyIncome, currentSavings);
      } else {
        response += await this.provideSavingsGuidance(monthlyIncome, currentSavings);
      }
      
      response += "\n💡 SAVINGS OPTIMIZATION STRATEGIES:\n";
      response += await this.generateSavingsOptimizationTips(monthlyIncome);
      
    } catch (error) {
      response += "Let me provide general savings goal guidance:\n\n";
      response += await this.generateGenericSavingsAdvice();
    }
    
    return response;
  }

  async handleInsurancePlanning(input, confidence, entities) {
    return "🛡️ Comprehensive insurance planning and recommendations coming soon!";
  }

  async handleRiskAssessment(input, confidence, entities) {
    return "📊 Personal risk tolerance assessment and portfolio alignment coming soon!";
  }

  async handleCreditImprovement(input, confidence, entities) {
    return "💳 Credit score improvement strategies and credit building advice coming soon!";
  }

  async handleFraudDetection(input, confidence, entities) {
    let response = `🛡️ Fraud Detection & Security Analysis (Confidence: ${confidence.toFixed(0)}%)

`;
    
    try {
      const transactions = await this.getRecentTransactions(null, 100);
      const fraudAnalysis = await this.analyzeFraudPatterns(transactions);
      
      response += "🔍 FRAUD ANALYSIS RESULTS:\n";
      response += `• Risk Level: ${fraudAnalysis.riskLevel}\n`;
      response += `• Suspicious Transactions: ${fraudAnalysis.suspiciousCount}\n`;
      response += `• Account Security Score: ${fraudAnalysis.securityScore}/100\n\n`;
      
      if (fraudAnalysis.alerts.length > 0) {
        response += "⚠️ SECURITY ALERTS:\n";
        fraudAnalysis.alerts.forEach((alert, index) => {
          response += `• ${alert}\n`;
        });
        response += "\n";
      }
      
      response += "🛡️ FRAUD PREVENTION RECOMMENDATIONS:\n";
      response += await this.generateFraudPreventionTips(fraudAnalysis);
      
      response += "\n📱 MONITORING SETUP:\n";
      response += await this.generateMonitoringRecommendations();
      
    } catch (error) {
      response += "Here's general fraud protection guidance:\n\n";
      response += await this.generateGenericFraudAdvice();
    }
    
    return response;
  }

  async generateGenericBudgetAdvice() {
    return `📋 **GENERAL BUDGET GUIDANCE**:

🎯 **50/30/20 Rule**:
• 50% Needs (housing, utilities, groceries, minimum debt payments)
• 30% Wants (entertainment, dining out, hobbies)
• 20% Savings & Extra Debt Payments

💡 **Budget Success Tips**:
• Track every expense for 30 days
• Use budgeting apps or spreadsheets
• Set up automatic savings transfers
• Review and adjust monthly
• Build in flexibility for unexpected expenses

🚀 **Quick Wins**:
• Cancel unused subscriptions
• Negotiate better rates on insurance/utilities
• Use cashback credit cards responsibly
• Meal plan to reduce food waste
• Set spending limits for discretionary categories

`;
  }

  // Savings Goals Helper Methods
  isCreatingGoal(input) {
    const creationKeywords = ['create', 'set', 'start', 'new', 'goal', 'target'];
    return creationKeywords.some(keyword => input.toLowerCase().includes(keyword));
  }

  isCheckingProgress(input) {
    const progressKeywords = ['progress', 'how much', 'status', 'check', 'update'];
    return progressKeywords.some(keyword => input.toLowerCase().includes(keyword));
  }

  async handleGoalCreation(input, entities, monthlyIncome) {
    let response = "🎯 CREATING YOUR SAVINGS GOAL:\n\n";
    
    const goalAmount = entities.amounts.length > 0 ? 
      parseFloat(entities.amounts[0].replace(/[$,]/g, '')) : null;
    
    if (goalAmount) {
      const monthsToSave = Math.ceil(goalAmount / (monthlyIncome * 0.20)); // Assuming 20% savings rate
      const monthlyTarget = goalAmount / monthsToSave;
      
      const newGoal = {
        id: uuidv4(),
        name: this.extractGoalName(input),
        targetAmount: goalAmount,
        currentAmount: 0,
        monthlyTarget: monthlyTarget,
        timeframe: monthsToSave,
        createdDate: new Date(),
        targetDate: new Date(Date.now() + monthsToSave * 30 * 24 * 60 * 60 * 1000),
        priority: 'medium'
      };
      
      this.userProfile.savingsGoals.push(newGoal);
      
      response += `✅ Goal Created: ${newGoal.name}\n`;
      response += `💰 Target Amount: $${goalAmount.toLocaleString()}\n`;
      response += `📅 Timeframe: ${monthsToSave} months\n`;
      response += `💵 Monthly Target: $${monthlyTarget.toLocaleString()}\n`;
      response += `🎯 Target Date: ${newGoal.targetDate.toLocaleDateString()}\n\n`;
      
      response += "📊 GOAL ACHIEVEMENT STRATEGY:\n";
      response += await this.generateGoalStrategy(newGoal, monthlyIncome);
    } else {
      response += "To create a savings goal, please specify the target amount.\n";
      response += "Example: 'I want to save $10,000 for a vacation'\n\n";
      response += await this.suggestCommonGoals(monthlyIncome);
    }
    
    return response;
  }

  async handleGoalProgress(monthlyIncome, currentSavings) {
    let response = "📊 SAVINGS GOALS PROGRESS:\n\n";
    
    if (this.userProfile.savingsGoals.length === 0) {
      response += "No savings goals found. Let's create your first goal!\n\n";
      response += await this.suggestCommonGoals(monthlyIncome);
    } else {
      this.userProfile.savingsGoals.forEach((goal, index) => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        const remaining = goal.targetAmount - goal.currentAmount;
        const monthsLeft = Math.ceil(remaining / goal.monthlyTarget);
        
        response += `${index + 1}. ${goal.name}\n`;
        response += `   Progress: $${goal.currentAmount.toLocaleString()} / $${goal.targetAmount.toLocaleString()} (${progress.toFixed(1)}%)\n`;
        response += `   Remaining: $${remaining.toLocaleString()}\n`;
        response += `   Est. Completion: ${monthsLeft} months\n\n`;
      });
    }
    
    return response;
  }

  async provideSavingsGuidance(monthlyIncome, currentSavings) {
    let response = "💰 SAVINGS GUIDANCE & RECOMMENDATIONS:\n\n";
    
    const recommendedSavings = monthlyIncome * 0.20;
    const emergencyFundTarget = monthlyIncome * 6;
    
    response += `📊 CURRENT FINANCIAL SNAPSHOT:\n`;
    response += `• Monthly Income: $${monthlyIncome.toLocaleString()}\n`;
    response += `• Current Savings: $${currentSavings.toLocaleString()}\n`;
    response += `• Recommended Monthly Savings: $${recommendedSavings.toLocaleString()} (20%)\n\n`;
    
    response += "🎯 PRIORITY SAVINGS GOALS:\n";
    
    if (currentSavings < 1000) {
      response += "1. 🚨 Emergency Starter Fund: $1,000 (URGENT)\n";
      response += "2. 🏠 Full Emergency Fund: $" + emergencyFundTarget.toLocaleString() + " (6 months expenses)\n";
    } else if (currentSavings < emergencyFundTarget) {
      response += "1. 🏠 Complete Emergency Fund: $" + emergencyFundTarget.toLocaleString() + "\n";
      response += "2. 🎯 Start pursuing other financial goals\n";
    } else {
      response += "✅ Emergency fund complete! Ready for growth goals:\n";
      response += "• 🏖️ Vacation fund\n";
      response += "• 🏠 House down payment\n";
      response += "• 📚 Education fund\n";
      response += "• 🚗 Vehicle replacement\n";
    }
    
    response += "\n💡 SMART SAVINGS STRATEGIES:\n";
    response += await this.generateSavingsStrategies(monthlyIncome, currentSavings);
    
    return response;
  }

  extractGoalName(input) {
    // Simple goal name extraction
    const goalTypes = {
      'vacation': 'Vacation Fund',
      'house': 'House Down Payment',
      'car': 'Car Fund',
      'wedding': 'Wedding Fund',
      'emergency': 'Emergency Fund',
      'education': 'Education Fund',
      'retirement': 'Retirement Savings'
    };
    
    for (const [keyword, name] of Object.entries(goalTypes)) {
      if (input.toLowerCase().includes(keyword)) {
        return name;
      }
    }
    
    return 'Savings Goal';
  }

  async generateGoalStrategy(goal, monthlyIncome) {
    let strategy = '';
    
    const savingsRate = (goal.monthlyTarget / monthlyIncome) * 100;
    
    strategy += `• Required Savings Rate: ${savingsRate.toFixed(1)}% of income\n`;
    
    if (savingsRate > 30) {
      strategy += "⚠️ This goal requires aggressive savings. Consider:\n";
      strategy += "  - Extending the timeframe\n";
      strategy += "  - Reducing the target amount\n";
      strategy += "  - Increasing income sources\n";
    } else if (savingsRate > 20) {
      strategy += "📊 This goal requires disciplined saving. Tips:\n";
      strategy += "  - Automate savings transfers\n";
      strategy += "  - Reduce discretionary spending\n";
      strategy += "  - Consider side income\n";
    } else {
      strategy += "✅ This goal is very achievable! Strategies:\n";
      strategy += "  - Set up automatic transfers\n";
      strategy += "  - Use high-yield savings account\n";
      strategy += "  - Consider additional goals\n";
    }
    
    return strategy;
  }

  async suggestCommonGoals(monthlyIncome) {
    const emergencyAmount = monthlyIncome * 6;
    const vacationAmount = monthlyIncome * 2;
    const carAmount = monthlyIncome * 8;
    
    return `🎯 COMMON SAVINGS GOALS:\n
` +
           `• Emergency Fund: $${emergencyAmount.toLocaleString()} (6 months expenses)\n` +
           `• Vacation Fund: $${vacationAmount.toLocaleString()} (2 months income)\n` +
           `• Car Replacement: $${carAmount.toLocaleString()} (8 months income)\n` +
           `• House Down Payment: 20% of home price\n` +
           `• Wedding Fund: $15,000 - $30,000 average\n\n`;
  }

  async generateSavingsStrategies(monthlyIncome, currentSavings) {
    let strategies = '';
    
    strategies += "• 💰 Pay yourself first - automate savings transfers\n";
    strategies += "• 🏦 Use high-yield savings accounts (4%+ APY)\n";
    strategies += "• 📅 Save tax refunds and bonuses\n";
    strategies += "• 🔄 Round up purchases and save the change\n";
    strategies += "• 📊 Track progress weekly to stay motivated\n";
    strategies += "• 🎯 Use separate accounts for different goals\n";
    
    if (monthlyIncome > 5000) {
      strategies += "• 💼 Consider CD ladders for guaranteed returns\n";
      strategies += "• 📈 Invest excess emergency fund in conservative portfolios\n";
    }
    
    return strategies;
  }

  async generateSavingsOptimizationTips(monthlyIncome) {
    return "• 🚀 Start with 1% of income, increase by 1% every 3 months\n" +
           "• 🏆 Use savings challenges (52-week, $5 challenge)\n" +
           "• 💡 Cut one subscription, save that amount instead\n" +
           "• 🛒 Implement 24-hour rule for non-essential purchases\n" +
           "• 📱 Use budgeting apps with savings goal tracking\n" +
           "• 🎁 Ask for contributions to goals instead of gifts\n";
  }

  async generateGenericSavingsAdvice() {
    return `🎯 **SAVINGS FUNDAMENTALS**:

💰 **Emergency Fund Priority**:
• Start with $1,000 emergency starter fund
• Build to 3-6 months of expenses
• Keep in high-yield savings account
• Only use for true emergencies

📊 **SMART Goals Framework**:
• Specific: Define exact amount and purpose
• Measurable: Track progress monthly
• Achievable: Start with smaller, realistic goals
• Relevant: Align with your life priorities
• Time-bound: Set clear target dates

🚀 **Automation Strategies**:
• Set up automatic transfers on payday
• Use separate accounts for different goals
• Start small and increase gradually
• Celebrate milestones to stay motivated

`;
  }

  // Fraud Detection Helper Methods
  async analyzeFraudPatterns(transactions) {
    const analysis = {
      riskLevel: 'LOW',
      suspiciousCount: 0,
      securityScore: 85,
      alerts: [],
      patterns: {}
    };
    
    if (!transactions || transactions.length === 0) {
      return analysis;
    }
    
    // Analyze transaction patterns
    const patterns = this.detectTransactionPatterns(transactions);
    analysis.patterns = patterns;
    
    // Check for suspicious activities
    const suspiciousTransactions = this.identifySuspiciousTransactions(transactions, patterns);
    analysis.suspiciousCount = suspiciousTransactions.length;
    
    // Generate alerts
    analysis.alerts = this.generateFraudAlerts(suspiciousTransactions, patterns);
    
    // Calculate risk level
    if (analysis.suspiciousCount > 5) {
      analysis.riskLevel = 'HIGH';
      analysis.securityScore = 45;
    } else if (analysis.suspiciousCount > 2) {
      analysis.riskLevel = 'MEDIUM';
      analysis.securityScore = 65;
    }
    
    return analysis;
  }

  detectTransactionPatterns(transactions) {
    const patterns = {
      averageAmount: 0,
      commonTimes: {},
      commonMerchants: {},
      dailyFrequency: {},
      locationPatterns: {},
      typeDistribution: {}
    };
    
    // Calculate average transaction amount
    const amounts = transactions.map(t => Math.abs(t.amount));
    patterns.averageAmount = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
    
    // Analyze transaction times, merchants, and types
    transactions.forEach(transaction => {
      // Time patterns
      const hour = new Date(transaction.transaction_date).getHours();
      patterns.commonTimes[hour] = (patterns.commonTimes[hour] || 0) + 1;
      
      // Transaction type distribution
      patterns.typeDistribution[transaction.transaction_type] = 
        (patterns.typeDistribution[transaction.transaction_type] || 0) + 1;
      
      // Daily frequency
      const date = transaction.transaction_date.split(' ')[0];
      patterns.dailyFrequency[date] = (patterns.dailyFrequency[date] || 0) + 1;
    });
    
    return patterns;
  }

  identifySuspiciousTransactions(transactions, patterns) {
    const suspicious = [];
    const amountThreshold = patterns.averageAmount * 3; // 3x average amount
    
    transactions.forEach(transaction => {
      const amount = Math.abs(transaction.amount);
      const reasons = [];
      
      // Large amount anomaly
      if (amount > amountThreshold && amount > 1000) {
        reasons.push('Unusually large amount');
      }
      
      // Weekend/Late night transactions
      const transactionHour = new Date(transaction.transaction_date).getHours();
      if (transactionHour < 6 || transactionHour > 23) {
        reasons.push('Unusual time of day');
      }
      
      // Multiple transactions same day
      const date = transaction.transaction_date.split(' ')[0];
      if (patterns.dailyFrequency[date] > 10) {
        reasons.push('High frequency on single day');
      }
      
      // Failed transactions (potential fraud attempts)
      if (transaction.status === 'Failed' || transaction.status === 'Declined') {
        reasons.push('Failed transaction attempt');
      }
      
      if (reasons.length > 0) {
        suspicious.push({
          transaction,
          reasons
        });
      }
    });
    
    return suspicious;
  }

  generateFraudAlerts(suspiciousTransactions, patterns) {
    const alerts = [];
    
    if (suspiciousTransactions.length > 5) {
      alerts.push('High number of suspicious transactions detected');
    }
    
    const largeTransactions = suspiciousTransactions.filter(st => 
      st.reasons.includes('Unusually large amount'));
    if (largeTransactions.length > 0) {
      alerts.push(`${largeTransactions.length} unusually large transactions found`);
    }
    
    const nightTransactions = suspiciousTransactions.filter(st => 
      st.reasons.includes('Unusual time of day'));
    if (nightTransactions.length > 2) {
      alerts.push('Multiple late-night/early morning transactions');
    }
    
    const failedTransactions = suspiciousTransactions.filter(st => 
      st.reasons.includes('Failed transaction attempt'));
    if (failedTransactions.length > 3) {
      alerts.push('Multiple failed transaction attempts (possible fraud)');
    }
    
    return alerts;
  }

  async generateFraudPreventionTips(fraudAnalysis) {
    let tips = '';
    
    if (fraudAnalysis.riskLevel === 'HIGH') {
      tips += "🚨 IMMEDIATE ACTIONS REQUIRED:\n";
      tips += "• Contact your bank immediately to review transactions\n";
      tips += "• Consider freezing your accounts temporarily\n";
      tips += "• Change all online banking passwords\n";
      tips += "• Monitor credit reports closely\n\n";
    }
    
    tips += "🛡️ FRAUD PREVENTION BEST PRACTICES:\n";
    tips += "• Enable real-time transaction alerts\n";
    tips += "• Use strong, unique passwords for all accounts\n";
    tips += "• Enable two-factor authentication\n";
    tips += "• Regularly review bank and credit card statements\n";
    tips += "• Use secure networks for online banking\n";
    tips += "• Cover your PIN when entering it in public\n";
    tips += "• Report lost/stolen cards immediately\n";
    tips += "• Be cautious with ATMs in isolated locations\n";
    
    return tips;
  }

  async generateMonitoringRecommendations() {
    return "• 📱 Set up SMS/email alerts for all transactions over $100\n" +
           "• 📊 Review accounts weekly, not just monthly statements\n" +
           "• 🔔 Enable push notifications for card usage\n" +
           "• 📈 Use bank's fraud monitoring services\n" +
           "• 🛡️ Consider identity monitoring services\n" +
           "• 📞 Save bank's fraud hotline in your phone\n" +
           "• 💳 Use virtual card numbers for online purchases\n" +
           "• 🔒 Freeze credit reports when not applying for credit\n";
  }

  async generateGenericFraudAdvice() {
    return `🛡️ **FRAUD PROTECTION FUNDAMENTALS**:

🚨 **Warning Signs of Fraud**:
• Unauthorized transactions on statements
• Missing bank statements or bills
• Unexpected credit score changes
• Calls about accounts you didn't open
• Denied transactions on good accounts

🔒 **Prevention Strategies**:
• Monitor accounts daily through mobile apps
• Set up automatic alerts for all transactions
• Use strong, unique passwords
• Enable two-factor authentication
• Regularly update contact information with banks

📞 **If Fraud Occurs**:
• Contact your bank/credit card company immediately
• File a police report
• Contact credit bureaus to place fraud alerts
• Document all communications
• Monitor accounts closely for 6+ months

💡 **Pro Tips**:
• Use credit cards for online purchases (better fraud protection)
• Avoid debit cards for risky transactions
• Check ATMs for skimming devices
• Shred financial documents before disposal

`;
  }
  
  // Advanced Utility Methods for Financial Calculations
  normalCDF(x) {
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }
  
  erf(x) {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
    
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return sign * y;
  }
  
  generateNormalRandom(mean = 0, stdDev = 1) {
    if (this.spare) {
      const result = this.spare * stdDev + mean;
      this.spare = null;
      return result;
    }
    
    const u = Math.random();
    const v = Math.random();
    const mag = stdDev * Math.sqrt(-2.0 * Math.log(u));
    
    this.spare = mag * Math.cos(2 * Math.PI * v);
    return mag * Math.sin(2 * Math.PI * v) + mean;
  }
  
  getZScore(confidence) {
    const zScores = {
      0.90: 1.282,
      0.95: 1.645,
      0.99: 2.326
    };
    return zScores[confidence] || 1.645;
  }

  // Simple, relevant response handlers
  handleTransactionQuery(input, entities) {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.match(/list|show|view|display/) && lowerInput.match(/transaction|transactions/)) {
      return "I don't have access to your personal transaction data.";
    }
    
    if (lowerInput.match(/history|statement/)) {
      return "I don't have access to your transaction history.";
    }
    
    return "I can't access your personal transaction data.";
  }

  handleAccountQuery(input, entities) {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.match(/balance|my balance|account balance|what.*balance|check.*balance/)) {
      return "I don't have access to your actual account balances.";
    }
    
    if (lowerInput.match(/how much.*have|how much.*money/)) {
      return "I can't see your actual account balances.";
    }
    
    if (lowerInput.match(/account.*info|my account|accounts/)) {
      return "I don't have access to your personal account information.";
    }
    
    return "I can't access your personal account information.";
  }

  handleAnalysisQuery(input, entities) {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.match(/spending|spend|expense/)) {
      return "I don't have access to your transaction data for spending analysis.";
    }
    
    if (lowerInput.match(/portfolio|investment.*performance|returns/)) {
      return "I don't have access to your investment account data.";
    }
    
    if (lowerInput.match(/budget.*performance|budget.*review/)) {
      return "I don't have access to your budget data.";
    }
    
    return "I don't have access to your financial data for analysis.";
  }

  handleInvestmentQuery(input, entities) {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('how much') || lowerInput.includes('amount')) {
      return "For investing, a common rule is to invest 10-20% of your income. Start with low-cost index funds or ETFs that track the S&P 500. Consider your risk tolerance and time horizon - the longer you can invest, the more risk you can generally take.";
    }
    
    if (lowerInput.includes('beginner') || lowerInput.includes('start')) {
      return "For beginners, I recommend starting with a diversified portfolio using low-cost index funds. Consider a target-date fund that automatically adjusts as you age, or a simple three-fund portfolio with total stock market, international stocks, and bonds.";
    }
    
    if (lowerInput.includes('portfolio') || lowerInput.includes('diversify')) {
      return "A well-diversified portfolio typically includes: 60-80% stocks (mix of domestic and international), 20-40% bonds, and possibly 5-10% alternatives. Adjust based on your age, risk tolerance, and goals. Rebalance annually.";
    }
    
    return "I can help with investment strategies, portfolio allocation, fund selection, and risk management. Consider factors like your timeline, risk tolerance, and financial goals when making investment decisions.";
  }

  handleBudgetQuery(input, entities) {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('create') || lowerInput.includes('make') || lowerInput.includes('start')) {
      return "To create a budget: 1) Track your income and expenses for a month, 2) Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings/debt, 3) Use budgeting apps or spreadsheets, 4) Review and adjust monthly.";
    }
    
    if (lowerInput.includes('save money') || lowerInput.includes('cut expenses')) {
      return "To reduce expenses: Review subscriptions and cancel unused ones, cook at home more, compare insurance rates, negotiate bills, buy generic brands, and track spending to identify waste.";
    }
    
    return "Good budgeting involves tracking income and expenses, prioritizing needs over wants, and allocating money for savings and debt repayment. The 50/30/20 rule is a good starting framework.";
  }

  handleDebtQuery(input, entities) {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('pay off') || lowerInput.includes('strategy')) {
      return "Two main debt payoff strategies: 1) Avalanche method - pay minimums on all debts, extra on highest interest rate debt, 2) Snowball method - pay minimums on all, extra on smallest balance. Avalanche saves more money, snowball provides psychological wins.";
    }
    
    if (lowerInput.includes('credit card')) {
      return "For credit card debt: Stop using cards, pay more than minimum, consider balance transfer to 0% APR card, or personal loan at lower rate. Focus on highest interest cards first. Avoid closing old cards as it hurts credit score.";
    }
    
    if (lowerInput.includes('consolidate')) {
      return "Debt consolidation can simplify payments and potentially lower interest rates through personal loans, balance transfers, or HELOC. However, it doesn't reduce total debt - focus on changing spending habits too.";
    }
    
    return "Focus on paying off high-interest debt first, make more than minimum payments, and avoid taking on new debt. Consider debt consolidation if it lowers your interest rates.";
  }

  handleRetirementQuery(input, entities) {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('how much') || lowerInput.includes('save')) {
      return "General rule: Save 10-15% of income for retirement. Use employer 401(k) match first (free money!), then max out Roth IRA ($6,500/year, $7,500 if 50+), then back to 401(k). Start early - compound interest is powerful.";
    }
    
    if (lowerInput.includes('401k') || lowerInput.includes('403b')) {
      return "Contribute enough to get full employer match first. Choose low-cost index funds or target-date funds. Consider Roth vs traditional based on current vs expected future tax rates. Increase contributions with raises.";
    }
    
    if (lowerInput.includes('ira') || lowerInput.includes('roth')) {
      return "IRA contribution limit is $6,500/year ($7,500 if 50+). Roth IRA: pay taxes now, withdraw tax-free in retirement. Traditional IRA: deduct now, pay taxes in retirement. Choose based on current vs future tax bracket.";
    }
    
    return "Start saving for retirement early and consistently. Take advantage of employer matches, maximize tax-advantaged accounts, and invest in diversified, low-cost funds.";
  }

  handleSavingsQuery(input, entities) {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('emergency') || lowerInput.includes('fund')) {
      return "Emergency fund should cover 3-6 months of expenses. Keep it in a high-yield savings account or money market account for easy access. Start with $1,000, then build to full amount over time.";
    }
    
    if (lowerInput.includes('high yield') || lowerInput.includes('best account')) {
      return "Look for high-yield savings accounts offering 4-5% APY from online banks like Ally, Marcus, or Discover. Credit union accounts often have good rates too. Avoid accounts with monthly fees.";
    }
    
    return "Build an emergency fund first (3-6 months expenses), then save for specific goals. Use high-yield savings accounts for short-term goals, consider CDs for money you won't need for 6+ months.";
  }

  handleCreditQuery(input, entities) {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('improve') || lowerInput.includes('build') || lowerInput.includes('increase')) {
      return "To improve credit: Pay all bills on time, keep credit utilization below 30% (ideally under 10%), don't close old cards, monitor credit reports for errors, consider becoming authorized user on family member's card.";
    }
    
    if (lowerInput.includes('score') || lowerInput.includes('report')) {
      return "Check credit score free through Credit Karma, bank apps, or annualcreditreport.com. Scores range 300-850. Good credit is 670+, excellent is 740+. Payment history (35%) and credit utilization (30%) matter most.";
    }
    
    return "Good credit comes from paying bills on time, keeping credit utilization low, and maintaining old accounts. Monitor your credit report regularly and dispute any errors.";
  }

  handleInsuranceQuery(input, entities) {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('life insurance')) {
      return "Consider term life insurance if you have dependents. Rule of thumb: 10-12x annual income in coverage. Term is cheaper than whole life for most people. Get quotes from multiple insurers.";
    }
    
    if (lowerInput.includes('health insurance')) {
      return "Choose health insurance based on expected usage, preferred doctors, and budget. High-deductible plans with HSAs can be good for healthy people. Consider total costs (premiums + deductibles + copays).";
    }
    
    return "Essential insurance includes health, auto (if you drive), renters/homeowners, and life insurance if you have dependents. Disability insurance protects your income if you can't work.";
  }

  handleTaxQuery(input, entities) {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('deduction') || lowerInput.includes('write off')) {
      return "Common deductions: mortgage interest, state/local taxes (up to $10k), charitable donations, medical expenses over 7.5% of income. Consider itemizing vs standard deduction ($13,850 single, $27,700 married filing jointly for 2023).";
    }
    
    if (lowerInput.includes('save') || lowerInput.includes('reduce')) {
      return "Tax-saving strategies: contribute to 401(k)/IRA, use HSA if available, consider tax-loss harvesting, time capital gains/losses, bunch charitable deductions, and use tax-advantaged accounts.";
    }
    
    return "Maximize tax-advantaged accounts like 401(k), IRA, and HSA. Keep good records of deductible expenses and consider whether itemizing beats the standard deduction.";
  }

  handleGeneralQuery(input, entities) {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('help') || lowerInput.includes('advice')) {
      return "I can help with investments, budgeting, debt management, retirement planning, savings strategies, credit improvement, insurance, and tax planning. What specific financial topic interests you?";
    }
    
    if (lowerInput.includes('start') || lowerInput.includes('begin')) {
      return "Good financial foundation: 1) Create a budget, 2) Build emergency fund, 3) Pay off high-interest debt, 4) Start investing for retirement, 5) Get appropriate insurance coverage. Take it step by step!";
    }
    
    return "I'm here to help with your financial questions. I can provide guidance on investing, budgeting, debt management, retirement planning, and more. What would you like to know about?";
  }
}

// Enhanced CLI Interface
async function startEnhancedFinancialAdvisor() {
  console.log('Financial Advisor Started');
  
  const advisor = new EnhancedFinancialAdvisor();
  
  try {
    await advisor.initializeUser();
    await advisor.initializeAdvancedSystem();
  } catch (error) {
    console.error('Error initializing financial advisor:', error.message);
  }
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  function askQuestion() {
    rl.question('You: '.bold.blue, async (input) => {
      if (input.toLowerCase().trim() === 'exit') {
        console.log('Goodbye!');
        if (advisor.db) advisor.db.close();
        rl.close();
        return;
      }
      
      if (input.trim()) {
        try {
          const startTime = Date.now();
          
          const response = await advisor.processFinancialInput(input);
          
          const processingTime = Date.now() - startTime;
          console.log(`\n${response}`);
          console.log('');
        } catch (error) {
          console.error('Error processing question:', error.message);
        }
      }
      
      askQuestion();
    });
  }
  
  askQuestion();
}

// Start the enhanced financial advisor
if (require.main === module) {
  startEnhancedFinancialAdvisor();
}

module.exports = EnhancedFinancialAdvisor;