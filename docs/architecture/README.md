# Phoenix Architecture Documentation

Phoenix implements **Clean Architecture** with **Domain-Driven Design** principles, targeting 10/10 architectural compliance with continuous verification through the embedded verification framework.

## Architectural Overview

Phoenix is built as a modern SaaS foundation with enterprise-grade patterns:

- **436+ planned features** across 7 development phases
- **98% test coverage** requirement (100% domain, 95% infrastructure/UI)
- **Clean Architecture compliance** with strict dependency rules
- **Embedded verification** for continuous standards compliance
- **Contract-driven development** with end-to-end type safety

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Web Application                          │
│                 (apps/web - Next.js)                       │
│              ┌─────────────────────────────┐                │
│              │    Feature-Sliced Design    │                │
│              │  ┌─────┐ ┌─────┐ ┌─────┐   │                │
│              │  │Pages│ │Widet│ │Entit│   │                │
│              │  └─────┘ └─────┘ └─────┘   │                │
│              └─────────────────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│               Interface Adapters Layer                      │
│                 (packages/api - HonoJS)                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │ Controllers │ │ Presenters  │ │  Gateways   │         │
│  └─────────────┘ └─────────────┘ └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Use Cases Layer                           │
│               (Application Services)                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │   User      │ │    Auth     │ │ Billing     │         │
│  │ Use Cases   │ │ Use Cases   │ │ Use Cases   │         │
│  └─────────────┘ └─────────────┘ └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Domain Layer                              │
│                 (packages/core)                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │  Entities   │ │   Value     │ │   Domain    │         │
│  │             │ │  Objects    │ │  Services   │         │
│  └─────────────┘ └─────────────┘ └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Clean Architecture Layers

### 1. Domain Layer (`packages/core`)
**The heart of Phoenix - 100% test coverage required**

```typescript
// Pure business logic, zero framework dependencies
export class User {
  constructor(
    public readonly id: UserId,
    public readonly email: EmailAddress,
    public readonly profile: UserProfile
  ) {
    // Domain invariants enforced here
    if (!email.isValid()) {
      throw new InvalidEmailError(email.value);
    }
  }

  changeEmail(newEmail: EmailAddress): DomainEvent[] {
    // Business rules implemented here
    return [new UserEmailChangedEvent(this.id, this.email, newEmail)];
  }
}
```

**Contains**:
- **Entities**: Core business objects with identity
- **Value Objects**: Immutable objects without identity  
- **Domain Services**: Business logic that doesn't belong to entities
- **Domain Events**: Business event notifications
- **Repositories** (interfaces): Data persistence abstractions

**Rules**:
- ✅ Zero dependencies on other layers or frameworks
- ✅ Contains only business logic
- ✅ 100% test coverage required
- ✅ Immutable by default
- ✅ Rich domain models, not anemic data structures

### 2. Use Cases Layer (Application Services)
**Business workflows and application logic**

```typescript
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: DomainEventPublisher
  ) {}

  async execute(command: CreateUserCommand): Promise<UserCreatedResponse> {
    // Application workflow orchestration
    const user = User.create(command.email, command.profile);
    await this.userRepository.save(user);
    
    const events = user.getUncommittedEvents();
    await this.eventPublisher.publishAll(events);
    
    return UserCreatedResponse.fromDomain(user);
  }
}
```

**Contains**:
- **Application Services**: Workflow orchestration
- **Commands/Queries**: Input data structures
- **Application Events**: Cross-boundary notifications
- **DTOs**: Data transfer objects

**Rules**:
- ✅ Depends only on Domain layer
- ✅ Orchestrates business workflows
- ✅ No business logic (delegates to domain)
- ✅ Handles transaction boundaries

### 3. Interface Adapters (`packages/api`)
**Translate between external world and use cases**

```typescript
// Controller (Interface Adapter)
export class UserController {
  constructor(private readonly createUser: CreateUserUseCase) {}

  async create(c: Context): Promise<Response> {
    const request = CreateUserRequest.parse(await c.req.json());
    const command = CreateUserCommand.fromRequest(request);
    
    const result = await this.createUser.execute(command);
    
    return c.json(CreateUserResponse.fromResult(result));
  }
}
```

**Contains**:
- **Controllers**: HTTP request handlers
- **Presenters**: Format output for UI
- **Gateways**: External service adapters
- **Repository Implementations**: Database adapters

**Rules**:
- ✅ Depends on Use Cases and Domain layers
- ✅ Converts external formats to internal formats
- ✅ No business logic
- ✅ Framework-specific code allowed here

### 4. Frameworks Layer (`apps/web`)
**External interfaces and frameworks**

```typescript
// Next.js page (Frameworks layer)
export default function UsersPage() {
  const { data: users, isLoading } = useUsers();
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div>
      <h1>Users</h1>
      <UserList users={users} />
    </div>
  );
}
```

**Contains**:
- **Web Framework**: Next.js, React components
- **Database**: PostgreSQL, Drizzle ORM configurations
- **External Services**: Third-party integrations
- **Infrastructure**: Deployment configurations

**Rules**:
- ✅ Can depend on all inner layers
- ✅ Contains framework-specific code
- ✅ No business logic
- ✅ Main function assembles the application

## Dependency Rule

**The most important rule in Clean Architecture:**

> **Dependencies point inward only. Inner layers know nothing about outer layers.**

```
Domain Layer ← Use Cases ← Interface Adapters ← Frameworks
    │              │              │                │
    │              │              │                ├─ Next.js
    │              │              ├─ Controllers   ├─ PostgreSQL
    │              ├─ Use Cases   ├─ Gateways      └─ External APIs
    └─ Entities    └─ Commands    └─ Presenters
    └─ Value Objects
    └─ Domain Services
```

