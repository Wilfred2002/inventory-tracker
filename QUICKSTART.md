# ⚡ Quick Start - 5 Minute Setup

Get your Inventory Tracker running in 5 minutes!

---

## ✅ Checklist

### Step 1: Database (Choose One)

**Option A: Supabase (Easiest)**
- [ ] Go to [supabase.com](https://supabase.com) and sign up
- [ ] Create new project named "inventory-tracker"
- [ ] Save your database password
- [ ] Copy connection string from Settings → Database
- [ ] Replace `[YOUR-PASSWORD]` in connection string

**Option B: Local PostgreSQL**
- [ ] Install PostgreSQL: `brew install postgresql@15`
- [ ] Start PostgreSQL: `brew services start postgresql@15`
- [ ] Create database: `psql postgres -c "CREATE DATABASE inventory_tracker;"`

---

### Step 2: Environment Setup

- [ ] Copy `.env.example` to `.env`
- [ ] Update `DATABASE_URL` with your connection string
- [ ] Generate secret: `openssl rand -base64 32`
- [ ] Paste secret into `NEXTAUTH_SECRET`

**Your `.env` should look like:**
```bash
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"
NODE_ENV="development"
```

---

### Step 3: Install & Run

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Generate Prisma client
npm run db:generate

# Start dev server
npm run dev
```

---

### Step 4: Test It

- [ ] Open http://localhost:3000
- [ ] Click "Get Started" or "Sign In"
- [ ] Register with test@example.com / password123
- [ ] See the dashboard!

---

## 🎯 Verify Everything Works

### Test 1: Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test"}'
```

Should return: `{"user":{...}}`

### Test 2: View Database
```bash
npm run db:studio
```

Opens at http://localhost:5555 - you should see your tables!

### Test 3: Create Room (in browser console after signing in)
```javascript
fetch('/api/rooms', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  credentials: 'include',
  body: JSON.stringify({name: 'Test Room'})
}).then(r => r.json()).then(console.log)
```

Should return: `{"room":{...}}`

---

## 🚨 Troubleshooting

**Can't connect to database?**
```bash
# Test connection
psql "your-database-url"
```

**Port 3000 in use?**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Prisma issues?**
```bash
# Regenerate everything
npm run db:push
npm run db:generate
```

**Still not working?**
```bash
# Nuclear option - reset everything
rm -rf node_modules .next package-lock.json
npm install
npm run db:push
npm run db:generate
npm run dev
```

---

## 📚 Next Steps

Once running:

1. **Explore API**
   - See `API.md` for all endpoints
   - Test with curl or Postman

2. **Build Frontend**
   - Create room management pages
   - Add item list UI
   - Build API keys dashboard

3. **Deploy**
   - See `README.md` for Vercel deployment
   - Use Supabase for production DB

---

## 🆘 Need More Help?

- 📖 Full guide: `LOCAL_SETUP.md`
- 🏗️ Architecture: `ARCHITECTURE.md`
- 🌐 API docs: `API.md`
- 📘 Overview: `README.md`

---

## 🎉 Success?

If you see the landing page at http://localhost:3000, **you're done!**

Time to build something awesome! 🚀
