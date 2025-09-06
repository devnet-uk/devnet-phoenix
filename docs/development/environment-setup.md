# Development Environment Setup

Comprehensive guide for setting up the Phoenix development environment with dual-repository workspace configuration.

## Prerequisites

### Required Software
- **Node.js**: 22 LTS (see `.nvmrc`)
- **pnpm**: 10.15.1+ (`npm install -g pnpm`)
- **Git**: Latest version with conventional commit support
- **VS Code**: Recommended editor with Phoenix extensions

### Optional Tools
- **Docker**: For database development (Phase 3)
- **GitHub CLI**: For repository management (`gh`)
- **nvm**: For Node.js version management

## Dual-Repository Workspace

### Repository Setup
Phoenix development requires access to both repositories:

```bash
# 1. Primary Implementation Repository
cd ~/Projects/
git clone https://github.com/devnet-uk/devnet-phoenix.git
cd devnet-phoenix

# 2. Engineering OS Standards Repository  
cd ~/Projects/
git clone https://github.com/devnet-uk/devnet.clean_architecture.git

# 3. Verify both repositories are accessible
ls ~/Projects/devnet-phoenix/        # Phoenix implementation
ls ~/Projects/devnet.clean_architecture/  # Engineering OS standards
```

### Claude Code Workspace Configuration
Ensure Claude Code has access to both repositories:
- **Primary Workspace**: `~/Projects/devnet-phoenix/` 
- **Additional Workspace**: `~/Projects/devnet.clean_architecture/`

Use `/add-dir ~/Projects/devnet.clean_architecture` if needed.

## Local Development Setup

### 1. Install Dependencies
```bash
cd ~/Projects/devnet-phoenix/
pnpm install
```

### 2. Verify Installation
```bash
# Check pnpm workspace configuration
pnpm list --depth=0

# Verify git hooks
ls -la .husky/

# Test conventional commits
pnpm commit  # Interactive commit creation
```

### 3. Environment Configuration
```bash
# Copy environment template (when available)
cp .env.example .env.local  # Phase 4+

# Verify Node.js version
node --version  # Should match .nvmrc (22.x.x)
```

## VS Code Configuration

### Required Extensions
The workspace includes recommended extensions in `.vscode/extensions.json`:
- **BiomeJS**: Primary formatter and linter
- **TypeScript**: Enhanced TypeScript support
- **TailwindCSS**: CSS utility class support
- **Error Lens**: Inline error display
- **Playwright**: E2E testing support

### Workspace Settings
Pre-configured in `.vscode/settings.json`:
- **Format on save** with BiomeJS
- **TypeScript** workspace-wide IntelliSense
- **File nesting** for better organization
- **Search exclusions** for performance
- **Terminal integration** with proper working directory

### Manual Configuration (Optional)
```json
// Additional user settings for optimal experience
{
  "workbench.colorTheme": "GitHub Dark",
  "editor.fontFamily": "JetBrains Mono, Fira Code, monospace",
  "editor.fontSize": 14,
  "editor.lineHeight": 1.5,
  "terminal.integrated.fontSize": 13
}
```

## Git Workflow Setup

### Global Git Configuration
```bash
# Configure user (if not already set)
git config --global user.name "Your Name"
git config --global user.email "your.email@company.com"

# Recommended global settings
git config --global pull.rebase true
git config --global push.default current
git config --global init.defaultBranch main
```

### Repository-Specific Configuration
Already configured in Phoenix repository:
- **Commit template**: `.gitmessage` with conventional format
- **Conventional commits**: Commitizen with `pnpm commit`
- **Pre-commit hooks**: Husky with linting and testing
- **Commit message validation**: commitlint with Phoenix scopes

### SSH Key Setup (Recommended)
```bash
# Generate SSH key (if needed)
ssh-keygen -t ed25519 -C "your.email@company.com"

# Add to SSH agent
ssh-add ~/.ssh/id_ed25519

# Add public key to GitHub account
cat ~/.ssh/id_ed25519.pub
```

## Development Workflow

