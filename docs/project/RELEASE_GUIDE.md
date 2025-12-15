# Release Management Guide

## Overview

CleanCity uses automated semantic releases based on conventional commit messages. Every commit to `main` that follows the conventional format can trigger a new release.

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types and Release Impact

| Type       | Release | Example                               |
| ---------- | ------- | ------------------------------------- |
| `feat`     | minor   | `feat: add email notifications`       |
| `fix`      | patch   | `fix: resolve map marker duplication` |
| `perf`     | patch   | `perf: optimize database queries`     |
| `refactor` | patch   | `refactor: simplify auth logic`       |
| `docs`     | none    | `docs: update API documentation`      |
| `test`     | none    | `test: add report submission tests`   |
| `chore`    | none    | `chore: update dependencies`          |
| `ci`       | none    | `ci: improve workflow performance`    |

### Breaking Changes

Add `BREAKING CHANGE:` in the footer for major releases:

```
feat: redesign authentication system

BREAKING CHANGE: OAuth configuration must be updated
```

## Automated Release Process

1. **Developer makes changes:**
   - Write code following project standards
   - Run `npm run validate` locally
   - Commit with conventional format

2. **Push to main:**

   ```bash
   git push origin main
   ```

3. **Automated workflow:**
   - GitHub Actions runs CI (lint, typecheck, test, build)
   - If CI passes and commits are releasable → semantic-release runs
   - Version bumped in package.json
   - CHANGELOG.md updated
   - Git tag created (v1.2.3)
   - GitHub release created with notes
   - Build artifacts attached to release
   - Changes committed back to main
   - Vercel deploys new version

## Manual Releases

### Dry Run (Preview)

```bash
npm run release:dry
```

This shows what would happen without making changes.

### Manual Version Bumps

```bash
# Patch: 1.2.3 → 1.2.4
npm run version:patch

# Minor: 1.2.3 → 1.3.0
npm run version:minor

# Major: 1.2.3 → 2.0.0
npm run version:major
```

### Manual GitHub Release Workflow

Go to: https://github.com/sokol-matija/pi-clean-city/actions/workflows/release.yml
Click "Run workflow" → Select options → Run

## Version Strategy

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features (backward compatible)
- **PATCH** (0.0.1): Bug fixes (backward compatible)

### Current Version: 1.0.0 (Production Release)

We're now on v1.0.0, which means:

- Any breaking changes will bump to v2.0.0
- New features will bump to v1.1.0, v1.2.0, etc.
- Bug fixes will bump to v1.0.1, v1.0.2, etc.

## Changelog Management

### Automatic Updates

CHANGELOG.md is automatically updated by semantic-release on every release.

### Manual Edits

You can manually edit CHANGELOG.md after a release to:

- Add context or explanations
- Group related changes
- Add migration guides for breaking changes
- Include screenshots or examples

Commit manual edits with:

```bash
git add CHANGELOG.md
git commit -m "docs: enhance release notes for v1.2.3"
```

## Troubleshooting

### No Release Was Created

Possible reasons:

1. No conventional commits since last release
2. Only docs/test/chore commits (no version bump)
3. CI checks failed
4. Commit message format incorrect

**Solution:** Check GitHub Actions logs and verify commit messages

### Release Failed

Check:

1. GitHub Actions logs in the "Release" workflow
2. Commit message format (run `npx commitlint --from=HEAD~1`)
3. GitHub token permissions
4. Branch protection rules

### Wrong Version Bumped

Review commit types:

- `feat` → minor (1.0.0 → 1.1.0)
- `fix` → patch (1.0.0 → 1.0.1)
- `BREAKING CHANGE` → major (1.0.0 → 2.0.0)

If the wrong version was released, you can:

1. Manually delete the tag and release on GitHub
2. Create a new commit with the correct type
3. The next release will use the correct version

## Release Checklist

Before releasing v2.0.0 (next major version):

- [ ] All tests passing
- [ ] Documentation complete
- [ ] Breaking changes documented in CHANGELOG.md
- [ ] Migration guide written
- [ ] Security review completed
- [ ] Performance benchmarks run
- [ ] Browser compatibility tested
- [ ] Accessibility audit passed

## Version History

Our complete version history (v0.1.0 → v1.0.0):

| Version | Date         | Focus                         |
| ------- | ------------ | ----------------------------- |
| v0.1.0  | Nov 8, 2025  | Documentation & Planning      |
| v0.2.0  | Dec 11, 2025 | Backend Infrastructure (.NET) |
| v0.3.0  | Dec 12, 2025 | Frontend Foundation (React)   |
| v0.4.0  | Dec 12, 2025 | Map & Report Submission       |
| v0.5.0  | Dec 12, 2025 | Report Details & Community    |
| v0.6.0  | Dec 13, 2025 | Admin Dashboard & Ticketing   |
| v0.7.0  | Dec 13, 2025 | Community Integration         |
| v0.8.0  | Dec 13, 2025 | Photos & UX Improvements      |
| v0.9.0  | Dec 15, 2025 | DevOps & Code Quality         |
| v1.0.0  | Dec 15, 2025 | **Production Release**        |

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [semantic-release docs](https://semantic-release.gitbook.io/)
- [GitHub Releases](https://github.com/sokol-matija/pi-clean-city/releases)

## Quick Commands Reference

```bash
# Development
npm run dev                # Start development server
npm run validate           # Run all quality checks locally

# Testing
npm run test              # Run tests in watch mode
npm run test:run          # Run tests once
npm run test:coverage     # Generate coverage report

# Code Quality
npm run lint              # Check for linting errors
npm run lint:fix          # Auto-fix linting errors
npm run format            # Format code with Prettier
npm run typecheck         # Check TypeScript types

# Releases
npm run release:dry       # Preview next release
npm run release           # Create release (automatic in CI)
npm run version:patch     # Manual patch bump
npm run version:minor     # Manual minor bump
npm run version:major     # Manual major bump

# Git
git tag -l                # List all version tags
git log --oneline         # View commit history
```

## FAQ

### Q: When should I create a major release (v2.0.0)?

**A:** Only when you have breaking changes that require users to update their code or configuration. Examples:

- Removing or renaming API endpoints
- Changing authentication flow
- Removing features
- Changing database schema in incompatible ways

### Q: Can I skip a version number?

**A:** No, semantic-release will automatically calculate the next version based on commits. You cannot manually skip versions (e.g., go from v1.2.0 to v1.5.0).

### Q: What happens if I push directly to main without a conventional commit?

**A:** If the commit doesn't follow conventional format or is a non-releasable type (docs, test, chore), semantic-release will skip creating a release. The commit will still be pushed to main.

### Q: How do I create a hotfix release?

**A:** Just push a commit with `fix:` type to main:

```bash
git commit -m "fix: critical security vulnerability in auth"
git push origin main
```

This will automatically create a patch release (e.g., v1.0.3).

### Q: Can I test the release process locally?

**A:** Yes! Use the dry-run command:

```bash
npm run release:dry
```

This shows what version would be created and what changes would be in the release notes, without actually creating the release.

---

**Last Updated:** December 15, 2025
**Current Version:** 1.0.0
**Maintained by:** PI Clean City Team
