# TASKS: Development Environment Configuration for Phoenix

**Document ID:** TASKS-2025-09-07-DEV-ENV-CONFIG  
**Created:** 2025-09-07  
**Source Specification:** SPEC-2025-09-07-development-environment-configuration.md  
**Phoenix Phase:** Phase 0 - Foundation Setup  
**Engineering OS Compliance:** Full  

## Overview

These tasks implement comprehensive development environment configuration for Phoenix, establishing robust quality gates with embedded verification, 98% coverage threshold (greenfield standard), comprehensive git hooks, and automated quality assurance.

## Task Categories

### A. Testing Infrastructure (98% Coverage Standard)
### B. Git Hooks Configuration (Comprehensive Quality Gates)
### C. Code Quality Tools (BiomeJS + TypeScript Strict)
### D. Environment Configuration (Node 22, pnpm, Turborepo)
### E. CommitLint Configuration (Phoenix Phase-Based Scopes)
### F. Bundle Size & Performance Tracking
### G. IDE Integration & Developer Experience
### H. Embedded Verification & Quality Assurance

---

## A. Testing Infrastructure Tasks

### A1. Configure Vitest for 98% Coverage Threshold
**Priority:** Critical  
**Estimated Time:** 30 minutes  
**Dependencies:** None  

**Implementation:**
- [ ] Update `vitest.config.ts` with 98% coverage thresholds
- [ ] Configure v8 coverage provider
- [ ] Set parallel execution with thread pool (maxThreads: 8)
- [ ] Add comprehensive coverage exclusions
- [ ] Configure HTML, JSON, LCOV, and text reporters

**Verification Embedded:**
```bash
# Verify coverage configuration
pnpm test:coverage
# Expected: Reports generated in coverage/ with 98% thresholds enforced

# Check coverage threshold enforcement
pnpm coverage:check
# Expected: Command fails if any metric below 98%

# Verify parallel execution
pnpm test:run
# Expected: Tests run in parallel using thread pool
```

**Success Criteria:**
- [ ] Coverage reports generated in multiple formats
- [ ] 98% threshold enforced for lines, functions, branches, statements
- [ ] Parallel test execution working
- [ ] Coverage exclusions properly configured

### A2. Add Coverage-Focused Package Scripts
**Priority:** Critical  
**Estimated Time:** 15 minutes  
**Dependencies:** A1  

**Implementation:**
- [ ] Add comprehensive test scripts to root `package.json`
- [ ] Configure `test:pre-commit` for changed files only
- [ ] Set up `coverage:check` with explicit thresholds
- [ ] Add `test:ui` for interactive testing

**Package.json Scripts to Add:**
```json
{
  "test": "vitest",
  "test:run": "vitest run",
  "test:watch": "vitest watch",
  "test:coverage": "vitest run --coverage",
  "coverage:check": "vitest run --coverage --reporter=verbose --coverage.thresholds.lines=98 --coverage.thresholds.functions=98 --coverage.thresholds.branches=98 --coverage.thresholds.statements=98",
  "test:pre-commit": "vitest related --run --passWithNoTests",
  "test:ui": "vitest --ui"
}
```

**Verification Embedded:**
```bash
# Test all script variations
pnpm test:run && pnpm test:coverage && pnpm coverage:check
# Expected: All commands succeed with 98% coverage

# Verify pre-commit optimization
pnpm test:pre-commit
# Expected: Only runs tests for changed files, passes with no tests if needed
```

### A3. Prepare Mutation Testing Infrastructure
**Priority:** Medium  
**Estimated Time:** 20 minutes  
**Dependencies:** A1, A2  

**Implementation:**
- [ ] Install Stryker mutation testing framework
- [ ] Configure TypeScript checker integration
- [ ] Set up Vitest runner for Stryker
- [ ] Create basic stryker configuration

**Dependencies to Add:**
```json
{
  "devDependencies": {
    "@stryker-mutator/core": "^8.0.0",
    "@stryker-mutator/vitest-runner": "^8.0.0",
    "@stryker-mutator/typescript-checker": "^8.0.0"
  }
}
```

