#!/usr/bin/env node

/**
 * Create Version History Script
 *
 * Generates complete CHANGELOG.md with 10 versions (v0.1.0 → v1.0.0)
 * and creates git tags at appropriate commits.
 *
 * Usage: npm run version:history
 */

import { execSync } from 'child_process'
import { writeFileSync } from 'fs'
import * as readline from 'readline'

/**
 * Safe wrapper for execSync with parameterized commands
 */
function safeExec(command, args = [], options = {}) {
  const fullCommand = [command, ...args].join(' ')
  return execSync(fullCommand, { stdio: 'pipe', ...options })
}

// Version data with commit hashes and changelog content
const versions = [
  {
    version: '0.1.0',
    date: '2025-11-08',
    commit: '5b09bfc',
    changelog: {
      added: [
        'Initial project setup with folder structure',
        'Architecture documentation (ER and class diagrams)',
        'Mintlify documentation framework',
        'Visual design assets and system diagrams',
        'Contributing guidelines and README'
      ]
    }
  },
  {
    version: '0.2.0',
    date: '2025-12-11',
    commit: 'd25f44c',
    changelog: {
      added: [
        '.NET backend infrastructure (ASP.NET Core)',
        'Complete domain model with entities (User, Ticket, GeoLocation, Category, CityService)',
        'Entity Framework Core configuration and migrations',
        'JWT authentication and authorization',
        'REST API endpoints for tickets, users, and city services',
        'Swagger/OpenAPI documentation',
        'Database seeding for test data'
      ]
    }
  },
  {
    version: '0.3.0',
    date: '2025-12-12',
    commit: '3ade4c0',
    changelog: {
      added: [
        'React 18 + Vite frontend with TypeScript',
        'Tailwind CSS and Shadcn/ui component library',
        'Supabase client integration and type generation',
        'Google OAuth authentication flow',
        'Landing page and authentication UI',
        'Navigation layout and routing foundation'
      ]
    }
  },
  {
    version: '0.4.0',
    date: '2025-12-12',
    commit: '325294c',
    changelog: {
      added: [
        'Interactive map view with Leaflet.js',
        'Report submission form with file upload',
        'Geolocation tracking for reports',
        'Application routing with React Router',
        'Vercel deployment pipeline',
        'GitHub Actions CI/CD workflow',
        'Environment configuration management'
      ]
    }
  },
  {
    version: '0.5.0',
    date: '2025-12-12',
    commit: 'dc8b6f1',
    changelog: {
      added: [
        'Report details page with full report information',
        'Comments and discussion system on reports',
        'Community feed page for citizen engagement',
        'Social interaction features (likes, comments)',
        'Backend support for community posts and comments',
        'Updated technical documentation and security rationale'
      ]
    }
  },
  {
    version: '0.6.0',
    date: '2025-12-13',
    commit: '7b21f54',
    changelog: {
      added: [
        'Admin authentication system (email/password)',
        'Admin dashboard with ticket management interface',
        'Ticket listing, filtering, and search',
        'Ticket detail modal with assignment options',
        'Ticket status and priority management',
        'Admin-only protected routes'
      ]
    }
  },
  {
    version: '0.7.0',
    date: '2025-12-13',
    commit: 'b284acd',
    changelog: {
      added: [
        'Complete community feature integration',
        'Enhanced post and comment system'
      ],
      fixed: [
        'Post submission function improvements',
        'Database table structure and relationships',
        'TypeScript type safety (removed any types)',
        'Post database constraints'
      ]
    }
  },
  {
    version: '0.8.0',
    date: '2025-12-13',
    commit: 'f36e836',
    changelog: {
      added: [
        'Photo preview in map report popups',
        'Vercel Analytics for usage tracking'
      ],
      improved: [
        'Photo upload reliability and validation',
        'Authentication session persistence across browser sessions',
        'UI/UX refinements (dropdown positioning, form layouts)',
        'Dropdown list scrolling behavior'
      ]
    }
  },
  {
    version: '0.9.0',
    date: '2025-12-15',
    commit: 'fc1a7af',
    changelog: {
      added: [
        'Husky pre-commit hooks for automated checks',
        'Commitlint for conventional commit messages',
        'ESLint configuration with auto-fix on commit',
        'Prettier code formatting integration',
        'Secret scanning (Gitleaks integration)',
        'Automated CI/CD testing pipeline'
      ],
      improved: [
        'Developer experience with automated tooling',
        'Code consistency through enforced standards',
        'Commit message quality and project history clarity'
      ]
    }
  },
  {
    version: '1.0.0',
    date: '2025-12-15',
    commit: 'HEAD',
    changelog: {
      added: [
        'Complete clean-city platform with all core features',
        'Multi-user support with role-based access control (Citizens, Admins, City Services)',
        'Interactive mapping and geolocation-based reporting',
        'Community engagement features with posts and comments',
        'Ticketing and issue tracking system',
        'Admin dashboard for system management'
      ],
      fixed: [
        'All TypeScript type safety issues resolved',
        'All ESLint code quality warnings fixed',
        'Improved code organization and refactoring'
      ],
      improved: [
        'CI/CD pipeline with parallel job execution',
        'Performance and reliability across all features',
        'Developer experience and contribution guidelines'
      ]
    }
  }
]

