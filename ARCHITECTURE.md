# Inventory Tracker - System Architecture

## Overview

This document provides a detailed architecture overview of the Inventory Tracker SaaS platform, explaining design decisions, data flow, and system components.

---

## Architecture Decisions

### Why Next.js 14 (App Router)?

1. **Full-stack in One** - No separate backend server needed
2. **Type Safety** - TypeScript across frontend and backend
3. **Server Components** - Optimal performance with RSC
4. **API Routes** - Built-in REST API support
5. **Easy Deployment** - Vercel integration
6. **SEO Friendly** - Server-side rendering

### Why PostgreSQL + Prisma?

1. **Relational Data** - Perfect for hierarchical inventory structure
2. **ACID Compliance** - Data integrity for inventory counts
3. **Type Safety** - Prisma generates TypeScript types
4. **Migrations** - Schema versioning and evolution
5. **Developer Experience** - Excellent tooling (Prisma Studio)

### Why NextAuth.js?

1. **Battle-tested** - Industry standard for Next.js auth
2. **Flexible** - Supports multiple providers
3. **JWT Sessions** - Stateless authentication
4. **TypeScript** - Full type safety
5. **Easy Integration** - Works seamlessly with Next.js

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
├─────────────────────────────────────────────────────────┤
│  React Components (Next.js App Router)                  │
│  - Landing Page                                         │
│  - Dashboard UI                                         │
│  - Room/Category/Item Management                        │
│  - API Key Management                                   │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  API Layer (Next.js)                    │
├─────────────────────────────────────────────────────────┤
│  Authentication Routes                                  │
│  ├─ POST /api/auth/register                            │
│  └─ POST /api/auth/[...nextauth]                       │
│                                                         │
│  Authenticated API Routes (Session-based)               │
│  ├─ /api/rooms         (GET, POST)                     │
│  ├─ /api/rooms/[id]    (GET, PUT, DELETE)              │
│  ├─ /api/categories    (POST)                          │
│  ├─ /api/categories/[id] (PUT, DELETE)                 │
│  ├─ /api/items         (POST)                          │
│  ├─ /api/items/[id]    (GET, PUT, DELETE)              │
│  └─ /api/keys          (GET, POST, DELETE)             │
│                                                         │
│  Public API Routes (API Key-based)                     │
│  ├─ GET  /api/v1/inventory                             │
│  ├─ GET  /api/v1/inventory/items/[id]                  │
│  └─ POST /api/v1/inventory/items/[id]                  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Business Logic Layer                       │
├─────────────────────────────────────────────────────────┤
│  Authentication (lib/auth.ts)                           │
│  ├─ Session management                                  │
│  ├─ Password hashing (bcrypt)                          │
│  └─ JWT token generation                               │
│                                                         │
│  API Key Management (lib/api-key.ts)                   │
│  ├─ Key generation (crypto)                            │
│  ├─ Key hashing (bcrypt)                               │
│  └─ Key validation                                     │
│                                                         │
│  Data Access (lib/prisma.ts)                           │
│  └─ Prisma Client singleton                            │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Data Layer (Prisma ORM)                │
├─────────────────────────────────────────────────────────┤
│  Models:                                                │
│  ├─ User                                                │
│  ├─ ApiKey                                              │
│  ├─ Room                                                │
│  ├─ Category                                            │
│  └─ Item                                                │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Database (PostgreSQL)                       │
└─────────────────────────────────────────────────────────┘
```

---

## Data Model & Relationships

### Entity Relationship Diagram

```
┌──────────────┐
│     User     │
│──────────────│
│ id (PK)      │
│ email        │◄──────┐
│ password     │       │
│ name         │       │
└──────────────┘       │
       │               │
       │ 1:N           │ 1:N
       │               │
       ▼               │
┌──────────────┐       │
│     Room     │       │
│──────────────│       │
│ id (PK)      │       │
│ name         │       │
│ userId (FK)  │───────┘
└──────────────┘
       │
       │ 1:N
       │
       ▼
┌──────────────┐
│   Category   │
│──────────────│
│ id (PK)      │
│ name         │
│ roomId (FK)  │
└──────────────┘
       │
       │ 1:N
       │
       ▼
┌──────────────┐
│     Item     │
│──────────────│
│ id (PK)      │
│ name         │
│ quantity     │
│ threshold    │
│ categoryId   │
└──────────────┘

┌──────────────┐
│    ApiKey    │
│──────────────│
│ id (PK)      │
│ key (hashed) │
│ userId (FK)  │───┐
│ isActive     │   │
│ lastUsed     │   │
└──────────────┘   │
                   │
                   └──► User (N:1)
```

### Cascade Behavior

```
User deleted
  └─► Rooms deleted
       └─► Categories deleted
            └─► Items deleted

User deleted
  └─► API Keys deleted

Room deleted
  └─► Categories deleted
       └─► Items deleted

Category deleted
  └─► Items deleted
