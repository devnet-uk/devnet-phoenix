import { z } from 'zod';
import { Result } from '../../domain/shared/Result';

/**
 * Base Data Transfer Object (DTO)
 *
 * DTOs are used to transfer data between use cases and external layers.
 * They provide a stable contract and handle serialization/deserialization
 * while protecting domain objects from external concerns.
 *
 * Key characteristics:
 * - Simple data containers with no business logic
 * - Validation using Zod schemas
 * - Immutable after creation
 * - Can be easily serialized/deserialized
 */
export abstract class BaseDto {
  /**
   * Validates the DTO using its schema
   * @returns Result indicating validation success or failure
   */
  validate(): Result<void> {
    try {
      const schema = this.getSchema();
      schema.parse(this);
      return Result.ok(undefined);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        return Result.fail(`Validation failed: ${messages.join(', ')}`);
      }
      return Result.fail('Unknown validation error');
    }
  }

  /**
   * Returns the Zod schema for this DTO
   * Subclasses must implement this method
   */
  protected abstract getSchema(): z.ZodSchema;

  /**
   * Converts the DTO to a plain object
   * Useful for serialization
   */
  toJSON(): Record<string, unknown> {
    return JSON.parse(JSON.stringify(this));
  }

  /**
   * Returns a string representation of the DTO
   * Useful for logging and debugging
   */
  toString(): string {
    return `${this.constructor.name}(${JSON.stringify(this.toJSON())})`;
  }

  /**
   * Creates a copy of this DTO with specified changes
   * Since DTOs should be immutable, this creates a new instance
   */
  copyWith(changes: Partial<this>): this {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this, changes);
  }
}

/**
 * Request DTO Base
 *
 * Base class for DTOs that represent input to use cases.
 * Provides additional validation and metadata handling.
 */
export abstract class BaseRequestDto extends BaseDto {
  /**
   * Optional correlation ID for request tracing
   */
  public readonly correlationId?: string;

  /**
   * Timestamp when the request was created
   */
  public readonly createdAt: Date;

  protected constructor(data: { correlationId?: string; createdAt?: Date }) {
    super();
    this.correlationId = data.correlationId;
    this.createdAt = data.createdAt ?? new Date();

    // Freeze to ensure immutability
    Object.freeze(this);
  }

  /**
   * Validates request-specific rules in addition to schema validation
   */
  override validate(): Result<void> {
    // First validate the schema
    const schemaResult = super.validate();
    if (schemaResult.isFailure) {
      return schemaResult;
    }

    // Then validate request-specific business rules
    return this.validateBusinessRules();
  }

  /**
   * Validates business rules specific to this request
   * Override to implement custom business validation
   */
  protected validateBusinessRules(): Result<void> {
    return Result.ok(undefined);
  }

  /**
   * Returns metadata about this request
   */
  getMetadata(): Record<string, unknown> {
    return {
      correlationId: this.correlationId,
      createdAt: this.createdAt.toISOString(),
      requestType: this.constructor.name,
    };
  }
}

/**
 * Response DTO Base
 *
 * Base class for DTOs that represent output from use cases.
 * Provides success/error handling and metadata.
 */
export abstract class BaseResponseDto extends BaseDto {
  /**
   * Indicates if the operation was successful
   */
  public readonly success: boolean;

  /**
   * Error message if the operation failed
   */
  public readonly errorMessage?: string;

  /**
   * Timestamp when the response was created
   */
  public readonly createdAt: Date;

  /**
   * Optional correlation ID from the request
   */
  public readonly correlationId?: string;

  protected constructor(data: {
    success: boolean;
    errorMessage?: string;
    correlationId?: string;
    createdAt?: Date;
  }) {
    super();
    this.success = data.success;
    this.errorMessage = data.errorMessage;
    this.correlationId = data.correlationId;
    this.createdAt = data.createdAt ?? new Date();

    // Freeze to ensure immutability
    Object.freeze(this);
  }

  /**
   * Creates a successful response
   */
  static createSuccess<T extends BaseResponseDto>(
    this: new (
      ...args: any[]
    ) => T,
    data: Omit<T, 'success' | 'errorMessage' | 'createdAt'>
  ): T {
    return new BaseResponseDto({
      ...data,
      success: true,
      createdAt: new Date(),
    } as any);
  }

  /**
   * Creates a failed response
   */
  static createFailure<T extends BaseResponseDto>(
    this: new (
      ...args: any[]
    ) => T,
    errorMessage: string,
    correlationId?: string
  ): T {
    return new BaseResponseDto({
      success: false,
      errorMessage: errorMessage,
      correlationId: correlationId,
      createdAt: new Date(),
    } as any);
  }

  /**
   * Returns metadata about this response
   */
  getMetadata(): Record<string, unknown> {
    return {
      success: this.success,
      correlationId: this.correlationId,
      createdAt: this.createdAt.toISOString(),
      responseType: this.constructor.name,
    };
  }
}

/**
 * Paginated Response DTO
 *
 * Base class for responses that contain paginated data.
 */
export abstract class BasePaginatedResponseDto<TItem> extends BaseResponseDto {
  /**
   * The items for the current page
   */
  public readonly items: TItem[];

  /**
   * Total number of items across all pages
   */
  public readonly totalCount: number;

  /**
   * Current page number (1-based)
   */
  public readonly currentPage: number;

  /**
   * Number of items per page
   */
  public readonly pageSize: number;

  /**
   * Total number of pages
   */
  public readonly totalPages: number;

  protected constructor(data: {
    items: TItem[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    success?: boolean;
    errorMessage?: string;
    correlationId?: string;
    createdAt?: Date;
  }) {
    super({
      success: data.success ?? true,
      errorMessage: data.errorMessage,
      correlationId: data.correlationId,
      createdAt: data.createdAt,
    });

    this.items = [...data.items]; // Create a copy to prevent mutation
    this.totalCount = data.totalCount;
    this.currentPage = data.currentPage;
    this.pageSize = data.pageSize;
    this.totalPages = Math.ceil(data.totalCount / data.pageSize);

    Object.freeze(this.items);
    Object.freeze(this);
  }

  /**
   * Returns true if there is a next page
   */
  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  /**
   * Returns true if there is a previous page
   */
  get hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  /**
   * Returns the number of items on the current page
   */
  get currentPageItemCount(): number {
    return this.items.length;
  }
}
