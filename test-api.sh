#!/bin/bash

# Test API Script for Inventory Tracker
# Make executable with: chmod +x test-api.sh

BASE_URL="http://localhost:3000"

echo "🧪 Testing Inventory Tracker API"
echo "================================"

# 1. Register a test user
echo ""
echo "1️⃣  Registering test user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }')

echo "Response: $REGISTER_RESPONSE"

# Note: For session-based endpoints, you'll need to sign in via the UI
# or use a tool like Postman that can handle session cookies

echo ""
echo "✅ Registration complete!"
echo ""
echo "📝 Next steps:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Click 'Sign In'"
echo "3. Use credentials:"
echo "   Email: test@example.com"
echo "   Password: password123"
echo ""
echo "4. Navigate to /dashboard to see the dashboard"
echo ""
echo "To test the API with curl, you'll need to:"
echo "- Sign in through the browser first"
echo "- Copy the session cookie"
echo "- Include it in curl requests"
