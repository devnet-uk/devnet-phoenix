import type { Result } from '../domain/shared/Result';

/**
 * Base Use Case Interface
 *
 * Use Cases represent application-specific business rules and orchestrate
 * the flow of data to and from entities. They should not contain business
 * rules that belong in the domain layer, but rather coordinate domain
 * operations and external dependencies.
 *
 * Key characteristics:
 * - Application-specific business logic
 * - Orchestrates domain objects and external services
 * - Independent of UI and database concerns
 * - Uses dependency injection for external dependencies
 */
export interface IUseCase<TRequest, TResponse> {
  /**
   * Executes the use case with the provided request
   * @param request - The input data for the use case
   * @returns Result containing the response or error
   */
  execute(request: TRequest): Promise<Result<TResponse>>;
}

/**
 * Command Interface
 *
 * Commands represent requests to change the state of the system.
 * They are typically used with CQRS (Command Query Responsibility Segregation)
 * pattern to separate read and write operations.
 */
export interface ICommand {
  /**
   * Unique identifier for this command instance
   */
  readonly commandId: string;

  /**
   * The type/name of the command
   */
  readonly commandType: string;

  /**
   * Timestamp when the command was created
   */
  readonly createdAt: Date;

  /**
   * Optional correlation ID for tracing
   */
  readonly correlationId?: string;

  /**
   * Optional user/actor who initiated the command
   */
  readonly initiatedBy?: string;
}

/**
 * Query Interface
 *
 * Queries represent requests to read data from the system.
 * They should not modify state and are typically used with CQRS
 * pattern to optimize read operations.
 */
export interface IQuery {
  /**
   * Unique identifier for this query instance
   */
  readonly queryId: string;

  /**
   * The type/name of the query
   */
  readonly queryType: string;

  /**
   * Timestamp when the query was created
   */
  readonly createdAt: Date;

  /**
   * Optional correlation ID for tracing
   */
  readonly correlationId?: string;

  /**
   * Optional user/actor who initiated the query
   */
  readonly initiatedBy?: string;
}

/**
 * Command Handler Interface
 *
 * Handles commands by executing the appropriate business logic.
 * Command handlers should be stateless and focus on coordinating
 * domain operations.
 */
export interface ICommandHandler<TCommand extends ICommand, TResult = void> {
  /**
   * Handles the specified command
   * @param command - The command to handle
   * @returns Result indicating success or failure
   */
  handle(command: TCommand): Promise<Result<TResult>>;

  /**
   * Returns true if this handler can handle the given command type
   * @param commandType - The command type to check
   */
  canHandle(commandType: string): boolean;
}

/**
 * Query Handler Interface
 *
 * Handles queries by retrieving and returning the requested data.
 * Query handlers should be optimized for read operations and
 * may bypass domain objects for performance.
 */
export interface IQueryHandler<TQuery extends IQuery, TResult> {
  /**
   * Handles the specified query
   * @param query - The query to handle
   * @returns Result containing the query result or error
   */
  handle(query: TQuery): Promise<Result<TResult>>;

  /**
   * Returns true if this handler can handle the given query type
   * @param queryType - The query type to check
   */
  canHandle(queryType: string): boolean;
}

/**
 * Command Bus Interface
 *
 * Dispatches commands to their appropriate handlers.
 * Provides a central point for command execution and
 * cross-cutting concerns like logging, validation, etc.
 */
export interface ICommandBus {
  /**
   * Sends a command to its handler
   * @param command - The command to send
   * @returns Result from the command execution
   */
  send<TResult = void>(command: ICommand): Promise<Result<TResult>>;

  /**
   * Registers a command handler
   * @param commandType - The type of command to handle
   * @param handler - The handler to register
   */
  register<TCommand extends ICommand, TResult = void>(
    commandType: string,
    handler: ICommandHandler<TCommand, TResult>
  ): void;

  /**
   * Unregisters a command handler
   * @param commandType - The type of command
   */
  unregister(commandType: string): void;
}

/**
 * Query Bus Interface
 *
 * Dispatches queries to their appropriate handlers.
 * Provides a central point for query execution and
 * optimization opportunities.
 */
export interface IQueryBus {
  /**
   * Sends a query to its handler
   * @param query - The query to send
   * @returns Result containing the query result
   */
  send<TResult>(query: IQuery): Promise<Result<TResult>>;

  /**
   * Registers a query handler
   * @param queryType - The type of query to handle
   * @param handler - The handler to register
   */
  register<TQuery extends IQuery, TResult>(
    queryType: string,
    handler: IQueryHandler<TQuery, TResult>
  ): void;

  /**
   * Unregisters a query handler
   * @param queryType - The type of query
   */
  unregister(queryType: string): void;
}

/**
 * Use Case Context Interface
 *
 * Provides contextual information for use case execution,
 * such as user identity, permissions, correlation IDs, etc.
 */
export interface IUseCaseContext {
  /**
   * Unique identifier for this execution context
   */
  readonly contextId: string;

  /**
   * The user executing the use case (if authenticated)
   */
  readonly userId?: string;

  /**
   * User roles and permissions
   */
  readonly permissions?: string[];

  /**
   * Correlation ID for tracing across services
   */
  readonly correlationId?: string;

  /**
   * Timestamp when the context was created
   */
  readonly createdAt: Date;

  /**
   * Additional metadata
   */
  readonly metadata?: Record<string, unknown>;
}

/**
 * Authorization Service Interface
 *
 * Provides authorization capabilities for use cases.
 * Determines whether a user can perform specific operations.
 */
export interface IAuthorizationService {
  /**
   * Checks if the current user is authorized for the operation
   * @param context - The execution context
   * @param operation - The operation being attempted
   * @param resource - Optional resource being accessed
   * @returns Result indicating authorization success or failure
   */
  authorize(context: IUseCaseContext, operation: string, resource?: unknown): Promise<Result<void>>;

  /**
   * Gets all permissions for a user
   * @param userId - The user ID
   * @returns Result containing the user's permissions
   */
  getUserPermissions(userId: string): Promise<Result<string[]>>;

  /**
   * Checks if a user has a specific permission
   * @param userId - The user ID
   * @param permission - The permission to check
   * @returns Result indicating if the permission exists
   */
  hasPermission(userId: string, permission: string): Promise<Result<boolean>>;
}