**Verification Embedded:**
```bash
# Verify Stryker installation
npx stryker --version
# Expected: Version 8.0.0+ displayed

# Check TypeScript integration
npx stryker run --dry-run
# Expected: Configuration validated successfully
```

---

## B. Git Hooks Configuration Tasks

### B1. Install and Configure Husky
**Priority:** Critical  
**Estimated Time:** 20 minutes  
**Dependencies:** None  

**Implementation:**
- [ ] Install Husky as development dependency
- [ ] Initialize Husky hooks directory
- [ ] Ensure Git repository is properly configured
- [ ] Set up basic hook structure

**Commands to Execute:**
```bash
pnpm add -D husky
npx husky install
npx husky add .husky/pre-commit "echo 'Pre-commit hook installed'"
npx husky add .husky/pre-push "echo 'Pre-push hook installed'"
npx husky add .husky/commit-msg "echo 'Commit message hook installed'"
npx husky add .husky/post-merge "echo 'Post-merge hook installed'"
```

**Verification Embedded:**
```bash
# Check hook directory exists and is executable
ls -la .husky/
# Expected: All hooks present and executable (755 permissions)

# Test hook execution
git add . && git commit -m "test: verify hooks working"
# Expected: Pre-commit hook executes successfully
```

### B2. Implement Pre-Commit Quality Gates
**Priority:** Critical  
**Estimated Time:** 45 minutes  
**Dependencies:** B1, A2  

**Implementation:**
- [ ] Create comprehensive pre-commit hook script
- [ ] Integrate BiomeJS code style checks with auto-fix
- [ ] Add TypeScript type checking
- [ ] Configure test execution for changed files only
- [ ] Enforce 98% coverage threshold verification
- [ ] Add descriptive progress messages

**Pre-commit Hook Script:**
```bash
#!/usr/bin/env sh
# .husky/pre-commit
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit quality checks..."

# Run BiomeJS checks (Phoenix uses Engineering OS BiomeJS config)
echo "📝 Checking code style with BiomeJS..."
pnpm biome check --apply . || {
  echo "❌ BiomeJS checks failed"
  exit 1
}

# Type checking
echo "🔧 Running TypeScript type check..."
pnpm type-check || {
  echo "❌ Type checking failed"
  exit 1
}

# Run tests for changed files
echo "🧪 Running tests for changed files..."
pnpm test:pre-commit || {
  echo "❌ Tests failed for changed files"
  exit 1
}

# Verify coverage threshold (98% for Phoenix greenfield)
echo "📊 Checking coverage threshold (98%)..."
pnpm coverage:check || {
  echo "❌ Coverage threshold (98%) not met"
  exit 1
}

echo "✅ All pre-commit checks passed!"
```

**Verification Embedded:**
```bash
# Test pre-commit hook with real changes
echo "// Test change" >> test-file.ts
git add test-file.ts
git commit -m "test: verify pre-commit hook"
# Expected: All quality checks pass before commit

# Test failure scenarios
echo "console.log('test')" >> test-file.ts
git add test-file.ts && git commit -m "test: should fail on console.log"
# Expected: BiomeJS check fails, commit blocked
```

### B3. Implement Pre-Push Quality Gates
**Priority:** Critical  
**Estimated Time:** 30 minutes  
**Dependencies:** B1  

**Implementation:**
- [ ] Create comprehensive pre-push hook script
- [ ] Add full test suite execution
- [ ] Integrate build verification
- [ ] Add comprehensive type checking
- [ ] Include security audit checks
- [ ] Add descriptive progress indicators

**Pre-push Hook Script:**
```bash
#!/usr/bin/env sh
# .husky/pre-push
. "$(dirname -- "$0")/_/husky.sh"

echo "🚀 Running pre-push quality checks..."

# Run all tests
echo "🧪 Running full test suite..."
pnpm test:run || {
  echo "❌ Test suite failed"
  exit 1
}

# Verify build works
echo "🏗️  Verifying build..."
pnpm build || {
  echo "❌ Build failed"
  exit 1
}

# Type checking for all packages
echo "🔧 Running comprehensive type check..."
pnpm type-check || {
  echo "❌ Type checking failed"
  exit 1
}

# Security audit
echo "🔒 Running security audit..."
pnpm audit --audit-level moderate || {
  echo "❌ Security vulnerabilities found"
  exit 1
}

echo "✅ All pre-push checks passed!"
```

