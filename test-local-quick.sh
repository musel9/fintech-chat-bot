#!/bin/bash

echo "🧪 Quick Local Test of Fintech Chatbot"
echo "======================================"

# Function to test endpoint
test_endpoint() {
    local message="$1"
    local description="$2"
    local language="$3"
    
    echo ""
    echo "📝 Testing: $description"
    echo "💬 Message: \"$message\""
    
    response=$(curl -s -X POST http://localhost:3000/chat \
        -H "Content-Type: application/json" \
        -d "{\"message\":\"$message\"}" 2>/dev/null)
    
    if [ $? -eq 0 ] && [ ! -z "$response" ]; then
        # Extract key fields (basic parsing without jq)
        model=$(echo "$response" | grep -o '"model":"[^"]*"' | cut -d'"' -f4 2>/dev/null || echo "unknown")
        success=$(echo "$response" | grep -o '"success":[^,}]*' | cut -d':' -f2 2>/dev/null || echo "unknown")
        
        echo "✅ Response received"
        echo "🤖 Model: $model"
        echo "📊 Success: $success" 
        echo "🌐 Expected Language: $language"
        
        # Show first 100 characters of response
        response_text=$(echo "$response" | grep -o '"response":"[^"]*"' | cut -d'"' -f4 | cut -c1-100 2>/dev/null)
        if [ ! -z "$response_text" ]; then
            echo "📄 Preview: $response_text..."
        fi
    else
        echo "❌ Failed to get response"
    fi
}

# Check if server is running
echo "🔍 Checking if server is running..."
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Server is running on port 3000"
elif curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Server is running on port 3001"
    # Update port for tests
    sed -i 's/:3000/:3001/g' "$0"
    echo "🔄 Updated test script to use port 3001"
else
    echo "❌ Server is not running"
    echo "💡 Start the server first:"
    echo "   ./start-local.sh"
    echo "   or"
    echo "   npm start"
    exit 1
fi

# Run tests
echo ""
echo "🧪 Running tests..."

# Financial questions (English)
test_endpoint "Should I invest more money?" "Financial advice" "English"
test_endpoint "كيف يمكنني توفير المال؟" "Savings advice" "Arabic"

# Non-financial (should be rejected)
test_endpoint "What's the weather today?" "Non-financial query" "English (rejected)"

# Security question
test_endpoint "Is my account secure from fraud?" "Security advice" "English"

echo ""
echo "🎉 Quick test completed!"
echo ""
echo "💡 For more comprehensive testing:"
echo "   node test-enhanced-features.js"
echo ""
echo "🔧 Manual testing:"
echo "   curl -X POST http://localhost:3000/chat -H \"Content-Type: application/json\" -d '{\"message\":\"Should I invest?\"}'"