# Git Workflow Guide

This document defines the git workflow and conventions for the Phoenix project, following Engineering OS standards.

## Branching Strategy

### Trunk-Based Development
- **Main branch**: `main` (protected, always deployable)
- **Feature branches**: Short-lived (< 2 days), focused on single features
- **Integration**: Continuous integration with frequent merges to main

### Branch Naming Convention

Use the following format: `<type>/<description-with-hyphens>`

#### Branch Types
| Type | Purpose | Example |
|------|---------|---------|
| `feature/` | New features or enhancements | `feature/user-authentication` |
| `fix/` | Bug fixes | `fix/login-validation-error` |
| `chore/` | Maintenance tasks | `chore/update-dependencies` |
| `refactor/` | Code refactoring | `refactor/user-service-cleanup` |
| `docs/` | Documentation updates | `docs/api-documentation` |
| `test/` | Test additions or improvements | `test/user-service-coverage` |
| `perf/` | Performance improvements | `perf/database-query-optimization` |

#### Naming Rules
- Use lowercase letters and hyphens only
- Be descriptive but concise (2-4 words maximum)
- Avoid abbreviations when possible
- No spaces, underscores, or special characters

## Commit Message Convention

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Commit Types
| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add user login functionality` |
| `fix` | Bug fix | `fix(api): resolve user validation error` |
| `docs` | Documentation only | `docs(readme): update installation instructions` |
| `style` | Formatting, missing semicolons | `style(components): fix indentation` |
| `refactor` | Code change that neither fixes nor adds | `refactor(utils): simplify date formatting` |
| `perf` | Performance improvement | `perf(api): optimize database queries` |
| `test` | Adding or correcting tests | `test(auth): add login validation tests` |
| `chore` | Build process, auxiliary tools | `chore(deps): update typescript to 5.0` |
| `revert` | Reverts a previous commit | `revert: feat(auth): add user login` |

### Scope (Optional)
Common scopes for Phoenix project:
- `auth` - Authentication system
- `api` - API layer
- `ui` - User interface
- `database` - Database layer
- `config` - Configuration files
- `deps` - Dependencies
- `phase-0` to `phase-7` - Implementation phases

### Description Rules
- Use imperative mood ("add feature" not "added feature")
- First line should be 50 characters or less
- Capitalize first letter
- No period at the end

### Body (Optional)
- Wrap at 72 characters
- Explain what and why, not how
- Reference issues and pull requests

### Footer (Optional)
- `BREAKING CHANGE:` for breaking changes
- `Closes #123` to close issues

## Workflow Process

### 1. Create Feature Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/new-feature-name
```

### 2. Development Cycle
```bash
# Make changes
git add .
git commit -m "feat(scope): add new feature functionality"

# Push regularly
git push origin feature/new-feature-name
```

### 3. Pull Request Process
1. Create pull request from feature branch to main
2. Fill out PR template with summary and testing details
3. Request review from team member
4. Ensure all status checks pass
5. Squash and merge after approval

### 4. Cleanup
```bash
git checkout main
git pull origin main
git branch -d feature/new-feature-name
```

## Quality Gates

### Pre-commit Hooks
- **Lint**: BiomeJS formatting and linting
- **Type Check**: TypeScript compilation
- **Test**: Run tests related to changed files
- **Commit Message**: Validate conventional commit format

### Pre-push Hooks
- **Full Test Suite**: Run all tests
- **Build**: Verify all packages build successfully
- **Coverage**: Ensure coverage thresholds are met

## Git Configuration

### Required Git Config
```bash
git config user.name "DevNet Engineering"
git config user.email "engineering@devnet.uk"
git config pull.rebase true
git config push.default current
```

### Recommended Aliases
```bash
git config alias.co checkout
git config alias.br branch
git config alias.ci commit
git config alias.st status
git config alias.last 'log -1 HEAD'
git config alias.unstage 'reset HEAD --'
```

## Integration with Engineering OS

### Standards Consultation
When working on Phoenix features:
1. Consult Engineering OS standards in `~/Projects/devnet.clean_architecture/`
2. Follow clean architecture patterns
3. Ensure compliance with verification tests
4. Reference relevant ADRs and best practices

### Dual Repository Workflow
- **Phoenix Repository**: Implementation and feature development
- **Engineering OS Repository**: Standards, documentation, and templates
- Use both repositories in your development environment

## Troubleshooting

### Common Issues
1. **Commit message rejected**: Ensure conventional commit format
2. **Push rejected**: Pull latest changes and rebase if needed
3. **Hooks failing**: Fix linting/testing issues before committing
4. **Branch conflicts**: Rebase feature branch on latest main

### Getting Help
- Check Engineering OS documentation
- Review existing commit messages for examples
- Ask team for guidance on complex scenarios