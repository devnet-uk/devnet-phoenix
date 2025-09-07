import { Result } from '../domain/shared/Result';
import type { IAuthorizationService, IUseCase, IUseCaseContext } from './IUseCase';

/**
 * Base Use Case Implementation
 *
 * Provides common functionality for all use cases including
 * authorization, validation, logging, and error handling.
 *
 * Subclasses should implement the executeImpl method with
 * their specific business logic.
 */
export abstract class BaseUseCase<TRequest, TResponse> implements IUseCase<TRequest, TResponse> {
  protected constructor(protected readonly authorizationService?: IAuthorizationService) {}

  /**
   * Executes the use case with proper error handling, authorization, and validation
   * @param request - The input data for the use case
   * @param context - Optional execution context
   * @returns Result containing the response or error
   */
  async execute(request: TRequest, context?: IUseCaseContext): Promise<Result<TResponse>> {
    try {
      // Input validation
      const validationResult = await this.validateRequest(request);
      if (validationResult.isFailure) {
        return Result.fail(validationResult.error!);
      }

      // Authorization check
      if (context && this.authorizationService) {
        const authResult = await this.checkAuthorization(request, context);
        if (authResult.isFailure) {
          return Result.fail(authResult.error!);
        }
      }

      // Pre-execution hook
      const preExecutionResult = await this.preExecution(request, context);
      if (preExecutionResult.isFailure) {
        return Result.fail(preExecutionResult.error!);
      }

      // Execute the main logic
      const result = await this.executeImpl(request, context);

      // Post-execution hook
      if (result.isSuccess) {
        const postExecutionResult = await this.postExecution(request, result.value, context);
        if (postExecutionResult.isFailure) {
          return Result.fail(postExecutionResult.error!);
        }
      }

      return result;
    } catch (error) {
      // Handle unexpected errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      return Result.fail(`Unexpected error in ${this.getUseCaseName()}: ${errorMessage}`);
    }
  }

  /**
   * Implements the core business logic of the use case
   * Subclasses must implement this method
   */
  protected abstract executeImpl(
    request: TRequest,
    context?: IUseCaseContext
  ): Promise<Result<TResponse>>;

  /**
   * Validates the input request
   * Override to implement custom validation logic
   */
  protected async validateRequest(request: TRequest): Promise<Result<void>> {
    if (request === null || request === undefined) {
      return Result.fail('Request cannot be null or undefined');
    }
    return Result.ok(undefined);
  }

  /**
   * Performs authorization check
   * Override to implement custom authorization logic
   */
  protected async checkAuthorization(
    request: TRequest,
    context: IUseCaseContext
  ): Promise<Result<void>> {
    if (!this.authorizationService) {
      return Result.ok(undefined);
    }

    const operation = this.getRequiredPermission(request);
    if (!operation) {
      return Result.ok(undefined);
    }

    return this.authorizationService.authorize(context, operation, request);
  }

  /**
   * Returns the permission required to execute this use case
   * Override to specify required permissions
   */
  protected getRequiredPermission(_request: TRequest): string | undefined {
    return undefined;
  }

  /**
   * Hook that runs before the main execution
   * Useful for setup, additional validation, etc.
   */
  protected async preExecution(
    _request: TRequest,
    _context?: IUseCaseContext
  ): Promise<Result<void>> {
    return Result.ok(undefined);
  }

  /**
   * Hook that runs after successful execution
   * Useful for cleanup, notifications, logging, etc.
   */
  protected async postExecution(
    _request: TRequest,
    _response: TResponse,
    _context?: IUseCaseContext
  ): Promise<Result<void>> {
    return Result.ok(undefined);
  }

  /**
   * Returns the name of this use case for logging and error messages
   */
  protected getUseCaseName(): string {
    return this.constructor.name;
  }

  /**
   * Creates a standardized error result for this use case
   */
  protected createError(message: string, details?: unknown): Result<TResponse> {
    const errorMessage = `${this.getUseCaseName()}: ${message}`;
    if (details) {
    }
    return Result.fail(errorMessage);
  }

  /**
   * Handles domain validation errors
   */
  protected handleDomainError(error: string | Error): Result<TResponse> {
    const message = error instanceof Error ? error.message : error;
    return this.createError(`Domain validation failed: ${message}`);
  }

  /**
   * Handles repository/infrastructure errors
   */
  protected handleInfrastructureError(error: string | Error): Result<TResponse> {
    const message = error instanceof Error ? error.message : error;
    return this.createError(`Infrastructure error: ${message}`);
  }
}

/**
 * Command Use Case Base
 *
 * Specialized base class for command use cases that modify system state.
 * Provides additional hooks for transaction management and event handling.
 */
export abstract class BaseCommandUseCase<TRequest, TResponse = void> extends BaseUseCase<
  TRequest,
  TResponse
> {
  protected constructor(authorizationService?: IAuthorizationService) {
    super(authorizationService);
  }

  /**
   * Override execute to add transaction support
   */
  override async execute(request: TRequest, context?: IUseCaseContext): Promise<Result<TResponse>> {
    // Commands typically require authentication
    if (!context?.userId && this.requiresAuthentication()) {
      return Result.fail('Authentication required for this operation');
    }

    return super.execute(request, context);
  }

  /**
   * Indicates whether this command requires authentication
   * Override to specify authentication requirements
   */
  protected requiresAuthentication(): boolean {
    return true;
  }

  /**
   * Hook for transaction management
   * Override to implement transaction boundaries
   */
  protected async executeInTransaction(
    operation: () => Promise<Result<TResponse>>
  ): Promise<Result<TResponse>> {
    // Default implementation just executes the operation
    // Override to add transaction support
    return operation();
  }
}

/**
 * Query Use Case Base
 *
 * Specialized base class for query use cases that read system state.
 * Optimized for read operations and may have different authorization rules.
 */
export abstract class BaseQueryUseCase<TRequest, TResponse> extends BaseUseCase<
  TRequest,
  TResponse
> {
  protected constructor(authorizationService?: IAuthorizationService) {
    super(authorizationService);
  }

  /**
   * Queries may have more lenient authentication requirements
   */
  protected requiresAuthentication(): boolean {
    return false;
  }

  /**
   * Hook for caching support
   * Override to implement caching strategies
   */
  protected async executeWithCaching(
    _cacheKey: string,
    operation: () => Promise<Result<TResponse>>
  ): Promise<Result<TResponse>> {
    // Default implementation just executes the operation
    // Override to add caching support
    return operation();
  }

  /**
   * Generates a cache key for this query
   * Override to implement custom cache key generation
   */
  protected generateCacheKey(request: TRequest): string {
    return `${this.getUseCaseName()}_${JSON.stringify(request)}`;
  }
}
