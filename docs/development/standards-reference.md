# Engineering OS Standards Reference

Quick reference guide for accessing Engineering OS standards during Phoenix development.

## Standards Location

All Engineering OS standards are located in the dual-repository setup:
- **Path**: `~/Projects/devnet.clean_architecture/docs/standards/`
- **Dispatcher**: `standards.md` (root routing file)
- **Access**: Available through Claude Code workspace configuration

## Quick Access Patterns

### Architecture Standards
```bash
# Clean Architecture patterns
~/Projects/devnet.clean_architecture/docs/standards/architecture/clean-architecture.md

# Domain-Driven Design
~/Projects/devnet.clean_architecture/docs/standards/architecture/domain-driven-design.md

# Monorepo structure
~/Projects/devnet.clean_architecture/docs/standards/development/monorepo-setup.md
```

### Development Standards
```bash
# Git workflow
~/Projects/devnet.clean_architecture/docs/standards/development/git-workflow.md

# Testing strategy
~/Projects/devnet.clean_architecture/docs/standards/development/testing-strategy.md

# Code style
~/Projects/devnet.clean_architecture/docs/standards/development/code-style.md
```

### Technology Standards
```bash
# Tech stack versions
~/Projects/devnet.clean_architecture/docs/standards/tech-stack.md

# TypeScript configuration
~/Projects/devnet.clean_architecture/docs/standards/development/typescript.md

# API development
~/Projects/devnet.clean_architecture/docs/standards/api/
```

## Engineering OS Commands

### Available Commands
Located in `~/Projects/devnet.clean_architecture/.claude/commands/`:
- **`/create-spec`**: Create feature specifications
- **`/create-tasks`**: Generate implementation tasks
- **`/execute-tasks`**: Execute task workflows
- **`/analyze-product`**: Product analysis workflows
- **`/refactor-codebase`**: Code refactoring workflows

### Usage Pattern
```bash
# From Phoenix workspace, reference Engineering OS commands
cd ~/Projects/devnet-phoenix/

# Example: Create new feature specification
# Claude: /create-spec
# (Command will reference Engineering OS standards automatically)
```

## Standards Integration

### Phoenix-Specific Extensions
Phoenix may extend Engineering OS standards in:
- **Location**: `docs/standards/` (Phoenix repository)
- **Relationship**: Extensions only, never overrides
- **Documentation**: ADRs for significant deviations

### Precedence Rules
1. **Engineering OS Standards**: Base requirements (always followed)
2. **Phoenix Extensions**: Project-specific additions (when needed)
3. **Phase-Specific Adaptations**: Temporary modifications (documented)

## Verification Framework

### Standards Compliance
Engineering OS includes embedded verification tests:
- **Location**: Verification blocks within standard documents
- **Execution**: Automatic during `/execute-tasks` workflows
- **Coverage**: Architecture, testing, code quality, security

### Variable Substitution
Standards support project-specific variables:
- `${PROJECT_COVERAGE}`: Target coverage percentage (98% for Phoenix)
- `${PROJECT_TYPE}`: Project type (greenfield for Phoenix)
- `${PROJECT_PHASES}`: Phase-based development (true for Phoenix)

## Quick Reference Commands

### Standards Consultation
```bash
# Browse all available standards
ls ~/Projects/devnet.clean_architecture/docs/standards/

# Use standards dispatcher for specific guidance
# (Available through Claude Code workspace)
Continue Phoenix from phoenix-plan/phoenix.md
```

### Documentation Paths
When you see these references in Phoenix documentation:
- `@docs/standards/` → `~/Projects/devnet.clean_architecture/docs/standards/`
- `@.claude/commands/` → `~/Projects/devnet.clean_architecture/.claude/commands/`
- `@.claude/agents/` → `~/Projects/devnet.clean_architecture/.claude/agents/`

## Best Practices

### Before Implementation
1. **Check Engineering OS standards** for established patterns
2. **Review relevant ADRs** for architectural decisions
3. **Consult verification requirements** for quality gates
4. **Follow established workflows** for feature development

### During Development
1. **Reference standards continuously** for consistency
2. **Use Engineering OS commands** for structured workflows
3. **Maintain verification compliance** throughout development
4. **Document deviations** as ADRs when necessary

### After Implementation
1. **Run verification tests** to ensure compliance
2. **Update Phoenix documentation** with new patterns
3. **Contribute improvements** back to Engineering OS (when applicable)
4. **Share learnings** through team knowledge sharing

## Common Standards by Phase

### Phase 0: Infrastructure
- **Git Workflow**: Branch strategy, conventional commits
- **Monorepo Setup**: Workspace configuration, build systems
- **Quality Gates**: Pre-commit hooks, continuous integration

### Phase 1: Domain Layer
- **Clean Architecture**: Layer boundaries, dependency rules
- **Domain-Driven Design**: Entity patterns, value objects
- **Testing Strategy**: Unit testing, coverage requirements

### Phase 2: Use Cases
- **Business Logic**: Use case patterns, validation
- **Error Handling**: Exception strategies, user messaging
- **Integration Testing**: Service layer testing

### Phase 3: Infrastructure
- **Database Design**: Schema patterns, migration strategies
- **External Services**: API integration, resilience patterns
- **Security**: Authentication, authorization, data protection

### Phase 4: Interface Adapters
- **API Design**: RESTful patterns, contract validation
- **Controller Patterns**: Request/response handling
- **Integration Testing**: API testing strategies

### Phase 5: Presentation
- **UI Architecture**: Component patterns, state management
- **User Experience**: Accessibility, responsiveness
- **E2E Testing**: User workflow testing

### Phase 6: Deployment
- **Infrastructure as Code**: Deployment automation
- **Monitoring**: Observability, alerting
- **Security**: Production hardening

### Phase 7: Documentation
- **Documentation Standards**: Format, structure, maintenance
- **Knowledge Management**: Team documentation practices
- **Optimization**: Performance monitoring, improvement cycles

This reference guide enables efficient consultation of Engineering OS standards while maintaining focus on Phoenix implementation tasks.