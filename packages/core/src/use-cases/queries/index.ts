/**
 * Use Case Queries Exports
 *
 * This module will export query use cases when they are implemented.
 * Queries read system state and are typically optimized for performance.
 */

export { BaseQueryUseCase } from '../BaseUseCase';
// Re-export query interfaces and base classes for convenience
export type { IQuery, IQueryBus, IQueryHandler } from '../IUseCase';

// TODO: Add query use cases here when implemented
// Example:
// export { GetUserQuery, GetUserQueryHandler } from './GetUserQuery';
// export { ListUsersQuery, ListUsersQueryHandler } from './ListUsersQuery';
// export { SearchUsersQuery, SearchUsersQueryHandler } from './SearchUsersQuery';
