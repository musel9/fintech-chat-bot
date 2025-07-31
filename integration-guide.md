# 🤖 PersonalizedFinBot Integration Guide

## Overview
This guide shows how to integrate the AI chatbot into your existing fintech application with user-specific learning and personalization.

## Quick Start

### 1. Install Dependencies
```bash
npm install natural sqlite3 ml-regression simple-statistics moment
```

### 2. Import and Initialize
```javascript
const { FinBotAPI } = require('./app-integration-example');

// Initialize the chatbot API
const finBot = new FinBotAPI('./path/to/your/database.db');
```

### 3. User Login (when user logs into your app)
```javascript
// When user logs in to your application
const loginResult = await finBot.loginUser(customerId);
if (loginResult.success) {
  console.log(`Welcome ${loginResult.user.first_name}!`);
}
```

### 4. Process Chat Messages
```javascript
// Handle user chat messages
const response = await finBot.processMessage(customerId, userMessage);
if (response.success) {
  // Send bot response back to user
  sendToUser(response.response);
}
```

## API Methods

### Core Methods

#### `loginUser(customerId)`
- Initializes user session and loads personalized profile
- Returns user info and welcome message
- Starts behavior tracking for this session

#### `processMessage(customerId, message)`
- Processes user input with personalized AI
- Returns AI response tailored to user's behavior
- Automatically tracks interaction patterns

#### `getUserDashboard(customerId)`
- Gets comprehensive user financial dashboard
- Includes stats, insights, and recommendations
- Perfect for app dashboard integration

#### `getAllUsersWithStats()`
- Admin method to get all users with their stats
- Shows active sessions and user engagement
- Useful for admin panels

### Utility Methods

#### `getSessionInfo(customerId)`
- Returns current session information
- Shows interaction count and session duration

#### `logoutUser(customerId)`
- Cleanly ends user session
- Clears session data from memory

## Integration Examples

### React Component Example
```jsx
import React, { useState, useEffect } from 'react';
import { FinBotAPI } from './PersonalizedFinBot';

const ChatBot = ({ userId }) => {
  const [bot] = useState(new FinBotAPI());
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Login user when component mounts
    bot.loginUser(userId).then(result => {
      if (result.success) {
        setMessages([{
          type: 'bot',
          text: result.message
        }]);
      }
    });

    return () => bot.disconnect();
  }, [userId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: input }]);

    // Get bot response
    const response = await bot.processMessage(userId, input);
    if (response.success) {
      setMessages(prev => [...prev, { type: 'bot', text: response.response }]);
    }

    setInput('');
  };

  return (
    <div className="chatbot">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="اكتب رسالتك..."
        />
        <button onClick={sendMessage}>إرسال</button>
      </div>
    </div>
  );
};
```

### Express.js API Example
```javascript
const express = require('express');
const { FinBotAPI } = require('./PersonalizedFinBot');

const app = express();
const finBot = new FinBotAPI();

app.use(express.json());

// Chat endpoint
app.post('/api/chat/:userId', async (req, res) => {
  const { userId } = req.params;
  const { message } = req.body;

  try {
    const response = await finBot.processMessage(parseInt(userId), message);
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dashboard endpoint
app.get('/api/dashboard/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const dashboard = await finBot.getUserDashboard(parseInt(userId));
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin endpoint
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await finBot.getAllUsersWithStats();
    res.json(users);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log('FinBot API running on port 3000');
});
```

## Personalization Features

### User Behavior Learning
- **Interaction Tracking**: Records every user query and response
- **Pattern Recognition**: Identifies user's preferred query types
- **Usage Analytics**: Tracks session length, frequency, and engagement

### Personalized Models
- **Individual ML Models**: Each user gets their own prediction models
- **Behavior-Based Recommendations**: Advice tailored to user's financial habits
- **Historical Context**: Responses consider user's past interactions

### Adaptive Responses
- **Language Detection**: Automatically responds in Arabic or English
- **Context Awareness**: Remembers conversation context
- **Personal Greetings**: Uses user's name and personal insights

## Database Schema
The bot works with your existing customer database structure:
- `customers` table with customer_id, first_name, last_name, etc.
- `accounts` table with account information
- `transactions` table with transaction history

## Advanced Features

### Financial Health Scoring
Each user gets a personalized financial health score based on:
- Account balances and diversity
- Transaction success rates
- Spending patterns
- Historical behavior

### Predictive Analytics
- **Personal Spending Predictions**: 3-month forecasts per user
- **Risk Assessment**: Individual risk scoring
- **Anomaly Detection**: Unusual activity detection per user

### Behavioral Insights
- **Usage Patterns**: When and how users interact
- **Interest Analysis**: What topics users care about most
- **Engagement Metrics**: Session quality and satisfaction

## Performance & Scalability

### Memory Management
- User profiles cached in memory for fast access
- Automatic cleanup of old session data
- Configurable cache limits

### Database Optimization
- Indexed queries for fast user lookups
- Batch processing for multiple users
- Connection pooling support

## Security Considerations

### Data Privacy
- User data kept isolated per customer_id
- No cross-user data sharing
- Session-based access control

### Input Validation
- SQL injection protection
- Input sanitization
- Error handling

## Testing

Run the integration demo:
```bash
node app-integration-example.js
```

This will demonstrate:
1. User login and session creation
2. Message processing with personalization
3. Dashboard data generation
4. Multi-user management

## Support & Customization

The chatbot can be customized for:
- Additional languages
- Custom financial products
- Specific business rules
- Custom ML models
- Integration with external APIs

For advanced customization, modify the `PersonalizedFinBot.js` class methods to fit your specific business requirements.