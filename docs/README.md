# Phoenix Documentation

Comprehensive documentation for the Phoenix platform development.

## Structure

### 📋 Standards
Project-specific engineering standards and architectural decisions.
- **Location**: `docs/standards/`
- **Content**: ADRs, coding standards, quality gates
- **Relationship**: Extends Engineering OS standards

### 📦 Product
Product specifications, features, and business requirements.
- **Location**: `docs/product/`
- **Content**: Feature specs, user stories, roadmaps
- **Process**: Created via Engineering OS `/create-spec` workflow

### ⚙️ Development
Development setup, workflows, and operational procedures.
- **Location**: `docs/development/`
- **Content**: Environment setup, git workflow, deployment guides
- **Audience**: Development team and new contributors

## Documentation Standards

All documentation follows Engineering OS documentation standards:
- **Markdown Format**: CommonMark specification
- **Structure**: Consistent headers and sections
- **Links**: Relative paths for internal references
- **Code Blocks**: Syntax highlighting with language tags
- **Status Indicators**: 🟢 Complete, 🟡 In Progress, 🔴 Blocked

## Contributing

1. Follow Engineering OS documentation standards
2. Use conventional commit messages for doc changes
3. Keep documentation up-to-date with implementation
4. Link to relevant Engineering OS standards when applicable

## Quick Links

### Development Documentation
- [Git Workflow](development/git-workflow.md)
- [Environment Setup](development/environment-setup.md) (Phase 4)
- [Branch Protection](development/branch-protection.md)

### Engineering OS Integration
- **Standards Repository**: `~/Projects/devnet.clean_architecture/`
- **Command Reference**: `.claude/commands/` in Engineering OS repo
- **Standards Dispatcher**: `docs/standards/standards.md` in Engineering OS repo