# Inventory Tracker API Documentation

Complete API reference for the Inventory Tracker platform.

## Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

## Authentication

The API supports two authentication methods:

1. **Session-based (Dashboard)** - NextAuth.js session cookies
2. **API Key (Public API)** - `X-API-Key` header

---

## 1. Authentication & User Management

### 1.1 Register New User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe" // optional
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "clx123...",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors:**
- `400` - User already exists or validation error
- `500` - Server error

---

### 1.2 Sign In

Sign in with NextAuth.js (client-side):

```typescript
import { signIn } from "next-auth/react"

const result = await signIn("credentials", {
  email: "user@example.com",
  password: "password123",
  redirect: false
})
```

---

## 2. Room Management

Rooms are the top-level organizational unit in your inventory.

### 2.1 Get All Rooms

**Endpoint:** `GET /api/rooms`

**Auth:** Session required

**Response:** `200 OK`
```json
{
  "rooms": [
    {
      "id": "clx123...",
      "name": "Kitchen",
      "description": "Kitchen storage area",
      "userId": "clx456...",
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z",
      "categories": [
        {
          "id": "clx789...",
          "name": "Food",
          "items": [...]
        }
      ]
    }
  ]
}
```

---

### 2.2 Create Room

**Endpoint:** `POST /api/rooms`

**Auth:** Session required

**Request:**
```json
{
  "name": "Garage",
  "description": "Garage storage" // optional
}
```

**Response:** `200 OK`
```json
{
  "room": {
    "id": "clx123...",
    "name": "Garage",
    "description": "Garage storage",
    "userId": "clx456...",
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  }
}
```

---

### 2.3 Update Room

**Endpoint:** `PUT /api/rooms/[roomId]`

**Auth:** Session required

**Request:**
```json
{
  "name": "Updated Garage",
  "description": "New description"
}
```

---

### 2.4 Delete Room

**Endpoint:** `DELETE /api/rooms/[roomId]`

**Auth:** Session required

**Response:** `200 OK`
```json
{
  "success": true
}
```

**Note:** Deleting a room cascades to all categories and items within it.

---

## 3. Category Management

Categories organize items within a room.

### 3.1 Create Category

**Endpoint:** `POST /api/categories`

**Auth:** Session required

**Request:**
```json
{
  "name": "Electronics",
  "description": "Electronic items", // optional
  "roomId": "clx123..."
}
```

**Response:** `200 OK`
```json
{
  "category": {
    "id": "clx789...",
    "name": "Electronics",
    "description": "Electronic items",
    "roomId": "clx123...",
    "createdAt": "2025-01-15T10:00:00Z",
    "items": []
  }
}
```

---

### 3.2 Update Category

**Endpoint:** `PUT /api/categories/[categoryId]`

**Auth:** Session required

**Request:**
```json
{
  "name": "Updated Electronics",
  "description": "New description"
}
```

---

### 3.3 Delete Category

**Endpoint:** `DELETE /api/categories/[categoryId]`

**Auth:** Session required

**Note:** Deleting a category cascades to all items within it.

---

## 4. Item Management

Items are the individual inventory units.

### 4.1 Create Item

**Endpoint:** `POST /api/items`

**Auth:** Session required

**Request:**
```json
{
  "name": "MacBook Pro",
  "description": "15-inch, 2023 model",
  "quantity": 2,
  "lowStockThreshold": 1,
  "categoryId": "clx789...",
  "imageUrl": "https://example.com/image.jpg" // optional
}
```

**Response:** `200 OK`
```json
{
  "item": {
    "id": "clx999...",
    "name": "MacBook Pro",
    "description": "15-inch, 2023 model",
    "quantity": 2,
    "lowStockThreshold": 1,
    "imageUrl": "https://example.com/image.jpg",
    "categoryId": "clx789...",
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  }
}
```

---

### 4.2 Get Item

**Endpoint:** `GET /api/items/[itemId]`

**Auth:** Session required

---

### 4.3 Update Item

**Endpoint:** `PUT /api/items/[itemId]`

**Auth:** Session required

**Request:**
```json
{
  "quantity": 5,
  "name": "Updated name", // optional
  "description": "Updated description", // optional
  "lowStockThreshold": 2, // optional
  "imageUrl": "https://..." // optional or null
}
```

---

### 4.4 Delete Item

**Endpoint:** `DELETE /api/items/[itemId]`

**Auth:** Session required

---

## 5. API Key Management

Generate and manage API keys for programmatic access.

### 5.1 Get All API Keys

**Endpoint:** `GET /api/keys`

**Auth:** Session required