**Verification Embedded:**
```bash
# Test pre-push hook
git push origin main
# Expected: All checks pass before push is allowed

# Test build failure scenario
echo "invalid syntax" >> package.json
git add package.json && git commit -m "test: break build" && git push
# Expected: Push blocked due to build failure
```

### B4. Configure Commit Message Validation
**Priority:** High  
**Estimated Time:** 25 minutes  
**Dependencies:** B1  

**Implementation:**
- [ ] Create commit-msg hook with phase support
- [ ] Integrate CommitLint validation
- [ ] Add helpful error messages for Phoenix phases
- [ ] Configure both standard and phase-based scopes
- [ ] Add example commit formats in error messages

**Commit Message Hook Script:**
```bash
#!/usr/bin/env sh
# .husky/commit-msg
. "$(dirname -- "$0")/_/husky.sh"

# Validate commit message format with phase support
npx --no-install commitlint --edit "$1" || {
  echo "❌ Commit message format is invalid"
  echo ""
  echo "📝 Standard format: <type>(<scope>): <subject>"
  echo "   Example: feat(auth): add OAuth2 integration"
  echo ""
  echo "🔥 Phoenix phase format: <type>(phase-N): <subject>"
  echo "   Example: feat(phase-0): setup development environment"
  echo "   Example: fix(phase-2): resolve API authentication bug"
  echo "   Example: docs(phase-1): update database setup guide"
  echo ""
  echo "📋 Available phases: phase-0 through phase-7"
  echo "📋 Available types: feat, fix, docs, style, refactor, perf, test, chore"
  exit 1
}
```

**Verification Embedded:**
```bash
# Test valid commit messages
git commit -m "feat(phase-0): add development environment configuration"
# Expected: Commit accepted

# Test invalid commit messages
git commit -m "invalid commit message"
# Expected: Commit rejected with helpful error message

# Test phase scope validation
git commit -m "feat(phase-8): invalid phase"
# Expected: Commit rejected, phase-8 not in allowed scopes
```

### B5. Set Up Post-Merge Hook
**Priority:** Medium  
**Estimated Time:** 20 minutes  
**Dependencies:** B1  

**Implementation:**
- [ ] Create post-merge hook for dependency management
- [ ] Add automatic pnpm install on lock file changes
- [ ] Include workspace integrity verification
- [ ] Add package.json change detection

**Post-merge Hook Script:**
```bash
#!/usr/bin/env sh
# .husky/post-merge
. "$(dirname -- "$0")/_/husky.sh"

# Check if package-lock files changed
if git diff --name-only HEAD@{1} HEAD | grep -q "pnpm-lock.yaml"; then
  echo "🔄 Dependencies changed - running pnpm install..."
  pnpm install --frozen-lockfile
fi

# Check if any package.json files changed
if git diff --name-only HEAD@{1} HEAD | grep -q "package.json"; then
  echo "🔄 Package configuration changed - verifying workspace integrity..."
  pnpm workspace:list
fi
```

**Verification Embedded:**
```bash
# Test post-merge functionality
git checkout -b test-merge
echo '{}' > test-package.json && git add . && git commit -m "test: add package"
git checkout main && git merge test-merge
# Expected: Post-merge hook detects package.json changes
```

---

## C. Code Quality Tools Tasks

### C1. Configure BiomeJS (Engineering OS Standard)
**Priority:** Critical  
**Estimated Time:** 25 minutes  
**Dependencies:** None  

**Implementation:**
- [ ] Create `biome.json` configuration file
- [ ] Configure VCS integration with Git
- [ ] Set up strict linting rules for Phoenix
- [ ] Configure formatter with Engineering OS standards
- [ ] Add file ignores for build artifacts

