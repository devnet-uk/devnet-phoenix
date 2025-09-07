# SPECIFICATION: Development Environment Configuration for Phoenix

**Document ID:** SPEC-2025-09-07-DEV-ENV-CONFIG  
**Created:** 2025-09-07  
**Status:** Active  
**Phoenix Phase:** Phase 0 - Foundation Setup  
**Engineering OS Compliance:** Full  

## Executive Summary

This specification defines the comprehensive development environment configuration for the Phoenix greenfield project, implementing robust quality gates with embedded Engineering OS verification. The configuration enforces a 98% coverage threshold (greenfield standard), comprehensive git hooks, and automated quality assurance to ensure production-ready code delivery.

## Task Analysis

- **Keywords**: development-environment, testing, git-hooks, quality-gates, phoenix, greenfield, coverage-98
- **DSL Navigation**: Root → development → [local-quality, testing-strategy, git-workflow, monorepo-setup]  
- **Variables**: PROJECT_COVERAGE=98, PROJECT_TYPE=greenfield, PROJECT_NAME=phoenix, PROJECT_PHASES=phase-0:phase-7

## Standards Consultation

Following Engineering OS hierarchical standards routing:

1. **Root Dispatcher**: `@docs/standards/standards.md` - Routes to development category
2. **Category Dispatcher**: `development/development.md` - Routes to specific development standards
3. **Standards Loaded**:
   - `development/local-quality.md` - Git hooks, linting, formatting with embedded verification
   - `development/testing-strategy.md` - Coverage thresholds, test configuration with domain patterns
   - `development/git-workflow.md` - Commit conventions, branch policies with verification
   - `development/monorepo-setup.md` - Workspace configuration with pnpm/turbo integration

## Requirements

### 1. Testing Infrastructure