```

---

## Authentication Flow

### Session-based Authentication (Dashboard)

```
1. User Registration
   ┌─────────┐   POST /api/auth/register   ┌─────────┐
   │ Client  │──────────────────────────────►│  API    │
   └─────────┘   {email, password, name}    └─────────┘
                                                   │
                                                   ▼
                                             Hash password
                                                   │
                                                   ▼
                                             Create user
                                                   │
                                                   ▼
                                            Return user data

2. User Sign In
   ┌─────────┐   signIn("credentials")      ┌─────────┐
   │ Client  │──────────────────────────────►│NextAuth │
   └─────────┘   {email, password}           └─────────┘
                                                   │
                                                   ▼
                                             Verify password
                                                   │
                                                   ▼
                                             Create JWT session
                                                   │
                                                   ▼
                                             Set session cookie
                                                   │
                                                   ▼
                                            ┌─────────┐
                                            │ Client  │
                                            └─────────┘

3. Authenticated Request
   ┌─────────┐   GET /api/rooms              ┌─────────┐
   │ Client  │──────────────────────────────►│  API    │
   └─────────┘   Cookie: session-token       └─────────┘
                                                   │
                                                   ▼
                                             getServerSession()
                                                   │
                                                   ▼
                                             Verify session
                                                   │
                                                   ▼
                                             Get user data
                                                   │
                                                   ▼
                                             Return response
```

### API Key Authentication (Public API)

```
1. Generate API Key
   ┌─────────┐   POST /api/keys              ┌─────────┐
   │Dashboard│──────────────────────────────►│  API    │
   └─────────┘   {name}                      └─────────┘
                                                   │
                                                   ▼
                                             Generate key
                                             (inv_[64 hex chars])
                                                   │
                                                   ▼
                                             Hash with bcrypt
                                                   │
                                                   ▼
                                             Store hashed key
                                                   │
                                                   ▼
                                             Return plain key
                                             (ONLY TIME!)

2. Use API Key
   ┌─────────┐   GET /api/v1/inventory       ┌─────────┐
   │ Client  │──────────────────────────────►│  API    │
   └─────────┘   X-API-Key: inv_...          └─────────┘
                                                   │
                                                   ▼
                                             Get all hashed keys
                                                   │
                                                   ▼
                                             Compare with bcrypt
                                                   │
                                                   ▼
                                             If match: get userId
                                                   │
                                                   ▼
                                             Update lastUsed
                                                   │
                                                   ▼
                                             Return user data
```

---

## Security Architecture

### Password Security

```
Registration/Login Flow:
┌────────────┐
│  Password  │
└────────────┘
      │
      ▼
┌────────────────────┐
│  bcrypt.hash()     │  ← 12 rounds
│  Salt + Hash       │
└────────────────────┘
      │
      ▼
┌────────────────────┐
│  Database          │
│  (hashed password) │
└────────────────────┘

Login Verification:
┌────────────┐     ┌────────────────────┐
│  Password  │────►│  bcrypt.compare()  │
└────────────┘     │  with stored hash  │
                   └────────────────────┘
                             │
                             ▼
                      ┌──────────────┐
                      │ Match? Y/N   │
                      └──────────────┘
```

### API Key Security

```
Key Generation:
crypto.randomBytes(32) → "inv_[64 hex chars]"
   │
   ▼
bcrypt.hash(key, 12) → Stored in DB
   │
   ▼
Plain key returned ONCE to user

Key Validation:
Incoming key → Compare with all hashed keys
   │              using bcrypt.compare()
   ▼
Match found → Return userId
   │
   ▼
Update lastUsed timestamp
```

### Authorization Layers

```
1. Session Check (Dashboard)
   ├─ getServerSession()
   ├─ If no session → 401 Unauthorized
   └─ If session → Extract userId

2. Resource Ownership Check
   ├─ Query resource with userId filter
   ├─ If not found → 404 Not Found
   └─ If found → Allow operation

3. API Key Check (Public API)
   ├─ Get X-API-Key header
   ├─ If missing → 401 Unauthorized
   ├─ Validate key
   ├─ If invalid → 401 Unauthorized
   └─ If valid → Extract userId
```

---

## Data Flow Examples

### Creating an Item

```
1. User Action
   Dashboard → Click "Add Item" → Fill form

2. Client Request
   POST /api/items
   Body: {
     name: "Laptop",
     quantity: 3,
     categoryId: "clx123..."
   }

3. Server Processing
   a. Verify session (getCurrentUser)
   b. Validate input (Zod schema)
   c. Verify category belongs to user
      ├─ Query: Category with roomId → userId
      └─ If mismatch → 404
   d. Create item in database
   e. Return created item

4. Client Update
   Update UI with new item
   Show success message
```

### Updating Item via Public API

```
1. External System
   Inventory scanner detects stock change

2. API Request
   POST /api/v1/inventory/items/clx789
   Headers:
     X-API-Key: inv_abc123...
   Body:
     { quantity: 5 }

