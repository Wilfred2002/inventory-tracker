# MVP Feature List - Sprint 1

Complete list of features we're implementing for the MVP launch.

---

## ✅ **COMPLETED FEATURES**

### 1. Backend Infrastructure (100%)
- [x] PostgreSQL database schema (5 models)
- [x] Prisma ORM integration
- [x] NextAuth.js authentication system
- [x] 16 REST API endpoints (all CRUD operations)
- [x] Public API with API key authentication
- [x] Password hashing (bcrypt)
- [x] API key hashing and validation
- [x] Input validation (Zod)
- [x] Error handling
- [x] Authorization middleware

### 2. Authentication (100%)
- [x] User registration API
- [x] User login API (NextAuth)
- [x] JWT session management
- [x] Sign-up page with form
- [x] Sign-in page with form
- [x] Toast notifications system
- [x] Loading states on auth forms
- [x] Error handling & user feedback
- [x] Auto-redirect after auth

### 3. UI Foundation (100%)
- [x] Landing page
- [x] Dark theme (black/gray + green)
- [x] TailwindCSS configuration
- [x] shadcn/ui components (Button, Card, Input)
- [x] Responsive layout
- [x] Toast notification styling

---

## 🚧 **IN PROGRESS - Sprint 1**

### 4. Dashboard Core
- [ ] Update dashboard stats with real data
  - Total rooms count
  - Total categories count
  - Total items count
  - Low stock items count
  - Real-time data from database

### 5. Sign-Out Functionality
- [ ] Connect sign-out button to NextAuth
- [ ] Add confirmation dialog (optional)
- [ ] Redirect to homepage after sign-out
- [ ] Clear session properly

---

## 📋 **PLANNED - Sprint 1 (Next 3 Days)**

### 6. Rooms Management (Priority 1)

#### **A. Rooms List Page** (`/dashboard/rooms`)
- [ ] Display all rooms in grid/list layout
- [ ] Show room name, description, created date
- [ ] Show category count per room
- [ ] Show item count per room
- [ ] Empty state when no rooms exist
  - Helpful message
  - "Create your first room" CTA
- [ ] Search/filter rooms by name
- [ ] Sort rooms (newest, oldest, name A-Z)

#### **B. Create Room Modal/Form**
- [ ] "Create Room" button
- [ ] Modal with form:
  - Room name (required)
  - Description (optional)
- [ ] Form validation
- [ ] Loading state on submit
- [ ] Success toast notification
- [ ] Auto-refresh list after creation
- [ ] Error handling

#### **C. Edit Room**
- [ ] Edit button on each room card
- [ ] Pre-populate form with existing data
- [ ] Same validation as create
- [ ] Update in database
- [ ] Success feedback
- [ ] Optimistic UI update

#### **D. Delete Room**
- [ ] Delete button on each room card
- [ ] Confirmation dialog:
  - "Are you sure?"
  - Warning: "This will delete all categories and items"
  - Show counts
- [ ] Loading state during deletion
- [ ] Success toast
- [ ] Remove from UI immediately

#### **E. View Room Details**
- [ ] Click on room card to view details
- [ ] Show all categories inside
- [ ] Show all items inside
- [ ] Breadcrumb navigation
- [ ] "Add Category" button in room view

---

### 7. Categories Management (Priority 2)

#### **A. Category List (Inside Room)**
- [ ] Display categories in room detail view
- [ ] Show category name, description
- [ ] Show item count per category
- [ ] Empty state when no categories

#### **B. Create Category**
- [ ] "Add Category" button in room view
- [ ] Modal with form:
  - Category name (required)
  - Description (optional)
  - Room ID (auto-set from context)
- [ ] Form validation
- [ ] Success feedback
- [ ] Auto-add to list

#### **C. Edit Category**
- [ ] Edit button on category card
- [ ] Pre-populate form
- [ ] Update in database
- [ ] Success feedback

#### **D. Delete Category**
- [ ] Delete button
- [ ] Confirmation dialog:
  - Warning: "This will delete all items in this category"
  - Show item count
- [ ] Success feedback

---

### 8. Items Management (Priority 1 - CORE FEATURE)

