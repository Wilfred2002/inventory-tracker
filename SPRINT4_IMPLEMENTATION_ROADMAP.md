# Sprint 4 Implementation Roadmap

## Database Schema ✅ COMPLETED
- Added Activity/Audit logs model
- Added Notifications model
- Added Team & TeamMember models
- Added soft delete support (deletedAt field)
- Added barcode/QR code fields
- Added tags support
- Added role field to User model
- Added 2FA placeholder field

**Next Step**: Run `npx prisma db push` when database is accessible

---

## Feature 1: Quick Stock Adjustment ⏳ IN PROGRESS
**Priority**: HIGH
**Complexity**: LOW

### Implementation Steps:
1. Add `+`/`-` buttons to item cards
2. Create `/api/items/[itemId]/adjust` endpoint
3. Log adjustments in ActivityLog
4. Optimistic UI updates

**Files to Create/Modify**:
- `src/app/dashboard/items/page.tsx` - Add quick adjust buttons
- `src/app/api/items/[itemId]/adjust/route.ts` - New endpoint

---

## Feature 2: Activity Audit Log
**Priority**: CRITICAL
**Complexity**: MEDIUM

### Implementation Steps:
1. Create utility function to log activities
2. Update all CRUD operations to log changes
3. Create Activity Log UI page
4. Add filtering (by user, by date, by action type)

**Files to Create**:
- `src/lib/activity-log.ts` - Logging utility
- `src/app/dashboard/activity/page.tsx` - Activity log UI
- Update all API routes to call logging

---

## Feature 3: Barcode/QR Code System
**Priority**: HIGH
**Complexity**: MEDIUM

### Implementation Steps:
1. Install: `npm install qrcode jsbarcode react-qr-scanner`
2. Generate QR codes for items
3. Add scanner component using phone camera
4. Print labels functionality

**Files to Create**:
- `src/components/barcode-generator.tsx`
- `src/components/qr-scanner.tsx`
- `src/app/dashboard/scanner/page.tsx`
- `src/app/api/items/[itemId]/generate-code/route.ts`

---

## Feature 4: Notifications System
**Priority**: HIGH
**Complexity**: MEDIUM-HIGH

### Implementation Steps:
1. Create notification creation utility
2. Add low stock check cron job or webhook
3. Create notification center UI
4. Add email notifications (optional)
5. WebSocket for real-time notifications (optional)

**Files to Create**:
- `src/lib/notifications.ts` - Notification utility
- `src/app/dashboard/notifications/page.tsx` - Notification center
- `src/app/api/notifications/route.ts` - CRUD endpoints
- `src/components/notification-bell.tsx` - Header notification icon

---

## Feature 5: CSV Import
**Priority**: MEDIUM
**Complexity**: MEDIUM

### Implementation Steps:
1. Install: `npm install papaparse @types/papaparse`
2. Create CSV upload UI
3. Validate CSV format
4. Bulk create items with validation
5. Show import results/errors

**Files to Create**:
- `src/app/dashboard/import/page.tsx` - Import UI
- `src/app/api/items/import/route.ts` - Import endpoint
- `src/components/csv-import.tsx` - Upload component

---

## Feature 6: Pagination & Infinite Scroll
**Priority**: HIGH (Performance)
**Complexity**: MEDIUM

### Implementation Steps:
1. Update `/api/items` to support pagination
2. Add `skip`, `take`, `cursor` parameters
3. Implement infinite scroll on frontend
4. Add "Load More" button fallback

**Files to Modify**:
- `src/app/api/items/route.ts` - Add pagination
- `src/app/dashboard/items/page.tsx` - Implement infinite scroll
- Use `react-intersection-observer` for scroll detection

---

## Feature 7: Team/Multi-user Support
**Priority**: HIGH (Monetization)
**Complexity**: HIGH

### Implementation Steps:
1. Create team creation UI
2. Add team invitation system
3. Implement role-based permissions
4. Update all queries to filter by team
5. Add team switching UI

