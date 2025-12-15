# Product Requirements Document (PRD)

# CleanCity - Municipal Problem Reporting Platform

**Version:** 1.0
**Date:** December 2025
**Authors:** Domagoj Antic, Fran Vicic, Matija Sokol, Mato Jelen Kralj
**Course:** Software Engineering (Programsko Inzenjerstvo)

---

## 1. Executive Summary

### 1.1 Vision

CleanCity is a web platform that enables citizens to report municipal problems (potholes, trash, broken street lights) while municipal authorities track, manage, and resolve these issues in real-time.

### 1.2 Problem Statement

Current municipal problem reporting methods are:

- **Slow**: Phone calls and emails create delays
- **Opaque**: Citizens have no visibility into resolution progress
- **Uncoordinated**: Multiple reports of the same issue waste resources
- **Undocumented**: No historical data for planning and prevention

### 1.3 Solution

A unified platform providing:

- Simple problem submission with geolocation
- Real-time status tracking
- Direct communication between citizens and authorities
- Data analytics for better urban planning

### 1.4 Success Metrics

| Metric                   | Target        |
| ------------------------ | ------------- |
| Report submission time   | < 2 minutes   |
| Average resolution time  | < 7 days      |
| User satisfaction rating | > 4.0/5.0     |
| Page load time           | < 2 seconds   |
| Mobile responsiveness    | 100% coverage |

---

## 2. User Personas & Roles

### 2.1 Citizens (Gradani)

**Description:** Residents who want to report and track community problems.

**Goals:**

- Submit problems quickly with photos and location
- Track status of submitted reports
- Receive notifications on progress
- Communicate with municipal services

**Key Tasks:**

- Create account / Sign in with Google
- Submit new report with photo and geolocation
- View all reports on map
- Track own reports in dashboard
- Add comments to reports

### 2.2 Municipal Workers (Gradanski Radnici)

**Description:** City employees who process and resolve reported problems.

**Goals:**

- View assigned reports efficiently
- Update status as work progresses
- Communicate with citizens
- Manage workload effectively

**Key Tasks:**

- View dashboard of assigned reports
- Claim unassigned reports
- Update report status (New -> In Progress -> Resolved -> Closed)
- Add internal notes and public comments
- Upload resolution photos

### 2.3 Administrators (Administratori)

**Description:** System managers who oversee operations and analyze data.

**Goals:**

- Monitor overall system performance
- Generate reports for stakeholders
- Manage user accounts
- Identify problem trends

**Key Tasks:**

- View statistics dashboard
- Filter data by date/location
- Export PDF reports
- Manage user roles
- Monitor worker performance

---

## 3. Functional Requirements

### 3.1 Phase 1: MVP (Core Citizen Flow)

#### FR-1: User Authentication

| ID     | Requirement                            | Priority  |
| ------ | -------------------------------------- | --------- |
| FR-1.1 | Users can sign in with Google OAuth    | Must Have |
| FR-1.2 | Users can sign out                     | Must Have |
| FR-1.3 | Session persists across page refreshes | Must Have |
| FR-1.4 | Protected routes redirect to login     | Must Have |

#### FR-2: Map View

| ID     | Requirement                                                                           | Priority    |
| ------ | ------------------------------------------------------------------------------------- | ----------- |
| FR-2.1 | Display interactive map centered on Zagreb                                            | Must Have   |
| FR-2.2 | Show all reports as colored markers                                                   | Must Have   |
| FR-2.3 | Marker color indicates status (red=new, yellow=progress, green=resolved, gray=closed) | Must Have   |
| FR-2.4 | Click marker to view report details                                                   | Must Have   |
| FR-2.5 | Filter markers by status                                                              | Should Have |
| FR-2.6 | Filter markers by category                                                            | Should Have |

#### FR-3: Report Submission

| ID     | Requirement                                | Priority    |
| ------ | ------------------------------------------ | ----------- |
| FR-3.1 | Title field (required, max 100 chars)      | Must Have   |
| FR-3.2 | Description field (required, 20-500 chars) | Must Have   |
| FR-3.3 | Category dropdown (required)               | Must Have   |
| FR-3.4 | Location picker on map (required)          | Must Have   |
| FR-3.5 | "Use my location" geolocation button       | Should Have |
| FR-3.6 | Photo upload (max 5 photos, 10MB each)     | Must Have   |
| FR-3.7 | Address auto-fill from coordinates         | Should Have |
| FR-3.8 | Form validation with error messages        | Must Have   |

