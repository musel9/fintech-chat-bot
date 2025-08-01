// Comprehensive mock user financial data for testing
// User: Ahmed Al-Rashid, 32-year-old Software Engineer in Dubai

const moment = require('moment');

// Generate realistic transaction history for the last 3 months
function generateTransactionHistory() {
  const transactions = [];
  const startDate = moment().subtract(3, 'months');
  const endDate = moment();
  
  // Monthly salary (consistent)
  for (let month = 0; month < 3; month++) {
    const salaryDate = moment().subtract(month, 'months').date(1);
    transactions.push({
      transaction_id: `SAL_${salaryDate.format('YYYYMM')}`,
      amount: 12000,
      description: 'Software Engineer Salary - TechCorp Dubai',
      transaction_type: 'Credit',
      transaction_date: salaryDate.format('YYYY-MM-DD'),
      category: 'Income',
      location: 'Dubai, UAE'
    });
  }
  
  // Monthly rent (consistent)
  for (let month = 0; month < 3; month++) {
    const rentDate = moment().subtract(month, 'months').date(5);
    transactions.push({
      transaction_id: `RENT_${rentDate.format('YYYYMM')}`,
      amount: -2800,
      description: 'Apartment Rent - Downtown Dubai',
      transaction_type: 'Debit',
      transaction_date: rentDate.format('YYYY-MM-DD'),
      category: 'Housing',
      location: 'Dubai, UAE'
    });
  }
  
  // Utilities (monthly with variation)
  const utilities = [
    { name: 'DEWA Electricity & Water', base: -380, variation: 50 },
    { name: 'Internet - Etisalat', base: -299, variation: 0 },
    { name: 'Mobile - Du', base: -180, variation: 20 }
  ];
  
  utilities.forEach(utility => {
    for (let month = 0; month < 3; month++) {
      const utilDate = moment().subtract(month, 'months').date(Math.floor(Math.random() * 10) + 8);
      const amount = utility.base + (Math.random() * utility.variation * 2 - utility.variation);
      transactions.push({
        transaction_id: `UTIL_${utility.name.replace(/\s+/g, '_')}_${utilDate.format('YYYYMM')}`,
        amount: Math.round(amount),
        description: utility.name,
        transaction_type: 'Debit',
        transaction_date: utilDate.format('YYYY-MM-DD'),
        category: 'Utilities',
        location: 'Dubai, UAE'
      });
    }
  });
  
  // Grocery shopping (weekly with realistic variation)
  let currentDate = moment(startDate);
  while (currentDate.isBefore(endDate)) {
    if (currentDate.day() === 5 || currentDate.day() === 6) { // Friday/Saturday shopping
      const amount = -(Math.random() * 200 + 150); // 150-350 AED
      const stores = ['Carrefour Mall of Emirates', 'Spinneys Motor City', 'Lulu Hypermarket', 'Waitrose Dubai Mall'];
      transactions.push({
        transaction_id: `GROC_${currentDate.format('YYYYMMDD')}`,
        amount: Math.round(amount),
        description: stores[Math.floor(Math.random() * stores.length)],
        transaction_type: 'Debit',
        transaction_date: currentDate.format('YYYY-MM-DD'),
        category: 'Groceries',
        location: 'Dubai, UAE'
      });
    }
    currentDate.add(1, 'day');
  }
  
  // Dining out (2-3 times per week)
  currentDate = moment(startDate);
  while (currentDate.isBefore(endDate)) {
    if (Math.random() < 0.35) { // 35% chance per day
      const amount = -(Math.random() * 180 + 45); // 45-225 AED
      const restaurants = [
        'Zuma Dubai', 'La Petite Maison', 'Ravi Restaurant', 'Tim Hortons',
        'Shake Shack Dubai Mall', 'Lebanese Mill', 'Cafeteria M15', 
        'McDonald\'s JBR', 'Starbucks Marina Walk', 'Five Guys Dubai'
      ];
      transactions.push({
        transaction_id: `DINE_${currentDate.format('YYYYMMDD')}_${Math.random().toString(36).substr(2, 4)}`,
        amount: Math.round(amount),
        description: restaurants[Math.floor(Math.random() * restaurants.length)],
        transaction_type: 'Debit',
        transaction_date: currentDate.format('YYYY-MM-DD'),
        category: 'Dining',
        location: 'Dubai, UAE'
      });
    }
    currentDate.add(1, 'day');
  }
  
  // Transportation (Metro, Taxi, Uber, Parking)
  currentDate = moment(startDate);
  while (currentDate.isBefore(endDate)) {
    if (Math.random() < 0.8) { // 80% chance per day (work days mostly)
      const transportTypes = [
        { type: 'Dubai Metro', min: 4, max: 12 },
        { type: 'Uber Dubai', min: 25, max: 85 },
        { type: 'Careem', min: 20, max: 75 },
        { type: 'Dubai Parking', min: 2, max: 8 },
        { type: 'Salik Toll', min: 4, max: 4 },
        { type: 'ENOC Petrol Station', min: 120, max: 180 }
      ];
      
      const transport = transportTypes[Math.floor(Math.random() * transportTypes.length)];
      const amount = -(Math.random() * (transport.max - transport.min) + transport.min);
      
      transactions.push({
        transaction_id: `TRANS_${currentDate.format('YYYYMMDD')}_${Math.random().toString(36).substr(2, 4)}`,
        amount: Math.round(amount),
        description: transport.type,
        transaction_type: 'Debit',
        transaction_date: currentDate.format('YYYY-MM-DD'),
        category: 'Transportation',
        location: 'Dubai, UAE'
      });
    }
    currentDate.add(1, 'day');
  }
  
  // Shopping & Entertainment (weekly/bi-weekly)
  const shoppingEntertainment = [
    { name: 'Dubai Mall Shopping', min: 200, max: 800, frequency: 0.15 },
    { name: 'Mall of Emirates', min: 150, max: 600, frequency: 0.1 },
    { name: 'VOX Cinemas Dubai Mall', min: 45, max: 90, frequency: 0.08 },
    { name: 'Kinokuniya Bookstore', min: 60, max: 250, frequency: 0.03 },
    { name: 'Decathlon Sports', min: 100, max: 400, frequency: 0.02 },
    { name: 'IKEA Dubai', min: 150, max: 500, frequency: 0.01 }
  ];
  
  currentDate = moment(startDate);
  while (currentDate.isBefore(endDate)) {
    shoppingEntertainment.forEach(activity => {
      if (Math.random() < activity.frequency) {
        const amount = -(Math.random() * (activity.max - activity.min) + activity.min);
        transactions.push({
          transaction_id: `SHOP_${currentDate.format('YYYYMMDD')}_${activity.name.replace(/\s+/g, '_')}`,
          amount: Math.round(amount),
          description: activity.name,
          transaction_type: 'Debit',
          transaction_date: currentDate.format('YYYY-MM-DD'),
          category: 'Shopping',
          location: 'Dubai, UAE'
        });
      }
    });
    currentDate.add(1, 'day');
  }
  
  // Monthly investments (consistent savings habit)
  for (let month = 0; month < 3; month++) {
    const investDate = moment().subtract(month, 'months').date(15);
    transactions.push({
      transaction_id: `INV_${investDate.format('YYYYMM')}`,
      amount: -3000,
      description: 'Monthly Investment - Emirates NBD Wealth',
      transaction_type: 'Debit',
      transaction_date: investDate.format('YYYY-MM-DD'),
      category: 'Investment',
      location: 'Dubai, UAE'
    });
  }
  
  // Healthcare & Insurance
  const healthInsurance = [
    { name: 'Daman Health Insurance', amount: -450, date: moment().subtract(2, 'months').date(10) },
    { name: 'Dubai Hospital Consultation', amount: -180, date: moment().subtract(1, 'months').date(22) },
    { name: 'Aster Pharmacy', amount: -85, date: moment().subtract(1, 'months').date(23) }
  ];
  
  healthInsurance.forEach(item => {
    transactions.push({
      transaction_id: `HEALTH_${item.date.format('YYYYMMDD')}`,
      amount: item.amount,
      description: item.name,
      transaction_type: 'Debit',
      transaction_date: item.date.format('YYYY-MM-DD'),
      category: 'Healthcare',
      location: 'Dubai, UAE'
    });
  });
  
  // Some irregular income (freelance work)
  const freelanceWork = [
    { amount: 2500, description: 'Freelance Web Development Project', date: moment().subtract(2, 'months').date(20) },
    { amount: 1800, description: 'Mobile App Consultation', date: moment().subtract(1, 'months').date(8) }
  ];
  
  freelanceWork.forEach(work => {
    transactions.push({
      transaction_id: `FREELANCE_${work.date.format('YYYYMMDD')}`,
      amount: work.amount,
      description: work.description,
      transaction_type: 'Credit',
      transaction_date: work.date.format('YYYY-MM-DD'),
      category: 'Freelance Income',
      location: 'Dubai, UAE'
    });
  });
  
  // Sort transactions by date (newest first)
  return transactions.sort((a, b) => moment(b.transaction_date).diff(moment(a.transaction_date)));
}