**BiomeJS Configuration:**
```json
{
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": [
      "node_modules/**",
      "dist/**",
      ".next/**",
      "coverage/**",
      "*.tsbuildinfo"
    ]
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "error",
        "noConsoleLog": "error"
      },
      "style": {
        "useImportType": "error",
        "useExportType": "error"
      },
      "correctness": {
        "noUnusedVariables": "error",
        "useExhaustiveDependencies": "warn"
      }
    }
  },
  "javascript": {
    "formatter": {
      "semicolons": "always",
      "trailingCommas": "es5",
      "quoteStyle": "single"
    }
  },
  "typescript": {
    "formatter": {
      "semicolons": "always",
      "trailingCommas": "es5",
      "quoteStyle": "single"
    }
  }
}
```

**Verification Embedded:**
```bash
# Test BiomeJS configuration
pnpm biome check .
# Expected: Configuration valid, checks run successfully

# Test formatting
pnpm biome format . --write
# Expected: Files formatted according to Engineering OS standards

# Test linting rules
echo "console.log('test')" > test-lint.ts
pnpm biome check test-lint.ts
# Expected: Error on console.log usage
```

### C2. Configure TypeScript Strict Mode
**Priority:** Critical  
**Estimated Time:** 30 minutes  
**Dependencies:** None  

**Implementation:**
- [ ] Update `tsconfig.json` with strict configuration
- [ ] Enable all strict type checking options
- [ ] Configure path mapping for workspace packages
- [ ] Set up Next.js integration
- [ ] Add comprehensive includes/excludes

**TypeScript Configuration Updates:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": true,
    "skipLibCheck": false,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@workspace/*": ["./packages/*/src"]
    },
    // Strict type checking
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "dist", "coverage"]
}
```

**Verification Embedded:**
```bash
# Test TypeScript strict mode
pnpm type-check
# Expected: All files pass strict type checking

# Test strict rules enforcement
echo "let x; x.foo();" > test-strict.ts
npx tsc --noEmit test-strict.ts
# Expected: Errors on implicit any and unsafe access
```

### C3. Configure Lint-Staged Integration
**Priority:** High  
**Estimated Time:** 20 minutes  
**Dependencies:** C1  

**Implementation:**
- [ ] Create `.lintstagedrc.json` configuration
- [ ] Integrate BiomeJS with auto-apply
- [ ] Add test execution for changed TypeScript files
- [ ] Configure formatting for various file types
- [ ] Add package.json sorting

**Lint-Staged Configuration:**
```json
{
  "*.{ts,tsx,js,jsx}": [
    "biome check --apply",
    "vitest related --run --passWithNoTests"
  ],
  "*.{json,md,yml,yaml}": [
    "biome format --write"
  ],
  "*.{css,scss}": [
    "biome format --write"
  ],
  "package.json": [
    "sort-package-json"
  ],
  "turbo.json": [
    "biome format --write"
  ]
}
```

**Verification Embedded:**
```bash
# Test lint-staged integration
npx lint-staged
# Expected: Only staged files processed, tests run for changes

# Test with staged changes
echo "const test = 'value'" > test-staged.ts
git add test-staged.ts
npx lint-staged
# Expected: BiomeJS processes file, related tests run
```

---

## D. Environment Configuration Tasks

### D1. Configure Node Version Management
**Priority:** Critical  
**Estimated Time:** 10 minutes  
**Dependencies:** None  

**Implementation:**
- [ ] Create `.nvmrc` file with Node 22
- [ ] Create `.node-version` file for alternative managers
- [ ] Update any documentation references to Node version
- [ ] Verify consistency across configuration files

**Files to Create:**
```bash
# .nvmrc
22

# .node-version
22
```

**Verification Embedded:**
```bash
# Test Node version detection
nvm use
# Expected: "Now using node v22.x.x"

# Verify version consistency
cat .nvmrc && cat .node-version
# Expected: Both files contain "22"

