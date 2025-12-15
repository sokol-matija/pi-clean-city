# CI/CD Pipeline Documentation

**Project**: PI Clean City
**Last Updated**: December 15, 2025
**Version**: 1.1.0

## Table of Contents

1. [Overview](#overview)
2. [Pipeline Architecture](#pipeline-architecture)
3. [Local Development Workflow](#local-development-workflow)
4. [Git Hooks (Husky)](#git-hooks-husky)
5. [GitHub Actions Workflows](#github-actions-workflows)
6. [Automated Release Process](#automated-release-process)
7. [Tools & Technologies](#tools--technologies)
8. [Configuration Files](#configuration-files)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

---

## Overview

The PI Clean City project uses a comprehensive CI/CD pipeline that ensures code quality, security, and automated releases. The pipeline consists of:

- **Local Git Hooks** - Validate code before commits/pushes
- **GitHub Actions CI** - Parallel quality checks on every push/PR
- **GitHub Actions Release** - Automated semantic versioning and releases
- **Deployment** - Automatic deployment to Vercel on successful releases

### Pipeline Goals

- Catch errors early in development
- Enforce code quality standards
- Prevent secrets from being committed
- Automate version management
- Ensure consistent builds
- Provide fast feedback (< 2 minutes)

### Quality Gates

```
┌─────────────────────────────────────────────────────┐
│  Developer Workflow                                  │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  1. Local Development         │
        │     - Write code              │
        │     - Run tests               │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  2. Pre-Commit Hook           │
        │     - Secret scanning         │
        │     - Lint staged files       │
        │     - Format code             │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  3. Pre-Push Hook             │
        │     - TypeScript check        │
        │     - Run tests               │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  4. GitHub Actions CI         │
        │     - Lint (parallel)         │
        │     - TypeCheck (parallel)    │
        │     - Test (parallel)         │
        │     - Build                   │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  5. Release (if on main)      │
        │     - Analyze commits         │
        │     - Bump version            │
        │     - Update CHANGELOG        │
        │     - Create GitHub release   │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  6. Deploy                    │
        │     - Vercel deployment       │
        └──────────────────────────────┘
```

---

## Pipeline Architecture

### Multi-Layer Quality Assurance

The pipeline implements a defense-in-depth strategy with multiple validation layers:

#### Layer 1: Pre-Commit (Local)

**Purpose**: Catch issues before they're committed
**Speed**: 5-15 seconds
**Tools**: Gitleaks, lint-staged, Prettier, ESLint

```bash
git add .
git commit -m "feat: add feature"
# ↓ Automatically runs:
# 1. gitleaks (secret scanning)
# 2. lint-staged (format + lint changed files)
```

#### Layer 2: Pre-Push (Local)

**Purpose**: Verify code compiles and tests pass
**Speed**: 10-30 seconds
**Tools**: TypeScript, Vitest

```bash
git push origin main
# ↓ Automatically runs:
# 1. npm run typecheck
# 2. npm run test:run
```

#### Layer 3: Commit Message Validation (Local)

**Purpose**: Enforce conventional commit format
**Tool**: commitlint

```bash
git commit -m "feat: new feature"  # ✅ Valid
git commit -m "added stuff"        # ❌ Invalid
```

#### Layer 4: CI Validation (GitHub Actions)

**Purpose**: Comprehensive quality checks on remote
**Speed**: ~1 minute (parallel)
**Jobs**: Lint, TypeCheck, Test, Build

#### Layer 5: Release Automation (GitHub Actions)

**Purpose**: Semantic versioning and changelog management
**Speed**: ~2 minutes
**Tool**: semantic-release

---

## Local Development Workflow

### Daily Development Commands

```bash
# Start development server
npm run dev

# Run all quality checks (same as CI)
npm run validate
# Runs: lint + typecheck + test + build

# Individual checks
npm run lint              # ESLint
npm run lint:fix          # Auto-fix ESLint issues
npm run typecheck         # TypeScript type checking
npm run test              # Tests in watch mode
npm run test:run          # Tests once (used in CI)
npm run test:coverage     # Tests with coverage report
npm run format            # Format code with Prettier
npm run format:check      # Check formatting without changing files
npm run build             # Production build
```

### Pre-Commit Workflow

When you commit code, the following happens automatically:

```bash
git add src/components/Button.tsx
git commit -m "feat: add new button component"

# Automatic execution:
# ┌─────────────────────────────────────┐
# │ 1. Gitleaks - Secret Scanning       │
# │    ✓ Scans staged files for secrets │
# │    ✓ Blocks commit if secrets found │
# └─────────────────────────────────────┘
#              │
#              ▼
# ┌─────────────────────────────────────┐
# │ 2. lint-staged                      │
# │    For *.{ts,tsx} files:            │
# │      - eslint --fix                 │
# │      - prettier --write             │
# │    For *.{json,md,css} files:       │
# │      - prettier --write             │
# └─────────────────────────────────────┘
#              │
#              ▼
# ┌─────────────────────────────────────┐
# │ 3. commitlint                       │
# │    ✓ Validates commit message       │
# │    ✓ Enforces conventional format   │
# └─────────────────────────────────────┘
#              │
#              ▼
#    Commit created ✅
```

### Pre-Push Workflow

Before code is pushed to GitHub:

```bash
git push origin feature-branch

# Automatic execution:
# ┌─────────────────────────────────────┐
# │ 1. TypeScript Type Checking         │
# │    npm run typecheck                │
# │    ✓ Verifies all types are correct │
# └─────────────────────────────────────┘
#              │
#              ▼
# ┌─────────────────────────────────────┐
# │ 2. Run All Tests                    │
# │    npm run test:run                 │
# │    ✓ Ensures tests pass             │
# └─────────────────────────────────────┘
#              │
#              ▼
#    Push to GitHub ✅
```

---

## Git Hooks (Husky)

### What is Husky?

Husky manages Git hooks to run scripts automatically at specific Git lifecycle events. All hooks are disabled in CI environments using `HUSKY=0` to prevent conflicts.

### Hook Configuration

#### Pre-Commit Hook

**File**: `.husky/pre-commit`
**Runs**: Before every commit
**Can be bypassed**: `git commit --no-verify` (not recommended)

```bash
#!/bin/sh

# 1. Secret scanning with gitleaks
gitleaks protect --staged --verbose --redact --config=.gitleaks.toml

# 2. Lint and format staged files
npx lint-staged
```

**What gets checked:**

- All staged files are scanned for secrets (API keys, tokens, passwords)
- TypeScript/TSX files: ESLint + Prettier
- JSON/MD/CSS files: Prettier only
- package-lock.json: Excluded (prevents corruption)

**Configuration**: `package.json`

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"],
    "package-lock.json": []
  }
}
```

#### Pre-Push Hook

**File**: `.husky/pre-push`
**Runs**: Before every push
**Can be bypassed**: `git push --no-verify` (not recommended)

```bash
#!/bin/sh

# 1. TypeScript type checking
npm run typecheck

# 2. Run all tests
npm run test:run
```

**Why these checks:**

- TypeScript: Catch type errors before CI
- Tests: Ensure all tests pass before pushing
- Faster feedback than waiting for CI

#### Commit-Msg Hook

**File**: `.husky/commit-msg`
**Runs**: After commit message is entered
**Purpose**: Validate commit message format

```bash
#!/bin/sh
npx --no -- commitlint --edit ${1}
```

**Validates against conventional commits:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Valid types:**

- `feat`: New feature (minor release)
- `fix`: Bug fix (patch release)
- `perf`: Performance improvement (patch release)
- `refactor`: Code refactoring (patch release)
- `docs`: Documentation only (no release)
- `test`: Tests only (no release)
- `chore`: Maintenance (no release)
- `ci`: CI/CD changes (no release)

**Examples:**

```bash
# ✅ Valid
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login redirect issue"
git commit -m "feat(auth)!: redesign authentication system

BREAKING CHANGE: OAuth configuration must be updated"

# ❌ Invalid
git commit -m "added stuff"
git commit -m "WIP"
git commit -m "fixes bug"
```

### Gitleaks Configuration

**File**: `.gitleaks.toml`
**Purpose**: Detect hardcoded secrets in code

**Scans for:**

- API keys
- AWS credentials
- Private keys
- Passwords
- Tokens
- Database connection strings

**Allowlist**: Configure in `.gitleaks.toml` to allow specific patterns:

```toml
[allowlist]
description = "Allowlist for test/example values"
paths = [
  ".*test.*",
  ".*example.*"
]
```

---

## GitHub Actions Workflows

### CI Workflow

**File**: `.github/workflows/ci.yml`
**Triggers**:

- Push to `main` branch
- Pull requests targeting `main`

#### Workflow Structure

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Cancel old runs when new commits pushed
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
      - run: npm ci
        env:
          HUSKY: 0 # Disable git hooks in CI
      - run: npm run lint

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
      - run: npm ci
        env:
          HUSKY: 0
      - run: npm run typecheck

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
      - run: npm ci
        env:
          HUSKY: 0
      - run: npm run test:run

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
      - run: npm ci
        env:
          HUSKY: 0
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
          retention-days: 7
```

#### Job Execution Flow

```
Trigger (push/PR)
        │
        ├─────────────┬─────────────┬─────────────┐
        │             │             │             │
        ▼             ▼             ▼             │
    ┌──────┐      ┌──────┐      ┌──────┐         │
    │ Lint │      │ Type │      │ Test │         │
    │ ~35s │      │ ~40s │      │ ~35s │         │
    └──┬───┘      └──┬───┘      └──┬───┘         │
       │             │             │             │
       └─────────────┴─────────────┴─────────────┘
                     │
                     ▼
              ┌─────────────┐
              │   Build     │
              │   ~80s      │
              └─────────────┘
                     │
                     ▼
              ┌─────────────┐
              │  Upload     │
              │  Artifact   │
              └─────────────┘
```

**Total Time**: ~1 minute 20 seconds (parallel execution)

**Benefits of Parallel Execution:**

- Faster feedback (was ~2 minutes sequential)
- Early failure detection
- Efficient use of CI resources
- Independent job failures are easier to debug

#### CI Job Details

**1. Lint Job**

```yaml
Purpose: Code quality checks
Runs: ESLint
Checks:
  - Code style violations
  - React hooks rules
  - TypeScript ESLint rules
  - Unused imports/variables
Fails on: Any ESLint errors
```

**2. TypeCheck Job**

```yaml
Purpose: Type safety verification
Runs: tsc --noEmit
Checks:
  - Type errors
  - Missing type annotations
  - Invalid type assignments
Fails on: Any TypeScript errors
```

**3. Test Job**

```yaml
Purpose: Run unit tests
Runs: Vitest
Checks:
  - All test suites
  - Test failures
  - Regression issues
Fails on: Any test failures
Current tests: 3 (utils.test.ts)
```

**4. Build Job**

```yaml
Purpose: Production build
Runs: Vite build
Depends on: lint, typecheck, test (all must pass)
Checks:
  - Build compilation
  - Environment variables
  - Asset generation
Outputs: dist/ directory (uploaded as artifact)
Fails on: Build errors or missing env vars
```

### Release Workflow

**File**: `.github/workflows/release.yml`
**Triggers**:

- Push to `main` branch
- Manual trigger via workflow_dispatch

#### Workflow Structure

```yaml
name: Release

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      dry_run:
        description: "Run in dry-run mode"
        required: false
        default: false
        type: boolean

# Prevent concurrent releases
concurrency:
  group: release
  cancel-in-progress: false

jobs:
  quality:
    name: Quality Checks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Full history for semantic-release
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
      - run: npm ci
      - run: npm run validate # lint + typecheck + test + build

  release:
    name: Semantic Release
    needs: quality
    runs-on: ubuntu-latest
    permissions:
      contents: write # Create releases and tags
      issues: write # Comment on issues
      pull-requests: write # Comment on PRs
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          persist-credentials: false
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
      - run: npm ci
      - run: npx commitlint --from=HEAD~1 --to=HEAD --verbose
      - run: npm run release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          HUSKY: 0 # Disable git hooks in CI

  deploy:
    name: Deploy to Vercel
    needs: release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
      - run: npm ci
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

#### Release Process Flow

```
Push to main (with conventional commits)
        │
        ▼
┌────────────────────┐
│ Quality Job        │
│ - Run validate     │
│ - All checks pass  │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Release Job        │
│ 1. Analyze commits │
│ 2. Determine bump  │
│ 3. Update version  │
│ 4. Update CHANGELOG│
│ 5. Create git tag  │
│ 6. GitHub release  │
│ 7. Commit changes  │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Deploy Job         │
│ - Build app        │
│ - Deploy to Vercel │
└────────────────────┘
```

---

## Automated Release Process

### Semantic Versioning

The project follows [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH
  │     │     │
  │     │     └─ Bug fixes, refactors (1.0.0 → 1.0.1)
  │     └─────── New features (1.0.0 → 1.1.0)
  └───────────── Breaking changes (1.0.0 → 2.0.0)
```

### Commit Message → Version Bump Mapping

| Commit Type        | Release Type | Example                   | Version Change |
| ------------------ | ------------ | ------------------------- | -------------- |
| `fix:`             | Patch        | `fix: resolve login bug`  | 1.0.0 → 1.0.1  |
| `feat:`            | Minor        | `feat: add dark mode`     | 1.0.0 → 1.1.0  |
| `perf:`            | Patch        | `perf: optimize queries`  | 1.0.0 → 1.0.1  |
| `refactor:`        | Patch        | `refactor: simplify auth` | 1.0.0 → 1.0.1  |
| `BREAKING CHANGE:` | Major        | `feat!: redesign API`     | 1.0.0 → 2.0.0  |
| `docs:`            | None         | `docs: update README`     | No release     |
| `test:`            | None         | `test: add unit tests`    | No release     |
| `chore:`           | None         | `chore: update deps`      | No release     |
| `ci:`              | None         | `ci: fix workflow`        | No release     |

### semantic-release Configuration

**File**: `.releaserc.json`

```json
{
  "branches": ["main"],
  "plugins": [
    [
      "@semantic-release/commit-analyzer",
      {
        "preset": "conventionalcommits",
        "releaseRules": [
          { "type": "feat", "release": "minor" },
          { "type": "fix", "release": "patch" },
          { "type": "perf", "release": "patch" },
          { "type": "refactor", "release": "patch" },
          { "type": "docs", "release": false },
          { "type": "test", "release": false },
          { "type": "ci", "release": false }
        ]
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        "preset": "conventionalcommits"
      }
    ],
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "CHANGELOG.md"
      }
    ],
    [
      "@semantic-release/npm",
      {
        "npmPublish": false
      }
    ],
    [
      "@semantic-release/github",
      {
        "assets": [{ "path": "dist/**/*", "label": "Distribution" }]
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": ["CHANGELOG.md", "package.json", "package-lock.json"],
        "message": "chore(release): ${nextRelease.version} [skip ci]"
      }
    ]
  ]
}
```

### What Happens During a Release

1. **Commit Analysis**: semantic-release analyzes all commits since the last release
2. **Version Calculation**: Determines new version based on commit types
3. **Changelog Generation**: Updates CHANGELOG.md with release notes
4. **Version Bump**: Updates package.json version
5. **Git Tag Creation**: Creates annotated git tag (e.g., v1.2.0)
6. **GitHub Release**: Creates GitHub release with notes and build artifacts
7. **Commit Changes**: Commits CHANGELOG.md and package.json with `[skip ci]`
8. **Push to Main**: Pushes release commit and tag

### Release Examples

#### Example 1: Patch Release (Bug Fix)

```bash
# Commit
git commit -m "fix: resolve user authentication timeout issue"
git push origin main

# Automated Release Process:
# 1. CI runs and passes
# 2. semantic-release analyzes commits
# 3. Determines: patch release (fix type)
# 4. Bumps version: 1.0.0 → 1.0.1
# 5. Updates CHANGELOG.md:
#    ## 1.0.1 (2025-12-15)
#    * fix: resolve user authentication timeout issue ([abc1234](link))
# 6. Creates git tag v1.0.1
# 7. Creates GitHub release
# 8. Deploys to Vercel
```

#### Example 2: Minor Release (New Feature)

```bash
# Commit
git commit -m "feat: add email notifications for report updates"
git push origin main

# Automated Release Process:
# Version bump: 1.0.1 → 1.1.0
# CHANGELOG entry under "Features" section
```

#### Example 3: Major Release (Breaking Change)

```bash
# Commit
git commit -m "feat: redesign authentication system

BREAKING CHANGE: OAuth configuration must be updated.
See migration guide in docs/MIGRATION.md"
git push origin main

# Automated Release Process:
# Version bump: 1.1.0 → 2.0.0
# CHANGELOG highlights breaking changes
```

#### Example 4: No Release (Documentation)

```bash
# Commit
git commit -m "docs: update API documentation"
git push origin main

# Automated Release Process:
# CI runs and passes
# semantic-release runs but creates no release (docs type)
# No version bump
```

### Manual Release Commands

```bash
# Preview next release without creating it
npm run release:dry

# Manual version bumps (alternative to semantic-release)
npm run version:patch  # 1.0.0 → 1.0.1
npm run version:minor  # 1.0.0 → 1.1.0
npm run version:major  # 1.0.0 → 2.0.0

# Recreate version history (already done)
npm run version:history
```

### Release Artifacts

Each GitHub release includes:

- **Release Notes**: Generated from conventional commits
- **Git Tag**: Annotated tag (e.g., v1.2.0)
- **Build Artifacts**: Production build (dist/) as ZIP
- **Commit Links**: Direct links to commits in release
- **Issue/PR References**: Automatic linking with `closes #123`

### Version History

The project has 10 documented versions representing development phases:

| Version | Date         | Phase                      |
| ------- | ------------ | -------------------------- |
| v0.1.0  | Nov 8, 2025  | Documentation & Planning   |
| v0.2.0  | Dec 11, 2025 | Backend Infrastructure     |
| v0.3.0  | Dec 12, 2025 | Frontend Foundation        |
| v0.4.0  | Dec 12, 2025 | Map & Report Submission    |
| v0.5.0  | Dec 12, 2025 | Report Details & Community |
| v0.6.0  | Dec 13, 2025 | Admin Dashboard            |
| v0.7.0  | Dec 13, 2025 | Community Integration      |
| v0.8.0  | Dec 13, 2025 | Photos & UX                |
| v0.9.0  | Dec 15, 2025 | DevOps & Code Quality      |
| v1.0.0  | Dec 15, 2025 | **Production Release**     |

Current version: **v1.1.0** (Automated Release System)

---

## Tools & Technologies

### Code Quality

#### ESLint

**Purpose**: JavaScript/TypeScript linting
**Configuration**: `eslint.config.js`
**Rules**:

- TypeScript ESLint recommended
- React hooks rules
- React refresh rules
- Prettier compatibility

```bash
npm run lint       # Check for issues
npm run lint:fix   # Auto-fix issues
```

#### Prettier

**Purpose**: Code formatting
**Configuration**: `.prettierrc` or `prettier.config.js`
**Formats**: TS, TSX, JS, JSON, CSS, MD
**Integration**: Runs via lint-staged on commit

```bash
npm run format        # Format all files
npm run format:check  # Check without changing
```

#### TypeScript

**Purpose**: Static type checking
**Configuration**: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
**Target**: ES2021+
**Strict Mode**: Enabled

```bash
npm run typecheck  # Check types
```

### Testing

#### Vitest

**Purpose**: Unit testing framework
**Configuration**: `vitest.config.ts`
**Coverage**: v8 provider
**Environment**: jsdom (for React components)

```bash
npm run test              # Watch mode
npm run test:run          # Run once (CI)
npm run test:coverage     # With coverage report
```

#### Testing Library

**Purpose**: React component testing
**Libraries**:

- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`

```typescript
// Example test
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Security

#### Gitleaks

**Purpose**: Secret scanning
**Configuration**: `.gitleaks.toml`
**Runs**: Pre-commit hook
**Detects**: API keys, tokens, passwords, private keys

```bash
# Manual scan
gitleaks detect --verbose

# Scan staged files
gitleaks protect --staged --verbose
```

### Git & Version Control

#### Husky

**Purpose**: Git hooks management
**Version**: 9.1.7
**Hooks**: pre-commit, pre-push, commit-msg
**Disabled in CI**: `HUSKY=0`

```bash
# Install hooks
npm run prepare

# Skip hooks (emergency use only)
git commit --no-verify
git push --no-verify
```

#### commitlint

**Purpose**: Commit message validation
**Configuration**: `.commitlintrc.json`
**Preset**: `@commitlint/config-conventional`

```bash
# Test commit message
echo "feat: new feature" | npx commitlint

# View configuration
npx commitlint --print-config
```

#### lint-staged

**Purpose**: Run linters on staged files only
**Configuration**: `package.json` → `lint-staged`
**Performance**: Only checks changed files (faster)

### Release Management

#### semantic-release

**Purpose**: Automated versioning and releases
**Version**: 25.0.2
**Configuration**: `.releaserc.json`
**Requires**: Node.js 22+

**Plugins:**

- `@semantic-release/commit-analyzer`: Analyze commits for version bump
- `@semantic-release/release-notes-generator`: Generate changelog
- `@semantic-release/changelog`: Update CHANGELOG.md
- `@semantic-release/npm`: Update package.json (no publish)
- `@semantic-release/github`: Create GitHub releases
- `@semantic-release/git`: Commit changes back to repo

#### conventional-changelog-cli

**Purpose**: Manual changelog generation (backup)
**Version**: 5.0.0
**Usage**: Fallback when semantic-release not used

#### standard-version

**Purpose**: Alternative manual versioning tool
**Version**: 9.5.0
**Usage**: Manual version bumps when needed

### Build & Development

#### Vite

**Purpose**: Frontend build tool
**Configuration**: `vite.config.ts`
**Features**: Fast HMR, optimized builds
**Plugins**: React, TypeScript

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run preview  # Preview build
```

#### Node.js

**Version**: 22 (LTS)
**Required for**: semantic-release v25+
**Package Manager**: npm (lock file: package-lock.json)

### Deployment

#### Vercel

**Purpose**: Hosting platform
**Deployment**: Automatic on git push to main
**Environment Variables**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Configuration Files

### Root Configuration Files

```
pi-clean-city/
├── .commitlintrc.json          # Commit message validation
├── .eslintrc.json              # ESLint configuration
├── .gitleaks.toml              # Secret scanning rules
├── .prettierrc                 # Code formatting
├── .releaserc.json             # semantic-release config
├── eslint.config.js            # ESLint modern config
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript base config
├── tsconfig.app.json           # App TypeScript config
├── tsconfig.node.json          # Node TypeScript config
├── vite.config.ts              # Vite build config
└── vitest.config.ts            # Test configuration
```

### Husky Hooks

```
.husky/
├── pre-commit    # Secret scan + lint-staged
├── pre-push      # TypeCheck + tests
└── commit-msg    # Commit message validation
```

### GitHub Actions

```
.github/workflows/
├── ci.yml       # Quality checks (parallel)
└── release.yml  # Automated releases
```

### Key Configuration Snippets

#### package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "validate": "npm run lint && npm run typecheck && npm run test:run && npm run build",
    "prepare": "husky",
    "release": "semantic-release",
    "release:dry": "semantic-release --dry-run"
  }
}
```

#### lint-staged (package.json)

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"],
    "package-lock.json": []
  }
}
```

---

## Troubleshooting

### Common Issues

#### 1. Pre-Commit Hook Fails

**Issue**: Gitleaks finds a secret

```
[WARN] Secret found
```

**Solution:**

```bash
# 1. Remove the secret from code
# 2. Add to .gitleaks.toml allowlist if false positive
# 3. Commit again
```

**Issue**: ESLint errors

```
✖ 5 problems (5 errors, 0 warnings)
```

**Solution:**

```bash
# Auto-fix
npm run lint:fix

# Or fix manually and commit
```

#### 2. Pre-Push Hook Fails

**Issue**: TypeScript errors

```
error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

**Solution:**

```bash
# Run typecheck locally
npm run typecheck

# Fix type errors
# Commit and push again
```

**Issue**: Tests fail

```
❌ Test failed: expected true to be false
```

**Solution:**

```bash
# Run tests locally
npm run test:run

# Fix broken tests or code
# Commit and push
```

#### 3. CI Workflow Fails

**Issue**: CI passes locally but fails on GitHub

```
Error: Missing environment variable VITE_SUPABASE_URL
```

**Solution:**

```bash
# Add secrets in GitHub repo settings:
# Settings → Secrets and variables → Actions
# Add: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```

**Issue**: Node version mismatch

```
npm error engine Unsupported engine
```

**Solution:**

- Update workflow to use Node 22
- Check `.github/workflows/*.yml` for `node-version: '22'`

#### 4. Release Workflow Fails

**Issue**: semantic-release can't create release

```
Error: Command failed with exit code 1: git commit
```

**Solution:**

- Check commit message format (must be conventional)
- Verify GITHUB_TOKEN has correct permissions
- Ensure `HUSKY=0` is set in workflow

**Issue**: No release created

```
semantic-release: No release published
```

**Reasons:**

- Only `docs:`, `test:`, `chore:`, or `ci:` commits since last release
- These don't trigger releases
- Need `feat:`, `fix:`, `perf:`, or `refactor:` commits

#### 5. Commit Message Rejected

**Issue**: commitlint fails

```
⧗   input: added new feature
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
```

**Solution:**

```bash
# Use conventional format
git commit -m "feat: add new feature"

# Valid formats:
# feat: description
# fix: description
# docs: description
# test: description
# chore: description
# ci: description
# refactor: description
# perf: description
```

#### 6. package-lock.json Conflicts

**Issue**: package-lock.json corrupted

```
npm error Missing: package@version from lock file
```

**Solution:**

```bash
# Regenerate clean lock file
rm -rf node_modules package-lock.json
npm install

# Verify
npm ci
```

#### 7. Husky Hooks Not Running

**Issue**: Git hooks don't execute

```
# Commits without running hooks
```

**Solution:**

```bash
# Reinstall hooks
npm run prepare

# Verify hooks exist
ls -la .husky/

# Check hook permissions
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/commit-msg
```

### Bypassing Checks (Emergency Use Only)

```bash
# Skip all git hooks
git commit --no-verify -m "emergency fix"
git push --no-verify

# Skip CI (add [skip ci] to commit message)
git commit -m "docs: update README [skip ci]"
```

**Warning**: Only use in emergencies. All checks exist for good reasons.

---

## Best Practices

### Commit Messages

**DO:**

```bash
✅ git commit -m "feat: add user profile page"
✅ git commit -m "fix: resolve memory leak in component"
✅ git commit -m "refactor: simplify authentication logic"
✅ git commit -m "docs: update API documentation"
```

**DON'T:**

```bash
❌ git commit -m "updates"
❌ git commit -m "WIP"
❌ git commit -m "fixed stuff"
❌ git commit -m "changes"
```

### Development Workflow

1. **Create feature branch**

   ```bash
   git checkout -b feature/user-profile
   ```

2. **Write code with tests**

   ```bash
   npm run test  # Watch mode while developing
   ```

3. **Run validation before commit**

   ```bash
   npm run validate
   ```

4. **Commit with conventional format**

   ```bash
   git add .
   git commit -m "feat: add user profile page with avatar upload"
   ```

5. **Push and create PR**

   ```bash
   git push origin feature/user-profile
   # Create PR on GitHub
   ```

6. **CI runs automatically**
   - Lint, typecheck, test, build in parallel
   - Fix any failures before merge

7. **Merge to main**
   - Squash and merge (maintains clean history)
   - semantic-release creates release automatically

### Code Quality

1. **Write tests first** (TDD when possible)
2. **Run validation locally** before pushing
3. **Keep commits small** and focused
4. **One feature per PR**
5. **Update tests** when changing code
6. **Fix linting errors** immediately
7. **Don't bypass hooks** without good reason

### Release Strategy

1. **Use conventional commits** always
2. **feat:** for new features → minor release
3. **fix:** for bug fixes → patch release
4. **BREAKING CHANGE:** for breaking changes → major release
5. **Let automation handle versioning** (don't manually edit package.json)
6. **Review CHANGELOG.md** after each release
7. **Test in staging** before major releases

### Security

1. **Never commit secrets** (checked by gitleaks)
2. **Use environment variables** for sensitive data
3. **Add secrets to GitHub Actions** securely
4. **Review dependencies** for vulnerabilities (`npm audit`)
5. **Keep dependencies updated**
6. **Use `.env.example`** for documentation, never `.env` with real values

### CI/CD

1. **Keep CI fast** (< 2 minutes ideal)
2. **Fail fast** (parallel jobs catch errors quickly)
3. **Monitor CI status** (check Actions tab regularly)
4. **Fix broken builds immediately**
5. **Don't merge failing PRs**
6. **Review release notes** after automated releases

---

## Quick Reference

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run validate         # Run all checks (CI equivalent)

# Quality Checks
npm run lint             # Check linting
npm run lint:fix         # Fix linting issues
npm run typecheck        # Check types
npm run test:run         # Run tests once
npm run format           # Format all code

# Building
npm run build            # Production build
npm run preview          # Preview production build

# Releases
npm run release:dry      # Preview release
git push origin main     # Trigger release (if conventional commits)

# Git
git commit --no-verify   # Skip hooks (emergency)
git push --no-verify     # Skip pre-push (emergency)
```

### Workflow Triggers

| Event          | CI Workflow | Release Workflow |
| -------------- | ----------- | ---------------- |
| Push to main   | ✅ Runs     | ✅ Runs          |
| Push to branch | ❌ No       | ❌ No            |
| PR to main     | ✅ Runs     | ❌ No            |
| Manual trigger | ✅ Possible | ✅ Possible      |

### Links & Resources

- **Repository**: https://github.com/sokol-matija/pi-clean-city
- **Actions**: https://github.com/sokol-matija/pi-clean-city/actions
- **Releases**: https://github.com/sokol-matija/pi-clean-city/releases
- **Release Guide**: [docs/RELEASE_GUIDE.md](RELEASE_GUIDE.md)
- **Conventional Commits**: https://www.conventionalcommits.org/
- **Semantic Versioning**: https://semver.org/
- **Keep a Changelog**: https://keepachangelog.com/

---

**Pipeline Status**: ✅ Production Ready
**Last Verified**: December 15, 2025
**Version**: 1.1.0

For questions or issues with the CI/CD pipeline, refer to the troubleshooting section above or check the GitHub Actions logs.
