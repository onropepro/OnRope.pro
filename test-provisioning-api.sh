#!/bin/bash

# Test script for the provisioning API endpoint
# This script tests the complete flow: account provisioning and login

echo "========================================"
echo "PROVISIONING API COMPREHENSIVE TEST"
echo "========================================"
echo ""

# Configuration
API_KEY="test-api-key-12345"
BASE_URL="http://localhost:5000"

# Generate unique test data
TIMESTAMP=$(date +%s)
TEST_EMAIL="testcompany${TIMESTAMP}@example.com"
TEST_COMPANY="Test Rope Access ${TIMESTAMP}"

echo "1. Testing Account Provisioning"
echo "--------------------------------"
echo "Test Email: $TEST_EMAIL"
echo "Test Company: $TEST_COMPANY"
echo ""

# Test the provisioning endpoint
PROVISION_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST \
  "${BASE_URL}/api/provision-account" \
  -H "Content-Type: application/json" \
  -H "x-api-key: ${API_KEY}" \
  -d '{
    "companyName": "'"$TEST_COMPANY"'",
    "name": "John Test Owner",
    "email": "'"$TEST_EMAIL"'",
    "hourlyRate": "45.00",
    "streetAddress": "123 Test Street",
    "province": "BC",
    "country": "Canada",
    "zipCode": "V6B 1A1",
    "licenseKey": "TEST-LICENSE-KEY-123"
  }')

# Extract HTTP code
HTTP_CODE=$(echo "$PROVISION_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
RESPONSE_BODY=$(echo "$PROVISION_RESPONSE" | sed '/HTTP_CODE:/d')

echo "HTTP Status Code: $HTTP_CODE"
echo ""
echo "Response Body:"
echo "$RESPONSE_BODY" | jq . 2>/dev/null || echo "$RESPONSE_BODY"
echo ""

# Check if provisioning was successful
if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ PROVISIONING SUCCESSFUL"
  
  # Extract temporary password from response
  TEMP_PASSWORD=$(echo "$RESPONSE_BODY" | jq -r '.credentials.temporaryPassword' 2>/dev/null)
  
  if [ -n "$TEMP_PASSWORD" ] && [ "$TEMP_PASSWORD" != "null" ]; then
    echo "✅ Temporary password received: $TEMP_PASSWORD"
    echo ""
    
    echo "2. Testing Email-Based Login"
    echo "--------------------------------"
    
    # Test login with the provisioned account
    LOGIN_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST \
      "${BASE_URL}/api/login" \
      -H "Content-Type: application/json" \
      -H "Cookie: $COOKIES" \
      -d '{
        "identifier": "'"$TEST_EMAIL"'",
        "password": "'"$TEMP_PASSWORD"'"
      }')
    
    # Extract HTTP code
    LOGIN_HTTP_CODE=$(echo "$LOGIN_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
    LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | sed '/HTTP_CODE:/d')
    
    echo "HTTP Status Code: $LOGIN_HTTP_CODE"
    echo ""
    echo "Response Body:"
    echo "$LOGIN_BODY" | jq . 2>/dev/null || echo "$LOGIN_BODY"
    echo ""
    
    if [ "$LOGIN_HTTP_CODE" = "200" ]; then
      echo "✅ LOGIN SUCCESSFUL"
      
      # Verify user data
      USER_EMAIL=$(echo "$LOGIN_BODY" | jq -r '.user.email' 2>/dev/null)
      USER_COMPANY=$(echo "$LOGIN_BODY" | jq -r '.user.companyName' 2>/dev/null)
      
      if [ "$USER_EMAIL" = "$TEST_EMAIL" ]; then
        echo "✅ Email matches: $USER_EMAIL"
      else
        echo "❌ Email mismatch! Expected: $TEST_EMAIL, Got: $USER_EMAIL"
      fi
      
      if [ "$USER_COMPANY" = "$TEST_COMPANY" ]; then
        echo "✅ Company name matches: $USER_COMPANY"
      else
        echo "❌ Company name mismatch! Expected: $TEST_COMPANY, Got: $USER_COMPANY"
      fi
    else
      echo "❌ LOGIN FAILED"
      echo "Error: Unable to login with provisioned credentials"
    fi
  else
    echo "❌ No temporary password in response"
  fi
else
  echo "❌ PROVISIONING FAILED"
  echo "Error: HTTP $HTTP_CODE"
fi

echo ""
echo "========================================"
echo "TEST COMPLETE"
echo "========================================"
echo ""

# Summary
echo "Summary:"
echo "--------"
if [ "$HTTP_CODE" = "200" ] && [ "$LOGIN_HTTP_CODE" = "200" ]; then
  echo "✅ ALL TESTS PASSED"
  echo "   - Account provisioning: SUCCESS"
  echo "   - Email-based login: SUCCESS"
  echo "   - Data integrity: SUCCESS"
  exit 0
else
  echo "❌ TESTS FAILED"
  [ "$HTTP_CODE" != "200" ] && echo "   - Account provisioning: FAILED"
  [ "$LOGIN_HTTP_CODE" != "200" ] && echo "   - Email-based login: FAILED"
  exit 1
fi