/**
 * Generate CHANGELOG.md content
 */
function generateChangelog() {
  const header = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`

  let content = header

  // Generate each version entry in reverse chronological order
  for (let i = versions.length - 1; i >= 0; i--) {
    const version = versions[i]
    const isProductionRelease = version.version === '1.0.0'

    // Version header
    content += `## [${version.version}] - ${version.date}`
    if (isProductionRelease) {
      content += ' (Production Release)'
    }
    content += '\n\n'

    // Changelog sections
    const { changelog } = version

    if (changelog.added && changelog.added.length > 0) {
      content += '### Added\n\n'
      changelog.added.forEach(item => {
        content += `- ${item}\n`
      })
      content += '\n'
    }

    if (changelog.fixed && changelog.fixed.length > 0) {
      content += '### Fixed\n\n'
      changelog.fixed.forEach(item => {
        content += `- ${item}\n`
      })
      content += '\n'
    }

    if (changelog.improved && changelog.improved.length > 0) {
      content += '### Improved\n\n'
      changelog.improved.forEach(item => {
        content += `- ${item}\n`
      })
      content += '\n'
    }
  }

  // Add version links at the bottom
  content += '<!-- Version Links -->\n'
  versions.forEach(version => {
    const tag = `v${version.version}`
    content += `[${version.version}]: https://github.com/sokol-matija/pi-clean-city/releases/tag/${tag}\n`
  })

  return content
}

/**
 * Create git tags for all versions
 */
function createGitTags(dryRun = false) {
  console.log('\n📍 Creating git tags...\n')

  versions.forEach(version => {
    const tag = `v${version.version}`
    const commit = version.commit
    const message = `Release ${version.version}`

    try {
      // Check if tag already exists
      try {
        safeExec('git', ['rev-parse', tag])
        console.log(`⏭️  Tag ${tag} already exists, skipping...`)
        return
      } catch (e) {
        // Tag doesn't exist, create it
      }

      if (dryRun) {
        console.log(`[DRY RUN] Would create tag: git tag -a ${tag} ${commit} -m "${message}"`)
      } else {
        safeExec('git', ['tag', '-a', tag, commit, '-m', message])
        console.log(`✅ Created tag ${tag} at commit ${commit}`)
      }
    } catch (error) {
      console.error(`❌ Error creating tag ${tag}: ${error.message}`)
    }
  })

  console.log('\n✨ All tags created successfully!\n')
}

/**
 * Prompt user for confirmation
 */
async function promptConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close()
      resolve(answer.toLowerCase().trim())
    })
  })
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🚀 Creating Version History for pi-clean-city\n')
  console.log('This script will:')
  console.log('  1. Generate CHANGELOG.md with 10 versions (v0.1.0 → v1.0.0)')
  console.log('  2. Create git tags at appropriate commits')
  console.log('  3. Optionally push tags to GitHub\n')

  // Check if we're in the correct directory
  try {
    safeExec('git', ['rev-parse', '--is-inside-work-tree'])
  } catch (error) {
    console.error('❌ Error: Not in a git repository')
    process.exit(1)
  }

  // Generate CHANGELOG.md
  console.log('📝 Generating CHANGELOG.md...')
  const changelogContent = generateChangelog()

  const answer = await promptConfirmation('\nGenerate CHANGELOG.md? (yes/no): ')

  if (answer === 'yes' || answer === 'y') {
    writeFileSync('CHANGELOG.md', changelogContent, 'utf-8')
    console.log('✅ CHANGELOG.md created successfully!\n')
  } else {
    console.log('⏭️  Skipping CHANGELOG.md generation\n')
  }

  // Create git tags
  const createTagsAnswer = await promptConfirmation('Create git tags? (yes/no): ')

  if (createTagsAnswer === 'yes' || createTagsAnswer === 'y') {
    createGitTags(false)
  } else {
    console.log('⏭️  Skipping git tag creation\n')
    return
  }

  // Push tags to GitHub
  const pushAnswer = await promptConfirmation('\nPush tags to GitHub? (yes/no): ')

  if (pushAnswer === 'yes' || pushAnswer === 'y') {
    console.log('\n📤 Pushing tags to GitHub...')
    try {
      execSync('git push origin --tags', { stdio: 'inherit' })
      console.log('\n✅ Tags pushed successfully!')
    } catch (error) {
      console.error('\n❌ Error pushing tags:', error.message)
    }
  } else {
    console.log('\n⏭️  Skipping push to GitHub')
    console.log('\n💡 You can push tags later with: git push origin --tags')
  }

  console.log('\n🎉 Version history creation complete!')
  console.log('\n📊 Summary:')
  console.log(`   - CHANGELOG.md: ${versions.length} versions documented`)
  console.log(`   - Git tags: ${versions.length} tags created`)
  console.log('\n🔗 Next steps:')
  console.log('   - Review CHANGELOG.md')
  console.log('   - Verify tags with: git tag -l')
  console.log('   - View releases on GitHub')
  console.log('   - Update package.json version to 1.0.0')
  console.log('\n')
}

// Run the script
main().catch(error => {
  console.error('❌ Unexpected error:', error)
  process.exit(1)
})
