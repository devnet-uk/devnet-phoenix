# Contributing to Phoenix

Welcome to the Phoenix project! This guide will help you understand our development workflow, coding standards, and contribution process. Phoenix follows the **Engineering OS** framework with embedded verification for continuous standards compliance.

## 🚀 Quick Start for Contributors

### Prerequisites

- **Node.js**: 22 LTS (check with `node --version`)
- **pnpm**: 10.15.1+ (check with `pnpm --version`)
- **PostgreSQL**: 17.6+ (for database-related features)
- **Git**: Latest version with conventional commits support

### Initial Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/devnet-phoenix.git
cd devnet-phoenix

# Verify you're in the correct workspace
[[ $(basename $(pwd)) == "devnet-phoenix" ]] && echo "✅ Phoenix workspace" || echo "❌ Wrong directory"

# Install dependencies (includes embedded verification checks)
pnpm install

# Verify setup
pnpm test        # Should pass all tests
pnpm lint        # Should pass linting checks
pnpm build       # Should build all packages
```

## 🏗️ Architecture Overview

Phoenix follows **Clean Architecture** with **Domain-Driven Design** principles:

```
├── apps/web/                    # Next.js application (Feature-Sliced Design)
├── packages/
│   ├── contracts/               # Type-safe API contracts (Zod schemas)
│   ├── core/                    # Domain layer (100% coverage required)
│   ├── infrastructure/          # Infrastructure layer (95% coverage)
│   ├── api/                     # HonoJS API (Clean Architecture)
│   ├── auth/                    # Better-Auth configuration
│   └── ui/                      # React component library
└── docs/                        # Documentation
```

### Dependency Rules

**Critical**: Inner layers NEVER depend on outer layers:

```
Domain (core) ← Use Cases ← Interface Adapters (api) ← Frameworks (web)
```

- **Domain layer** (`packages/core`): Zero external dependencies
- **Use cases**: May depend on domain only
- **Interface adapters**: May depend on use cases and domain
- **Frameworks**: May depend on all inner layers

## 🔄 Development Workflow

### Branch Strategy

We use **trunk-based development** with protected main branch:

```bash
# Create feature branch
git checkout -b feature/your-feature-description
git checkout -b fix/issue-description
git checkout -b chore/maintenance-task
```

**Branch naming conventions**:
- `feature/` - New features
- `fix/` - Bug fixes
- `chore/` - Maintenance, dependencies, tooling
- `refactor/` - Code refactoring without behavior changes
- `docs/` - Documentation updates

### Commit Message Format

We use **conventional commits** with phase-specific scopes:

```
type(scope): description

Types: feat, fix, docs, refactor, test, chore
Scopes: phase-0, phase-1, phase-2, ..., phase-7, or specific package names
```

**Examples**:
```bash
feat(phase-1): add User domain entity with validation
fix(api): resolve authentication middleware error
docs(phase-0): update development setup guide
refactor(core): extract common value object patterns
test(infrastructure): add repository integration tests
chore(deps): update pnpm to 10.15.2
```

### Commit Process

```bash
# Stage your changes
git add .

# Commit with conventional format (commitlint validates)
git commit -m "feat(phase-1): add User domain entity with validation"

# Or use interactive commit helper
pnpm commit

# Push (pre-push hooks run tests and coverage checks)
git push origin feature/your-feature-description
```

## 🎯 Code Quality Standards

### Coverage Requirements

Phoenix enforces **98% overall coverage** with layer-specific targets:

- **Domain layer** (`packages/core`): **100% coverage** (no exceptions)
- **Infrastructure/API**: **95% coverage** minimum
- **UI components**: **95% coverage** minimum

```bash
# Check coverage (must meet 98% threshold)
pnpm coverage

# Coverage is automatically checked on pre-push hooks
```

### TypeScript Standards

All code must use **strict TypeScript** with:

```typescript
// ✅ Good: Strict types with proper validation
interface UserData {
  readonly id: UserId;
  readonly email: EmailAddress;
  readonly createdAt: Date;
}

// ❌ Bad: Loose types
interface UserData {
  id: any;
  email: string;
  createdAt: string;
}
```

### Testing Strategy

**Layer-specific testing requirements**:

1. **Domain Layer** (100% coverage):
   ```typescript
   // Unit tests for all domain entities, value objects, and services
   describe('User', () => {
     it('should create valid user with email verification', () => {
       // Test domain logic in isolation
     });
   });
   ```

2. **Infrastructure Layer** (95% coverage):
   ```typescript
   // Integration tests for repositories, external services
   describe('UserRepository', () => {
     it('should persist and retrieve users correctly', () => {
       // Test database operations
     });
   });
   ```

3. **API Layer** (95% coverage):
   ```typescript
   // API endpoint testing
   describe('POST /users', () => {
     it('should create user with valid data', async () => {
       // Test API contracts and error handling
     });
   });
   ```

## 🔧 Engineering OS Integration

Phoenix integrates with Engineering OS through embedded verification:

### Standards Consultation

Before implementing features, consult Engineering OS standards:

1. **Architecture decisions**: Check `@docs/standards/architecture/`
2. **Development practices**: Check `@docs/standards/development/`
3. **Testing strategies**: Check `@docs/standards/testing/`

### Embedded Verification Workflow

During development, embedded verification runs automatically:

```bash
╔══════════════════════════════════════════════════════════╗
║  Engineering OS Embedded Verification - Phoenix          ║
╚══════════════════════════════════════════════════════════╝

