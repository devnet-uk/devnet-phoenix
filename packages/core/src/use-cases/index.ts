/**
 * Use Cases Layer Exports
 *
 * This is the main export file for the use cases (application) layer,
 * providing access to all application-specific business logic that
 * orchestrates domain objects and coordinates with external services.
 *
 * The use cases layer contains:
 * - Use Case interfaces and base classes
 * - Commands (state-changing operations)
 * - Queries (state-reading operations)
 * - DTOs (data transfer objects)
 * - Application Services (cross-cutting concerns)
 */

export {
  BaseCommandUseCase,
  BaseQueryUseCase,
  BaseUseCase,
} from './BaseUseCase';
// Commands
export * from './commands';
// DTOs
export * from './dtos';
// Core use case interfaces and base classes
export type {
  IAuthorizationService,
  ICommand,
  ICommandBus,
  ICommandHandler,
  IQuery,
  IQueryBus,
  IQueryHandler,
  IUseCase,
  IUseCaseContext,
} from './IUseCase';
// Queries
export * from './queries';

// Application Services
export * from './services';
