# Local Deployment Guide

Complete guide to run Inventory Tracker on your local machine.

---

## 🎯 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org))
- npm (comes with Node.js)
- PostgreSQL database (local or cloud)

---

## Option A: Using Supabase (Recommended - Easiest!)

### Step 1: Create Supabase Database

1. Visit [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub (or email)
4. Create a new organization (if first time)
5. Click **"New Project"**
6. Fill in:
   - **Name**: `inventory-tracker`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing**: Free tier is perfect
7. Click **"Create new project"**
8. Wait ~2 minutes for provisioning

### Step 2: Get Connection String

1. In your project dashboard, click **Settings** (gear icon)
2. Go to **Database** section
3. Scroll to **Connection string**
4. Select **"URI"** tab (NOT Session mode)
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with the password you created

Example:
```
postgresql://postgres:your_password@db.abcdefghij.supabase.co:5432/postgres
```

### Step 3: Configure Environment

In your project, edit `.env`:

```bash
# Replace with your actual Supabase connection string
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

NEXTAUTH_URL="http://localhost:3000"

# Generate this with: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-here"

NODE_ENV="development"
```

Generate the secret:
```bash
openssl rand -base64 32
```

### Step 4: Install & Run

```bash
# Install dependencies
npm install

# Push database schema to Supabase
npm run db:push

# Generate Prisma Client
npm run db:generate

# Start development server
npm run dev
```

### Step 5: Access the App

Open your browser to:
```
http://localhost:3000
```

✅ **Done!** Your app is running locally with a cloud database.

---

## Option B: Using Local PostgreSQL

### Step 1: Install PostgreSQL

**macOS (using Homebrew):**
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify it's running
brew services list | grep postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows:**
1. Download from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Run installer
3. Remember the password you set for `postgres` user

### Step 2: Create Database

**macOS/Linux:**
```bash
# Access PostgreSQL
psql postgres

# Or if that doesn't work:
sudo -u postgres psql
```

**In PostgreSQL console:**
```sql
-- Create database
CREATE DATABASE inventory_tracker;

-- Create user with password
CREATE USER inventory_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE inventory_tracker TO inventory_user;

-- Grant schema privileges (PostgreSQL 15+)
\c inventory_tracker
GRANT ALL ON SCHEMA public TO inventory_user;

-- Exit
\q
```

### Step 3: Configure Environment

Edit `.env`:
```bash
DATABASE_URL="postgresql://inventory_user:your_secure_password@localhost:5432/inventory_tracker?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-command"
NODE_ENV="development"
```

Generate secret:
```bash
openssl rand -base64 32
```

### Step 4: Install & Run

```bash
npm install
npm run db:push
npm run db:generate
npm run dev
```

---

## 🧪 Testing Your Setup

### 1. Register a Test User

**Using curl:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Or use the test script:**
```bash
./test-api.sh
```

### 2. Sign In via Browser

1. Open http://localhost:3000
2. Click **"Sign In"** button
3. Use credentials:
   - Email: `test@example.com`
   - Password: `password123`
4. You'll be redirected to the dashboard!

### 3. Test API Endpoints

**Create a room:**
```typescript
// In browser console or Postman:
fetch('/api/rooms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    name: 'Kitchen',
    description: 'Kitchen storage'
  })
}).then(r => r.json()).then(console.log)
```

**Get all rooms:**
```typescript
fetch('/api/rooms', {
  credentials: 'include'
}).then(r => r.json()).then(console.log)
```

### 4. Test Public API

**Generate API key:**
```typescript
fetch('/api/keys', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ name: 'Test Key' })
}).then(r => r.json()).then(data => {
  console.log('Save this key:', data.plainKey)
})
```

**Use API key:**
```bash
# Replace with your actual key
curl -H "X-API-Key: inv_your_key_here" \
  http://localhost:3000/api/v1/inventory
```

---

## 🔍 Verify Database

### Using Prisma Studio (Recommended)

```bash
npm run db:studio
```

This opens a GUI at http://localhost:5555 where you can:
- View all tables
- Browse data
- Edit records
- Run queries

### Using psql

```bash
# Connect to database
psql postgresql://inventory_user:your_password@localhost:5432/inventory_tracker

# Or for Supabase:
psql "your-supabase-connection-string"
```

**Useful commands:**
```sql
-- List tables
\dt

-- View users
SELECT * FROM users;

-- View rooms
SELECT * FROM rooms;

-- View items with category names
SELECT items.name, items.quantity, categories.name as category
FROM items
JOIN categories ON items."categoryId" = categories.id;

-- Exit
\q
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"

**Check PostgreSQL is running:**
```bash
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Test connection
psql postgresql://inventory_user:your_password@localhost:5432/inventory_tracker
```

**Verify connection string in `.env`:**
- Check username and password
- Verify port (default is 5432)
- Ensure database exists

### Issue: "Prisma Client not generated"

```bash
npm run db:generate
```

### Issue: "Schema not in sync"

```bash
npm run db:push
```

### Issue: "Port 3000 already in use"

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Issue: "NextAuth session not working"

Check:
1. `NEXTAUTH_SECRET` is set in `.env`
2. `NEXTAUTH_URL` matches your local URL
3. Cookies are enabled in browser
4. Clear browser cache and cookies

### Issue: "Module not found"

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Check Database Tables

After running `npm run db:push`, you should have these tables:

```bash
# List tables with psql
psql your-connection-string -c "\dt"
```

Expected tables:
- `users`
- `api_keys`
- `rooms`
- `categories`
- `items`

---

## 🔥 Hot Reload

The dev server supports hot reload:
- Frontend changes: Instant refresh
- API route changes: Restart on save
- Database schema changes: Run `npm run db:push` again

---

## 📦 Build for Production (Local)

```bash
# Create production build
npm run build

# Start production server
npm start
```

The production build:
- Optimizes code
- Minifies assets
- Enables caching
- Runs on http://localhost:3000

---

## 🔑 Environment Variables Reference

Required variables in `.env`:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_URL` | Your app URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Random secret for JWT | Generate with openssl |
| `NODE_ENV` | Environment | `development` or `production` |

---

## 🚀 Next Steps

Once running locally:

1. **Explore the API**
   - Open http://localhost:3000
   - Register a user
   - Create rooms, categories, items
   - Generate API keys

2. **Test with Prisma Studio**
   ```bash
   npm run db:studio
   ```

3. **Build frontend pages**
   - Rooms management UI
   - Items list with search
   - API keys dashboard

4. **Deploy to production**
   - See `README.md` for deployment guides

---

## 🛠️ Development Tools

**Prisma Studio:**
```bash
npm run db:studio
```

**Database Push (after schema changes):**
```bash
npm run db:push
```

**Generate Prisma Client (after schema changes):**
```bash
npm run db:generate
```

**Format Code:**
```bash
npx prettier --write .
```

**Type Check:**
```bash
npx tsc --noEmit
```

---

## 📝 Sample Data Script

Want to populate with test data? Create `seed.ts`:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await hash('password123', 12)

  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password,
      name: 'Demo User',
    },
  })

  const room = await prisma.room.create({
    data: {
      name: 'Kitchen',
      description: 'Kitchen storage',
      userId: user.id,
    },
  })

  const category = await prisma.category.create({
    data: {
      name: 'Food',
      description: 'Food items',
      roomId: room.id,
    },
  })

  await prisma.item.create({
    data: {
      name: 'Rice',
      description: 'White rice 5kg',
      quantity: 10,
      lowStockThreshold: 3,
      categoryId: category.id,
    },
  })

  console.log('✅ Seed data created!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run with:
```bash
npx tsx prisma/seed.ts
```

---

## 🎉 Success!

If you can:
- ✅ Access http://localhost:3000
- ✅ Register a user
- ✅ See the dashboard
- ✅ Open Prisma Studio

**Congratulations! Your local deployment is working!** 🚀

---

## 🆘 Need Help?

1. Check this guide again
2. Review error messages carefully
3. Check database connection
4. Verify all environment variables
5. Try clearing cache: `rm -rf .next`
6. Check `README.md` and `API.md`

Common commands:
```bash
# Reset everything
rm -rf node_modules .next package-lock.json
npm install
npm run db:push
npm run db:generate
npm run dev
```
