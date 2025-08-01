#!/bin/bash

echo "🚀 Starting Enhanced Fintech Chatbot Locally"
echo "============================================"

# Kill any existing processes on port 3000
echo "🔧 Cleaning up existing processes..."
lsof -ti :3000 | xargs kill -9 2>/dev/null || echo "Port 3000 was already free"

# Wait a moment
sleep 2

# Check if GEMINI_API_KEY is set
if [ -z "$GEMINI_API_KEY" ]; then
    echo "🔑 Loading API key from .env file..."
    if [ -f .env ]; then
        export $(cat .env | xargs)
        echo "✅ API key loaded from .env"
    else
        echo "❌ No .env file found and GEMINI_API_KEY not set"
        echo "💡 Please set GEMINI_API_KEY environment variable"
        exit 1
    fi
else
    echo "✅ GEMINI_API_KEY already set"
fi

# Start the server
echo "🚀 Starting server on port 3000..."
echo "📡 Health check will be: http://localhost:3000/health"
echo "💬 Chat endpoint will be: POST http://localhost:3000/chat"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================"

# Start with explicit environment variable
GEMINI_API_KEY=${GEMINI_API_KEY} node server.js