# Check actual Node version
node --version
# Expected: v22.x.x
```

### D2. Configure PNPM Workspace
**Priority:** Critical  
**Estimated Time:** 15 minutes  
**Dependencies:** None  

**Implementation:**
- [ ] Verify `pnpm-workspace.yaml` configuration
- [ ] Ensure all package directories included
- [ ] Configure workspace dependency patterns
- [ ] Verify pnpm version compatibility

**PNPM Workspace Configuration:**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**Verification Embedded:**
```bash
# Test workspace configuration
pnpm workspace list
# Expected: All packages in apps/ and packages/ directories listed

# Test workspace dependency resolution
pnpm install
# Expected: Dependencies resolved across workspace

# Verify pnpm version
pnpm --version
# Expected: Version 10.15.1 or higher
```

### D3. Configure Turborepo Pipeline
**Priority:** High  
**Estimated Time:** 35 minutes  
**Dependencies:** D2  

**Implementation:**
- [ ] Update `turbo.json` with comprehensive pipeline
- [ ] Configure task dependencies and caching
- [ ] Set up parallel execution strategies
- [ ] Add output caching for build artifacts
- [ ] Configure development server persistence

**Turborepo Configuration:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*", "tsconfig.json", "biome.json"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**", "build/**"]
    },
    "lint": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "type-check": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "test": {
      "dependsOn": ["^build"],
      "cache": false
    },
    "test:run": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "cache": true
    },
    "test:coverage": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "cache": true
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

**Verification Embedded:**
```bash
# Test turbo pipeline
pnpm turbo run build
# Expected: Build tasks execute in dependency order

# Test caching functionality
pnpm turbo run test:run
pnpm turbo run test:run
# Expected: Second run uses cache, executes faster

# Verify parallel execution
pnpm turbo run lint type-check
# Expected: Tasks run in parallel where possible
```

### D4. Create Environment Variables Template
**Priority:** Medium  
**Estimated Time:** 15 minutes  
**Dependencies:** None  

**Implementation:**
- [ ] Create `.env.example` with Phoenix configuration
- [ ] Include all required environment variables
- [ ] Use Phoenix-specific ports (4000/4001)
- [ ] Add comprehensive documentation comments
- [ ] Include security reminders

**Environment Variables Template:**
```bash
# .env.example
# Phoenix Development Environment Configuration

# Application URLs (Phoenix Ports)
NEXT_PUBLIC_APP_URL=http://localhost:4000
API_URL=http://localhost:4001

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/phoenix_dev

# Authentication
AUTH_SECRET=your-secret-key-here
AUTH_TRUST_HOST=true

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# Development
NODE_ENV=development
LOG_LEVEL=debug
```

**Verification Embedded:**
```bash
# Test environment template
cp .env.example .env.local
# Expected: Local environment file created

# Verify variable format
grep -E "^[A-Z_]+=" .env.example
# Expected: All variables follow naming convention

# Check Phoenix port configuration
grep -E "(4000|4001)" .env.example
# Expected: Phoenix ports 4000/4001 configured
```

---

## E. CommitLint Configuration Tasks

### E1. Install and Configure CommitLint
**Priority:** Critical  
**Estimated Time:** 20 minutes  
**Dependencies:** None  

**Implementation:**
- [ ] Install CommitLint and conventional config
- [ ] Create `commitlint.config.js` with Phoenix phases
- [ ] Configure type and scope enums
- [ ] Add phase-based scope validation
- [ ] Set up header length and formatting rules

**CommitLint Installation:**
```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

**CommitLint Configuration:**
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor',
      'perf', 'test', 'chore', 'revert'
    ]],
    'scope-enum': [2, 'always', [
      // Phoenix Phase Scopes
      'phase-0', 'phase-1', 'phase-2', 'phase-3',
      'phase-4', 'phase-5', 'phase-6', 'phase-7',
      // Standard Feature Scopes
      'auth', 'api', 'ui', 'db', 'config',
      'deps', 'ci', 'docs'
    ]],
    'header-max-length': [2, 'always', 100],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always']
  }
};
```

**Verification Embedded:**
```bash
# Test CommitLint installation
npx commitlint --version
# Expected: CommitLint version displayed

# Test phase scope validation
echo "feat(phase-0): test commit" | npx commitlint
# Expected: Commit message passes validation