3. Server Processing
   a. Extract API key from header
   b. Validate key (bcrypt compare)
   c. Get userId from key
   d. Update lastUsed timestamp
   e. Verify item belongs to user
   f. Update item quantity
   g. Return updated item

4. Response
   {
     item: {...},
     message: "Item updated successfully"
   }
```

---

## Performance Considerations

### Database Optimization

1. **Indexes**
   ```sql
   -- Prisma auto-creates these:
   users.email (unique)
   api_keys.key (unique)

   -- Consider adding:
   items.quantity (for low-stock queries)
   rooms.userId (for user queries)
   ```

2. **Query Optimization**
   ```typescript
   // Use includes for related data
   prisma.room.findMany({
     include: {
       categories: {
         include: { items: true }
       }
     }
   })

   // Use select to limit fields
   prisma.apiKey.findMany({
     select: {
       id: true,
       name: true,
       // Don't return the key!
     }
   })
   ```

3. **Connection Pooling**
   ```typescript
   // Prisma Client singleton prevents
   // multiple connection pools
   export const prisma = globalForPrisma.prisma ??
     new PrismaClient()
   ```

### Caching Strategy (Future)

```
1. Redis for API key validation
   ├─ Cache valid keys for 5 minutes
   └─ Reduces bcrypt comparisons

2. React Query for client state
   ├─ Cache API responses
   ├─ Background refetching
   └─ Optimistic updates

3. Next.js Route Caching
   ├─ Static pages: Cached indefinitely
   ├─ Dynamic pages: Revalidate on demand
   └─ API routes: No caching (dynamic)
```

---

## Scalability Path

### Current Architecture (Single Server)

```
┌─────────────────────────────────┐
│      Vercel Edge Network        │
│  (CDN for static assets)        │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│    Next.js Server (Vercel)      │
│  ├─ API Routes                  │
│  ├─ SSR Pages                   │
│  └─ Client Components           │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│   PostgreSQL (Supabase)         │
└─────────────────────────────────┘
```

### Future Scalability (Microservices)

```
┌────────────────┐
│   API Gateway  │
│  (Rate limit,  │
│   Auth, Route) │
└────────────────┘
        │
   ┌────┴────┬────────────┬──────────┐
   ▼         ▼            ▼          ▼
┌──────┐ ┌──────┐  ┌──────────┐ ┌────────┐
│ Auth │ │Rooms │  │ Items    │ │ Search │
│Service│ │Service│  │ Service  │ │Service │
└──────┘ └──────┘  └──────────┘ └────────┘
   │         │            │           │
   └────┬────┴──────┬─────┴───────────┘
        ▼           ▼
    ┌────────┐  ┌────────┐
    │ Cache  │  │  DB    │
    │ (Redis)│  │(Postgres)│
    └────────┘  └────────┘
```

---

## Deployment Architecture

### Recommended Setup

```
┌─────────────────────────────────────┐
│           Vercel                    │
│  ├─ Next.js App (auto-scaling)     │
│  ├─ Edge Functions (API routes)    │
│  ├─ CDN (static assets)            │
│  └─ Automatic HTTPS                │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         Supabase / Railway          │
│  ├─ PostgreSQL (managed)           │
│  ├─ Automatic backups              │
│  ├─ Connection pooling             │
│  └─ Monitoring                     │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│      Cloudinary / UploadThing       │
│  ├─ Image storage                  │
│  ├─ CDN delivery                   │
│  └─ Image optimization             │
└─────────────────────────────────────┘
```

---

## Monitoring & Observability

### Recommended Tools

1. **Application Monitoring**
   - Vercel Analytics
   - Sentry (error tracking)

2. **Database Monitoring**
   - Supabase Dashboard
   - Query performance metrics

3. **API Monitoring**
   - Log API key usage
   - Track response times
   - Monitor error rates

### Key Metrics

```
Application:
├─ Response time (p50, p95, p99)
├─ Error rate
├─ Request volume
└─ User sessions

Database:
├─ Query performance
├─ Connection pool usage
├─ Slow queries
└─ Storage usage

Business:
├─ Active users
├─ API key usage
├─ Total items tracked
└─ Low stock alerts
```

---

## Future Enhancements

1. **Real-time Updates**
   - WebSocket connections
   - Live inventory updates
   - Collaborative editing

2. **Advanced Search**
   - Full-text search (Elasticsearch)
   - Filters and facets
   - Search suggestions

3. **Analytics Dashboard**
   - Inventory trends
   - Usage patterns
   - Predictive analytics

4. **Mobile Apps**
   - React Native apps
   - QR code scanning
   - Offline support

5. **Integrations**
   - Webhooks
   - Zapier integration
   - E-commerce platforms

---

## Conclusion

This architecture provides a solid foundation for a production-ready SaaS platform. The modular design allows for easy scaling and feature additions while maintaining code quality and performance.
