# Phoenix: Production-Ready SaaS Foundation

Phoenix is a production-ready SaaS foundation built on the **Engineering OS** framework, designed to eliminate months of boilerplate development while ensuring enterprise-grade architecture patterns, complete authentication, payments, AI integration, and clean architecture compliance from day one.

This greenfield rebuild replaces legacy systems with **436 planned features** across 7 development phases, targeting **10/10 Clean Architecture compliance** with an **embedded verification framework** for continuous standards compliance.

## 🚀 Project Overview

- **Type**: Greenfield Phoenix rebuild (436 features total)
- **Architecture**: Clean Architecture with Domain-Driven Design (10/10 compliance target)
- **Framework**: Engineering OS with embedded verification framework integration
- **Coverage**: 98% overall (100% domain, 95% infrastructure/UI) - enforced via embedded verification
- **Development**: Phase-based approach (phase-0 through phase-7) with hierarchical standards loading
- **Performance**: < 2s page loads, < 200ms API responses, < 500KB bundle size

## 📋 Implementation Status

**Current Phase**: Phase 0 - Infrastructure & Project Setup
**Progress**: Repository infrastructure setup complete
**Next**: Phase 1 - Core Domain Layer implementation

## 🏗️ Architecture

```
├── apps/
│   └── web/                 # Next.js application (Feature-Sliced Design)
├── packages/
│   ├── api/                 # HonoJS API (Clean Architecture)
│   ├── auth/                # Better-Auth configuration
│   ├── contracts/           # Type-safe API contracts (Zod schemas)
│   ├── database/            # Drizzle ORM schemas
│   └── [other packages]/    # Additional shared packages
├── docs/
│   ├── development/         # Development documentation
│   ├── product/             # Product specifications
│   └── standards/           # Engineering standards
└── tooling/                 # Build tools and configurations
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15.5+, Node.js 22 LTS |
| **Database** | PostgreSQL 17.6, Drizzle ORM 0.44.4+ |
| **API** | HonoJS 4.9.4+, Zod 4.1+ |
| **State** | TanStack Query 5.85+, Zustand 5.0+ |
| **Auth** | Better-Auth 1.3.7+ |
| **Styling** | TailwindCSS 4.1+ |
| **Testing** | Vitest, Playwright, React Testing Library |
| **Tooling** | pnpm, Turborepo, BiomeJS |

## 🚦 Development Workflow

### Prerequisites

- **Node.js**: 22 LTS (locked via .nvmrc)
- **pnpm**: 10.15.1+ (optimized workspace configuration)
- **PostgreSQL**: 17.6+ (with phoenix schema)
- **Git**: Latest version with conventional commits support

### Quick Start with Embedded Verification

```bash
# Clone and setup
git clone https://github.com/devnet-uk/devnet-phoenix.git
cd devnet-phoenix

# Verify environment (embedded verification validates setup)
node --version    # Should show v22.x.x
pnpm --version   # Should show 10.15.1+

# Install with automatic verification
pnpm install     # Installs dependencies and runs embedded verification checks

# Development (Phase 5+ when UI is implemented)
pnpm dev         # Start development servers (web: :4000, api: :4001)
pnpm build       # Build all packages with Turborepo caching
pnpm test        # Run test suites with 98% coverage enforcement
pnpm lint        # Lint and format with BiomeJS

# Embedded verification commands
pnpm verify      # Run all embedded verification tests from Engineering OS standards
pnpm coverage    # Ensure 98% coverage requirement is met (greenfield standard)
```

### Development URLs
- **Web Application**: http://localhost:4000
- **API Server**: http://localhost:4001
- **Database**: PostgreSQL with schema=phoenix

### Workspace Setup

**Dual Repository Development with Standards Integration:**
- **Phoenix Repository**: `~/Projects/devnet-phoenix/` (Primary implementation workspace)
- **Engineering OS**: `~/Projects/devnet.clean_architecture/` (Standards reference and hierarchical routing)

**Critical**: Both repositories must be accessible for embedded verification framework integration. The Engineering OS repository provides hierarchical DSL navigation patterns and embedded verification blocks that Phoenix consults during development.

**Verification Pattern**:
```bash
# Quick verification you're in the correct workspace
[[ $(basename $(pwd)) == "devnet-phoenix" ]] && echo "✅ Phoenix workspace" || echo "❌ Wrong directory"