# Test invalid scope
echo "feat(invalid-scope): test commit" | npx commitlint
# Expected: Validation fails with scope error
```

### E2. Create Git Message Template
**Priority:** Medium  
**Estimated Time:** 15 minutes  
**Dependencies:** E1  

**Implementation:**
- [ ] Create `.gitmessage` template file
- [ ] Include Phoenix phase examples
- [ ] Add commit type guidelines
- [ ] Configure git to use template
- [ ] Add helpful comments and examples

**Git Message Template:**
```bash
# <type>(<scope>): <subject>
#
# Phoenix Phase Format Examples:
# feat(phase-0): add development environment configuration
# fix(phase-1): resolve database connection issue
# docs(phase-2): update authentication setup guide
# test(phase-3): add user profile validation tests
#
# Standard Format Examples:
# feat(auth): add OAuth2 integration
# fix(api): resolve CORS configuration
# docs(ui): update component usage guide
#
# Types: feat, fix, docs, style, refactor, perf, test, chore
# Phoenix Phases: phase-0 through phase-7
# Standard Scopes: auth, api, ui, db, config, deps, ci, docs
#
# Lines starting with # are ignored
# Max header length: 100 characters
```

**Verification Embedded:**
```bash
# Configure git to use template
git config commit.template .gitmessage
# Expected: Git configured to use message template

# Test template usage
git commit
# Expected: Editor opens with template populated
```

---

## F. Bundle Size & Performance Tracking Tasks

### F1. Configure Size Limit Monitoring
**Priority:** Medium  
**Estimated Time:** 25 minutes  
**Dependencies:** None  

**Implementation:**
- [ ] Install size-limit and related plugins
- [ ] Create `.size-limit.json` configuration
- [ ] Configure bundle size thresholds for packages
- [ ] Add size checking to package scripts
- [ ] Set up CI integration preparation

**Size Limit Installation:**
```bash
pnpm add -D size-limit @size-limit/preset-big-lib @size-limit/file
```

**Size Limit Configuration:**
```json
[
  {
    "name": "Web App Bundle",
    "path": "apps/web/.next/static/chunks/**/*.js",
    "limit": "300 KB"
  },
  {
    "name": "Core Package",
    "path": "packages/core/dist/index.js",
    "limit": "50 KB"
  },
  {
    "name": "UI Package", 
    "path": "packages/ui/dist/index.js",
    "limit": "100 KB"
  }
]
```

**Verification Embedded:**
```bash
# Test size limit configuration
npx size-limit
# Expected: Bundle sizes calculated and compared to limits

# Test size limit with build
pnpm build && npx size-limit
# Expected: Actual bundle sizes measured against thresholds
```

### F2. Add Performance Monitoring Scripts
**Priority:** Low  
**Estimated Time:** 15 minutes  
**Dependencies:** F1  

**Implementation:**
- [ ] Add performance scripts to package.json
- [ ] Configure size analysis commands
- [ ] Set up bundle analyzer integration
- [ ] Add performance CI preparation

**Package.json Scripts:**
```json
{
  "size:check": "size-limit",
  "size:why": "size-limit --why",
  "analyze": "cross-env ANALYZE=true pnpm build"
}
```

**Verification Embedded:**
```bash
# Test performance monitoring
pnpm size:check
# Expected: Current bundle sizes displayed

# Test bundle analysis
pnpm analyze
# Expected: Detailed bundle analysis generated
```

---

## G. IDE Integration Tasks

### G1. Configure VS Code Settings
**Priority:** High  
**Estimated Time:** 20 minutes  
**Dependencies:** C1  

**Implementation:**
- [ ] Create `.vscode/settings.json`
- [ ] Configure BiomeJS integration
- [ ] Set up auto-formatting on save
- [ ] Configure TypeScript preferences
- [ ] Add file exclusions for performance

**VS Code Settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.biome": true,
    "source.organizeImports.biome": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.suggest.autoImports": true,
  "editor.rulers": [80, 100],
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.next": true,
    "**/coverage": true,
    "**/*.tsbuildinfo": true
  },
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/.next/**": true,
    "**/coverage/**": true
  }
}
```

