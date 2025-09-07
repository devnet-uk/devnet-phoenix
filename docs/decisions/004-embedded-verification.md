# ADR-004: Embedded Verification Framework

**Status**: Accepted  
**Date**: 2025-09-06  
**Authors**: Phoenix Team  
**Reviewers**: Engineering OS Team  

## Context

Phoenix requires continuous compliance with Engineering OS standards throughout all development phases. Traditional approaches to standards compliance rely on manual checklists, periodic reviews, and post-implementation audits, which are error-prone and don't scale with team growth or project complexity.

### Background

Previous projects have struggled with:
- Standards compliance drift over time
- Manual verification processes that are skipped under pressure
- Inconsistent application of standards across different developers
- Late discovery of compliance issues, requiring expensive rework
- Lack of real-time feedback during development

Phoenix, as a greenfield rebuild targeting 10/10 architectural compliance, needs a systematic approach to ensure continuous standards adherence with 98% test coverage enforcement.

## Decision

**We will implement an embedded verification framework that automatically extracts and executes compliance tests from Engineering OS standards during development.**

### What we decided

Implement a comprehensive embedded verification system with:

1. **Standards Integration**: Engineering OS standards contain `<verification>` blocks with test commands
2. **Hierarchical DSL Navigation**: Automatic routing to relevant standards based on task keywords
3. **Variable Substitution**: Phoenix-specific context variables applied to verification tests
4. **Automated Execution**: Verification tests run automatically during task implementation
5. **Blocking on Failures**: Critical verification failures prevent task completion
6. **Real-time Feedback**: Immediate feedback on standards compliance

### Why we decided this

- **Continuous Compliance**: Standards are verified continuously, not just at reviews
- **Zero Manual Overhead**: No developer action required for standards consultation
- **Context-Aware**: Only relevant standards are loaded, optimizing token usage
- **Phoenix-Specific**: Verification tests use Phoenix context (98% coverage, greenfield type, etc.)
- **Engineering OS Integration**: Seamless integration with existing standards framework
- **Scalable**: Works for individual developers and large teams

## Alternatives Considered

### Option 1: Manual Standards Checklists
- **Pros**: Simple to implement, familiar process
- **Cons**: Error-prone, time-consuming, often skipped under pressure
- **Why rejected**: Doesn't scale or provide real-time feedback

### Option 2: Post-Implementation Audits
- **Pros**: Comprehensive review, catches major issues
- **Cons**: Late feedback, expensive to fix, disrupts development flow
- **Why rejected**: Too late in the process, doesn't prevent issues

### Option 3: Separate Compliance Tools
- **Pros**: Dedicated tooling, comprehensive reporting
- **Cons**: Context switch required, separate workflow, tool maintenance overhead
- **Why rejected**: Adds complexity and requires separate learning curve

## Consequences

### Positive Consequences

- **Continuous compliance**: Standards violations caught immediately
- **Reduced rework**: Issues prevented rather than fixed after implementation
- **Consistent quality**: Same standards applied regardless of developer or timeline pressure
- **Learning acceleration**: Developers learn standards through real-time feedback
- **Confidence in delivery**: High certainty that deliverables meet standards
- **Token efficiency**: Only relevant standards loaded based on context

### Negative Consequences

- **Implementation complexity**: Requires sophisticated standards parsing and execution
- **Dependency on Engineering OS**: Phoenix tightly coupled to Engineering OS standards format
- **Potential development slowdown**: Verification failures block progress
- **Learning curve**: Developers need to understand verification framework

### Neutral Consequences

- **Different development flow**: Verification integrated into normal development process
- **Standards format constraints**: Engineering OS standards must include verification blocks
- **Variable substitution patterns**: Phoenix context must be maintained consistently

## Implementation

### Immediate Actions

- [x] Engineering OS standards updated with embedded `<verification>` blocks
- [x] Hierarchical DSL navigation implemented for efficient standards loading
- [x] Phoenix context variables defined (PROJECT_COVERAGE=98, PROJECT_TYPE=greenfield, etc.)
- [x] Variable substitution system implemented for Phoenix-specific values

### Future Considerations

- **Standards evolution**: New standards will include embedded verification
- **Performance monitoring**: Track verification execution time and impact
- **Error reporting improvement**: Better error messages for failed verifications
- **Team training**: Ensure developers understand how to work with verification framework
- **Verification coverage expansion**: Add more sophisticated compliance checks

## Compliance and Verification

### Engineering OS Standards

- **Standards consulted**: `development/local-quality.md`, `development/testing-strategy.md`
- **Embedded verification**: Self-verifying through meta-verification patterns
- **Compliance requirements**: 100% verification test pass rate for critical standards

### Testing Strategy

- **Verification system tests**: Test the verification framework itself
- **Standards compliance tests**: Embedded tests within each standard
- **Integration tests**: End-to-end verification workflow testing
- **Performance tests**: Verification execution time monitoring

## Verification Example

```bash
╔══════════════════════════════════════════════════════════╗
║  Engineering OS Embedded Verification - Phoenix          ║
╚══════════════════════════════════════════════════════════╝

Loading standards via hierarchical dispatcher...
✅ Root dispatcher → development category → local-quality.md
✅ Variable substitution: PROJECT_COVERAGE=98, PROJECT_TYPE=greenfield
✅ Extracted verification blocks for automated compliance checking

┌─ local-quality.md embedded verifications ────────────────┐
│ ✅ Coverage threshold: 98% (greenfield requirement)      │
│ ✅ Git hooks: pre-commit, commit-msg, pre-push          │
│ ✅ Phase scopes: phase-0 through phase-7                │
│ ✅ BiomeJS: strict formatting with Engineering OS rules  │
└───────────────────────────────────────────────────────────┘

🎯 ALL EMBEDDED VERIFICATIONS PASSED - Implementation approved
```

## Related ADRs

- **Depends on**: ADR-001 (Clean Architecture) - Architecture compliance verification
- **Related to**: ADR-003 (TypeScript Strict) - Code quality verification
- **Related to**: ADR-005 (Development Environment) - Environment compliance verification

## Notes

This framework represents a significant advancement in automated standards compliance. It transforms Engineering OS from a reference documentation system into an active, intelligent development partner.

The embedded verification approach ensures that Phoenix maintains its 10/10 architectural compliance target throughout all development phases without manual overhead.

---

**Review Status**: 
- [x] Architecture review completed
- [x] Engineering OS compliance verified
- [x] Stakeholder approval obtained
- [x] Implementation plan approved