# Verify access to Engineering OS standards
ls ../devnet.clean_architecture/docs/standards/ || echo "❌ Missing Engineering OS standards reference"
```

## 📖 Documentation

### Core Documentation
- **Implementation Plan**: [phoenix-plan/phoenix.md](phoenix-plan/phoenix.md)
- **Development Setup**: [docs/development/environment-setup.md](docs/development/environment-setup.md)
- **Developer Onboarding**: [docs/development/onboarding.md](docs/development/onboarding.md)
- **Git Workflow**: [docs/development/git-workflow.md](docs/development/git-workflow.md)
- **Contributing Guide**: [CONTRIBUTING.md](CONTRIBUTING.md)

### Architecture Documentation
- **Architecture Overview**: [docs/architecture/README.md](docs/architecture/README.md)
- **Clean Architecture Guide**: [docs/architecture/clean-architecture.md](docs/architecture/clean-architecture.md)
- **Domain-Driven Design**: [docs/architecture/domain-driven-design.md](docs/architecture/domain-driven-design.md)
- **API Documentation**: [docs/api/README.md](docs/api/README.md)

### Project Management
- **Project Roadmap**: [docs/project/roadmap.md](docs/project/roadmap.md)
- **Phase Documentation**: [docs/project/phases/](docs/project/phases/)
- **Architecture Decisions**: [docs/decisions/](docs/decisions/)

*Note: Architecture and API documentation will be available in Phase 1+ as implementation progresses.*

## 🔧 Engineering OS Integration

Phoenix integrates deeply with the **Engineering OS** framework through hierarchical standards loading and embedded verification blocks for continuous compliance monitoring.

### Standards Consultation Pattern

**Hierarchical DSL Navigation**:
1. **Root Dispatcher**: `@docs/standards/standards.md` (Engineering OS repository)
2. **Category Navigation**: Routes to specific standard categories (development, architecture, etc.)
3. **Embedded Verification**: Each standard contains verification blocks for automated compliance
4. **Variable Substitution**: Phoenix-specific values (coverage=98%, type=greenfield, phases=phase-0:phase-7)

### Command Workflow Patterns

**Engineering OS Commands** (executed by AI assistants):
```bash
# Specification creation workflow
Claude: /create-spec "Feature Description"  # Creates specification with standards consultation
Claude: /create-tasks                       # Generates implementation tasks from spec  
Claude: /execute-tasks                      # Implements tasks with embedded verification
```

### Embedded Verification Framework

**How it works**:
- Standards files contain `<verification>` blocks with test commands
- During implementation, verification-runner extracts these blocks
- Phoenix-specific variables are substituted (PROJECT_COVERAGE=98, etc.)
- Tests execute automatically to ensure standards compliance
- Implementation blocked if critical embedded tests fail

**Example Embedded Verification Output**:
```bash
╔══════════════════════════════════════════════════════════╗
║  Engineering OS Embedded Verification - Phoenix          ║
╚══════════════════════════════════════════════════════════╝

Loading standards via hierarchical dispatcher...
✅ Root dispatcher → development category → local-quality.md
✅ Extracted embedded verification blocks from loaded standards
✅ Applied Phoenix substitutions (coverage=98%, type=greenfield)

┌─ local-quality.md embedded verifications ────────────────┐
│ ✅ Coverage threshold: 98% (greenfield requirement)      │
│ ✅ Git hooks: pre-commit, commit-msg, pre-push          │
│ ✅ Phase scopes: phase-0 through phase-7                │
│ ✅ BiomeJS configuration: strict formatting rules       │
└───────────────────────────────────────────────────────────┘

🎯 ALL EMBEDDED VERIFICATIONS PASSED
```

### Variable Context for Phoenix

The following variables are automatically substituted in Engineering OS standards:
- `${PROJECT_NAME}` → phoenix
- `${PROJECT_COVERAGE}` → 98 (greenfield standard)
- `${PROJECT_TYPE}` → greenfield
- `${PROJECT_PHASES}` → phase-0:phase-7
- `${NODE_VERSION}` → 22
- `${PORT_WEB}` → 4000
- `${PORT_API}` → 4001

## 🔄 Git Workflow

### Branch Strategy
- **Main Branch**: `main` (protected, trunk-based development)
- **Feature Branches**: `feature/description`, `fix/description`, `chore/description`
- **Commit Format**: `type(scope): description` (conventional commits)

### Commit Types
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Testing additions
- `chore`: Maintenance tasks

## 🎯 Project Goals

1. **Clean Architecture Compliance**: 10/10 architecture score
2. **Comprehensive Coverage**: 98% overall test coverage
3. **Production Ready**: Enterprise-grade patterns and security
4. **Developer Experience**: Optimized workflows and tooling
5. **Engineering OS Integration**: Seamless standards consultation

## 📞 Support

For questions and support:
- **Engineering Team**: engineering@devnet.uk
- **Repository**: [GitHub Issues](https://github.com/devnet-uk/devnet-phoenix/issues)
- **Documentation**: [Engineering OS Standards](../devnet.clean_architecture/)

---

**Status**: 🟡 Phase 0 Step 5 - Project Documentation Specification
**Last Updated**: 2025-09-07
**Next**: Phase 1 - Core Domain Layer Implementation
**Coverage**: 98% target (100% domain, 95% infrastructure/UI)
**Architecture**: 10/10 Clean Architecture compliance target