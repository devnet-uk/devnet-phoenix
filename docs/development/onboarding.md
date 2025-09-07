# Developer Onboarding Checklist

Welcome to the Phoenix development team! This checklist ensures you have everything needed for productive Phoenix development.

## 📋 Pre-Development Setup

### 1. System Requirements ✅
- [ ] **Node.js 22 LTS** installed (check: `node --version`)
- [ ] **pnpm 10.15.1+** installed (check: `pnpm --version`)
- [ ] **Git** latest version (check: `git --version`)
- [ ] **VS Code** or preferred IDE installed
- [ ] **SSH keys** configured for GitHub access

### 2. Repository Access ✅
- [ ] **GitHub access** to `devnet-uk/devnet-phoenix` repository
- [ ] **Clone Phoenix repository**: `~/Projects/devnet-phoenix/`
- [ ] **Clone Engineering OS repository**: `~/Projects/devnet.clean_architecture/`
- [ ] **Verify both repositories** accessible locally

### 3. Authentication Setup ✅
- [ ] **GitHub SSH keys** added to GitHub account
- [ ] **Git user configuration** set globally or locally
- [ ] **GitHub CLI** installed and authenticated (optional but recommended)

## 🛠️ Development Environment

### 4. Phoenix Repository Setup ✅
```bash
cd ~/Projects/devnet-phoenix/
```
- [ ] **Install dependencies**: `pnpm install`
- [ ] **Verify git hooks**: `ls -la .husky/`
- [ ] **Test conventional commits**: `pnpm commit` (then cancel)
- [ ] **Verify workspace**: `pnpm list --depth=0`

### 5. VS Code Configuration ✅
- [ ] **Open Phoenix workspace** in VS Code
- [ ] **Install recommended extensions** from `.vscode/extensions.json`
- [ ] **Verify BiomeJS** is working (check status bar)
- [ ] **Test format on save** with a sample edit
- [ ] **Configure workspace trust** for full functionality

### 6. Claude Code Setup ✅
- [ ] **Add Phoenix repository** as primary workspace
- [ ] **Add Engineering OS repository** as additional workspace
- [ ] **Verify dual-repository access** in Claude Code
- [ ] **Test Engineering OS command access**: Try `Continue Phoenix from phoenix-plan/phoenix.md`
- [ ] **Understand embedded verification**: Read [Engineering OS Integration](../../CLAUDE.md#engineering-os-integration)

## 📚 Knowledge & Documentation

### 7. Architecture Understanding ✅
- [ ] **Read Phoenix README.md** for project overview
- [ ] **Review CLAUDE.md** for development guidance
- [ ] **Study Clean Architecture principles** from Engineering OS standards
- [ ] **Understand monorepo structure** and package organization

### 8. Development Workflow ✅
- [ ] **Read git workflow documentation**: `docs/development/git-workflow.md`
- [ ] **Review branch strategy** and naming conventions  
- [ ] **Understand conventional commits** format and scopes
- [ ] **Practice pull request process** with a small change

### 9. Engineering OS Integration ✅
- [ ] **Browse Engineering OS standards** in dual repository
- [ ] **Understand standards reference** system
- [ ] **Review available commands** in `.claude/commands/`
- [ ] **Practice standards consultation** workflow

## 🧪 Development Practice

### 10. First Development Session ✅
Create your first feature branch and make a small change:

```bash
# Create feature branch
git checkout -b feature/onboarding-test

# Make small change (e.g., update a README)
echo "## New Developer Notes" >> docs/development/team-notes.md
echo "- Added by [Your Name] during onboarding" >> docs/development/team-notes.md

# Test development workflow
pnpm lint
git add .
pnpm commit  # Practice interactive conventional commit

# Clean up
git checkout main
git branch -D feature/onboarding-test
```

### 11. Tool Verification ✅
- [ ] **BiomeJS formatting** works on file save
- [ ] **TypeScript IntelliSense** provides suggestions
- [ ] **Git hooks** run on commit attempts
- [ ] **Conventional commit validation** rejects malformed messages
- [ ] **pnpm workspace** resolves package dependencies

### 12. Phase Understanding ✅
- [ ] **Current Phase 0 status** (infrastructure setup)
- [ ] **Next phases overview** (domain → use cases → infrastructure → etc.)
- [ ] **Your role** in current and upcoming phases
- [ ] **Phase-specific workflows** and responsibilities

## 👥 Team Integration

### 13. Team Resources ✅
- [ ] **Engineering team contact**: engineering@devnet.uk
- [ ] **GitHub repository** bookmarked for issues and PRs
- [ ] **Slack/communication channels** joined
- [ ] **Meeting schedules** and development cadence

### 14. Code Review Process ✅
- [ ] **Review pull request template** in `.github/`
- [ ] **Understand code review expectations**
- [ ] **Practice giving constructive feedback**
- [ ] **Learn from existing PRs** and commit history

### 15. Quality Standards ✅
- [ ] **98% coverage target** understanding
- [ ] **Clean Architecture compliance** requirements
- [ ] **Testing strategy** and frameworks
- [ ] **Performance expectations** and monitoring

## 🚀 First Week Goals

### Week 1 Objectives ✅
- [ ] **Complete this onboarding checklist**
- [ ] **Contribute to one documentation improvement**
- [ ] **Complete one small bug fix or enhancement**
- [ ] **Participate in code review process**
- [ ] **Ask questions** and get comfortable with the team

### Development Milestones ✅
- [ ] **Successful local development setup**
- [ ] **First pull request merged**
- [ ] **Understanding of Phoenix architecture**
- [ ] **Comfortable with Engineering OS workflows**

## 🔧 Troubleshooting

### Common Issues ✅
If you encounter issues:

1. **Package installation failures**:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm store prune
   pnpm install
   ```

2. **Git hooks not working**:
   ```bash
   chmod +x .husky/*
   pnpm run prepare
   ```

3. **VS Code TypeScript issues**:
   - Restart TS server via Command Palette
   - Reinstall workspace extensions

4. **Standards access issues**:
   - Verify dual repository setup
   - Check Claude Code workspace configuration

### Getting Help ✅
- [ ] **Team members** available for questions
- [ ] **Documentation** comprehensive and up-to-date
- [ ] **GitHub issues** for bug reports and feature requests
- [ ] **Engineering OS standards** for technical guidance

## 📋 Post-Onboarding

### Ongoing Development ✅
After completing onboarding:
- [ ] **Stay updated** with Phoenix implementation phases
- [ ] **Contribute to documentation** improvements
- [ ] **Participate in technical discussions** and ADR reviews
- [ ] **Help onboard future team members**

### Continuous Learning ✅
- [ ] **Clean Architecture patterns** - deeper understanding
- [ ] **Domain-Driven Design** - practical application
- [ ] **Testing strategies** - comprehensive coverage
- [ ] **Performance optimization** - production readiness

## ✅ Completion

### Sign-off ✅
- [ ] **All checklist items completed**
- [ ] **Development environment fully functional**
- [ ] **First contribution made successfully**
- [ ] **Ready for Phoenix development work**

**Completed by**: ________________  
**Date**: ________________  
**Onboarding buddy**: ________________  

---

Welcome to the Phoenix development team! You're now ready to contribute to building a production-ready SaaS foundation with Engineering OS standards. 🚀

### Next Steps
1. **Review current sprint tasks** and pick up your first assignment
2. **Join daily standups** and team ceremonies
3. **Start contributing** to Phoenix Phase implementation
4. **Ask questions** and help improve this onboarding process