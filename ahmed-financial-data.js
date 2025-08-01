// Ahmed's Complete Financial Profile
const ahmedFinancialData = {
  userProfile: {
    name: "Ahmed",
    age: 32,
    profession: "Software Engineer",
    city: "Riyadh",
    monthlyIncome: 18000,
    currency: "SAR",
    riskTolerance: "moderate",
    investmentExperience: "beginner",
    maritalStatus: "married",
    financialGoals: ["home improvement", "emergency fund", "investment"]
  },

  // 4 accounts totaling 153,000 SAR
  balance: [
    {
      account_id: "ACC001",
      account_type: "Checking",
      bank: "Al Rajhi Bank",
      balance: 45000,
      currency: "SAR",
      status: "Active",
      opening_date: "2022-01-15"
    },
    {
      account_id: "ACC002", 
      account_type: "Savings",
      bank: "SAMBA Bank",
      balance: 68000,
      currency: "SAR",
      status: "Active",
      opening_date: "2021-06-10"
    },
    {
      account_id: "ACC003",
      account_type: "Investment", 
      bank: "SNB Capital",
      balance: 25000,
      currency: "SAR",
      status: "Active",
      opening_date: "2023-03-20"
    },
    {
      account_id: "ACC004",
      account_type: "Credit Card",
      bank: "Al Rajhi Bank", 
      balance: 15000,
      currency: "SAR",
      status: "Active",
      opening_date: "2022-08-05"
    }
  ],

  // 3 months of transactions with heavy home spending
  transactions: [
    // December 2024
    { amount: 18000, description: "Monthly Salary", transaction_type: "Credit", transaction_date: "2024-12-01", category: "Income" },
    { amount: -2800, description: "IKEA - Bedroom Furniture", transaction_type: "Debit", transaction_date: "2024-12-02", category: "Home & Garden" },
    { amount: -1200, description: "Home Box - Kitchen Accessories", transaction_type: "Debit", transaction_date: "2024-12-03", category: "Home & Garden" },
    { amount: -450, description: "Carrefour - Groceries", transaction_type: "Debit", transaction_date: "2024-12-04", category: "Groceries" },
    { amount: -1800, description: "IKEA - Living Room Sofa", transaction_type: "Debit", transaction_date: "2024-12-05", category: "Home & Garden" },
    { amount: -85, description: "Starbucks", transaction_type: "Debit", transaction_date: "2024-12-06", category: "Dining" },
    { amount: -320, description: "SACO - Home Decor", transaction_type: "Debit", transaction_date: "2024-12-07", category: "Home & Garden" },
    { amount: -2200, description: "Rent Payment", transaction_type: "Debit", transaction_date: "2024-12-08", category: "Housing" },
    { amount: -890, description: "Home Center - Tools", transaction_type: "Debit", transaction_date: "2024-12-09", category: "Home & Garden" },
    { amount: -150, description: "McDonald's", transaction_type: "Debit", transaction_date: "2024-12-10", category: "Dining" },
    { amount: -1500, description: "IKEA - Wardrobe", transaction_type: "Debit", transaction_date: "2024-12-11", category: "Home & Garden" },
    { amount: -75, description: "Gas Station", transaction_type: "Debit", transaction_date: "2024-12-12", category: "Transportation" },
    { amount: -680, description: "Home Box - Bathroom Items", transaction_type: "Debit", transaction_date: "2024-12-13", category: "Home & Garden" },
    { amount: -1200, description: "ACE Hardware - Home Improvement", transaction_type: "Debit", transaction_date: "2024-12-14", category: "Home & Garden" },
    { amount: -300, description: "Tamimi Markets - Groceries", transaction_type: "Debit", transaction_date: "2024-12-15", category: "Groceries" },
    { amount: -2500, description: "IKEA - Dining Table Set", transaction_type: "Debit", transaction_date: "2024-12-16", category: "Home & Garden" },
    { amount: -200, description: "Pharmacy", transaction_type: "Debit", transaction_date: "2024-12-17", category: "Healthcare" },
    { amount: -950, description: "Home Box - Curtains & Blinds", transaction_type: "Debit", transaction_date: "2024-12-18", category: "Home & Garden" },
    { amount: -120, description: "Coffee Shop", transaction_type: "Debit", transaction_date: "2024-12-19", category: "Dining" },
    { amount: -1800, description: "IKEA - Office Furniture", transaction_type: "Debit", transaction_date: "2024-12-20", category: "Home & Garden" },

    // November 2024
    { amount: 18000, description: "Monthly Salary", transaction_type: "Credit", transaction_date: "2024-11-01", category: "Income" },
    { amount: -3200, description: "IKEA - Kitchen Renovation", transaction_type: "Debit", transaction_date: "2024-11-02", category: "Home & Garden" },
    { amount: -1500, description: "Home Box - Lighting Fixtures", transaction_type: "Debit", transaction_date: "2024-11-03", category: "Home & Garden" },
    { amount: -400, description: "Panda - Groceries", transaction_type: "Debit", transaction_date: "2024-11-04", category: "Groceries" },
    { amount: -2100, description: "IKEA - Mattress & Bedding", transaction_type: "Debit", transaction_date: "2024-11-05", category: "Home & Garden" },
    { amount: -95, description: "Dunkin Donuts", transaction_type: "Debit", transaction_date: "2024-11-06", category: "Dining" },
    { amount: -780, description: "SACO - Wall Art", transaction_type: "Debit", transaction_date: "2024-11-07", category: "Home & Garden" },
    { amount: -2200, description: "Rent Payment", transaction_type: "Debit", transaction_date: "2024-11-08", category: "Housing" },
    { amount: -1200, description: "Home Center - Garden Tools", transaction_type: "Debit", transaction_date: "2024-11-09", category: "Home & Garden" },
    { amount: -180, description: "KFC", transaction_type: "Debit", transaction_date: "2024-11-10", category: "Dining" },
    { amount: -2800, description: "IKEA - Storage Solutions", transaction_type: "Debit", transaction_date: "2024-11-11", category: "Home & Garden" },
    { amount: -80, description: "Gas Station", transaction_type: "Debit", transaction_date: "2024-11-12", category: "Transportation" },
    { amount: -950, description: "Home Box - Rugs & Carpets", transaction_type: "Debit", transaction_date: "2024-11-13", category: "Home & Garden" },
    { amount: -1600, description: "ACE Hardware - Power Tools", transaction_type: "Debit", transaction_date: "2024-11-14", category: "Home & Garden" },
    { amount: -350, description: "Al Othaim Markets - Groceries", transaction_type: "Debit", transaction_date: "2024-11-15", category: "Groceries" },
    { amount: -2200, description: "IKEA - Appliances", transaction_type: "Debit", transaction_date: "2024-11-16", category: "Home & Garden" },
    { amount: -250, description: "Medical Center", transaction_type: "Debit", transaction_date: "2024-11-17", category: "Healthcare" },
    { amount: -1100, description: "Home Box - Garden Furniture", transaction_type: "Debit", transaction_date: "2024-11-18", category: "Home & Garden" },
    { amount: -140, description: "Cafe", transaction_type: "Debit", transaction_date: "2024-11-19", category: "Dining" },
    { amount: -1900, description: "IKEA - Closet Organization", transaction_type: "Debit", transaction_date: "2024-11-20", category: "Home & Garden" },

    // October 2024
    { amount: 18000, description: "Monthly Salary", transaction_type: "Credit", transaction_date: "2024-10-01", category: "Income" },
    { amount: -2900, description: "IKEA - Home Office Setup", transaction_type: "Debit", transaction_date: "2024-10-02", category: "Home & Garden" },
    { amount: -1300, description: "Home Box - Decorative Items", transaction_type: "Debit", transaction_date: "2024-10-03", category: "Home & Garden" },
    { amount: -380, description: "Carrefour - Groceries", transaction_type: "Debit", transaction_date: "2024-10-04", category: "Groceries" },
    { amount: -2500, description: "IKEA - Children's Room", transaction_type: "Debit", transaction_date: "2024-10-05", category: "Home & Garden" },
    { amount: -110, description: "Costa Coffee", transaction_type: "Debit", transaction_date: "2024-10-06", category: "Dining" },
    { amount: -650, description: "SACO - Picture Frames", transaction_type: "Debit", transaction_date: "2024-10-07", category: "Home & Garden" },
    { amount: -2200, description: "Rent Payment", transaction_type: "Debit", transaction_date: "2024-10-08", category: "Housing" },
    { amount: -1400, description: "Home Center - Plumbing Supplies", transaction_type: "Debit", transaction_date: "2024-10-09", category: "Home & Garden" },
    { amount: -200, description: "Pizza Hut", transaction_type: "Debit", transaction_date: "2024-10-10", category: "Dining" },
    { amount: -3100, description: "IKEA - Bathroom Renovation", transaction_type: "Debit", transaction_date: "2024-10-11", category: "Home & Garden" },
    { amount: -90, description: "Gas Station", transaction_type: "Debit", transaction_date: "2024-10-12", category: "Transportation" },
    { amount: -850, description: "Home Box - Kitchen Utensils", transaction_type: "Debit", transaction_date: "2024-10-13", category: "Home & Garden" },
    { amount: -1800, description: "ACE Hardware - Electrical Items", transaction_type: "Debit", transaction_date: "2024-10-14", category: "Home & Garden" },
    { amount: -420, description: "Tamimi Markets - Groceries", transaction_type: "Debit", transaction_date: "2024-10-15", category: "Groceries" },
    { amount: -2400, description: "IKEA - Outdoor Furniture", transaction_type: "Debit", transaction_date: "2024-10-16", category: "Home & Garden" },
    { amount: -180, description: "Dental Clinic", transaction_type: "Debit", transaction_date: "2024-10-17", category: "Healthcare" },
    { amount: -1200, description: "Home Box - Storage Boxes", transaction_type: "Debit", transaction_date: "2024-10-18", category: "Home & Garden" },
    { amount: -160, description: "Restaurant", transaction_type: "Debit", transaction_date: "2024-10-19", category: "Dining" },
    { amount: -2000, description: "IKEA - Home Entertainment", transaction_type: "Debit", transaction_date: "2024-10-20", category: "Home & Garden" }
  ],

  savingsGoals: [
    {
      name: "Emergency Fund",
      target_amount: 50000,
      current_amount: 25000,
      monthly_target: 2000,
      deadline: "2025-12-31"
    },
    {
      name: "Home Improvement",
      target_amount: 30000,
      current_amount: 12000,
      monthly_target: 1500,
      deadline: "2025-06-30"
    }
  ],

  debts: [
    {
      type: "Credit Card",
      creditor: "Al Rajhi Bank",
      current_balance: 8500,
      minimum_payment: 850,
      interest_rate: 24.99,
      due_date: "2025-01-15"
    }
  ],

  alerts: [
    {
      type: "spending_alert",
      message: "High spending on Home & Garden category this month",
      date: "2024-12-20",
      priority: "medium"
    }
  ]
};

module.exports = ahmedFinancialData;