**Verification Embedded:**
```bash
# Test VS Code configuration
code --list-extensions | grep biome
# Expected: BiomeJS extension listed if VS Code available

# Verify settings file
cat .vscode/settings.json | jq .
# Expected: Valid JSON configuration
```

### G2. Configure VS Code Extension Recommendations
**Priority:** Medium  
**Estimated Time:** 10 minutes  
**Dependencies:** G1  

**Implementation:**
- [ ] Create `.vscode/extensions.json`
- [ ] Add essential development extensions
- [ ] Include Phoenix-specific tooling
- [ ] Add code quality extensions

**VS Code Extensions:**
```json
{
  "recommendations": [
    "biomejs.biome",
    "bradlc.vscode-tailwindcss", 
    "ms-vscode.vscode-typescript-next",
    "vitest.explorer",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

**Verification Embedded:**
```bash
# Verify extensions configuration
cat .vscode/extensions.json | jq .recommendations
# Expected: Array of recommended extensions
```

---

## H. Embedded Verification & Quality Assurance Tasks

### H1. Create Comprehensive Test Suite for Configuration
**Priority:** High  
**Estimated Time:** 45 minutes  
**Dependencies:** All previous tasks  

**Implementation:**
- [ ] Create test file for configuration validation
- [ ] Add tests for git hooks functionality
- [ ] Test coverage threshold enforcement
- [ ] Validate CommitLint configuration
- [ ] Test BiomeJS integration
- [ ] Verify environment configuration

**Test Suite Structure:**
```typescript
// tests/configuration/development-environment.test.ts
describe('Development Environment Configuration', () => {
  describe('Git Hooks', () => {
    test('pre-commit hook exists and is executable');
    test('pre-push hook exists and is executable');
    test('commit-msg hook exists and is executable');
    test('post-merge hook exists and is executable');
  });

  describe('Coverage Thresholds', () => {
    test('vitest.config.ts enforces 98% coverage');
    test('package.json scripts include coverage commands');
    test('coverage:check fails below 98%');
  });

  describe('Code Quality', () => {
    test('BiomeJS configuration is valid');
    test('TypeScript strict mode is enabled');
    test('Lint-staged configuration includes all file types');
  });

  describe('Environment Setup', () => {
    test('Node version is locked to 22');
    test('pnpm workspace is properly configured');
    test('Turborepo pipeline includes all tasks');
  });
});
```

**Verification Embedded:**
```bash
# Run configuration tests
pnpm test tests/configuration/
# Expected: All configuration tests pass

# Test with coverage
pnpm test:coverage tests/configuration/
# Expected: 100% coverage for configuration tests
```

### H2. Create Configuration Validation Script
**Priority:** High  
**Estimated Time:** 30 minutes  
**Dependencies:** All previous tasks  

**Implementation:**
- [ ] Create validation script for all configurations
- [ ] Check file permissions on git hooks
- [ ] Validate JSON/YAML configuration files
- [ ] Test package.json script availability
- [ ] Verify dependency installations

**Validation Script:**
```bash
#!/bin/bash
# scripts/validate-dev-environment.sh

echo "🔍 Validating Phoenix Development Environment Configuration..."

# Check git hooks
for hook in pre-commit pre-push commit-msg post-merge; do
  if [[ -x .husky/$hook ]]; then
    echo "✅ Git hook $hook is executable"
  else
    echo "❌ Git hook $hook missing or not executable"
    exit 1
  fi
done

# Check coverage configuration
if grep -q "98" vitest.config.ts; then
  echo "✅ Coverage threshold set to 98%"
else
  echo "❌ Coverage threshold not configured correctly"
  exit 1
fi

# Check Node version
if grep -q "22" .nvmrc; then
  echo "✅ Node version locked to 22"
else
  echo "❌ Node version not configured correctly"
  exit 1
fi

# Validate JSON configurations
for config in biome.json .size-limit.json; do
  if [[ -f $config ]] && jq empty $config 2>/dev/null; then
    echo "✅ $config is valid JSON"
  else
    echo "❌ $config is invalid or missing"
    exit 1
  fi
