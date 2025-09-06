# Phoenix Standards

Project-specific engineering standards extending Engineering OS framework.

## Status
🟡 **Placeholder** - Standards will be established during implementation phases

## Relationship to Engineering OS

Phoenix standards extend but never override Engineering OS standards:
- **Engineering OS**: Base standards in `~/Projects/devnet.clean_architecture/`
- **Phoenix Standards**: Project-specific adaptations and extensions
- **Precedence**: Engineering OS standards take precedence when in conflict

## Structure

### Architectural Decision Records (ADRs)
- **Location**: `standards/adr/`
- **Purpose**: Document significant architectural decisions
- **Format**: Engineering OS ADR template

### Coding Standards
- **Location**: `standards/coding/`
- **Purpose**: Phoenix-specific coding conventions
- **Extends**: Engineering OS code style standards

### Quality Gates
- **Location**: `standards/quality/`
- **Purpose**: Project-specific quality thresholds
- **Integration**: Engineering OS verification framework

## Implementation Schedule

Standards will be documented as they are established:
- **Phase 1**: Domain layer standards and patterns
- **Phase 2**: Use case and business logic standards
- **Phase 3**: Infrastructure standards and patterns
- **Phase 4+**: Interface and presentation standards

## Usage

Consult these standards in conjunction with Engineering OS standards:
1. Check Engineering OS standards first
2. Apply Phoenix-specific extensions
3. Document new patterns as ADRs