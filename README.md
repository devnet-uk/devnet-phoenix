# Phoenix: Production-Ready SaaS Foundation

Phoenix is a production-ready SaaS foundation built on the Engineering OS framework, designed to eliminate months of boilerplate development while ensuring enterprise-grade architecture patterns, complete authentication, payments, AI integration, and clean architecture from day one.

## 🚀 Project Overview

- **Architecture**: Clean Architecture with Domain-Driven Design
- **Framework**: Engineering OS with embedded verification
- **Target**: 98% coverage (100% domain, 95% infrastructure/UI)
- **Features**: 436 planned features across 7 development phases

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

- **Node.js**: 22 LTS
- **pnpm**: 10.15.1+
- **Git**: Latest version with conventional commits

### Quick Start

```bash
# Clone and setup
git clone https://github.com/devnet-uk/devnet-phoenix.git
cd devnet-phoenix
pnpm install

# Development
pnpm dev          # Start development servers
pnpm build        # Build all packages
pnpm test         # Run test suites
pnpm lint         # Lint and format code
```

### Workspace Setup

**Dual Repository Development:**
- **Phoenix Repository**: `~/Projects/devnet-phoenix/` (Implementation)
- **Engineering OS**: `~/Projects/devnet.clean_architecture/` (Standards)

Ensure both repositories are accessible in your development environment.

## 📖 Documentation

- **Implementation Plan**: [phoenix-plan/phoenix.md](phoenix-plan/phoenix.md)
- **Development Setup**: [docs/development/environment-setup.md](docs/development/environment-setup.md)
- **Git Workflow**: [docs/development/git-workflow.md](docs/development/git-workflow.md)
- **Architecture Guide**: Coming in Phase 1

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

**Status**: 🟡 In Development - Phase 0 Infrastructure Setup
**Last Updated**: 2025-09-06