**Files to Create**:
- `src/app/dashboard/teams/page.tsx` - Team management
- `src/app/api/teams/route.ts` - Team CRUD
- `src/app/api/teams/[teamId]/invite/route.ts` - Invitations
- `src/lib/permissions.ts` - Permission checking utility
- `src/middleware.ts` - Update to check team access

---

## Feature 8: Soft Deletes & Recovery
**Priority**: MEDIUM
**Complexity**: LOW-MEDIUM

### Implementation Steps:
1. Update delete operations to set `deletedAt`
2. Add "deleted" filter to queries
3. Create "Trash" page showing deleted items
4. Add restore functionality

**Files to Create/Modify**:
- `src/app/dashboard/trash/page.tsx` - Trash UI
- Update all DELETE endpoints to soft delete
- Update all GET endpoints to filter `deletedAt IS NULL`

---

## Feature 9: Global Search & Tags
**Priority**: MEDIUM
**Complexity**: MEDIUM

### Implementation Steps:
1. Create global search component in header
2. Search across items, rooms, categories
3. Add tag management UI
4. Implement tag filtering

**Files to Create**:
- `src/components/global-search.tsx` - Search component
- `src/app/api/search/route.ts` - Search endpoint
- `src/app/dashboard/tags/page.tsx` - Tag management
- Update items page to show/filter by tags

---

## Feature 10: Email Notifications (Low Stock Alerts)
**Priority**: MEDIUM
**Complexity**: MEDIUM

### Implementation Steps:
1. Install: `npm install nodemailer @react-email/components`
2. Create email templates
3. Add cron job to check low stock
4. Send emails via SMTP or service (SendGrid/Postmark)

**Files to Create**:
- `src/lib/email.ts` - Email sending utility
- `src/emails/low-stock-alert.tsx` - Email template
- `src/app/api/cron/check-low-stock/route.ts` - Cron endpoint

---

## Additional Enhancements

### Mobile Optimization
- Test on mobile devices
- Add PWA manifest
- Improve touch targets
- Add mobile-specific gestures

### Performance
- Add Redis caching (optional)
- Optimize database queries
- Add database indexes
- Image lazy loading

### Security
- Rate limiting
- CSRF protection
- Input sanitization
- SQL injection prevention (Prisma handles this)

---

## Testing Checklist

- [ ] All CRUD operations work
- [ ] Activity logs are created correctly
- [ ] Notifications appear and mark as read
- [ ] Barcodes/QR codes generate and scan
- [ ] CSV import handles errors gracefully
- [ ] Pagination doesn't skip items
- [ ] Team permissions work correctly
- [ ] Soft deletes can be restored
- [ ] Search returns relevant results
- [ ] Email notifications send correctly

---

## Deployment Considerations

1. **Database Migration**: Run `npx prisma db push` or `npx prisma migrate deploy`
2. **Environment Variables**: Add email service credentials
3. **Cron Jobs**: Set up for low stock checks (Vercel Cron or external service)
4. **Image Storage**: Ensure Cloudinary limits are sufficient
5. **Rate Limiting**: Implement on API routes
6. **Monitoring**: Add error tracking (Sentry)
7. **Analytics**: Add usage tracking (Posthog/Mixpanel)

---

## Estimated Implementation Time

- Quick Stock Adjustment: 1-2 hours
- Activity Log: 3-4 hours
- Barcode/QR System: 4-6 hours
- Notifications: 4-6 hours
- CSV Import: 3-4 hours
- Pagination: 2-3 hours
- Team Support: 8-12 hours (COMPLEX)
- Soft Deletes: 2-3 hours
- Global Search & Tags: 4-5 hours
- Email Notifications: 3-4 hours

**Total: 35-50 hours of development time**

---

## Priority Implementation Order

1. ✅ Database schema updates
2. 🔄 Quick stock adjustment (UX win)
3. Activity logging (foundation for compliance)
4. Pagination (performance)
5. Barcode/QR (killer feature)
6. Notifications (user engagement)
7. CSV Import (bulk operations)
8. Soft deletes (data safety)
9. Global search & tags (discovery)
10. Team support (monetization)
11. Email notifications (automation)