done

echo "✅ All development environment configurations are valid!"
```

**Verification Embedded:**
```bash
# Run validation script
chmod +x scripts/validate-dev-environment.sh
./scripts/validate-dev-environment.sh
# Expected: All validations pass

# Test validation failures
chmod -x .husky/pre-commit
./scripts/validate-dev-environment.sh
# Expected: Script detects permission issue and fails
```

### H3. Create Developer Onboarding Checklist
**Priority:** Medium  
**Estimated Time:** 20 minutes  
**Dependencies:** All previous tasks  

**Implementation:**
- [ ] Create comprehensive setup checklist
- [ ] Include verification commands
- [ ] Add troubleshooting section
- [ ] Include Phoenix-specific setup notes

**Developer Checklist:**
```markdown
# Phoenix Development Environment Setup Checklist

## Prerequisites
- [ ] Node.js 22 LTS installed
- [ ] pnpm 10.15.1+ installed
- [ ] Git 2.30+ installed
- [ ] PostgreSQL 17.6+ running (optional for Phase 0)

## Setup Commands
- [ ] `pnpm install` - Install all dependencies
- [ ] `npx husky install` - Initialize git hooks
- [ ] `pnpm test:run` - Verify test setup
- [ ] `pnpm build` - Verify build configuration
- [ ] `pnpm lint` - Verify code quality setup

## Verification Tests
- [ ] Create test commit: `git commit -m "test: verify setup"`
- [ ] Run coverage check: `pnpm coverage:check`
- [ ] Test pre-push: `git push origin main`
- [ ] Validate configuration: `./scripts/validate-dev-environment.sh`

## IDE Setup (VS Code)
- [ ] Install recommended extensions
- [ ] Verify auto-formatting on save
- [ ] Test BiomeJS integration
- [ ] Confirm TypeScript IntelliSense

## Phoenix Phase 0 Ready
- [ ] All quality gates passing
- [ ] 98% coverage threshold enforced
- [ ] Phase-based commit scopes working
- [ ] Development environment fully configured
```

**Verification Embedded:**
```bash
# Test onboarding process
# (Manual verification by following checklist)
# Expected: New developer can complete setup in <30 minutes
```

---

## Task Execution Summary

### Critical Path Tasks (Must Complete First)
1. **A1**: Configure Vitest for 98% Coverage Threshold
2. **B1**: Install and Configure Husky
3. **B2**: Implement Pre-Commit Quality Gates
4. **C1**: Configure BiomeJS (Engineering OS Standard)
5. **E1**: Install and Configure CommitLint

### Parallel Execution Opportunities
- Tasks A2, A3 can run parallel after A1
- Tasks B3, B4, B5 can run parallel after B1, B2
- Tasks C2, C3 can run parallel after C1
- Tasks D1, D2, D3, D4 can run parallel (independent)
- Tasks F1, F2 can run parallel (independent)
- Tasks G1, G2 can run parallel (independent)

### Total Estimated Time
- **Critical tasks**: ~3 hours
- **All tasks**: ~5.5 hours
- **With parallel execution**: ~4 hours

### Success Validation Commands
```bash
# Complete development environment verification
pnpm install
pnpm test:coverage
pnpm build
git add . && git commit -m "feat(phase-0): complete development environment setup"
git push origin main
./scripts/validate-dev-environment.sh
```

## Final Deliverables

Upon completion of all tasks, the Phoenix development environment will provide:

1. **98% Coverage Enforcement**: Automatic rejection of code below coverage threshold
2. **Comprehensive Quality Gates**: Pre-commit and pre-push hooks with full validation
3. **Phase-Based Development Support**: CommitLint configured for Phoenix phases 0-7
4. **Engineering OS Compliance**: BiomeJS, TypeScript strict mode, standardized formatting
5. **Performance Monitoring**: Bundle size tracking and optimization
6. **Developer Experience**: VS Code integration, automated setup validation
7. **Zero Configuration Onboarding**: New developers productive in under 30 minutes

All configurations include embedded verification and are designed to support Phoenix's greenfield development approach with production-ready quality standards from day one.