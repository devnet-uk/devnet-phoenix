/**
 * Domain Layer Exports
 *
 * This is the main export file for the domain layer, providing access
 * to all domain concepts following Clean Architecture principles.
 *
 * The domain layer contains:
 * - Entities and Value Objects (business objects)
 * - Domain Services (business logic that doesn't belong to entities)
 * - Domain Events (things that happened in the domain)
 * - Repository Interfaces (data access contracts)
 * - Shared building blocks (Result, base classes, etc.)
 */

// Domain entities
export * from './entities';
// Domain events
export * from './events';
// Domain interfaces and contracts
export * from './interfaces';
// Domain services
export * from './services';
// Shared building blocks
export * from './shared';
// Domain value objects
export * from './value-objects';
