# CleanCity - Wireframe Plan

This document outlines all screens needed for the CleanCity platform, organized by user role and priority.

Last updated: 2025-11-17

---

## User Roles Overview

### 1. Citizens (Građani)
Users who report municipal problems and track their status.

### 2. Municipal Workers (Građanski Radnici)
Staff who process reports, update status, and communicate with citizens.

### 3. Administrators (Administratori)
System managers with full access to statistics, user management, and system configuration.

---

## Screen Inventory

### Priority 1: Core MVP Screens (Must Have)

#### A. Public/Citizen Screens

1. **Landing Page / Homepage**
   - **Jira:** SCRM-12, SCRM-14
   - **Components:**
     - Interactive map with report markers
     - Color-coded status indicators (new/in-progress/resolved)
     - Quick report submission CTA
     - Recent reports feed
   - **User Flow:** Entry point → View map → Click marker for details OR Submit report

2. **Interactive Map View**
   - **Jira:** SCRM-12, SCRM-13, SCRM-14
   - **Components:**
     - Full-screen map
     - Report markers with status colors
     - Click marker → modal with report details
     - Filter panel (status, category, date, location)
     - Legend for marker colors
   - **User Flow:** Browse map → Click marker → View details → Contact/comment

3. **Report Submission Form**
   - **Jira:** SCRM-19, SCRM-21, SCRM-121
   - **Components:**
     - Photo upload (required)
     - Category dropdown (potholes, trash, lighting, etc.)
     - Location picker (map + address autocomplete)
     - Description textarea
     - Validation messages
     - Submit button
   - **User Flow:** Click "Report Problem" → Fill form → Upload photo → Set location → Submit

4. **Report Details Modal**
   - **Jira:** SCRM-20, SCRM-23, SCRM-57
   - **Components:**
     - Photo gallery
     - Problem description
     - Status badge with timeline
     - Location map snippet
     - Comments section
     - Share button
   - **User Flow:** View report → Read details → Add comment → Track status

5. **User Authentication**
   - **Jira:** SCRM-115, SCRM-130, SCRM-132
   - **Components:**
     - Login form (email/password)
     - Registration form
     - Password reset
     - OAuth options (Google, Facebook)
   - **User Flow:** Landing → Login/Register → Access personalized features

#### B. Municipal Worker Screens

6. **Worker Dashboard**
   - **Jira:** SCRM-16, SCRM-47, SCRM-119, SCRM-124
   - **Components:**
     - Assigned reports queue
     - Reports by status (pending, in-progress, resolved)
     - Quick actions (assign, update status, add comment)
     - Search and filter tools
   - **User Flow:** Login → View assigned reports → Select report → Update status

7. **Report Management Table**
   - **Jira:** SCRM-7, SCRM-8, SCRM-10, SCRM-11
   - **Components:**
     - Sortable columns (date, status, category, location)
     - Filters (status, category, date range, location)
     - Bulk actions
     - Row click → report details
     - Pagination
   - **User Flow:** View all reports → Filter/sort → Select report → Manage

8. **Report Processing View**
   - **Jira:** SCRM-54, SCRM-56, SCRM-58, SCRM-128
   - **Components:**
     - Full report details
     - Status update dropdown
     - Assign to worker selector
     - Add internal notes
     - Add public comment
     - Workflow timeline
   - **User Flow:** Open report → Review → Update status → Assign → Add notes → Save

#### C. Admin Screens

9. **Admin Dashboard**
   - **Jira:** SCRM-47, SCRM-48, SCRM-101, SCRM-106, SCRM-109
   - **Components:**
     - Key metrics cards (total reports, pending, resolved, avg resolution time)
     - Charts (reports over time, by category, by location)
     - Recent activity feed
     - Filter by date range and location
     - Export to PDF button
   - **User Flow:** Login → View stats → Filter by period → Export report

10. **User Management**
    - **Jira:** SCRM-35, SCRM-49, SCRM-126
    - **Components:**
      - User list table (citizens, workers, admins)
      - Search and filter
      - User details panel
      - Role assignment
      - Account status (active/inactive)
    - **User Flow:** Manage users → Search → View details → Edit role → Save

