# AI FinBot - Custom Fintech Chatbot

A simple AI-powered fintech chatbot built with Natural.js for natural language processing. No external APIs required - everything runs locally.

## Features

- **Intent Classification**: Balance inquiry, transaction history, money transfers, help
- **Entity Extraction**: Recognizes money amounts and recipient names
- **Mock Banking Data**: Sample balance and transaction history
- **Interactive CLI**: Command-line chat interface with confidence scores
- **Custom AI Engine**: Built from scratch using Natural.js Bayes classifier

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

**Basic Chatbot** (pre-configured responses):
```bash
npm start
```

**Smart Chatbot** (real data analysis):
```bash
npm run smart
```

**Advanced AI Assistant** (top-class features):
```bash
npm run advanced
```

Or run directly:
```bash
node chatbot.js          # Basic
node smart-chatbot.js    # Smart
node advanced-finbot.js  # Advanced AI
```

## Example Interactions

```
🤖 AI FinBot Started!
💡 Try: "What's my balance?" or "Show transactions"

You: What's my balance?
Bot: Your current balance is $2,450.75 (confidence: 95%)

You: Show recent transactions
Bot: Here are your recent transactions (confidence: 92%):
- 2024-01-15: Grocery Store -$85.50
- 2024-01-14: Salary Deposit +$3,000.00
- 2024-01-13: Coffee Shop -$4.75
...

You: Send $50 to John
Bot: Transfer request: Send $50 to John (confidence: 88%)
⚠️  This is a demo - no actual transfer will be made.

You: help
Bot: 🤖 AI FinBot Help (confidence: 98%)

I can help you with:
💰 Balance inquiry: "What's my balance?"
📊 Transaction history: "Show recent transactions"  
💸 Money transfers: "Send $50 to John"
❓ Help: "What can you do?"

Type 'exit' to quit the chatbot.

You: exit
👋 Goodbye!
```

## Technical Details

- **NLP Engine**: Natural.js Bayes classifier
- **Training Data**: 10+ examples per intent category
- **Entity Recognition**: Custom regex patterns for amounts and names
- **No External Dependencies**: Pure Node.js + Natural.js only
- **Single File**: Complete implementation in `chatbot.js`

## Supported Commands

- Balance queries: "balance", "what's my balance", "account balance"
- Transaction history: "transactions", "recent spending", "account activity"
- Money transfers: "send money", "transfer $X to Name", "pay someone"
- Help: "help", "what can you do", "commands"

Type `exit` to quit the chatbot.