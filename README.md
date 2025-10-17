# Inventory Tracker

Modern inventory management system with a beautiful dashboard and public API.

## Features

- 📦 Organize inventory with Rooms, Categories, and Items
- 🔐 Secure authentication
- 🔑 API key access for external integrations
- 🎨 Dark theme interface
- 📱 Responsive design

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, TailwindCSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL

# Push database schema
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

## API Documentation

See [API.md](./API.md) for complete API reference.

## License

MIT