✅ Coverage threshold: 98% (greenfield requirement)
✅ Git hooks: pre-commit, commit-msg, pre-push
✅ TypeScript: strict mode with all flags enabled
✅ Architecture: dependency rules enforced
```

If verification fails, your contribution will be blocked until issues are resolved.

## 📦 Package Development Guidelines

### Contract-First Development

Always define API contracts before implementation:

```typescript
// 1. Define in packages/contracts first
export const CreateUserRequest = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

// 2. Then implement in domain layer
export class User {
  constructor(email: EmailAddress, name: UserName) {
    // Domain logic
  }
}

// 3. Finally implement API endpoint
app.post('/users', async (c) => {
  const data = CreateUserRequest.parse(await c.req.json());
  // Use domain layer
});
```

### Layer Implementation Order

1. **Contracts** (`packages/contracts`): Define schemas and types
2. **Domain** (`packages/core`): Implement business logic
3. **Use Cases**: Implement application services
4. **Infrastructure**: Implement repositories and external integrations
5. **API**: Implement HTTP endpoints
6. **UI**: Implement user interface

### Package Dependencies

```json
{
  "dependencies": {
    // ✅ Good: Inner layers depending on domain
    "@phoenix/core": "workspace:*",
    
    // ❌ Bad: Domain depending on framework
    "next": "15.5.0"
  }
}
```

## 🧪 Testing Guidelines

### Test Organization

```
src/
├── domain/
│   ├── entities/
│   │   ├── User.ts
│   │   └── User.test.ts           # Unit tests alongside implementation
│   └── services/
│       ├── UserService.ts
│       └── UserService.test.ts
├── infrastructure/
│   └── repositories/
│       ├── UserRepository.ts
│       └── UserRepository.integration.test.ts  # Integration tests
└── __tests__/                     # E2E and cross-cutting tests
```

### Test Commands

```bash
# Run all tests
pnpm test

# Run tests in specific package
pnpm --filter @phoenix/core test

# Run tests in watch mode
pnpm test:watch

# Run coverage check
pnpm coverage

# Run E2E tests (when UI is implemented)
pnpm test:e2e
```

## 🔍 Code Review Process

### Pre-Review Checklist

Before requesting review, ensure:

- [ ] All tests pass (`pnpm test`)
- [ ] Coverage meets requirements (`pnpm coverage`)
- [ ] No linting errors (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Conventional commit format used
- [ ] Architecture boundaries respected
- [ ] Embedded verification passes

### Review Criteria

Reviewers will check:

1. **Architecture Compliance**: Clean Architecture and DDD principles
2. **Test Coverage**: Meets phase-specific coverage requirements
3. **Type Safety**: Proper TypeScript usage throughout
4. **Performance**: No obvious performance issues
5. **Documentation**: Code is self-documenting or properly commented
6. **Contracts**: API changes include contract updates

### Pull Request Template

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Coverage meets requirements (98%)
- [ ] E2E tests pass (if applicable)

## Architecture
- [ ] Clean Architecture boundaries respected
- [ ] Domain layer remains pure (100% coverage)
- [ ] Contracts updated if API changes
- [ ] No circular dependencies introduced

## Embedded Verification
- [ ] All embedded verification tests pass
- [ ] Engineering OS standards consulted
- [ ] No critical verification failures
```

## 🐛 Issue Reporting

### Bug Reports

Use the bug report template with:

- **Environment**: OS, Node.js version, pnpm version
- **Steps to reproduce**: Clear, numbered steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Phase context**: Which Phoenix phase is affected
- **Logs**: Relevant error messages or logs

### Feature Requests

Include:

- **Problem statement**: What problem does this solve?
- **Proposed solution**: How should it work?
- **Architecture impact**: Which layers are affected?
- **Phase alignment**: Which Phoenix phase should include this?

## 📚 Resources

### Documentation

- **Architecture Guide**: [docs/architecture/](docs/architecture/)
- **Development Setup**: [docs/development/environment-setup.md](docs/development/environment-setup.md)
- **Engineering OS Standards**: `../devnet.clean_architecture/docs/standards/`

### Getting Help

- **Discord**: [Phoenix Development](https://discord.gg/phoenix-dev)
- **Email**: engineering@devnet.uk
- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion

## 🤝 Code of Conduct

Phoenix follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Please read and follow these guidelines to ensure a welcoming environment for all contributors.

---

**Thank you for contributing to Phoenix!** Your efforts help build a production-ready SaaS foundation that will benefit developers worldwide.