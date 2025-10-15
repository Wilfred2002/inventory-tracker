# Inventory Tracker - Modern SaaS Platform

A production-ready inventory management system built with Next.js 14, TypeScript, Prisma, and PostgreSQL. Features a beautiful dark theme UI with green accents and a complete public API.

## Features

- **User Authentication** - Secure sign up/sign in with NextAuth.js
- **Inventory Management** - Organize with Rooms → Categories → Items hierarchy
- **Public API** - Generate API keys and access inventory programmatically
- **Low Stock Alerts** - Visual indicators for items running low
- **Image Upload** - Attach reference images to items
- **Responsive Design** - Beautiful UI that works on all devices
- **Dark Theme** - Modern black/gray theme with green accents

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** + **shadcn/ui**
- **Framer Motion** (animations)
- **Lucide React** (icons)

### Backend
- **Next.js API Routes**
- **Prisma ORM**
- **PostgreSQL**
- **NextAuth.js** (authentication)
- **Zod** (validation)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud via Supabase/Railway)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd InventoryTracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL and NextAuth secret:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/inventory_tracker?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
NODE_ENV="development"
```

Generate a secret with:
```bash
openssl rand -base64 32
```

4. Set up the database:
```bash
npm run db:push
npm run db:generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

```
User
├── id, email, password, name
├── rooms[]
└── apiKeys[]

Room
├── id, name, description, userId
└── categories[]

Category
├── id, name, description, roomId
└── items[]

Item
├── id, name, description, quantity
├── lowStockThreshold, imageUrl
├── categoryId
└── timestamps

ApiKey
├── id, name, key (hashed)
├── userId, isActive, lastUsed
└── timestamps
```

## API Reference

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Sign In
Use NextAuth.js sign in:
```typescript
import { signIn } from "next-auth/react"

await signIn("credentials", {
  email: "user@example.com",
  password: "password123"
})
```

### Authenticated API Endpoints (Session-based)

All these endpoints require authentication via NextAuth session.

#### Rooms

```http
# Get all rooms
GET /api/rooms

# Create room
POST /api/rooms
{
  "name": "Kitchen",
  "description": "Kitchen storage"
}

# Update room
PUT /api/rooms/[roomId]
{
  "name": "Updated Kitchen",
  "description": "Updated description"
}

# Delete room
DELETE /api/rooms/[roomId]
```

#### Categories

```http
# Create category
POST /api/categories
{
  "name": "Food",
  "description": "Food items",
  "roomId": "clx..."
}

# Update category
PUT /api/categories/[categoryId]
{
  "name": "Updated Food"
}

# Delete category
DELETE /api/categories/[categoryId]
```

#### Items

```http
# Create item
POST /api/items
{
  "name": "Rice",
  "description": "White rice 5kg",
  "quantity": 10,
  "lowStockThreshold": 3,
  "categoryId": "clx...",
  "imageUrl": "https://..."
}

# Get item
GET /api/items/[itemId]

# Update item
PUT /api/items/[itemId]
{
  "quantity": 8
}

# Delete item
DELETE /api/items/[itemId]
```

#### API Keys

```http
# Get all API keys
GET /api/keys

# Generate new API key
POST /api/keys
{
  "name": "Production API Key"
}

Response:
{
  "apiKey": { "id": "...", "name": "...", ... },
  "plainKey": "inv_abc123..." // Only shown once!
}

# Delete API key
DELETE /api/keys/[keyId]
```

### Public API Endpoints (API Key-based)

All public endpoints require the `X-API-Key` header:

```http
X-API-Key: inv_abc123...
```

#### Get All Inventory
```http
GET /api/v1/inventory
X-API-Key: inv_abc123...

Response:
{
  "rooms": [...],
  "totalRooms": 5,
  "totalCategories": 15,
  "totalItems": 120
}
```

#### Get Item
```http
GET /api/v1/inventory/items/[itemId]
X-API-Key: inv_abc123...
```

#### Update Item Quantity
```http
POST /api/v1/inventory/items/[itemId]
X-API-Key: inv_abc123...
Content-Type: application/json

{
  "quantity": 5
}
```

## Project Structure

```
InventoryTracker/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication
│   │   │   ├── rooms/         # Room CRUD
│   │   │   ├── categories/    # Category CRUD
│   │   │   ├── items/         # Item CRUD
│   │   │   ├── keys/          # API key management
│   │   │   └── v1/            # Public API
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # NextAuth config
│   │   ├── session.ts         # Session helpers
│   │   ├── api-key.ts         # API key validation
│   │   └── utils.ts           # Utilities
│   └── types/
│       └── next-auth.d.ts     # TypeScript declarations
├── .env                       # Environment variables
├── .env.example              # Environment template
├── next.config.js            # Next.js config
├── tailwind.config.ts        # Tailwind config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database

Use **Supabase** or **Railway** for PostgreSQL:

**Supabase:**
1. Create project at [supabase.com](https://supabase.com)
2. Get connection string from Settings → Database
3. Add to `DATABASE_URL` in `.env`

**Railway:**
1. Create project at [railway.app](https://railway.app)
2. Add PostgreSQL service
3. Copy connection string to `DATABASE_URL`

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npm run db:push      # Push schema changes to DB
npm run db:studio    # Open Prisma Studio
npm run db:generate  # Generate Prisma Client
```

## Color Theme

The app uses a dark theme with green accents:

- **Background:** Black (#0a0a0a) to Dark Gray (#141414)
- **Primary/Accent:** Green (#10b981)
- **Text:** White (#fafafa)
- **Muted:** Gray (#52525b)
- **Borders:** Dark Gray (#2a2a2a)

## Security Features

- Password hashing with bcrypt
- JWT sessions via NextAuth.js
- API keys hashed in database
- CORS protection
- Input validation with Zod
- SQL injection prevention via Prisma

## Future Enhancements

- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Bulk import/export
- [ ] Advanced search and filtering
- [ ] Real-time notifications
- [ ] Mobile app
- [ ] Webhooks
- [ ] Rate limiting for public API
- [ ] API usage analytics

## License

MIT

## Support

For issues and feature requests, please open an issue on GitHub.