#### 1.1 Vitest Configuration (98% Coverage Threshold)
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/__tests__/**',
        '**/test/**'
      ],
      thresholds: {
        global: {
          lines: 98,
          functions: 98,
          branches: 98,
          statements: 98
        }
      }
    },
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 8,
        minThreads: 1
      }
    }
  }
});
```

#### 1.2 Coverage Scripts (Phoenix Greenfield Standard)
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "coverage:check": "vitest run --coverage --reporter=verbose --coverage.thresholds.lines=98 --coverage.thresholds.functions=98 --coverage.thresholds.branches=98 --coverage.thresholds.statements=98",
    "test:pre-commit": "vitest related --run --passWithNoTests",
    "test:ui": "vitest --ui"
  }
}
```

#### 1.3 Mutation Testing Preparation (Stryker)
```json
{
  "devDependencies": {
    "@stryker-mutator/core": "^8.0.0",
    "@stryker-mutator/vitest-runner": "^8.0.0",
    "@stryker-mutator/typescript-checker": "^8.0.0"
  }
}
```

### 2. Git Hooks Configuration (Husky)

#### 2.1 Pre-Commit Hook
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

#### 2.2 Pre-Push Hook
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

#### 2.3 Commit Message Hook (Phase-Based Scopes)
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

#### 2.4 Post-Merge Hook
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

### 3. Code Quality Tools

#### 3.1 BiomeJS Configuration (Engineering OS Standard)
```json
// biome.json
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

#### 3.2 TypeScript Configuration (Strict Mode)
```json
// tsconfig.json
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
    "plugins": [
      {
        "name": "next"
      }
    ],
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
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "coverage"
  ]
}
```

#### 3.3 Lint-Staged Configuration
```json
// .lintstagedrc.json
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

### 4. Environment Configuration

#### 4.1 Node Version Management
```bash
# .nvmrc
22

# .node-version  
22
```

#### 4.2 PNPM Workspace Configuration
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

#### 4.3 Turborepo Pipeline Configuration
```json
// turbo.json
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

#### 4.4 Environment Variables Template
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

### 5. CommitLint Configuration (Phase-Based Scopes)

#### 5.1 CommitLint Config with Phoenix Phases
```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat',      // New feature
      'fix',       // Bug fix
      'docs',      // Documentation only
      'style',     // Code style (formatting, missing semicolons, etc.)
      'refactor',  // Code change that neither fixes a bug nor adds a feature
      'perf',      // Performance improvement
      'test',      // Adding missing tests or correcting existing tests
      'chore',     // Changes to build process or auxiliary tools
      'revert'     // Reverts a previous commit
    ]],
    'scope-enum': [2, 'always', [
      // Phoenix Phase Scopes
      'phase-0',   // Foundation Setup
      'phase-1',   // Core Infrastructure  
      'phase-2',   // Authentication & Authorization
      'phase-3',   // User Management & Profile
      'phase-4',   // Subscription & Billing
      'phase-5',   // Multi-tenancy & Organizations
      'phase-6',   // Communication & Notifications
      'phase-7',   // Analytics & Monitoring
      
      // Standard Feature Scopes
      'auth',      // Authentication/Authorization
      'api',       // API changes
      'ui',        // User Interface
      'db',        // Database
      'config',    // Configuration changes
      'deps',      // Dependencies
      'ci',        // Continuous Integration
      'docs'       // Documentation
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

### 6. Bundle Size Tracking

#### 6.1 Size Limit Configuration
```json
// .size-limit.json
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

### 7. IDE Integration

#### 7.1 VS Code Settings
```json
// .vscode/settings.json
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

#### 7.2 VS Code Extensions Recommendations
```json
// .vscode/extensions.json
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

## Embedded Verification Execution

The following variables will be substituted during verification:
- `${PROJECT_COVERAGE}` → 98
- `${PROJECT_TYPE}` → greenfield  
- `${PROJECT_NAME}` → phoenix
- `${NODE_VERSION}` → 22
- `${PORT_WEB}` → 4000
- `${PORT_API}` → 4001
- `${PROJECT_PHASES}` → true (enables phase-based commit scopes)

### Critical Verification Tests

1. **Husky Installation**: Verify `.husky/` directory and executable hooks exist
2. **Coverage Threshold**: Ensure 98% threshold is configured in package.json scripts
3. **BiomeJS Integration**: Confirm BiomeJS is configured in lint-staged
4. **Git Hook Executability**: All hooks must be executable (`chmod +x`)
5. **CommitLint Phase Scopes**: Verify phase-0 through phase-7 scopes are configured
6. **Node Version Lock**: Confirm .nvmrc contains Node 22
7. **Phoenix Port Configuration**: Verify environment template uses ports 4000/4001

## Success Criteria

### Primary Success Criteria
- [ ] All git hooks executable and functional
- [ ] 98% coverage threshold enforced (greenfield standard)
- [ ] Commit validation working with phase-based scopes
- [ ] BiomeJS code quality checks passing
- [ ] TypeScript strict mode enabled and passing
- [ ] Pre-commit tests running for changed files only
- [ ] Pre-push full test suite and build verification
- [ ] Security audit integration
- [ ] Environment fully reproducible via configuration files

### Secondary Success Criteria  
- [ ] IDE integration configured (VS Code settings)
- [ ] Bundle size tracking operational
- [ ] Mutation testing framework prepared
- [ ] Workspace integrity checks on post-merge
- [ ] Quality command shortcuts available
- [ ] Zero manual configuration required for new developers

## Implementation Notes

### Performance Optimizations
- Use `vitest related` for pre-commit to test only affected files
- Enable BiomeJS caching for faster style checks
- Configure Turborepo task caching for repeated builds
- Use concurrent test execution where possible

### Phase-Based Development Support
- CommitLint configured for Phoenix phases (phase-0 through phase-7)
- Git hooks support phase-scoped commits
- Environment configuration supports phased development approach
- Quality gates maintain consistency across phases

### Emergency Bypass Options
```bash
# Skip pre-commit hooks (emergency only)
git commit --no-verify -m "emergency fix"

# Skip pre-push hooks (emergency only)  
git push --no-verify
```

**⚠️ Warning**: Quality gate bypasses should only be used in emergencies and issues must be fixed immediately afterward.

## Dependencies

### Production Dependencies
- Node.js 22 LTS
- pnpm 10.15.1+
- Git 2.30+

### Development Dependencies
- Husky 9.0+
- Vitest 3.2.4+
- BiomeJS (latest)
- CommitLint 18.0+
- Lint-staged 16.0+
- Turborepo 2.5+
- TypeScript 5.9+

## Maintenance

### Regular Maintenance Tasks
- Weekly: Update dependencies and verify compatibility
- Monthly: Review and optimize git hook performance
- Quarterly: Audit coverage threshold appropriateness
- Per Phase: Verify phase scope accuracy in CommitLint config

### Quality Gate Evolution
As Phoenix progresses through phases, the development environment configuration should be reviewed and enhanced to support emerging requirements while maintaining the 98% coverage standard and comprehensive quality assurance.

---

**Engineering OS Compliance**: This specification follows all Engineering OS standards for development environment configuration with embedded verification and comprehensive quality gates suitable for greenfield projects.