#### FR-4: Report Details

| ID     | Requirement                          | Priority    |
| ------ | ------------------------------------ | ----------- |
| FR-4.1 | Display report title and description | Must Have   |
| FR-4.2 | Display photo gallery                | Must Have   |
| FR-4.3 | Display status badge                 | Must Have   |
| FR-4.4 | Display category and location        | Must Have   |
| FR-4.5 | Display submission date and time     | Must Have   |
| FR-4.6 | Show on map                          | Should Have |

### 3.2 Phase 2: User Dashboards

#### FR-5: Citizen Dashboard

| ID     | Requirement                   | Priority    |
| ------ | ----------------------------- | ----------- |
| FR-5.1 | List user's submitted reports | Must Have   |
| FR-5.2 | Show status of each report    | Must Have   |
| FR-5.3 | Filter by status              | Should Have |
| FR-5.4 | Link to report details        | Must Have   |

#### FR-6: Worker Dashboard

| ID     | Requirement                       | Priority    |
| ------ | --------------------------------- | ----------- |
| FR-6.1 | Display assigned reports count    | Must Have   |
| FR-6.2 | Display active today count        | Must Have   |
| FR-6.3 | Display completed this week count | Must Have   |
| FR-6.4 | List assigned reports             | Must Have   |
| FR-6.5 | List unassigned reports           | Must Have   |
| FR-6.6 | Quick action: Start Work          | Must Have   |
| FR-6.7 | Quick action: Mark Resolved       | Must Have   |
| FR-6.8 | Claim unassigned report           | Should Have |

#### FR-7: Admin Dashboard

| ID      | Requirement                     | Priority    |
| ------- | ------------------------------- | ----------- |
| FR-7.1  | Display total reports count     | Must Have   |
| FR-7.2  | Display pending reports count   | Must Have   |
| FR-7.3  | Display resolved reports count  | Must Have   |
| FR-7.4  | Display average resolution time | Must Have   |
| FR-7.5  | Line chart: Reports over time   | Should Have |
| FR-7.6  | Pie chart: Reports by category  | Should Have |
| FR-7.7  | Filter by date range            | Should Have |
| FR-7.8  | Filter by location/area         | Could Have  |
| FR-7.9  | Export dashboard to PDF         | Should Have |
| FR-7.10 | Worker performance table        | Could Have  |

### 3.3 Phase 3: Advanced Features

#### FR-8: Comments & Communication

| ID     | Requirement                          | Priority    |
| ------ | ------------------------------------ | ----------- |
| FR-8.1 | Add comment to report                | Should Have |
| FR-8.2 | View comment thread                  | Should Have |
| FR-8.3 | Display commenter name and timestamp | Should Have |
| FR-8.4 | Delete own comments                  | Could Have  |

#### FR-9: Real-time Updates

| ID     | Requirement                               | Priority   |
| ------ | ----------------------------------------- | ---------- |
| FR-9.1 | New reports appear on map without refresh | Could Have |
| FR-9.2 | Status changes update in real-time        | Could Have |
| FR-9.3 | New comments appear without refresh       | Could Have |

#### FR-10: Notifications

| ID      | Requirement                         | Priority   |
| ------- | ----------------------------------- | ---------- |
| FR-10.1 | Email notification on status change | Could Have |
| FR-10.2 | Email notification on new comment   | Could Have |
| FR-10.3 | In-app notification center          | Could Have |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID      | Requirement                   | Target      |
| ------- | ----------------------------- | ----------- |
| NFR-1.1 | Page load time                | < 2 seconds |
| NFR-1.2 | API response time             | < 500ms     |
| NFR-1.3 | Map render time (100 markers) | < 1 second  |
| NFR-1.4 | Photo upload time (5MB)       | < 5 seconds |

### 4.2 Security

| ID      | Requirement                                        |
| ------- | -------------------------------------------------- |
| NFR-2.1 | All data transmitted over HTTPS                    |
| NFR-2.2 | Row Level Security (RLS) on all database tables    |
| NFR-2.3 | JWT-based authentication                           |
| NFR-2.4 | Role-based access control (citizen, worker, admin) |
| NFR-2.5 | Input validation on all forms                      |
| NFR-2.6 | SQL injection prevention                           |

### 4.3 Accessibility

