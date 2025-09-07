/**
 * Core Package Main Export
 *
 * This is the main entry point for the @phoenix/core package.
 * It exports all the building blocks needed to implement Clean Architecture
 * and Domain-Driven Design patterns in Phoenix applications.
 *
 * The core package provides:
 * - Domain layer: Entities, Value Objects, Domain Services, Events
 * - Use Cases layer: Application services, Commands, Queries, DTOs
 * - Shared utilities: Result pattern, base classes, interfaces
 *
 * Usage:
 *   import { Result, Entity, ValueObject, BaseUseCase } from '@phoenix/core';
 *   import { IRepository } from '@phoenix/core/domain/interfaces';
 *   import { BaseDto } from '@phoenix/core/use-cases/dtos';
 */

// Domain layer exports
export * from './domain';
export type { IDomainService } from './domain/interfaces/IDomainService';
// Type-only exports for better tree-shaking
export type { IRepository } from './domain/interfaces/IRepository';
export { AggregateRoot } from './domain/shared/AggregateRoot';
export { DomainEvent } from './domain/shared/DomainEvent';
export { Entity } from './domain/shared/Entity';
// Convenience re-exports of commonly used items
export { Result } from './domain/shared/Result';
export { ValueObject } from './domain/shared/ValueObject';
// Use cases layer exports
export * from './use-cases';
export { BaseUseCase } from './use-cases/BaseUseCase';
export type { IUseCase } from './use-cases/IUseCase';
