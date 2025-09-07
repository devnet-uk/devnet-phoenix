/**
 * Domain Interfaces Exports
 *
 * This module exports all domain interfaces that define contracts
 * for repositories, services, and other domain abstractions.
 */

// Domain Service Interfaces
export type {
  ICompositePolicy,
  IDomainEventDispatcher,
  IDomainEventHandler,
  IDomainService,
  IDomainValidator,
  IFactory,
  IPolicy,
} from './IDomainService';
// Repository Interfaces
export type {
  IPaginatedRepository,
  IPaginatedResult,
  IPaginationOptions,
  IRepository,
  ISpecification,
  ISpecificationRepository,
  IUnitOfWork,
} from './IRepository';
