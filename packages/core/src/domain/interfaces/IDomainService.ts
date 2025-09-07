import type { Result } from '../shared/Result';

/**
 * Base Domain Service Interface
 *
 * Domain Services represent operations that don't naturally belong to any
 * specific Entity or Value Object. They encapsulate domain logic that
 * spans multiple aggregates or requires external dependencies.
 *
 * Key characteristics:
 * - Stateless operations
 * - Express domain concepts
 * - Depend only on domain interfaces
 * - Return Results for explicit error handling
 */
export interface IDomainService {
  /**
   * Returns the name/type of this domain service
   * Useful for logging, debugging, and dependency injection
   */
  readonly serviceName: string;
}

/**
 * Domain Event Handler Interface
 *
 * Handles domain events within the same bounded context.
 * Event handlers represent domain reactions to events and should
 * contain domain logic.
 */
export interface IDomainEventHandler<TEvent> {
  /**
   * Handles the specified domain event
   * @param event - The domain event to handle
   * @returns Result indicating success or failure of handling
   */
  handle(event: TEvent): Promise<Result<void>>;

  /**
   * Returns true if this handler can handle the given event type
   * @param eventType - The event type to check
   */
  canHandle(eventType: string): boolean;

  /**
   * Returns the priority of this handler (lower numbers = higher priority)
   * Used for ordering handlers when multiple handlers exist for the same event
   */
  readonly priority: number;
}

/**
 * Domain Event Dispatcher Interface
 *
 * Coordinates the publishing and handling of domain events within
 * the domain layer. This maintains the separation between domain
 * logic and infrastructure concerns.
 */
export interface IDomainEventDispatcher {
  /**
   * Registers an event handler for a specific event type
   * @param eventType - The type of event to handle
   * @param handler - The handler to register
   */
  register<TEvent>(eventType: string, handler: IDomainEventHandler<TEvent>): void;

  /**
   * Unregisters an event handler
   * @param eventType - The type of event
   * @param handler - The handler to unregister
   */
  unregister<TEvent>(eventType: string, handler: IDomainEventHandler<TEvent>): void;

  /**
   * Dispatches an event to all registered handlers
   * @param event - The event to dispatch
   * @returns Result indicating success or failure of dispatching
   */
  dispatch<TEvent>(event: TEvent): Promise<Result<void>>;

  /**
   * Clears all registered handlers
   */
  clear(): void;

  /**
   * Returns the number of handlers registered for a specific event type
   * @param eventType - The event type to check
   */
  getHandlerCount(eventType: string): number;
}

/**
 * Factory Interface
 *
 * Encapsulates the knowledge needed to create complex domain objects
 * that require specific construction logic or validation.
 */
export interface IFactory<TProduct> {
  /**
   * Creates a new instance of the product
   * @param args - Arguments needed for creation
   * @returns Result containing the created product or failure
   */
  create(...args: unknown[]): Result<TProduct>;

  /**
   * Reconstructs a product from stored data (e.g., from repository)
   * @param data - The stored data
   * @returns Result containing the reconstructed product or failure
   */
  reconstruct(data: unknown): Result<TProduct>;

  /**
   * Validates that the given data can be used to create/reconstruct a product
   * @param data - The data to validate
   * @returns Result indicating validation success or failure
   */
  validate(data: unknown): Result<void>;
}

/**
 * Policy Interface
 *
 * Represents a business policy or rule that can be evaluated.
 * Policies are reusable business rules that can be combined
 * and applied in different contexts.
 */
export interface IPolicy<TInput> {
  /**
   * Evaluates the policy against the given input
   * @param input - The input to evaluate
   * @returns Result indicating whether the policy is satisfied and any details
   */
  evaluate(input: TInput): Result<boolean>;

  /**
   * Returns a human-readable description of this policy
   */
  getDescription(): string;

  /**
   * Returns the unique identifier for this policy
   */
  getPolicyId(): string;
}

/**
 * Composite Policy Interface
 *
 * Allows combining multiple policies using logical operators
 */
export interface ICompositePolicy<TInput> extends IPolicy<TInput> {
  /**
   * Adds a policy that must be satisfied (AND logic)
   * @param policy - The policy to add
   * @returns This policy for method chaining
   */
  and(policy: IPolicy<TInput>): ICompositePolicy<TInput>;

  /**
   * Adds a policy where at least one must be satisfied (OR logic)
   * @param policy - The policy to add
   * @returns This policy for method chaining
   */
  or(policy: IPolicy<TInput>): ICompositePolicy<TInput>;

  /**
   * Negates the result of the policy evaluation
   * @returns A new policy that represents the negation
   */
  not(): ICompositePolicy<TInput>;

  /**
   * Gets all individual policies that make up this composite
   */
  getPolicies(): IPolicy<TInput>[];
}

/**
 * Domain Validator Interface
 *
 * Provides validation services for domain objects and business rules.
 * Validators ensure that domain objects maintain their invariants.
 */
export interface IDomainValidator<TTarget> {
  /**
   * Validates the target object
   * @param target - The object to validate
   * @returns Result containing validation success or detailed failure information
   */
  validate(target: TTarget): Result<void>;

  /**
   * Returns all validation rules that apply to the target type
   */
  getRules(): string[];

  /**
   * Adds a custom validation rule
   * @param ruleName - Name of the rule
   * @param rule - The validation function
   */
  addRule(ruleName: string, rule: (target: TTarget) => Result<void>): void;

  /**
   * Removes a validation rule
   * @param ruleName - Name of the rule to remove
   */
  removeRule(ruleName: string): void;
}
