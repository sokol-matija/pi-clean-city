# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## <small>1.4.1 (2026-01-01)</small>

* chore: update dependencies and remove unused media ([cb1208f](https://github.com/sokol-matija/pi-clean-city/commit/cb1208f))
* refactor: remove verbose documentation across all features ([ff3e472](https://github.com/sokol-matija/pi-clean-city/commit/ff3e472))

## 1.4.0 (2025-12-20)

* Fixes ([b5355b5](https://github.com/sokol-matija/pi-clean-city/commit/b5355b5))
* Fixes ([c3f514b](https://github.com/sokol-matija/pi-clean-city/commit/c3f514b))
* Fixes ([31ca2ce](https://github.com/sokol-matija/pi-clean-city/commit/31ca2ce))
* Fixes ([d2e7a97](https://github.com/sokol-matija/pi-clean-city/commit/d2e7a97))
* Fixes ([964326e](https://github.com/sokol-matija/pi-clean-city/commit/964326e))
* Merge pull request #5 from sokol-matija/refactor/ticketing ([6ce0d11](https://github.com/sokol-matija/pi-clean-city/commit/6ce0d11)), closes [#5](https://github.com/sokol-matija/pi-clean-city/issues/5)
* Merge pull request #6 from sokol-matija/refactor/SOLID-community ([e61fb0b](https://github.com/sokol-matija/pi-clean-city/commit/e61fb0b)), closes [#6](https://github.com/sokol-matija/pi-clean-city/issues/6)
* fix: update TicketAssignment interface to allow undefined for assigned_worker ([ba52f9a](https://github.com/sokol-matija/pi-clean-city/commit/ba52f9a))
* feat: add index file for ticket service exports ([4610c4c](https://github.com/sokol-matija/pi-clean-city/commit/4610c4c))
* feat: add ITicketService interface for ticket management operations ([b42b9ef](https://github.com/sokol-matija/pi-clean-city/commit/b42b9ef))
* feat: add priority configuration with options and utility functions ([15bb1fd](https://github.com/sokol-matija/pi-clean-city/commit/15bb1fd))
* feat: add TicketAssignmentBadge component and integrate it into TicketsTable ([c6c5e2e](https://github.com/sokol-matija/pi-clean-city/commit/c6c5e2e))
* feat: add TicketDetailsModal component for viewing and updating ticket details ([71b503d](https://github.com/sokol-matija/pi-clean-city/commit/71b503d))
* feat: add TicketFilters component for managing ticket status and category filtering ([0b672ec](https://github.com/sokol-matija/pi-clean-city/commit/0b672ec))
* feat: add TicketServiceContext for dependency injection of ITicketService ([e806fab](https://github.com/sokol-matija/pi-clean-city/commit/e806fab))
* feat: add useTicketFilters hook for managing ticket filtering logic ([eda7fbb](https://github.com/sokol-matija/pi-clean-city/commit/eda7fbb))
* feat: add useTicketModal hook for managing ticket details modal state ([32639b3](https://github.com/sokol-matija/pi-clean-city/commit/32639b3))
* feat: implement SupabaseTicketService for ticket management operations ([2f5d577](https://github.com/sokol-matija/pi-clean-city/commit/2f5d577))
* feat: implement TicketsTable component for rendering ticket reports ([898b7a9](https://github.com/sokol-matija/pi-clean-city/commit/898b7a9))
* feat: implement useAdminTickets hook for fetching and managing admin ticket data ([dde20ab](https://github.com/sokol-matija/pi-clean-city/commit/dde20ab))
* feat: implement useTicketForm hook for managing ticket form state and changes ([6422e82](https://github.com/sokol-matija/pi-clean-city/commit/6422e82))
* feat: post interfaces ([447992b](https://github.com/sokol-matija/pi-clean-city/commit/447992b))
* feat: post services ([5d4d0fd](https://github.com/sokol-matija/pi-clean-city/commit/5d4d0fd))
* feat: replace hardcoded priority options with dynamic configuration from priorityConfig ([e98b551](https://github.com/sokol-matija/pi-clean-city/commit/e98b551))
* feat: supabase post repo ([4eada60](https://github.com/sokol-matija/pi-clean-city/commit/4eada60))
* feat: wrap AdminTicketsPage with TicketServiceProvider for context access ([13f1b40](https://github.com/sokol-matija/pi-clean-city/commit/13f1b40))
* refactor: move TicketDetailsModal component ([e3251c2](https://github.com/sokol-matija/pi-clean-city/commit/e3251c2))
* refactor: post component/hooks ([8519cc8](https://github.com/sokol-matija/pi-clean-city/commit/8519cc8))
* refactor: streamline AdminTicketsPage by delegating logic to hooks and components ([3f80ea8](https://github.com/sokol-matija/pi-clean-city/commit/3f80ea8))
* refactor: update import path for TicketDetailsModal component ([94f8c08](https://github.com/sokol-matija/pi-clean-city/commit/94f8c08))

## <small>1.3.4 (2025-12-17)</small>

* fix: properly separate context instance to resolve React Fast Refresh warnings ([6480288](https://github.com/sokol-matija/pi-clean-city/commit/6480288))

## <small>1.3.3 (2025-12-17)</small>

* fix: split repository hooks to fix React Fast Refresh warnings ([37cb28d](https://github.com/sokol-matija/pi-clean-city/commit/37cb28d))

## <small>1.3.2 (2025-12-17)</small>

* chore: remove finished docs ([c8394d9](https://github.com/sokol-matija/pi-clean-city/commit/c8394d9))
* chore: update gitignore ([6738842](https://github.com/sokol-matija/pi-clean-city/commit/6738842))
* chore: update gitignore ([49e21a5](https://github.com/sokol-matija/pi-clean-city/commit/49e21a5))
* Merge branch 'feature/solid-dip' ([a486f39](https://github.com/sokol-matija/pi-clean-city/commit/a486f39))
* Merge branch 'feature/solid-isp' ([236ddc8](https://github.com/sokol-matija/pi-clean-city/commit/236ddc8))
* Merge branch 'feature/solid-lsp' ([c5638b9](https://github.com/sokol-matija/pi-clean-city/commit/c5638b9))
* Merge branch 'feature/solid-ocp' ([55aa2f1](https://github.com/sokol-matija/pi-clean-city/commit/55aa2f1))
* refactor(solid): apply Dependency Inversion Principle to repository layer ([d5d6e78](https://github.com/sokol-matija/pi-clean-city/commit/d5d6e78))
* refactor(solid): apply Interface Segregation Principle to report operations ([556f021](https://github.com/sokol-matija/pi-clean-city/commit/556f021))
* refactor(solid): apply Liskov Substitution Principle with interface composition ([5a62c80](https://github.com/sokol-matija/pi-clean-city/commit/5a62c80))
* refactor(solid): apply Open/Closed Principle to badge styling ([0ddfdc4](https://github.com/sokol-matija/pi-clean-city/commit/0ddfdc4))
* refactor(solid): apply Single Responsibility Principle to SubmitReportPage ([018634b](https://github.com/sokol-matija/pi-clean-city/commit/018634b))
* docs: add demo video to README ([02b3493](https://github.com/sokol-matija/pi-clean-city/commit/02b3493))
* docs: embed YouTube video directly in README ([dcd2d15](https://github.com/sokol-matija/pi-clean-city/commit/dcd2d15))
* docs: fix demo link in README.md ([97c3cf3](https://github.com/sokol-matija/pi-clean-city/commit/97c3cf3))
* docs: fix README video embed - use clickable thumbnail ([3100532](https://github.com/sokol-matija/pi-clean-city/commit/3100532)), closes [hi#resolution](https://github.com/hi/issues/resolution)
* docs: update README with YouTube demo link ([65dfe21](https://github.com/sokol-matija/pi-clean-city/commit/65dfe21))

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
