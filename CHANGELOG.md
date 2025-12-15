# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## <small>1.3.1 (2025-12-15)</small>

* fix: revert package-lock.json ([8866769](https://github.com/sokol-matija/pi-clean-city/commit/8866769))
* docs: move the documents to the correct location ([1e84b00](https://github.com/sokol-matija/pi-clean-city/commit/1e84b00))

## 1.3.0 (2025-12-15)

* Merge remote-tracking branch 'origin/main' ([dbc8892](https://github.com/sokol-matija/pi-clean-city/commit/dbc8892))
* feat: implement post deletion functionality ([cb21881](https://github.com/sokol-matija/pi-clean-city/commit/cb21881))

## 1.2.0 (2025-12-15)

* feat: implement post display functionality with RLS fix ([1161ded](https://github.com/sokol-matija/pi-clean-city/commit/1161ded))
* docs: add comprehensive CI/CD pipeline documentation ([eadd8e0](https://github.com/sokol-matija/pi-clean-city/commit/eadd8e0))

## 1.1.0 (2025-12-15)

* ci: disable Husky git hooks in CI environment ([7353b78](https://github.com/sokol-matija/pi-clean-city/commit/7353b78))
* ci: upgrade Node.js to v22 for semantic-release compatibility ([9d9ba1a](https://github.com/sokol-matija/pi-clean-city/commit/9d9ba1a))
* fix: exclude package-lock.json from Prettier formatting ([32cae66](https://github.com/sokol-matija/pi-clean-city/commit/32cae66))
* fix: resolve dependency conflicts in package-lock.json ([2382877](https://github.com/sokol-matija/pi-clean-city/commit/2382877))
* feat: add automated release and changelog management ([cb984f4](https://github.com/sokol-matija/pi-clean-city/commit/cb984f4)), closes [#automate-releases](https://github.com/sokol-matija/pi-clean-city/issues/automate-releases)

## [1.0.0] - 2025-12-15 (Production Release)

### Added

- Complete clean-city platform with all core features
- Multi-user support with role-based access control (Citizens, Admins, City Services)
- Interactive mapping and geolocation-based reporting
- Community engagement features with posts and comments
- Ticketing and issue tracking system
- Admin dashboard for system management

### Fixed

- All TypeScript type safety issues resolved
- All ESLint code quality warnings fixed
- Improved code organization and refactoring

### Improved

- CI/CD pipeline with parallel job execution
- Performance and reliability across all features
- Developer experience and contribution guidelines

## [0.9.0] - 2025-12-15

### Added

- Husky pre-commit hooks for automated checks
- Commitlint for conventional commit messages
- ESLint configuration with auto-fix on commit
- Prettier code formatting integration
- Secret scanning (Gitleaks integration)
- Automated CI/CD testing pipeline

### Improved

- Developer experience with automated tooling
- Code consistency through enforced standards
- Commit message quality and project history clarity

## [0.8.0] - 2025-12-13

### Added

- Photo preview in map report popups
- Vercel Analytics for usage tracking

### Improved

- Photo upload reliability and validation
- Authentication session persistence across browser sessions
- UI/UX refinements (dropdown positioning, form layouts)
- Dropdown list scrolling behavior

## [0.7.0] - 2025-12-13

### Added

- Complete community feature integration
- Enhanced post and comment system

### Fixed

- Post submission function improvements
- Database table structure and relationships
- TypeScript type safety (removed any types)
- Post database constraints

## [0.6.0] - 2025-12-13

### Added

- Admin authentication system (email/password)
- Admin dashboard with ticket management interface
- Ticket listing, filtering, and search
- Ticket detail modal with assignment options
- Ticket status and priority management
- Admin-only protected routes

## [0.5.0] - 2025-12-12

### Added

- Report details page with full report information
- Comments and discussion system on reports
- Community feed page for citizen engagement
- Social interaction features (likes, comments)
- Backend support for community posts and comments
- Updated technical documentation and security rationale

## [0.4.0] - 2025-12-12

### Added

- Interactive map view with Leaflet.js
- Report submission form with file upload
- Geolocation tracking for reports
- Application routing with React Router
- Vercel deployment pipeline
- GitHub Actions CI/CD workflow
- Environment configuration management

## [0.3.0] - 2025-12-12

### Added

- React 18 + Vite frontend with TypeScript
- Tailwind CSS and Shadcn/ui component library
- Supabase client integration and type generation
- Google OAuth authentication flow
- Landing page and authentication UI
- Navigation layout and routing foundation

## [0.2.0] - 2025-12-11

### Added

- .NET backend infrastructure (ASP.NET Core)
- Complete domain model with entities (User, Ticket, GeoLocation, Category, CityService)
- Entity Framework Core configuration and migrations
- JWT authentication and authorization
- REST API endpoints for tickets, users, and city services
- Swagger/OpenAPI documentation
- Database seeding for test data

## [0.1.0] - 2025-11-08

### Added

- Initial project setup with folder structure
- Architecture documentation (ER and class diagrams)
- Mintlify documentation framework
- Visual design assets and system diagrams
- Contributing guidelines and README

<!-- Version Links -->

[0.1.0]: https://github.com/sokol-matija/pi-clean-city/releases/tag/v0.1.0
[0.2.0]: https://github.com/sokol-matija/pi-clean-city/releases/tag/v0.2.0
[0.3.0]: https://github.com/sokol-matija/pi-clean-city/releases/tag/v0.3.0
[0.4.0]: https://github.com/sokol-matija/pi-clean-city/releases/tag/v0.4.0
[0.5.0]: https://github.com/sokol-matija/pi-clean-city/releases/tag/v0.5.0
[0.6.0]: https://github.com/sokol-matija/pi-clean-city/releases/tag/v0.6.0
[0.7.0]: https://github.com/sokol-matija/pi-clean-city/releases/tag/v0.7.0
[0.8.0]: https://github.com/sokol-matija/pi-clean-city/releases/tag/v0.8.0
[0.9.0]: https://github.com/sokol-matija/pi-clean-city/releases/tag/v0.9.0
[1.0.0]: https://github.com/sokol-matija/pi-clean-city/releases/tag/v1.0.0
