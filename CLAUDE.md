# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the Phoenix project.

## Project Overview

**Phoenix** is a production-ready SaaS foundation built on the **Engineering OS** framework, designed to eliminate months of boilerplate development while ensuring enterprise-grade architecture patterns, complete authentication, payments, AI integration, and clean architecture compliance.

### Key Architecture Principles
- **Clean Architecture**: 10/10 compliance target with 4-layer structure
- **Domain-Driven Design**: Pure domain layer with zero framework dependencies  
- **Contract-Driven Development**: Type-safe API contracts using `@phoenix/contracts`
- **Monorepo**: pnpm workspaces with Turborepo build system
- **Engineering OS Integration**: Extends standards from dual-repository setup

## Workspace Configuration

### Dual-Repository Development
- **Phoenix Repository**: `~/Projects/devnet-phoenix/` (Primary implementation workspace)
- **Engineering OS Repository**: `~/Projects/devnet.clean_architecture/` (Standards and templates)

**Critical**: Both repositories should be accessible in Claude Code workspace for optimal development experience.

### Quick Workspace Verification
```bash
[[ $(basename $(pwd)) == "devnet-phoenix" ]] && echo "✅ Phoenix workspace" || echo "❌ Wrong directory"
```

## Development Commands

### Core Development
```bash
# Install dependencies
pnpm install

# Development (Phase 5+)
pnpm dev          # Start all development servers
pnpm build        # Build all packages
pnpm test         # Run test suites
pnpm lint         # Lint and format with BiomeJS
```

### Git Workflow
```bash
# Conventional commits with commitizen
pnpm commit       # Interactive commit message creation
git commit        # Uses .gitmessage template

# Branch naming: feature/description, fix/description, etc.
```

### Phase-Specific Commands
```bash
# Phase 0: Infrastructure (Current)
echo "Phase 0 commands will be available after Step 3"

# Phase 1+: Implementation commands
echo "Implementation commands available per phase"
```

## Technology Stack

| Category | Technology | Version | Status |
|----------|------------|---------|---------|
| **Runtime** | Node.js | 22 LTS | ✅ Configured |
| **Package Manager** | pnpm | 10.15.1+ | ✅ Configured |
| **Build System** | Turborepo | 2.5.6+ | 🟡 Phase 0 Step 3 |
| **Framework** | Next.js | 15.5+ | 🟡 Phase 5 |
| **API** | HonoJS | 4.9.4+ | 🟡 Phase 4 |
| **Database** | PostgreSQL + Drizzle | 17.6 + 0.44.4+ | 🟡 Phase 3 |
| **Authentication** | Better-Auth | 1.3.7+ | 🟡 Phase 3 |
| **State Management** | TanStack Query + Zustand | 5.85+ + 5.0+ | 🟡 Phase 5 |
| **Styling** | TailwindCSS | 4.1+ | 🟡 Phase 5 |
| **Testing** | Vitest + Playwright | Latest | 🟡 Phase 1+ |
| **Linting** | BiomeJS | Latest | 🟡 Phase 0 Step 3 |

## Architecture Structure

```
├── apps/
│   └── web/                    # Next.js app (Feature-Sliced Design)
├── packages/
│   ├── contracts/              # Type-safe API contracts (Zod schemas)
│   ├── api/                    # HonoJS API (Clean Architecture)
│   ├── auth/                   # Better-Auth configuration
│   ├── database/               # Drizzle ORM schemas
│   └── shared/                 # Shared utilities
├── docs/
│   ├── development/            # Development documentation
│   ├── product/                # Product specifications
│   └── standards/              # Phoenix-specific standards
└── tooling/                    # Build configurations
```

## Implementation Phases

### Current Status: Phase 0 (Infrastructure Setup)
- ✅ **Step 1**: Repository Infrastructure (Complete)
- 🟡 **Step 2**: Monorepo Architecture Specification (Next)
- 🟡 **Step 3**: Core Packages Architecture Specification
- 🟡 **Step 4**: Development Environment Specification  
- 🟡 **Step 5**: Project Documentation Specification

### Future Phases (437 features total)
- **Phase 1**: Core Domain Layer (100% coverage target)
- **Phase 2**: Use Cases & Business Logic (95% coverage)
- **Phase 3**: Infrastructure Layer (95% coverage)
- **Phase 4**: Interface Adapters (95% coverage)
- **Phase 5**: Presentation Layer (95% coverage)
- **Phase 6**: Deployment & Launch
- **Phase 7**: Documentation & Optimization

## Engineering OS Integration

### Standards Consultation
When implementing Phoenix features:
1. **Check Engineering OS standards** in `~/Projects/devnet.clean_architecture/`
2. **Follow clean architecture patterns** from `docs/standards/architecture/`
3. **Use Engineering OS commands**: `/create-spec`, `/create-tasks`, `/execute-tasks`
4. **Maintain verification compliance** with embedded testing

### Command Usage
```bash
# Engineering OS commands (executed from appropriate workspace)
Continue Phoenix from phoenix-plan/phoenix.md
```

### Path References
When you see these references:
- `@docs/standards/` → `~/Projects/devnet.clean_architecture/docs/standards/`
- `@.claude/` → `~/Projects/devnet.clean_architecture/.claude/`

## Development Guidelines

### Code Quality Standards
- **TypeScript**: Strict mode with end-to-end type safety
- **Testing**: 98% overall coverage (100% domain, 95% infrastructure/UI)
- **Architecture**: Clean Architecture compliance with dependency rule
- **Commits**: Conventional commit format with phase scopes
- **Documentation**: Comprehensive inline and external documentation

### Branch Strategy
- **Trunk-based development** with `main` as protected branch
- **Feature branches**: `feature/description`, `fix/description`, etc.
- **Short-lived branches**: < 2 days, frequent integration
- **Pull requests**: Required with status checks and review

### Package Development
- **Contract-first**: Define schemas in `@phoenix/contracts` before implementation
- **Layer isolation**: Respect clean architecture boundaries
- **Dependency management**: Inner layers never depend on outer layers
- **Testing strategy**: Unit, integration, and E2E tests per package

## Troubleshooting

### Common Issues
1. **Package resolution**: Ensure pnpm workspace is configured correctly
2. **TypeScript errors**: Check path mapping in tsconfig files
3. **Build failures**: Verify Turborepo pipeline configuration
4. **Git hooks**: Ensure Husky hooks are executable

### Getting Help
- **Engineering OS Documentation**: `~/Projects/devnet.clean_architecture/docs/`
- **Phoenix Documentation**: `docs/` directory
- **Standards Reference**: Engineering OS standards dispatcher
- **Issue Tracking**: GitHub issues with conventional templates

## VS Code Integration

This repository includes VS Code configuration for:
- **BiomeJS formatting** and linting
- **TypeScript** with workspace-wide IntelliSense
- **Recommended extensions** for optimal development
- **File nesting** and explorer optimization
- **Integrated terminal** with proper working directory

## Notes for Claude Code

- **Primary workspace**: Always work from `~/Projects/devnet-phoenix/`
- **Standards consultation**: Reference Engineering OS standards as needed
- **Phase awareness**: Respect implementation phase boundaries
- **Testing**: Run verification tests before marking tasks complete
- **Documentation**: Keep all documentation current with implementation

This configuration ensures optimal development experience while maintaining Engineering OS standards compliance and clean architecture principles.