## Package Structure

```
packages/
├── core/                      # Domain Layer
│   ├── entities/              # Domain entities
│   ├── value-objects/         # Value objects
│   ├── services/              # Domain services
│   ├── events/                # Domain events
│   └── repositories/          # Repository interfaces
├── use-cases/                 # Application Layer
│   ├── commands/              # Input commands
│   ├── queries/               # Query objects
│   └── services/              # Application services
├── infrastructure/            # Infrastructure Layer
│   ├── repositories/          # Repository implementations
│   ├── services/              # External service adapters
│   └── database/              # Database configurations
├── api/                       # Interface Adapters
│   ├── controllers/           # HTTP controllers
│   ├── middleware/            # HTTP middleware
│   └── presenters/            # Response formatters
├── contracts/                 # Shared Contracts
│   ├── api/                   # API contracts
│   ├── domain/                # Domain types
│   └── schemas/               # Validation schemas
└── ui/                        # UI Components
    ├── components/            # React components
    ├── hooks/                 # React hooks
    └── tokens/                # Design tokens
```

## Architecture Principles

### 1. Single Responsibility Principle
Each class/module has one reason to change.

### 2. Open/Closed Principle
Open for extension, closed for modification.

### 3. Liskov Substitution Principle
Subtypes must be substitutable for their base types.

### 4. Interface Segregation Principle
Clients shouldn't depend on interfaces they don't use.

### 5. Dependency Inversion Principle
Depend on abstractions, not concretions.

## Testing Strategy

### Domain Layer (100% Coverage)
```typescript
describe('User Entity', () => {
  it('should create user with valid email', () => {
    const email = EmailAddress.create('user@example.com');
    const user = User.create(email, userProfile);
    
    expect(user.email.value).toBe('user@example.com');
  });
  
  it('should throw error for invalid email', () => {
    expect(() => {
      EmailAddress.create('invalid-email');
    }).toThrow(InvalidEmailError);
  });
});
```

### Use Cases Layer (95% Coverage)
```typescript
describe('CreateUserUseCase', () => {
  it('should create user and publish events', async () => {
    const useCase = new CreateUserUseCase(mockRepository, mockPublisher);
    
    const result = await useCase.execute(createUserCommand);
    
    expect(mockRepository.save).toHaveBeenCalledWith(expect.any(User));
    expect(mockPublisher.publishAll).toHaveBeenCalled();
  });
});
```

### Integration Tests (95% Coverage)
```typescript
describe('User API', () => {
  it('should create user via HTTP', async () => {
    const response = await request(app)
      .post('/users')
      .send({ email: 'user@example.com', name: 'John' });
    
    expect(response.status).toBe(201);
    expect(response.body.email).toBe('user@example.com');
  });
});
```

## Architecture Verification

Phoenix uses embedded verification to continuously monitor architecture compliance:

### Dependency Direction Verification
```bash
# Automated checks ensure dependency rule compliance
✅ Domain layer has zero external dependencies
✅ Use cases depend only on domain layer  
✅ Interface adapters don't leak to domain
✅ Frameworks layer properly isolated
```

### Coverage Verification
```bash
# Coverage thresholds enforced automatically
✅ Domain layer: 100% coverage (strict requirement)
✅ Use cases: 95% coverage minimum
✅ Interface adapters: 95% coverage minimum
✅ Overall coverage: 98% (greenfield standard)
```

### Type Safety Verification
```bash
# TypeScript strict mode enforced
✅ No any types in domain layer
✅ Strict null checks enabled
✅ No implicit returns
✅ Exact optional property types
```

## Architecture Evolution

### Phase 0: Infrastructure Setup ✅
- Package structure established
- Dependency rules configured
- Testing framework setup
- Embedded verification active

### Phase 1: Domain Layer (Next)
- Pure domain entities
- Value objects with validation
- Domain services
- 100% test coverage

### Phase 2-4: Outer Layers
- Use cases and application services
- Infrastructure implementations  
- API controllers and endpoints

### Phase 5: User Interface
- Feature-Sliced Design in Next.js
- Component library integration
- E2E testing implementation

## Common Patterns

### Repository Pattern
```typescript
// Domain layer interface
export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | null>;
}

// Infrastructure implementation
export class PostgresUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    // Database-specific implementation
  }
}
```

### Command Pattern
```typescript
export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly name: string
  ) {}
}
```

### Event Sourcing Preparation
```typescript
export abstract class DomainEvent {
  public readonly occurredAt = new Date();
  public readonly eventId = uuid();
}

export class UserCreatedEvent extends DomainEvent {
  constructor(public readonly userId: UserId) {
    super();
  }
}
```

## Anti-Patterns to Avoid

### ❌ Anemic Domain Models
```typescript
// Bad: No behavior, just data
export class User {
  public id: string;
  public email: string;
}
```

### ❌ Framework Leakage
```typescript
// Bad: Express types in domain layer
export class UserService {
  createUser(req: express.Request): User {
    // Business logic mixed with framework
  }
}
```

### ❌ Dependency Rule Violations
```typescript
// Bad: Domain depending on infrastructure
import { Database } from '../infrastructure/database';

export class User {
  save(): void {
    Database.save(this); // Violation!
  }
}
```

---

**Architecture Status**: ✅ Phase 0 Complete - Foundation Established  
**Next Phase**: Phase 1 - Core Domain Layer Implementation  
**Compliance Target**: 10/10 Clean Architecture Score  
**Coverage Target**: 98% Overall (100% Domain)