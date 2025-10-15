# How to Get Your Supabase Connection String

You have the password: `Toh0ww8nj6qmpyqE`

Now follow these steps to get your complete connection string:

---

## Step 1: Go to Supabase Dashboard

1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in if needed
3. Click on your **inventory-tracker** project

---

## Step 2: Get Connection String

1. Click the **Settings** icon (⚙️) in the left sidebar
2. Click **Database** from the Settings menu
3. Scroll down to the **Connection string** section
4. Click the **URI** tab (not "Session mode")
5. You'll see a string that looks like:

```
postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

---

## Step 3: Copy and Replace Password

The connection string will have `[YOUR-PASSWORD]` placeholder.

**Replace** `[YOUR-PASSWORD]` with: `Toh0ww8nj6qmpyqE`

Example - your string might look like:
```
postgresql://postgres.abcdefghijklmnop:Toh0ww8nj6qmpyqE@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

## Step 4: Update Your .env File

Once you have your complete connection string, update `.env`:

```bash
DATABASE_URL="paste-your-complete-connection-string-here"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-change-in-production"
NODE_ENV="development"
```

---

## Alternative: Transaction Pooler vs Direct Connection

Supabase provides two connection options:

### Option A: Transaction Pooler (Recommended for Serverless)
```
postgresql://postgres.xxx:Toh0ww8nj6qmpyqE@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```
- Port: `6543`
- Better for serverless (Vercel, etc.)

### Option B: Direct Connection (Session Mode)
```
postgresql://postgres:Toh0ww8nj6qmpyqE@db.xxx.supabase.co:5432/postgres
```
- Port: `5432`
- Better for local development

**For local development, use either one. I recommend Direct Connection (5432).**

---

## Quick Copy-Paste

Once you get your connection string from Supabase, paste it here and I'll help you format it correctly!

Your password is: `Toh0ww8nj6qmpyqE`

---

## After Getting Your Connection String

Run these commands:

```bash
# Test the connection
npm run db:push

# If successful, generate Prisma Client
npm run db:generate

# Start the app
npm run dev
```

---

## Can't Find It?

If you're having trouble finding the connection string in Supabase:

1. Go to https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/database
2. The connection string is in the **Connection string** section
3. Make sure you're on the **URI** tab
4. Copy the entire string
5. Replace `[YOUR-PASSWORD]` with `Toh0ww8nj6qmpyqE`

---

## Need Help?

Share your connection string (without the password) and I can help format it correctly!

Example format:
```
postgresql://postgres.abcdefghij:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Just replace `[PASSWORD]` with: `Toh0ww8nj6qmpyqE`