**Response:** `200 OK`
```json
{
  "apiKeys": [
    {
      "id": "clx888...",
      "name": "Production Key",
      "isActive": true,
      "lastUsed": "2025-01-15T09:30:00Z",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

**Note:** The actual API key is never returned after creation.

---

### 5.2 Generate API Key

**Endpoint:** `POST /api/keys`

**Auth:** Session required

**Request:**
```json
{
  "name": "Production API Key"
}
```

**Response:** `200 OK`
```json
{
  "apiKey": {
    "id": "clx888...",
    "name": "Production API Key",
    "isActive": true,
    "createdAt": "2025-01-15T10:00:00Z"
  },
  "plainKey": "inv_1234567890abcdef..."
}
```

**Important:** The `plainKey` is only shown once. Store it securely!

---

### 5.3 Delete API Key

**Endpoint:** `DELETE /api/keys/[keyId]`

**Auth:** Session required

---

## 6. Public API (API Key Required)

All public API endpoints require the `X-API-Key` header:

```
X-API-Key: inv_1234567890abcdef...
```

### 6.1 Get All Inventory

Retrieve all rooms, categories, and items for the authenticated user.

**Endpoint:** `GET /api/v1/inventory`

**Headers:**
```
X-API-Key: inv_1234567890abcdef...
```

**Response:** `200 OK`
```json
{
  "rooms": [
    {
      "id": "clx123...",
      "name": "Kitchen",
      "description": "Kitchen storage",
      "categories": [
        {
          "id": "clx456...",
          "name": "Food",
          "items": [
            {
              "id": "clx789...",
              "name": "Rice",
              "quantity": 10,
              "lowStockThreshold": 3
            }
          ]
        }
      ]
    }
  ],
  "totalRooms": 5,
  "totalCategories": 15,
  "totalItems": 120
}
```

---

### 6.2 Get Single Item

**Endpoint:** `GET /api/v1/inventory/items/[itemId]`

**Headers:**
```
X-API-Key: inv_1234567890abcdef...
```

**Response:** `200 OK`
```json
{
  "item": {
    "id": "clx789...",
    "name": "Rice",
    "description": "White rice 5kg",
    "quantity": 10,
    "lowStockThreshold": 3,
    "imageUrl": "https://...",
    "category": {
      "id": "clx456...",
      "name": "Food",
      "room": {
        "id": "clx123...",
        "name": "Kitchen"
      }
    }
  }
}
```

---

### 6.3 Update Item Quantity

Update item stock levels via API.

**Endpoint:** `POST /api/v1/inventory/items/[itemId]`

**Headers:**
```
X-API-Key: inv_1234567890abcdef...
Content-Type: application/json
```

**Request:**
```json
{
  "quantity": 5,
  "name": "Updated name", // optional
  "description": "Updated description", // optional
  "lowStockThreshold": 2 // optional
}
```

**Response:** `200 OK`
```json
{
  "item": {
    "id": "clx789...",
    "name": "Rice",
    "quantity": 5,
    ...
  },
  "message": "Item updated successfully"
}
```

---

## Error Responses

All endpoints return consistent error responses:

### 400 Bad Request
```json
{
  "error": "Validation error description"
}
```

or

```json
{
  "error": [
    {
      "path": ["fieldName"],
      "message": "Field is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

or

```json
{
  "error": "API key is required"
}
```

or

```json
{
  "error": "Invalid API key"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider implementing rate limiting on public API endpoints.

**Recommended limits:**
- Authenticated users: 1000 requests/hour
- API key users: 5000 requests/hour

---

## Webhooks (Future)

Webhook support for real-time notifications is planned for future releases.

---

## Example Usage

### cURL Examples

**Get all rooms:**
```bash
curl -X GET http://localhost:3000/api/rooms \
  -H "Cookie: next-auth.session-token=..."
```

**Create room:**
```bash
curl -X POST http://localhost:3000/api/rooms \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{"name":"Garage","description":"Storage area"}'
```

**Public API - Get inventory:**
```bash
curl -X GET http://localhost:3000/api/v1/inventory \
  -H "X-API-Key: inv_1234567890abcdef..."
```

**Public API - Update item:**
```bash
curl -X POST http://localhost:3000/api/v1/inventory/items/clx789 \
  -H "X-API-Key: inv_1234567890abcdef..." \
  -H "Content-Type: application/json" \
  -d '{"quantity":8}'
```

### JavaScript/TypeScript Examples

**Using fetch:**
```typescript
// Get all rooms (authenticated)
const rooms = await fetch('/api/rooms', {
  credentials: 'include'
}).then(res => res.json())

// Create item
const item = await fetch('/api/items', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Laptop',
    quantity: 3,
    categoryId: 'clx123...'
  })
}).then(res => res.json())

// Public API - Get inventory
const inventory = await fetch('/api/v1/inventory', {
  headers: { 'X-API-Key': 'inv_1234567890abcdef...' }
}).then(res => res.json())
```

---

## Need Help?

For questions or issues, please:
1. Check this documentation
2. Review the README.md
3. Open an issue on GitHub
