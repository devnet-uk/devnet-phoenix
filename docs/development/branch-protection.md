# Branch Protection Configuration

This document outlines the branch protection rules that should be configured in GitHub for the Phoenix repository.

## Main Branch Protection

### Required Settings
- **Branch**: `main`
- **Protect matching branches**: ✅ Enabled
- **Require a pull request before merging**: ✅ Enabled
  - **Require approvals**: 1 (for team development)
  - **Dismiss stale pull request approvals when new commits are pushed**: ✅ Enabled
  - **Require review from code owners**: ✅ Enabled (when CODEOWNERS file exists)

### Status Checks
- **Require status checks to pass before merging**: ✅ Enabled
- **Require branches to be up to date before merging**: ✅ Enabled
- **Required status checks**:
  - `build` (Turborepo build pipeline)
  - `test` (Vitest test suite)
  - `lint` (BiomeJS linting)
  - `type-check` (TypeScript compilation)
  - `coverage` (Coverage threshold check)

### Additional Restrictions
- **Restrict pushes that create files with secrets**: ✅ Enabled
- **Do not allow bypassing the above settings**: ✅ Enabled
- **Allow force pushes**: ❌ Disabled
- **Allow deletions**: ❌ Disabled

## Feature Branch Workflow

### Branch Naming Convention
- `feature/description-with-hyphens` - New features
- `fix/description-with-hyphens` - Bug fixes
- `chore/description-with-hyphens` - Maintenance tasks
- `refactor/description-with-hyphens` - Code refactoring
- `docs/description-with-hyphens` - Documentation updates
- `test/description-with-hyphens` - Test additions
- `perf/description-with-hyphens` - Performance improvements

### Merge Strategy
- **Squash and merge**: ✅ Preferred for features
- **Rebase and merge**: ✅ Allowed for fixes
- **Merge commit**: ❌ Disabled

### Pull Request Template
- Automatic template linking to `.github/pull_request_template.md`
- Required sections: Summary, Testing, Breaking Changes
- Link to related issues or specifications

## Implementation Notes

These settings must be configured manually in GitHub repository settings under:
`Settings > Branches > Branch protection rules`

The protection rules ensure code quality gates are enforced before merging to the main branch, supporting trunk-based development with short-lived feature branches.