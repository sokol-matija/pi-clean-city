# CleanCity - Municipal Problem Reporting Platform

[![Version](https://img.shields.io/github/v/release/sokol-matija/pi-clean-city?label=version)](https://github.com/sokol-matija/pi-clean-city/releases)
[![CI Status](https://img.shields.io/github/actions/workflow/status/sokol-matija/pi-clean-city/ci.yml?branch=main&label=CI)](https://github.com/sokol-matija/pi-clean-city/actions/workflows/ci.yml)
[![Release Status](https://img.shields.io/github/actions/workflow/status/sokol-matija/pi-clean-city/release.yml?branch=main&label=release)](https://github.com/sokol-matija/pi-clean-city/actions/workflows/release.yml)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

CleanCity is a web platform that enables citizens to report municipal problems such as potholes, trash, broken street lights, and other community issues. Municipal authorities can track, manage, and resolve these reports in real-time.

**[CI/CD Pipeline](docs/CICD_PIPELINE.md)** | **[Release Guide](docs/RELEASE_GUIDE.md)** | **[Changelog](CHANGELOG.md)** | **[Latest Release](https://github.com/sokol-matija/pi-clean-city/releases/latest)**

## Demo

<video src="https://github.com/sokol-matija/pi-clean-city/assets/pi-github.mp4" controls width="100%"></video>

## Technology Stack

### Frontend Framework

The application is built with Vite and React 18.3.1. We chose Vite over Create React App due to its significantly faster development server startup and hot module replacement. React 18 was selected for its concurrent rendering features and automatic batching improvements.

We specifically chose not to use Next.js for this project for the following reasons:

- The application is a Single Page Application (SPA) that does not require server-side rendering (SSR) or static site generation (SSG).
- Supabase provides auto-generated API routes through its REST API, eliminating the need for Next.js API routes.
- Next.js has known security vulnerabilities that were disclosed recently, making it a security risk for this project.
- Deploying to Vercel as a static site provides better cost efficiency for our use case.
- The simpler architecture reduces complexity for a team project where not all members have Next.js experience.

### React Version Considerations

React 18.3.1 is the current stable version used in this project. We are not using React 19 due to a critical security vulnerability (CVE-2024-XXXXX) that was disclosed in the past 10 days affecting React 19's server-side rendering implementation. React 18 remains the secure and stable choice until the vulnerability is patched.

### UI Components

Shadcn/ui provides the component library, built on top of Radix UI primitives. This choice offers accessible, unstyled components that we customize with Tailwind CSS v3. We use Tailwind CSS v3.4.19 rather than v4 because Shadcn/ui components are not yet compatible with the v4 CSS-first configuration approach.

### State Management

Server state is managed with TanStack Query (React Query) v5, which handles caching, background refetching, and optimistic updates for all Supabase data. Client state uses Zustand for lightweight global state needs such as UI preferences.

### Maps Integration

Leaflet 1.9.4 with react-leaflet 4.2.1 provides the interactive map functionality. We use OpenStreetMap tiles, which are free and open-source. Note that react-leaflet v4 is required for React 18 compatibility; v5 requires React 19.

### Backend Services

Supabase provides the complete backend infrastructure:

- PostgreSQL database with Row Level Security (RLS) for data protection
- Authentication with Google OAuth integration
- Storage for report photos with automatic CDN delivery
- Real-time subscriptions for live updates (planned feature)

### Deployment

The application deploys to Vercel with automatic deployments triggered by GitHub pushes. GitHub Actions runs type checking and builds on every push to ensure code quality.

## Project Structure

```
src/
  components/     # Reusable UI components
    layout/       # Header, Layout wrapper
    ui/           # Shadcn/ui components
  features/       # Feature-based modules
    auth/         # Authentication logic and components
    reports/      # Report-related hooks and components
  lib/            # Utilities and Supabase client
  pages/          # Route components
  types/          # TypeScript type definitions
docs/             # Mintlify documentation
```

## Database Schema

The application uses seven tables with the following relationships:

- profiles: User information extending Supabase auth
- status: Report status lookup (New, In Progress, Resolved, Closed)
- category: Problem categories (Potholes, Trash, Lighting, etc.)
- report: Main reports table with foreign keys to category, status, and profiles
- photo: Report photos stored in Supabase Storage
- comment: User comments on reports
- report_view: Analytics tracking for report views

All tables have Row Level Security enabled with policies appropriate to each user role (citizen, worker, admin).

## User Roles

Citizens can submit reports, track their submissions, and comment on any report. Municipal workers can view assigned reports, update statuses, and communicate with citizens. Administrators have full access to statistics, user management, and system configuration.

## Local Development

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env.local` file with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run all quality checks (same as CI):

```bash
npm run validate
```

## CI/CD Pipeline

The project uses a comprehensive automated CI/CD pipeline:

- **Git Hooks** (Husky): Pre-commit secret scanning, linting, and formatting; pre-push type checking and testing
- **Conventional Commits**: Enforced commit message format for automated releases
- **GitHub Actions CI**: Parallel quality checks (lint, typecheck, test, build) on every push
- **Automated Releases**: semantic-release manages versioning and changelog based on conventional commits
- **Deployment**: Automatic deployment to Vercel on successful releases

**Quick Commands:**

```bash
npm run validate     # Run all checks (lint + typecheck + test + build)
npm run release:dry  # Preview next release version
```

For complete pipeline documentation including hooks, workflows, release process, and troubleshooting, see **[CI/CD Pipeline Documentation](docs/CICD_PIPELINE.md)**.

## Documentation

Technical documentation is maintained with Mintlify and located in the `/docs` directory. To preview locally:

```bash
npm install -g mintlify
cd docs
mintlify dev
```

## Team

- Domagoj Antic
- Fran Vicic
- Matija Sokol
- Mato Jelen Kralj

Developed as part of Software Engineering (Programsko Inzenjerstvo) course.

## License

This project is developed for educational purposes.
