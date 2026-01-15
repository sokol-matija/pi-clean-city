# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## <small>1.11.11 (2026-01-15)</small>

* fix(security): remove unsafe-eval from production CSP ([37cf6f4](https://github.com/sokol-matija/pi-clean-city/commit/37cf6f4))

## <small>1.11.10 (2026-01-15)</small>

* Merge remote-tracking branch 'origin/main' ([7528681](https://github.com/sokol-matija/pi-clean-city/commit/7528681))
* fix(security): add workflow permissions ([ecefa43](https://github.com/sokol-matija/pi-clean-city/commit/ecefa43))

## <small>1.11.9 (2026-01-15)</small>

* fix(security): add workflow permissions and remove comments ([19d0945](https://github.com/sokol-matija/pi-clean-city/commit/19d0945))

## <small>1.11.8 (2026-01-15)</small>

* Merge remote-tracking branch 'origin/main' ([692e313](https://github.com/sokol-matija/pi-clean-city/commit/692e313))
* fix(scripts): correct npm audit signatures command typo ([ef629a0](https://github.com/sokol-matija/pi-clean-city/commit/ef629a0))

## <small>1.11.7 (2026-01-15)</small>

* Merge remote-tracking branch 'origin/main' ([5b0913d](https://github.com/sokol-matija/pi-clean-city/commit/5b0913d))
* fix(scripts): use --audit-level=moderate for npm audit in validation ([8720ee1](https://github.com/sokol-matija/pi-clean-city/commit/8720ee1))

## <small>1.11.6 (2026-01-15)</small>

* fix(ci): pin GitHub Actions to SHA hashes and disable credential persistence ([db8e004](https://github.com/sokol-matija/pi-clean-city/commit/db8e004))

## <small>1.11.5 (2026-01-14)</small>

* fix(csp): add 'unsafe-eval' for Vite dynamic imports in production ([97cb5ef](https://github.com/sokol-matija/pi-clean-city/commit/97cb5ef))

## <small>1.11.4 (2026-01-14)</small>

* fix(csp): production CSP to restrictive ([61c91ce](https://github.com/sokol-matija/pi-clean-city/commit/61c91ce))

## <small>1.11.3 (2026-01-14)</small>

* fix(csp): allow Google Fonts domains ([3ddc3d4](https://github.com/sokol-matija/pi-clean-city/commit/3ddc3d4))

## <small>1.11.2 (2026-01-14)</small>

* fix(vercel): exclude txt files from SPA rewrite rules ([1565b56](https://github.com/sokol-matija/pi-clean-city/commit/1565b56))
* chore: add loader.io verification token for load testing ([1de3ae4](https://github.com/sokol-matija/pi-clean-city/commit/1de3ae4))

## <small>1.11.1 (2026-01-13)</small>

* fix(security): add explicit validation for redirect paths to address Snyk findings ([0523587](https://github.com/sokol-matija/pi-clean-city/commit/0523587))

## 1.11.0 (2026-01-13)

* fix: replace explicit any types with proper type annotations in tests ([764260b](https://github.com/sokol-matija/pi-clean-city/commit/764260b))
* fix: upgrade @supabase/supabase-js from 2.87.1 to 2.89.0 ([b7f3923](https://github.com/sokol-matija/pi-clean-city/commit/b7f3923))
* fix: upgrade lucide-react from 0.561.0 to 0.562.0 ([8d4fbe0](https://github.com/sokol-matija/pi-clean-city/commit/8d4fbe0))
* fix(deps): add peer dependencies to various packages in package-lock.json ([52888b0](https://github.com/sokol-matija/pi-clean-city/commit/52888b0))
* Merge pull request #10 from sokol-matija/main ([344c2c5](https://github.com/sokol-matija/pi-clean-city/commit/344c2c5)), closes [#10](https://github.com/sokol-matija/pi-clean-city/issues/10)
* Merge pull request #11 from sokol-matija/feature/ticketing-tests ([b88204e](https://github.com/sokol-matija/pi-clean-city/commit/b88204e)), closes [#11](https://github.com/sokol-matija/pi-clean-city/issues/11)
* Merge pull request #12 from sokol-matija/snyk-upgrade-6948ded39fc697b21eaf5f7ecf2ab23f ([20fe3fa](https://github.com/sokol-matija/pi-clean-city/commit/20fe3fa)), closes [#12](https://github.com/sokol-matija/pi-clean-city/issues/12)
* Merge pull request #13 from sokol-matija/snyk-upgrade-13dc09aaae851ec869a84bfe21a915dc ([00c2540](https://github.com/sokol-matija/pi-clean-city/commit/00c2540)), closes [#13](https://github.com/sokol-matija/pi-clean-city/issues/13)
* refactor(tests): standardize string quotes and improve test readability ([b5ecef9](https://github.com/sokol-matija/pi-clean-city/commit/b5ecef9))
* feat(test): add mock data for city services and statuses in ticket service tests ([f2572a0](https://github.com/sokol-matija/pi-clean-city/commit/f2572a0))
* feat(test): add unit tests for LoggingTicketServiceDecorator and improve logging format ([a94d9af](https://github.com/sokol-matija/pi-clean-city/commit/a94d9af))
* feat(test): add unit tests for SupabaseTicketService with mocked Supabase client ([0803a98](https://github.com/sokol-matija/pi-clean-city/commit/0803a98))
* feat(test): enhance SupabaseTicketService tests with error handling case ([ea8eccc](https://github.com/sokol-matija/pi-clean-city/commit/ea8eccc))
* feat(test): enhance SupabaseTicketService tests with error handling case ([229deeb](https://github.com/sokol-matija/pi-clean-city/commit/229deeb))
* feat(tests): add edge case tests for AssignmentBadge and enhance TicketServiceDecorator with export ([278723b](https://github.com/sokol-matija/pi-clean-city/commit/278723b))
* feat(tests): add unit tests for BadgeFactory and improve badge rendering logic ([fd7f4e6](https://github.com/sokol-matija/pi-clean-city/commit/fd7f4e6))
* feat(tests): add unit tests for TicketObserver pattern and its observers ([07e63f6](https://github.com/sokol-matija/pi-clean-city/commit/07e63f6))

## <small>1.10.3 (2026-01-13)</small>

* fix(ci): add GITHUB_TOKEN to gitleaks action for PR scanning ([268e798](https://github.com/sokol-matija/pi-clean-city/commit/268e798))

## <small>1.10.2 (2026-01-10)</small>

* fix(security): add security headers to vercel.json for production ([519cf5c](https://github.com/sokol-matija/pi-clean-city/commit/519cf5c))

## <small>1.10.1 (2026-01-10)</small>

* fix(security): add security headers and XSS protection ([e71ff2c](https://github.com/sokol-matija/pi-clean-city/commit/e71ff2c))
* chore: add validation scrips for all the tools and improve validation dry run ([6d901e9](https://github.com/sokol-matija/pi-clean-city/commit/6d901e9))
* chore: revert the old validate npm script to fix github action ([e62999c](https://github.com/sokol-matija/pi-clean-city/commit/e62999c))

## 1.10.0 (2026-01-10)

* chore(build): add rollup visualizer for bundle analysis ([aa2c76d](https://github.com/sokol-matija/pi-clean-city/commit/aa2c76d))
* chore(test): update vitest coverage configuration ([0c27b91](https://github.com/sokol-matija/pi-clean-city/commit/0c27b91))
* chore(types): add jest-dom vitest type reference ([6da3241](https://github.com/sokol-matija/pi-clean-city/commit/6da3241))
* test: add unit tests for auth, notifications, and reports ([24c532d](https://github.com/sokol-matija/pi-clean-city/commit/24c532d))
* feat(test): add screenshot and video capture on e2e failure ([7af4635](https://github.com/sokol-matija/pi-clean-city/commit/7af4635))
* feat(test): add vitest ui for interactive test debugging ([56f65a8](https://github.com/sokol-matija/pi-clean-city/commit/56f65a8))

## <small>1.9.2 (2026-01-09)</small>

* fix(security): update react-router to address multiple vulnerabilities ([55264ff](https://github.com/sokol-matija/pi-clean-city/commit/55264ff))

## <small>1.9.1 (2026-01-05)</small>

* fix(ci): add Supabase environment variables to Playwright workflow ([121a291](https://github.com/sokol-matija/pi-clean-city/commit/121a291))

## 1.9.0 (2026-01-05)

* feat(test): configure Playwright webServer for automated dev server ([a81d28d](https://github.com/sokol-matija/pi-clean-city/commit/a81d28d))
* feat(test): login e2e test using playwright ([a3f6fcf](https://github.com/sokol-matija/pi-clean-city/commit/a3f6fcf))
* chore: npm audit fix ([15bfe60](https://github.com/sokol-matija/pi-clean-city/commit/15bfe60))
* chore: remove redundant comments ([fa89ee9](https://github.com/sokol-matija/pi-clean-city/commit/fa89ee9))
* chore(release): 1.8.5 [skip ci] ([f4ae74b](https://github.com/sokol-matija/pi-clean-city/commit/f4ae74b))
* fix(test): exclude Playwright tests from Vitest runner ([ebc47c5](https://github.com/sokol-matija/pi-clean-city/commit/ebc47c5))
* test: add Playwright e2e testing infrastructure ([82c9de6](https://github.com/sokol-matija/pi-clean-city/commit/82c9de6))
* ci: add security gate to release workflow ([76153ed](https://github.com/sokol-matija/pi-clean-city/commit/76153ed))
* ci: allow moderate vulnerabilities in security gate ([e92482e](https://github.com/sokol-matija/pi-clean-city/commit/e92482e))

## <small>1.8.5 (2026-01-04)</small>

* fix(test): exclude Playwright tests from Vitest runner ([ebc47c5](https://github.com/sokol-matija/pi-clean-city/commit/ebc47c5))
* test: add Playwright e2e testing infrastructure ([82c9de6](https://github.com/sokol-matija/pi-clean-city/commit/82c9de6))
* chore: npm audit fix ([15bfe60](https://github.com/sokol-matija/pi-clean-city/commit/15bfe60))
* chore: remove redundant comments ([fa89ee9](https://github.com/sokol-matija/pi-clean-city/commit/fa89ee9))
* ci: add security gate to release workflow ([76153ed](https://github.com/sokol-matija/pi-clean-city/commit/76153ed))
* ci: allow moderate vulnerabilities in security gate ([e92482e](https://github.com/sokol-matija/pi-clean-city/commit/e92482e))

## <small>1.8.4 (2026-01-04)</small>

* fix: eliminate semgrep findings by removing command parameter wrapper ([1a84ba4](https://github.com/sokol-matija/pi-clean-city/commit/1a84ba4))
* fix: use spawnSync instead of execSync to prevent command injection ([16ba834](https://github.com/sokol-matija/pi-clean-city/commit/16ba834))

## <small>1.8.3 (2026-01-04)</small>

* Merge remote-tracking branch 'origin/main' ([deb3288](https://github.com/sokol-matija/pi-clean-city/commit/deb3288))
* fix: resolve security workflow issues ([f203d34](https://github.com/sokol-matija/pi-clean-city/commit/f203d34))

## <small>1.8.2 (2026-01-04)</small>

* docs: remove obsolete documentation ([571fbfd](https://github.com/sokol-matija/pi-clean-city/commit/571fbfd))
* refactor: convert BadgeFactory to functional exports ([f46fe87](https://github.com/sokol-matija/pi-clean-city/commit/f46fe87))
* refactor: convert NotificationEventEmitter to functional API ([036382b](https://github.com/sokol-matija/pi-clean-city/commit/036382b))
* refactor: update components to use refactored factories ([64ea569](https://github.com/sokol-matija/pi-clean-city/commit/64ea569))
* chore: update config and tooling ([d06c7d0](https://github.com/sokol-matija/pi-clean-city/commit/d06c7d0))
* ci: simplify security workflow ([3ae158c](https://github.com/sokol-matija/pi-clean-city/commit/3ae158c))
