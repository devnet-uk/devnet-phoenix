import type { Entity } from '../shared/Entity';
import type { Result } from '../shared/Result';
import type { ValueObject } from '../shared/ValueObject';

/**
 * Base Repository Interface
 *
 * Defines the contract for data access in the domain layer.
 * Repositories provide an abstraction over data storage mechanisms,
 * allowing the domain layer to remain independent of infrastructure concerns.
 *
 * All repository methods return Result<T> to maintain explicit error handling
 * throughout the domain layer.
 */
export interface IRepository<TEntity extends Entity<TId>, TId extends ValueObject> {
  /**
   * Persists an entity to the data store
   * @param entity - The entity to save
   * @returns Result indicating success or failure
   */
  save(entity: TEntity): Promise<Result<void>>;

  /**
   * Retrieves an entity by its unique identifier
   * @param id - The unique identifier of the entity
   * @returns Result containing the entity if found, null if not found, or failure
   */
  findById(id: TId): Promise<Result<TEntity | null>>;

  /**
   * Removes an entity from the data store
   * @param id - The unique identifier of the entity to remove
   * @returns Result indicating success or failure
   */
  delete(id: TId): Promise<Result<void>>;

  /**
   * Checks if an entity with the given ID exists
   * @param id - The unique identifier to check
   * @returns Result containing true if exists, false if not, or failure
   */
  exists(id: TId): Promise<Result<boolean>>;

  /**
   * Retrieves all entities (use with caution for large datasets)
   * @returns Result containing array of all entities or failure
   */
  findAll(): Promise<Result<TEntity[]>>;

  /**
   * Counts the total number of entities
   * @returns Result containing the count or failure
   */
  count(): Promise<Result<number>>;
}

/**
 * Specification Interface
 *
 * Represents a business rule or query criteria that can be applied
 * to filter or query entities. This allows for flexible and reusable
 * query logic that stays in the domain layer.
 */
export interface ISpecification<TEntity> {
  /**
   * Evaluates whether an entity satisfies this specification
   * @param entity - The entity to evaluate
   * @returns true if the entity satisfies the specification, false otherwise
   */
  isSatisfiedBy(entity: TEntity): boolean;

  /**
   * Combines this specification with another using AND logic
   * @param other - The other specification to combine with
   * @returns A new specification representing the AND combination
   */
  and(other: ISpecification<TEntity>): ISpecification<TEntity>;

  /**
   * Combines this specification with another using OR logic
   * @param other - The other specification to combine with
   * @returns A new specification representing the OR combination
   */
  or(other: ISpecification<TEntity>): ISpecification<TEntity>;

  /**
   * Creates a specification that is the negation of this one
   * @returns A new specification representing the NOT of this specification
   */
  not(): ISpecification<TEntity>;
}

/**
 * Extended Repository Interface with Specification Support
 *
 * Provides additional query capabilities using the Specification pattern
 * for complex business queries that need to remain in the domain layer.
 */
export interface ISpecificationRepository<TEntity extends Entity<TId>, TId extends ValueObject>
  extends IRepository<TEntity, TId> {
  /**
   * Finds entities that satisfy the given specification
   * @param specification - The business rule to apply
   * @returns Result containing matching entities or failure
   */
  findBySpecification(specification: ISpecification<TEntity>): Promise<Result<TEntity[]>>;

  /**
   * Finds a single entity that satisfies the given specification
   * @param specification - The business rule to apply
   * @returns Result containing the first matching entity, null if none found, or failure
   */
  findOneBySpecification(specification: ISpecification<TEntity>): Promise<Result<TEntity | null>>;

  /**
   * Counts entities that satisfy the given specification
   * @param specification - The business rule to apply
   * @returns Result containing the count or failure
   */
  countBySpecification(specification: ISpecification<TEntity>): Promise<Result<number>>;

  /**
   * Checks if any entities satisfy the given specification
   * @param specification - The business rule to apply
   * @returns Result containing true if any exist, false otherwise, or failure
   */
  anyBySpecification(specification: ISpecification<TEntity>): Promise<Result<boolean>>;
}

/**
 * Pagination Support
 *
 * Represents pagination parameters for query results
 */
export interface IPaginationOptions {
  /**
   * The page number (1-based)
   */
  page: number;

  /**
   * The number of items per page
   */
  pageSize: number;

  /**
   * Optional sorting criteria
   */
  sortBy?: string;

  /**
   * Sort direction (asc or desc)
   */
  sortDirection?: 'asc' | 'desc';
}

/**
 * Paginated Result
 *
 * Represents a paginated collection of entities with metadata
 */
export interface IPaginatedResult<TEntity> {
  /**
   * The entities for the current page
   */
  items: TEntity[];

  /**
   * Total number of items across all pages
   */
  totalCount: number;

  /**
   * Current page number (1-based)
   */
  currentPage: number;

  /**
   * Number of items per page
   */
  pageSize: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Whether there is a next page
   */
  hasNextPage: boolean;

  /**
   * Whether there is a previous page
   */
  hasPreviousPage: boolean;
}

/**
 * Paginated Repository Interface
 *
 * Extends repository with pagination support for handling large datasets
 */
export interface IPaginatedRepository<TEntity extends Entity<TId>, TId extends ValueObject>
  extends IRepository<TEntity, TId> {
  /**
   * Retrieves a paginated list of all entities
   * @param options - Pagination and sorting options
   * @returns Result containing paginated entities or failure
   */
  findAllPaginated(options: IPaginationOptions): Promise<Result<IPaginatedResult<TEntity>>>;

  /**
   * Retrieves a paginated list of entities matching a specification
   * @param specification - The business rule to apply
   * @param options - Pagination and sorting options
   * @returns Result containing paginated matching entities or failure
   */
  findBySpecificationPaginated(
    specification: ISpecification<TEntity>,
    options: IPaginationOptions
  ): Promise<Result<IPaginatedResult<TEntity>>>;
}

/**
 * Unit of Work Interface
 *
 * Maintains a list of objects affected by a business transaction and
 * coordinates writing out changes and resolving concurrency problems.
 */
export interface IUnitOfWork {
  /**
   * Registers an entity as new to be inserted
   * @param entity - The entity to mark as new
   */
  registerNew<TEntity extends Entity<any>>(entity: TEntity): void;

  /**
   * Registers an entity as modified to be updated
   * @param entity - The entity to mark as modified
   */
  registerModified<TEntity extends Entity<any>>(entity: TEntity): void;

  /**
   * Registers an entity as deleted to be removed
   * @param entity - The entity to mark as deleted
   */
  registerDeleted<TEntity extends Entity<any>>(entity: TEntity): void;

  /**
   * Commits all changes as a single transaction
   * @returns Result indicating success or failure of the transaction
   */
  commit(): Promise<Result<void>>;

  /**
   * Rolls back all changes in the current transaction
   * @returns Result indicating success or failure of the rollback
   */
  rollback(): Promise<Result<void>>;

  /**
   * Clears all registered changes without committing
   */
  clear(): void;

  /**
   * Returns true if there are uncommitted changes
   */
  hasChanges(): boolean;
}