| ID      | Requirement                              |
| ------- | ---------------------------------------- |
| NFR-3.1 | WCAG 2.1 AA compliance target            |
| NFR-3.2 | Keyboard navigation support              |
| NFR-3.3 | Screen reader compatibility              |
| NFR-3.4 | Color contrast ratio >= 4.5:1            |
| NFR-3.5 | Focus indicators on interactive elements |

### 4.4 Usability

| ID      | Requirement                                 |
| ------- | ------------------------------------------- |
| NFR-4.1 | Responsive design (mobile, tablet, desktop) |
| NFR-4.2 | Mobile breakpoint: 320px                    |
| NFR-4.3 | Tablet breakpoint: 768px                    |
| NFR-4.4 | Desktop breakpoint: 1024px                  |
| NFR-4.5 | Submit report in < 3 steps                  |

### 4.5 Reliability

| ID      | Requirement           | Target |
| ------- | --------------------- | ------ |
| NFR-5.1 | Uptime                | 99.5%  |
| NFR-5.2 | Data backup frequency | Daily  |
| NFR-5.3 | Error rate            | < 1%   |

---

## 5. Technical Architecture

### 5.1 Technology Stack

| Layer            | Technology                                        |
| ---------------- | ------------------------------------------------- |
| Frontend         | Vite + React 18 + TypeScript                      |
| Routing          | React Router v6                                   |
| UI Components    | Shadcn/ui + Tailwind CSS                          |
| State Management | Tanstack Query (server) + Zustand (client)        |
| Maps             | Leaflet + OpenStreetMap                           |
| Charts           | Recharts                                          |
| PDF Export       | jsPDF                                             |
| Backend          | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| Deployment       | Vercel                                            |
| CI/CD            | GitHub Actions                                    |

### 5.2 Database Schema

#### Tables

**profiles** (extends auth.users)

```
id: uuid (PK, FK -> auth.users)
username: text
email: text
role: text ('citizen' | 'worker' | 'admin')
avatar_url: text
created_at: timestamptz
updated_at: timestamptz
```

**status** (lookup table)

```
id: serial (PK)
name: text (unique)
color: text
description: text
sort_order: int
```

**category** (lookup table)

```
id: serial (PK)
name: text (unique)
icon: text
description: text
```

**report**

```
id: uuid (PK)
title: text
description: text
address: text
latitude: decimal(10,8)
longitude: decimal(11,8)
created_at: timestamptz
resolved_at: timestamptz (nullable)
category_id: int (FK -> category)
status_id: int (FK -> status)
user_id: uuid (FK -> profiles)
assigned_worker_id: uuid (FK -> profiles, nullable)
priority: text ('low' | 'medium' | 'high')
```

**photo**

```
id: uuid (PK)
url: text
filename: text
report_id: uuid (FK -> report)
uploaded_at: timestamptz
```

**comment**

```
id: uuid (PK)
report_id: uuid (FK -> report)
user_id: uuid (FK -> profiles)
content: text
created_at: timestamptz
```

**report_view** (analytics)

```
id: uuid (PK)
report_id: uuid (FK -> report)
user_id: uuid (FK -> profiles, nullable)
viewed_at: timestamptz
```

### 5.3 Row Level Security (RLS) Policies

| Table       | Select       | Insert       | Update             | Delete      |
| ----------- | ------------ | ------------ | ------------------ | ----------- |
| profiles    | All          | Own          | Own                | -           |
| status      | All          | Admin        | Admin              | Admin       |
| category    | All          | Admin        | Admin              | Admin       |
| report      | All          | Auth         | Owner/Worker/Admin | Admin       |
| photo       | All          | Owner/Worker | -                  | Admin       |
| comment     | All          | Auth         | Owner              | Owner/Admin |
| report_view | Worker/Admin | Auth         | -                  | -           |

### 5.4 API Endpoints (Supabase Auto-generated)

| Method | Endpoint                           | Description             |
| ------ | ---------------------------------- | ----------------------- |
| GET    | /rest/v1/report                    | List all reports        |
| GET    | /rest/v1/report?id=eq.{id}         | Get report by ID        |
| POST   | /rest/v1/report                    | Create new report       |
| PATCH  | /rest/v1/report?id=eq.{id}         | Update report           |
| DELETE | /rest/v1/report?id=eq.{id}         | Delete report           |
| GET    | /rest/v1/category                  | List categories         |
| GET    | /rest/v1/status                    | List statuses           |
| GET    | /rest/v1/comment?report_id=eq.{id} | Get comments for report |
| POST   | /rest/v1/comment                   | Add comment             |

