# CleanCity Implementation Log

This document tracks completed features and planned work for the CleanCity project, organized by Jira ticket references.

Last updated: December 2025

---

## Completed Features

### Phase 1: Foundation (MVP)

#### Authentication Module

SCRM-130, SCRM-131, SCRM-132: User authentication implemented with Google OAuth through Supabase Auth. Session management persists across page refreshes with automatic token refresh. Protected routes redirect unauthenticated users to the login page.

Implementation details:

- AuthProvider context wraps the application and manages auth state
- GoogleSignInButton component handles OAuth flow
- ProtectedRoute component guards authenticated routes
- Automatic profile creation on first sign-in via database trigger

Files: `src/features/auth/AuthProvider.tsx`, `src/features/auth/components/`

#### Map View Module

SCRM-12, SCRM-13, SCRM-14: Interactive map displays all reports as colored markers. Map centers on Zagreb with zoom level 13. Marker colors indicate report status (red for new, yellow for in progress, green for resolved, gray for closed).

Implementation details:

- Leaflet with OpenStreetMap tiles for free mapping
- Custom colored markers using Leaflet divIcon
- Popup displays report summary with link to details
- Status legend overlay in bottom-left corner

Files: `src/pages/MapPage.tsx`

#### Report Submission Module

SCRM-121: Report submission form with required fields for title, description, category, and location. Location picker allows clicking on map or using browser geolocation. Photo upload supports multiple images stored in Supabase Storage.

Implementation details:

- Form validation with required field checks
- Category dropdown populated from database
- LocationPicker component with map click and geolocation
- Photo upload with progress tracking
- useCreateReport hook handles submission and photo storage

Files: `src/pages/SubmitReportPage.tsx`, `src/features/reports/hooks/useCreateReport.ts`, `src/features/reports/components/LocationPicker.tsx`

#### Report Details Module

SCRM-20: Report details page displays full report information including title, description, status badge, category, priority, timestamps, and location mini-map. Photo gallery shows all attached images with lightbox view.

Implementation details:

- Dynamic route at /report/:id
- useReport hook fetches report with related data
- Mini-map shows report location
- Photo gallery with click-to-expand lightbox
- Reporter and assigned worker info displayed in sidebar

Files: `src/pages/ReportDetailsPage.tsx`, `src/features/reports/hooks/useReport.ts`

#### Comments Module

SCRM-23, SCRM-32: Comments section on report details page allows authenticated users to post comments. All comments display with user avatar, name, and timestamp. Comment list updates immediately after posting.

Implementation details:

- useAddComment hook handles comment creation
- Comments fetched as part of useReport query
- Avatar component shows user initials or profile image
- Unauthenticated users see prompt to sign in

Files: `src/features/reports/hooks/useAddComment.ts`

### Infrastructure

#### Database Schema

Three migrations applied via Supabase MCP:

1. Core tables: status, category, profiles, report, photo, comment, report_view
2. Row Level Security policies for all tables
3. Database triggers for profile creation and timestamp updates

Seed data: 4 status values, 8 category values

#### CI/CD Pipeline

GitHub Actions workflow runs on every push to main branch. Workflow installs dependencies, runs TypeScript compilation, and builds the production bundle. Vercel integration deploys automatically on successful builds.

Files: `.github/workflows/ci.yml`, `vercel.json`

---

## Planned Features

### Priority 1: Core User Flows

#### Tabular View with Filters

Jira: SCRM-7, SCRM-8, SCRM-9, SCRM-10, SCRM-11

Implement a table view of all reports with columns for title, category, status, date, and location. Add filter dropdowns for status and category. Enable sorting by clicking column headers. Include pagination for large datasets.

Estimated components:

- ReportsTablePage at /reports route
- useReports hook with filter and sort parameters
- DataTable component with Tanstack Table
- Filter dropdown components

#### My Reports Dashboard

Jira: SCRM-125

Create citizen dashboard showing only reports submitted by the current user. Display summary cards for total reports, pending, and resolved counts. Link each report to details page.

Estimated components:

- MyReportsPage at /my-reports route
- useMyReports hook filtered by user_id
- Summary stat cards
- Report list component

### Priority 2: Worker Features

#### Worker Dashboard

Jira: SCRM-109, SCRM-50, SCRM-51

Build dashboard for municipal workers showing assigned reports, unassigned reports available to claim, and completed reports. Include quick action buttons for status updates.

Estimated components:

- WorkerDashboardPage at /worker route
- useWorkerReports hook
- AssignedReportsList component
- UnassignedReportsList component
- QuickActionButtons component

#### Status Updates

Jira: SCRM-52, SCRM-54

Allow workers to update report status through the worker dashboard or report details page. Add status update form with optional note. Record status change history.

Estimated components:

- StatusUpdateForm component
- useUpdateStatus hook
- Status history display

### Priority 3: Admin Features

#### Admin Dashboard

Jira: SCRM-47, SCRM-48, SCRM-44, SCRM-118

Create admin dashboard with statistics overview. Display total reports, reports by status, reports by category (pie chart), reports over time (line chart). Add date range filter.

Estimated components:

- AdminDashboardPage at /admin route
- StatCard components
- Recharts integration for charts
- useReportStats hook

### Priority 4: Enhancements

#### Real-time Updates

Jira: SCRM-9.1, SCRM-9.2, SCRM-9.3

Implement Supabase real-time subscriptions so new reports appear on map without refresh, status changes update automatically, and new comments appear instantly.

#### Notifications

Jira: SCRM-41, SCRM-42, SCRM-133

Add notification system for status changes and new comments. Consider email notifications via Supabase Edge Functions or in-app notification center.

#### Report History

Jira: SCRM-31, SCRM-140

Create audit trail for report changes. Track status transitions, assignment changes, and edits with timestamps and user attribution.

---

## Technical Debt

### Known Issues

- Bundle size exceeds 500KB warning; consider code splitting with React.lazy
- Map re-renders on every state change; consider memoization
- No error boundary for graceful error handling

### Future Improvements

- Add unit tests with Vitest
- Implement image compression before upload
- Add marker clustering for performance with many reports
- Internationalization (i18n) support for Croatian/English

---

## Version History

### v0.1.0 (December 2025)

- Initial MVP release
- Google OAuth authentication
- Map view with report markers
- Report submission form
- Report details page with comments
- CI/CD pipeline with Vercel deployment
