const natural = require('natural');
const readline = require('readline');

class FinancialAI {
  constructor() {
    this.classifier = new natural.BayesClassifier();
    this.stemmer = natural.PorterStemmer;
    this.tokenizer = new natural.WordTokenizer();
    
    // Mock user data
    this.userData = {
      balance: 2450.75,
      transactions: [
        { date: '2024-01-15', description: 'Grocery Store', amount: -85.50 },
        { date: '2024-01-14', description: 'Salary Deposit', amount: 3000.00 },
        { date: '2024-01-13', description: 'Coffee Shop', amount: -4.75 },
        { date: '2024-01-12', description: 'Gas Station', amount: -45.20 },
        { date: '2024-01-11', description: 'Online Shopping', amount: -120.99 },
        { date: '2024-01-10', description: 'ATM Withdrawal', amount: -200.00 },
        { date: '2024-01-09', description: 'Restaurant', amount: -67.80 }
      ]
    };
    
    this.trainClassifier();
  }

  trainClassifier() {
    // Balance inquiry training data
    const balanceIntents = [
      "what's my balance",
      "show my balance",
      "check balance",
      "account balance",
      "how much money do I have",
      "what's in my account",
      "current balance",
      "balance check",
      "tell me my balance",
      "what's my current balance"
    ];

    // Transaction history training data
    const transactionIntents = [
      "show transactions",
      "recent transactions",
      "transaction history",
      "spending history",
      "what did I spend",
      "recent spending",
      "show my purchases",
      "transaction list",
      "recent activity",
      "account activity"
    ];

    // Money transfer training data
    const transferIntents = [
      "send money",
      "transfer funds",
      "transfer money",
      "send cash",
      "wire money",
      "pay someone",
      "send payment",
      "make transfer",
      "transfer to",
      "send funds"
    ];

    // Help training data
    const helpIntents = [
      "help",
      "what can you do",
      "commands",
      "how to use",
      "what are your features",
      "assist me",
      "guide me",
      "instructions",
      "help me",
      "what's available"
    ];

    // Train the classifier
    balanceIntents.forEach(phrase => {
      this.classifier.addDocument(phrase, 'balance');
    });

    transactionIntents.forEach(phrase => {
      this.classifier.addDocument(phrase, 'transactions');
    });

    transferIntents.forEach(phrase => {
      this.classifier.addDocument(phrase, 'transfer');
    });

    helpIntents.forEach(phrase => {
      this.classifier.addDocument(phrase, 'help');
    });

    this.classifier.train();
  }

  extractAmount(text) {
    // Extract dollar amounts like $100, $50.25, fifty dollars, etc.
    const dollarPattern = /\$(\d+(?:\.\d{2})?)/g;
    const wordAmountPattern = /(one|two|three|four|five|six|seven|eight|nine|ten|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand)\s*dollars?/gi;
    
    let amounts = [];
    
    // Extract $X.XX format
    let match;
    while ((match = dollarPattern.exec(text)) !== null) {
      amounts.push(parseFloat(match[1]));
    }
    
    // Simple word-to-number conversion for common amounts
    const wordToNumber = {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'ten': 10, 'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
      'hundred': 100, 'thousand': 1000
    };
    
    const wordMatch = text.match(wordAmountPattern);
    if (wordMatch) {
      wordMatch.forEach(match => {
        const words = match.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (wordToNumber[word]) {
            amounts.push(wordToNumber[word]);
          }
        });
      });
    }
    
    return amounts;
  }

  extractName(text) {
    // Simple name extraction - looks for "to [Name]" or "send to [Name]"
    const namePattern = /(?:to|send to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i;
    const match = text.match(namePattern);
    return match ? match[1] : null;
  }

  processInput(input) {
    const intent = this.classifier.classify(input);
    const confidence = Math.max(...this.classifier.getClassifications(input).map(c => c.value)) * 100;
    
    let response = '';
    
    switch (intent) {
      case 'balance':
        response = `Your current balance is $${this.userData.balance.toFixed(2)} (confidence: ${confidence.toFixed(0)}%)`;
        break;
        
      case 'transactions':
        response = `Here are your recent transactions (confidence: ${confidence.toFixed(0)}%):\n`;
        this.userData.transactions.forEach(tx => {
          const sign = tx.amount >= 0 ? '+' : '';
          response += `- ${tx.date}: ${tx.description} ${sign}$${tx.amount.toFixed(2)}\n`;
        });
        break;
        
      case 'transfer':
        const amounts = this.extractAmount(input);
        const recipient = this.extractName(input);
        
        if (amounts.length > 0 && recipient) {
          response = `Transfer request: Send $${amounts[0]} to ${recipient} (confidence: ${confidence.toFixed(0)}%)\n`;
          response += `⚠️  This is a demo - no actual transfer will be made.`;
        } else if (amounts.length > 0) {
          response = `I can help you transfer $${amounts[0]}. Please specify the recipient. (confidence: ${confidence.toFixed(0)}%)`;
        } else if (recipient) {
          response = `I can help you send money to ${recipient}. Please specify the amount. (confidence: ${confidence.toFixed(0)}%)`;
        } else {
          response = `I can help you transfer money. Please specify the amount and recipient. (confidence: ${confidence.toFixed(0)}%)`;
        }
        break;
        
      case 'help':
        response = `🤖 AI FinBot Help (confidence: ${confidence.toFixed(0)}%)\n\n`;
        response += `I can help you with:\n`;
        response += `💰 Balance inquiry: "What's my balance?"\n`;
        response += `📊 Transaction history: "Show recent transactions"\n`;
        response += `💸 Money transfers: "Send $50 to John"\n`;
        response += `❓ Help: "What can you do?"\n\n`;
        response += `Type 'exit' to quit the chatbot.`;
        break;
        
      default:
        response = `I'm not sure how to help with that. Try asking about your balance, transactions, or transfers. (confidence: ${confidence.toFixed(0)}%)`;
    }
    
    return response;
  }
}

// Interactive CLI Interface
function startChatbot() {
  console.log('🤖 AI FinBot Started!');
  console.log('💡 Try: "What\'s my balance?" or "Show transactions"');
  console.log('');
  
  const finbot = new FinancialAI();
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  function askQuestion() {
    rl.question('You: ', (input) => {
      if (input.toLowerCase().trim() === 'exit') {
        console.log('👋 Goodbye!');
        rl.close();
        return;
      }
      
      if (input.trim()) {
        const response = finbot.processInput(input);
        console.log(`Bot: ${response}`);
        console.log('');
      }
      
      askQuestion();
    });
  }
  
  askQuestion();
}

// Start the chatbot
if (require.main === module) {
  startChatbot();
}

module.exports = FinancialAI;