---

## 6. UI/UX Specifications

### 6.1 Design System

#### Colors

```
Primary: #10b981 (Emerald)
Status New: #ff6b6b (Red)
Status In Progress: #ffd93d (Yellow)
Status Resolved: #6bcf7f (Green)
Status Closed: #95a5a6 (Gray)
```

#### Typography

```
Font Family: System fonts (Inter fallback)
Heading 1: 28px, Bold
Heading 2: 24px, Bold
Body: 14px, Regular
Small: 12px, Regular
```

#### Spacing

```
Grid: 8px base unit
Component padding: 16px
Section margin: 32px
```

### 6.2 Key Screens

| Screen           | Route        | Access        |
| ---------------- | ------------ | ------------- |
| Landing Page     | /            | Public        |
| Map View         | /map         | Public        |
| Login            | /login       | Public        |
| Submit Report    | /submit      | Authenticated |
| Report Details   | /reports/:id | Public        |
| My Reports       | /my-reports  | Citizen       |
| Worker Dashboard | /worker      | Worker/Admin  |
| Admin Dashboard  | /admin       | Admin         |

### 6.3 Wireframe References

See `/wireframes/` directory:

- `01-landing-page.html` - Homepage with map preview
- `02-map-view.html` - Full interactive map
- `03-submit-report.html` - Report submission form
- `05-auth.html` - Login/Register
- `06-worker-dashboard.html` - Worker interface
- `07-report-table.html` - Tabular report view
- `09-admin-dashboard.html` - Admin statistics

---

## 7. Implementation Phases

### Phase 1: Foundation (MVP)

1. Project setup (Vite + React + TypeScript)
2. Shadcn/ui + Tailwind configuration
3. Supabase client setup
4. Database migrations
5. Google OAuth authentication
6. Login page
7. Protected routes
8. Map view with markers
9. Report submission form
10. Report details page

### Phase 2: User Dashboards

1. Citizen "My Reports" dashboard
2. Worker dashboard
3. Admin dashboard with statistics
4. Charts integration

### Phase 3: Advanced Features

1. Comments system
2. Real-time updates (Supabase subscriptions)
3. PDF export
4. Notification system

### Phase 4: Polish & Deployment

1. Mobile optimization
2. Performance tuning
3. Accessibility audit
4. Vercel deployment
5. CI/CD pipeline

---

## 8. Risks & Mitigations

| Risk                              | Impact | Probability | Mitigation                    |
| --------------------------------- | ------ | ----------- | ----------------------------- |
| Supabase rate limits              | High   | Low         | Implement client-side caching |
| Large photo uploads slow          | Medium | Medium      | Compress images before upload |
| Map performance with many markers | Medium | Medium      | Implement marker clustering   |
| User adoption                     | High   | Medium      | Simple onboarding, Google SSO |
| Data privacy concerns             | High   | Low         | Clear privacy policy, RLS     |

---

## 9. Glossary

| Term     | Definition                                                     |
| -------- | -------------------------------------------------------------- |
| Report   | A citizen-submitted municipal problem                          |
| Status   | Current state of a report (New, In Progress, Resolved, Closed) |
| Category | Type of problem (Potholes, Trash, Lighting, etc.)              |
| Worker   | Municipal employee who processes reports                       |
| RLS      | Row Level Security - database access control                   |
| MVP      | Minimum Viable Product                                         |

---

## 10. Appendices

### A. Category List

1. Potholes (Rupe na cesti)
2. Trash (Smece)
3. Street Lighting (Ulicna rasvjeta)
4. Graffiti (Grafiti)
5. Signage (Prometna signalizacija)
6. Drainage (Odvod)
7. Vegetation (Zelenilo)
8. Other (Ostalo)

### B. Status Workflow

```
New -> In Progress -> Resolved -> Closed
         |                |
         +-> Closed <-----+
```

### C. Related Documents

- ER Diagram: `/docs/matija-sokol/1-diagrams/er-diagram.mermaid`
- Class Diagram: `/docs/matija-sokol/1-diagrams/class-diagram.mermaid`
- Jira Backlog: `/docs/project/jira-backlog.md`
- Wireframe Plan: `/docs/project/wireframe-plan.md`