// Complete user profile
const mockUserData = {
  // Personal Information
  userProfile: {
    id: 'user_ahmed_rashid_001',
    name: 'Ahmed Al-Rashid',
    age: 32,
    nationality: 'UAE',
    city: 'Dubai',
    profession: 'Senior Software Engineer',
    company: 'TechCorp Dubai',
    
    // Financial Profile
    riskTolerance: 'moderate-aggressive',
    investmentExperience: 'intermediate',
    monthlyIncome: 12000,
    currency: 'AED',
    financialGoals: [
      'buy apartment in Dubai Marina',
      'retirement planning',
      'emergency fund',
      'children education fund',
      'annual vacation savings'
    ],
    
    // Investment preferences
    investmentHorizon: 'long-term', // 5-10 years
    preferredInvestments: ['index funds', 'real estate', 'technology stocks'],
    riskCapacity: 'high', // Young, stable income
    
    // Family status
    maritalStatus: 'married',
    dependents: 1, // Planning for children
    
    // Financial knowledge
    financialLiteracy: 'good',
    previousInvestments: ['ADCB savings account', 'Emirates NBD wealth management'],
    
    // Goals with timeframes
    shortTermGoals: ['emergency fund 6 months expenses', 'vacation to Europe'],
    mediumTermGoals: ['apartment down payment', 'car upgrade'],
    longTermGoals: ['retirement by 55', 'children education'],
    
    // Current financial status
    employmentStatus: 'full-time',
    jobStability: 'high',
    creditScore: 'excellent',
    existingDebts: ['car loan'],
    
    // Spending personality
    spendingStyle: 'balanced', // Neither too frugal nor spendthrift
    budgetingHabits: 'good',
    savingsRate: 0.25 // Saves 25% of income
  },
  
  // Account balances (as of current date)
  balance: [
    {
      account_id: 'ADCB_SAVINGS_001',
      account_type: 'Savings',
      bank: 'Abu Dhabi Commercial Bank',
      balance: 45000,
      currency: 'AED',
      opening_date: '2020-03-15',
      status: 'Active',
      interest_rate: 0.015,
      minimum_balance: 3000
    },
    {
      account_id: 'ENBD_CURRENT_001', 
      account_type: 'Current',
      bank: 'Emirates NBD',
      balance: 8500,
      currency: 'AED',
      opening_date: '2019-08-10',
      status: 'Active',
      monthly_fee: 25,
      overdraft_limit: 5000
    },
    {
      account_id: 'ADCB_INVESTMENT_001',
      account_type: 'Investment',
      bank: 'ADCB Wealth Management',
      balance: 22000,
      currency: 'AED',
      opening_date: '2021-06-01',
      status: 'Active',
      portfolio_type: 'Balanced Growth',
      risk_level: 'Moderate'
    },
    {
      account_id: 'USD_SAVINGS_001',
      account_type: 'USD Savings',
      bank: 'HSBC UAE',
      balance: 3200,
      currency: 'USD',
      opening_date: '2022-01-20',
      status: 'Active',
      purpose: 'International transactions'
    }
  ],
  
  // Transaction history (last 3 months)
  transactions: generateTransactionHistory(),
  
  // Financial goals with specific targets
  savingsGoals: [
    {
      goal_id: 'emergency_fund',
      name: 'Emergency Fund',
      target_amount: 36000, // 6 months of expenses
      current_amount: 20000,
      target_date: '2024-12-31',
      priority: 'high',
      monthly_contribution: 2000
    },
    {
      goal_id: 'apartment_downpayment',
      name: 'Apartment Down Payment',
      target_amount: 200000, // 20% of 1M AED apartment
      current_amount: 22000, // Investment account
      target_date: '2026-06-01',
      priority: 'high',
      monthly_contribution: 3000
    },
    {
      goal_id: 'vacation_fund',
      name: 'Annual Vacation Fund',
      target_amount: 15000,
      current_amount: 5000,
      target_date: '2024-06-01',
      priority: 'medium',
      monthly_contribution: 1000
    },
    {
      goal_id: 'retirement',
      name: 'Retirement Fund',
      target_amount: 2000000, // Retire comfortably by 55
      current_amount: 22000,
      target_date: '2047-01-01',
      priority: 'high',
      monthly_contribution: 3000
    }
  ],
  
  // Debt information
  debts: [
    {
      debt_id: 'car_loan_001',
      type: 'Car Loan',
      bank: 'Emirates NBD',
      original_amount: 80000,
      current_balance: 35000,
      monthly_payment: 1200,
      interest_rate: 0.035,
      remaining_months: 30,
      next_payment_date: moment().add(5, 'days').format('YYYY-MM-DD')
    }
  ],
  
  // Insurance policies
  insurance: [
    {
      policy_id: 'health_001',
      type: 'Health Insurance',
      provider: 'Daman',
      premium: 5400, // Annual
      coverage: 500000,
      status: 'Active'
    },
    {
      policy_id: 'life_001', 
      type: 'Life Insurance',
      provider: 'AXA UAE',
      premium: 3600, // Annual
      coverage: 1000000,
      status: 'Active'
    }
  ],
  
  // Recent financial alerts/notes
  alerts: [
    {
      type: 'budget_warning',
      message: 'Dining expenses exceeded budget by 15% this month',
      date: moment().subtract(3, 'days').format('YYYY-MM-DD'),
      severity: 'medium'
    },
    {
      type: 'investment_opportunity',
      message: 'Market dip detected - good time to increase investments',
      date: moment().subtract(1, 'week').format('YYYY-MM-DD'),
      severity: 'low'
    }
  ]
};

module.exports = mockUserData;