---

### Priority 2: Enhanced Features (Should Have)

11. **My Reports Dashboard (Citizen)**
    - **Jira:** SCRM-125, SCRM-143
    - **Components:**
      - User's submitted reports list
      - Status filters
      - Report statistics
    - **User Flow:** Login → My Reports → Track status

12. **Notifications Center**
    - **Jira:** SCRM-41, SCRM-42, SCRM-133, SCRM-134, SCRM-135
    - **Components:**
      - Notification list (status updates, comments, mentions)
      - Mark as read/unread
      - Notification preferences
    - **User Flow:** Receive notification → Click → View related report

13. **FAQ Page**
    - **Jira:** SCRM-40
    - **Components:**
      - Searchable FAQ list
      - Categories (reporting, tracking, account, etc.)
      - Expandable Q&A items
    - **User Flow:** Need help → Search FAQ → Find answer

14. **Report History & Timeline**
    - **Jira:** SCRM-31, SCRM-33, SCRM-140, SCRM-142
    - **Components:**
      - Complete audit trail
      - Status change history
      - Comment history
      - Worker assignment history
    - **User Flow:** View report → Check history → See all updates

15. **Advanced Filters & Search**
    - **Jira:** SCRM-127, SCRM-139
    - **Components:**
      - Date range picker
      - Location/neighborhood selector
      - Category multi-select
      - Status multi-select
      - Save filter presets
    - **User Flow:** Need specific reports → Set filters → Apply → View results

---

### Priority 3: Nice to Have Features

16. **User Profile**
    - **Jira:** SCRM-136
    - **Components:**
      - Personal information
      - Email preferences
      - Password change
      - Report statistics
    - **User Flow:** Account → Edit profile → Save

17. **Mobile Responsive Views**
    - **Jira:** Multiple items
    - **Components:**
      - Mobile-optimized navigation
      - Touch-friendly controls
      - Responsive layout
    - **User Flow:** Access from mobile → Same features, optimized UI

18. **Report Analytics Dashboard (Admin)**
    - **Jira:** SCRM-48, SCRM-106
    - **Components:**
      - Advanced charts and graphs
      - Heatmap of problem areas
      - Trend analysis
      - Performance metrics
    - **User Flow:** View trends → Identify patterns → Export data

---

## Screen Dependency Map

```
Landing Page (Public)
├── Interactive Map
│   ├── Report Details Modal
│   │   └── Comments Section
│   └── Report Submission Form
└── Auth (Login/Register)
    ├── Citizen Dashboard
    │   ├── My Reports
    │   └── Notifications
    ├── Worker Dashboard
    │   ├── Report Management Table
    │   └── Report Processing View
    └── Admin Dashboard
        ├── User Management
        └── Analytics Dashboard
```

---

## Wireframe Design Priorities

### Phase 1: Core MVP (Week 1-2)
1. Landing Page with Map
2. Report Submission Form
3. Report Details Modal
4. Auth Screens
5. Worker Dashboard
6. Admin Dashboard (basic)

### Phase 2: Enhanced Features (Week 3-4)
7. Report Management Table
8. Report Processing View
9. User Management
10. Notifications Center
11. FAQ Page

### Phase 3: Polish & Refinement (Week 5+)
12. My Reports Dashboard
13. Report History
14. Advanced Filters
15. User Profile
16. Mobile Optimization

---

## Design Considerations

### Visual Hierarchy
- **Primary Actions:** Submit report, Update status, Export data
- **Secondary Actions:** Filter, Sort, Search
- **Tertiary Actions:** Share, Archive, Delete

### Color Coding (Status)
- **New/Pending:** Red/Orange (#FF6B6B)
- **In Progress:** Yellow (#FFD93D)
- **Resolved:** Green (#6BCF7F)
- **Closed:** Gray (#95A5A6)

### Responsive Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode

---

## Next Steps

1. ✅ Create wireframe plan (this document)
2. 🔄 Design wireframes for Priority 1 screens
3. ⏳ Review with team
4. ⏳ Iterate based on feedback
5. ⏳ Create high-fidelity mockups
6. ⏳ Build design system/component library