#### **A. Items List Page** (`/dashboard/rooms/[roomId]/categories/[categoryId]/items`)
**OR** `/dashboard/items` (all items view)

- [ ] Display all items in table or card grid
- [ ] Show for each item:
  - Image thumbnail (or placeholder)
  - Name
  - Description (truncated)
  - Quantity
  - Low stock indicator (red badge if ≤ threshold)
  - Category name
  - Room name
  - Last updated
- [ ] Empty state when no items
- [ ] Pagination (if > 50 items)
- [ ] Items per page selector (25, 50, 100)

#### **B. Search & Filter**
- [ ] Search bar (filter by name/description)
- [ ] Filter by:
  - Room (dropdown)
  - Category (dropdown)
  - Stock level:
    - All items
    - Low stock only
    - Out of stock (quantity = 0)
    - In stock
- [ ] Sort by:
  - Name (A-Z, Z-A)
  - Quantity (Low to High, High to Low)
  - Last updated (Newest, Oldest)
- [ ] Clear all filters button

#### **C. Create Item Form**
- [ ] "Add Item" button
- [ ] Modal or dedicated page with form:
  - Name (required)
  - Description (textarea, optional)
  - Quantity (number, required, min: 0)
  - Low stock threshold (number, default: 10)
  - Category (dropdown, required)
  - Room (dropdown, required)
  - Image upload (optional - v2)
- [ ] Form validation
- [ ] Loading state
- [ ] Success feedback
- [ ] Auto-add to list

#### **D. Edit Item**
- [ ] Edit button on item card/row
- [ ] Pre-populate all fields
- [ ] Same form as create
- [ ] Update database
- [ ] Success feedback
- [ ] Optimistic UI update

#### **E. Delete Item**
- [ ] Delete button on item
- [ ] Confirmation dialog:
  - "Delete [Item Name]?"
  - Show current quantity
- [ ] Success feedback
- [ ] Remove from list

#### **F. Low Stock Indicators**
- [ ] Visual badge when `quantity ≤ lowStockThreshold`:
  - Red badge with "Low Stock"
  - Show exact quantity
- [ ] Visual badge when `quantity = 0`:
  - Dark red badge with "Out of Stock"
- [ ] Green indicator when stock is healthy
- [ ] Color-coded quantity numbers:
  - Red: quantity ≤ threshold
  - Yellow: quantity ≤ threshold * 1.5
  - Green: quantity > threshold * 1.5

#### **G. Quick Actions**
- [ ] Quick increment/decrement buttons (+1, -1)
- [ ] Quick stock update (inline edit)
- [ ] View item details (modal or page)

---

### 9. API Keys Management (Priority 2)

#### **A. API Keys Page** (`/dashboard/keys`)
- [ ] List all API keys
- [ ] Show for each key:
  - Key name
  - Created date
  - Last used date
  - Status (active/inactive)
- [ ] Empty state when no keys
- [ ] Max 5 keys per user (limit)

#### **B. Generate API Key**
- [ ] "Generate New Key" button
- [ ] Modal with form:
  - Key name (required, e.g., "Production", "Development")
- [ ] Generate random key with `inv_` prefix
- [ ] Show key ONCE in modal:
  - Warning: "Save this key now! You won't see it again"
  - Copy to clipboard button
  - Large, readable format
- [ ] Store hashed key in database
- [ ] Add to list
- [ ] Success feedback

#### **C. Delete API Key**
- [ ] Delete button on each key
- [ ] Confirmation dialog:
  - "This will break any apps using this key"
- [ ] Immediate deletion
- [ ] Success feedback

#### **D. API Documentation**
- [ ] Link to API docs from this page
- [ ] Show example usage:
  ```bash
  curl -H "X-API-Key: inv_..." http://localhost:3001/api/v1/inventory
  ```
- [ ] Quick copy code snippets

---

### 10. UI Polish & UX (Priority 3)

#### **A. Loading States**
- [ ] Skeleton loaders for:
  - Room cards
  - Category cards
  - Item cards/rows
  - Stats cards
- [ ] Spinner on buttons during actions
- [ ] Disabled state while loading
- [ ] Loading bar at top of page (NProgress)