### Daily Development
```bash
cd ~/Projects/devnet-phoenix/

# Start development session
git pull origin main
pnpm install  # If dependencies changed

# Create feature branch
git checkout -b feature/your-feature-name

# Development cycle
# ... make changes ...
pnpm lint     # Format and lint code
pnpm test     # Run tests (Phase 1+)
pnpm build    # Build packages (Phase 0 Step 3+)

# Commit changes
pnpm commit   # Interactive conventional commit
# or
git commit    # Uses template from .gitmessage
```

### Engineering OS Standards Consultation
```bash
# When implementing features, consult standards
cd ~/Projects/devnet.clean_architecture/
ls docs/standards/  # Browse available standards

# Use Engineering OS commands
Continue Phoenix from phoenix-plan/phoenix.md
```

### Phase-Specific Setup

#### Phase 0 (Current): Infrastructure
- ✅ Repository setup complete
- 🟡 Build system setup (Step 3)
- 🟡 Development tools configuration (Step 3)

#### Phase 1+: Implementation Phases
- **Database**: PostgreSQL setup (Phase 3)
- **API Development**: HonoJS server (Phase 4)
- **Web Development**: Next.js application (Phase 5)
- **Testing**: Comprehensive test suites (All phases)

## Troubleshooting

### Common Issues

#### 1. Package Installation Failures
```bash
# Clear caches and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm store prune
pnpm install
```

#### 2. TypeScript Errors
```bash
# Restart TypeScript language server in VS Code
# Command Palette > "TypeScript: Restart TS Server"

# Check workspace configuration
pnpm exec tsc --showConfig  # Phase 0 Step 3+
```

#### 3. Git Hook Failures
```bash
# Ensure hooks are executable
chmod +x .husky/*

# Reinstall husky
rm -rf .husky
pnpm run prepare
```

#### 4. VS Code Extension Issues
```bash
# Reinstall workspace extensions
# Command Palette > "Extensions: Show Recommended Extensions"
# Install all recommended extensions
```

### Performance Optimization

#### VS Code Performance
- **Exclude large directories**: Already configured in settings
- **Disable unused extensions**: Remove conflicting extensions
- **Workspace trust**: Trust the workspace for full feature access

#### Development Server Performance (Phase 4+)
- **File watching**: Optimize for monorepo structure
- **Build caching**: Turborepo caching configuration
- **Hot reloading**: Framework-specific optimizations

## Environment Variables

### Development Environment
```bash
# Node.js environment
NODE_ENV=development

# Package manager
PNPM_VERSION=10.15.1

# Development ports (Phase 4+)
WEB_PORT=4000
API_PORT=4001
```

### Production Environment (Phase 6)
Production environment variables will be configured during Phase 6 deployment setup.

## Integration with Engineering OS

### Standards Reference
- **Architecture**: `~/Projects/devnet.clean_architecture/docs/standards/architecture/`
- **Development**: `~/Projects/devnet.clean_architecture/docs/standards/development/`
- **Testing**: `~/Projects/devnet.clean_architecture/docs/standards/testing/`

### Command Integration
- **Specifications**: Use `/create-spec` for new features
- **Task Management**: Use `/create-tasks` and `/execute-tasks`
- **Standards Consultation**: Reference standards dispatcher

### Path Mapping
When working with Phoenix:
- `@docs/standards/` refers to Engineering OS standards
- `@.claude/` refers to Engineering OS command definitions
- Local `docs/` refers to Phoenix-specific documentation

## Support and Resources

### Documentation
- **Phoenix Docs**: `docs/` directory in Phoenix repository
- **Engineering OS Docs**: `docs/` directory in Engineering OS repository
- **API Documentation**: Generated during Phase 4+

### Team Resources
- **Engineering Team**: engineering@devnet.uk
- **Repository Issues**: GitHub issue tracking with templates
- **Standards Questions**: Reference Engineering OS documentation

### External Resources
- **Clean Architecture**: Robert C. Martin's principles
- **Domain-Driven Design**: Eric Evans' patterns
- **Monorepo Best Practices**: pnpm + Turborepo documentation

This setup ensures optimal development experience with proper tooling, standards compliance, and dual-repository workflow integration.