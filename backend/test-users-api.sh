#!/bin/bash

# Base URL for the API
BASE_URL="http://localhost:3000/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}===== Testing Kigali Women Hub API Routes =====${NC}"

#-------------------------------------------------------------------------
echo -e "\n${YELLOW}===== USER AUTHENTICATION TESTS =====${NC}"
#-------------------------------------------------------------------------

# 1. Register a new user
echo -e "\n${BLUE}1. Registering a new user${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }')
echo $REGISTER_RESPONSE | jq

# Extract user ID for later use
USER_ID=$(echo $REGISTER_RESPONSE | grep -o '"userId":"[^"]*' | sed 's/"userId":"//')
echo -e "${GREEN}Created user with ID: $USER_ID${NC}"

# 2. Login with the newly created user
echo -e "\n${BLUE}2. Logging in with created user${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')
echo $LOGIN_RESPONSE | jq

# Extract token for authentication
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')
echo -e "${GREEN}Received token: ${TOKEN:0:20}...${NC}"

# 3. Get user profile (protected route)
echo -e "\n${BLUE}3. Getting user profile (protected route)${NC}"
curl -s -X GET $BASE_URL/users/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq

#-------------------------------------------------------------------------
echo -e "\n${YELLOW}===== RESOURCE MANAGEMENT TESTS =====${NC}"
#-------------------------------------------------------------------------

# 10. Create a new resource (protected route)
echo -e "\n${BLUE}10. Creating a new resource${NC}"
RESOURCE_RESPONSE=$(curl -s -X POST $BASE_URL/resources \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Women Entrepreneurship Workshop",
    "description": "A comprehensive workshop on starting a business",
    "category": "Business",
    "url": "https://example.com/workshop",
    "imageUrl": "https://example.com/images/workshop.jpg"
  }')
echo $RESOURCE_RESPONSE | jq

# Extract resource ID for later use
RESOURCE_ID=$(echo $RESOURCE_RESPONSE | grep -o '"_id":"[^"]*' | sed 's/"_id":"//')
if [ -z "$RESOURCE_ID" ]; then
  RESOURCE_ID=$(echo $RESOURCE_RESPONSE | grep -o '"resource":{[^}]*"_id":"[^"]*' | grep -o '"_id":"[^"]*' | sed 's/"_id":"//')
fi

echo -e "${GREEN}Created resource with ID: $RESOURCE_ID${NC}"

# 11. Get all resources (public route)
echo -e "\n${BLUE}11. Getting all resources${NC}"
curl -s -X GET $BASE_URL/resources | jq

# 12. Get resource by ID
echo -e "\n${BLUE}12. Getting resource by ID${NC}"
curl -s -X GET $BASE_URL/resources/$RESOURCE_ID | jq

# 13. Update the resource (protected route)
echo -e "\n${BLUE}13. Updating resource${NC}"
curl -s -X PUT $BASE_URL/resources/$RESOURCE_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated: Women Leadership Workshop",
    "description": "Learn leadership skills for business and community"
  }' | jq

# 14. Get the updated resource
echo -e "\n${BLUE}14. Getting updated resource${NC}"
curl -s -X GET $BASE_URL/resources/$RESOURCE_ID | jq

# 15. Register a second user to test authorization
echo -e "\n${BLUE}15. Registering a second user${NC}"
REGISTER_RESPONSE2=$(curl -s -X POST $BASE_URL/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another User",
    "email": "another@example.com",
    "password": "password456"
  }')
echo $REGISTER_RESPONSE2 | jq

# Login with second user
echo -e "\n${BLUE}16. Logging in with second user${NC}"
LOGIN_RESPONSE2=$(curl -s -X POST $BASE_URL/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "another@example.com",
    "password": "password456"
  }')
echo $LOGIN_RESPONSE2 | jq

# Extract second token
TOKEN2=$(echo $LOGIN_RESPONSE2 | grep -o '"token":"[^"]*' | sed 's/"token":"//')

# 17. Attempt to update resource with different user (should fail)
echo -e "\n${BLUE}17. Attempting to update resource with different user (should fail)${NC}"
curl -s -X PUT $BASE_URL/resources/$RESOURCE_ID \
  -H "Authorization: Bearer $TOKEN2" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Unauthorized update attempt"
  }' | jq

# 18. Delete the resource (with original user)
echo -e "\n${BLUE}18. Deleting resource${NC}"
curl -s -X DELETE $BASE_URL/resources/$RESOURCE_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq

# 19. Verify resource is deleted
echo -e "\n${BLUE}19. Verifying resource is deleted${NC}"
curl -s -X GET $BASE_URL/resources/$RESOURCE_ID | jq

#-------------------------------------------------------------------------
echo -e "\n${YELLOW}===== CLEANUP TESTS =====${NC}"
#-------------------------------------------------------------------------

# 20. Delete the first user
echo -e "\n${BLUE}20. Deleting first user${NC}"
curl -s -X DELETE $BASE_URL/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq

echo -e "\n${GREEN}Testing complete!${NC}"