#### **B. Empty States**
- [ ] Custom illustrations or icons
- [ ] Helpful messaging
- [ ] Clear call-to-action
- [ ] Examples:
  - "No rooms yet. Create your first storage room!"
  - "No items in this category. Add your first item!"

#### **C. Modals & Dialogs**
- [ ] Smooth animations (Framer Motion)
- [ ] Keyboard shortcuts (ESC to close)
- [ ] Click outside to close
- [ ] Focus management
- [ ] Consistent styling

#### **D. Forms**
- [ ] Clear labels
- [ ] Placeholder text
- [ ] Validation messages (inline)
- [ ] Required field indicators (*)
- [ ] Character counters for text areas
- [ ] Auto-focus first field

#### **E. Responsive Design**
- [ ] Mobile-optimized tables (cards on mobile)
- [ ] Hamburger menu working smoothly
- [ ] Touch-friendly buttons
- [ ] Readable on all screen sizes

---

### 11. Navigation Improvements

#### **A. Breadcrumbs**
- [ ] Show current path:
  - Dashboard > Rooms > Kitchen > Food > Rice
- [ ] Clickable navigation
- [ ] Auto-update on route change

#### **B. Sidebar Updates**
- [ ] Highlight active page
- [ ] Collapse on mobile after click
- [ ] Show notification badge on "Items" if low stock exists

#### **C. Quick Stats**
- [ ] Show in sidebar:
  - Total items
  - Low stock count (red badge)
  - Last updated time

---

## 🔮 **FUTURE FEATURES (Post-MVP / V2)**

### Not included in Sprint 1:

12. **Image Upload**
    - Cloudinary/Uploadthing integration
    - Image preview
    - Image deletion
    - Multiple images per item

13. **User Profile & Settings**
    - Update name, email
    - Change password
    - Profile picture
    - Delete account

14. **Email Features**
    - Email verification
    - Password reset
    - Welcome email
    - Low stock email alerts

15. **Advanced Features**
    - Bulk actions (delete multiple items)
    - Import/export (CSV, JSON)
    - Barcode scanning
    - QR code generation
    - Item history/audit log
    - Stock movement tracking
    - Notifications (webhooks)

16. **Analytics**
    - Stock trends over time
    - Most/least used items
    - Inventory value
    - Usage patterns

17. **Collaboration**
    - Team features (multiple users per account)
    - Role-based permissions
    - Activity feed
    - Comments on items

---

## 📊 **Sprint 1 Summary**

### **Total Features: 11 main areas**
- ✅ **Completed: 3** (Backend, Auth, UI Foundation)
- 🚧 **In Progress: 2** (Dashboard, Sign-out)
- 📋 **Planned: 6** (Rooms, Categories, Items, Keys, Polish, Navigation)

### **Estimated Completion:**
- **Day 1 (Today):** ✅ Auth + Toast (DONE)
- **Day 2:** Rooms CRUD + Sign-out + Dashboard stats
- **Day 3:** Items list + Create/Edit/Delete + Search
- **Day 4:** API Keys + Polish + Final testing

### **MVP Definition:**
User can:
1. ✅ Register and sign in
2. ✅ See dashboard with stats
3. [ ] Create rooms
4. [ ] Create categories in rooms
5. [ ] Create items with quantities
6. [ ] Search and filter items
7. [ ] See low stock warnings
8. [ ] Generate API keys
9. [ ] Sign out

**That's our MVP! Everything else is V2.**

---

## 🎯 **Success Criteria**

MVP is ready when:
- [ ] User can complete full inventory flow end-to-end
- [ ] All critical features work without bugs
- [ ] Mobile responsive
- [ ] Fast load times (< 2s)
- [ ] Toast notifications working
- [ ] No console errors
- [ ] API documentation accessible
- [ ] Ready to deploy to Vercel

---

## 🚀 **Next Actions**

1. Review and approve this feature list
2. Continue building in priority order
3. Test each feature as we complete it
4. Keep todo list updated
5. Demo at end of each day

**Ready to continue? Let's build the Rooms page next!** 🏗️
