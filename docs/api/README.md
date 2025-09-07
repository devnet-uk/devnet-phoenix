# Phoenix API Documentation

This directory contains comprehensive API documentation for Phoenix, following contract-driven development principles with end-to-end type safety.

## Overview

Phoenix API is built on **Clean Architecture** principles using:

- **HonoJS 4.9.4+**: Modern, fast web framework for the API layer
- **Zod 4.1+**: Runtime type validation and schema definition
- **TypeScript**: End-to-end type safety from contracts to implementation
- **Contract-Driven Development**: API contracts defined first in `@phoenix/contracts`

## API Structure

```
packages/
├── contracts/              # Type-safe API contracts (source of truth)
│   ├── api/               # HTTP endpoint schemas
│   ├── domain/            # Business domain types
│   └── schemas/           # Reusable validation schemas
├── api/                   # HonoJS API implementation
│   ├── controllers/       # HTTP request handlers
│   ├── middleware/        # Authentication, validation, error handling
│   └── routes/           # Route definitions and OpenAPI specs
└── core/                 # Domain layer (business logic)
```

## Development Workflow

### 1. Contract-First Development

Always define API contracts before implementation:

```typescript
// 1. Define in packages/contracts/api/users.ts
import { z } from 'zod';

export const CreateUserRequest = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100),
  role: z.enum(['user', 'admin']).default('user'),
});

export const CreateUserResponse = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: z.string(),
  createdAt: z.string().datetime(),
});
```

### 2. Implementation in Domain Layer

```typescript
// 2. Implement business logic in packages/core
export class User {
  constructor(
    public readonly id: UserId,
    public readonly email: EmailAddress,
    public readonly name: UserName,
    public readonly role: UserRole,
    public readonly createdAt: Date
  ) {}

  static create(data: CreateUserData): User {
    // Domain validation and business rules
    return new User(/* ... */);
  }
}
```

### 3. API Controller Implementation

```typescript
// 3. Implement HTTP handler in packages/api/controllers
import { Hono } from 'hono';
import { CreateUserRequest, CreateUserResponse } from '@phoenix/contracts/api/users';

const app = new Hono();

app.post('/users', async (c) => {
  // Validate request with contract
  const data = CreateUserRequest.parse(await c.req.json());
  
  // Use domain layer
  const user = User.create(data);
  await userRepository.save(user);
  
  // Return validated response
  return c.json(CreateUserResponse.parse({
    id: user.id.value,
    email: user.email.value,
    name: user.name.value,
    role: user.role.value,
    createdAt: user.createdAt.toISOString(),
  }));
});
```

## API Documentation Structure

### Current Documentation (Phase 0)

- **API Overview**: This document
- **Contract Schemas**: [contracts/](contracts/) - Generated from `@phoenix/contracts`
- **Development Guide**: [development.md](development.md) - Local API development
- **Testing Guide**: [testing.md](testing.md) - API testing strategies

### Planned Documentation (Phase 4+)

- **OpenAPI Specification**: Auto-generated from Hono routes and Zod schemas
- **Authentication Guide**: Better-Auth integration and JWT handling
- **Rate Limiting**: API rate limiting and throttling documentation
- **Error Handling**: Standardized error responses and codes
- **Versioning Strategy**: API versioning approach and backward compatibility

## API Principles

### 1. Type Safety

- **End-to-end types**: From HTTP request to domain layer and back
- **Runtime validation**: Zod schemas validate all inputs and outputs
- **Compile-time safety**: TypeScript ensures type correctness
- **Contract compliance**: Implementation must match defined contracts

### 2. Clean Architecture Compliance

- **Controllers are thin**: Minimal logic, delegate to domain layer
- **Domain independence**: Business logic doesn't know about HTTP
- **Dependency inversion**: Controllers depend on domain abstractions
- **Testability**: Easy to test business logic in isolation

### 3. Error Handling

- **Consistent format**: Standardized error response structure
- **Domain errors**: Business rule violations handled gracefully
- **HTTP status codes**: Appropriate status codes for different error types
- **Client-friendly messages**: Clear error messages for API consumers

### 4. Performance

- **Minimal overhead**: Efficient request processing with Hono
- **Validation caching**: Zod schema compilation optimized
- **Response streaming**: Large responses streamed when appropriate
- **Database optimization**: Efficient queries and connection pooling

## Documentation Generation

### Automatic Generation (Phase 4)

API documentation is automatically generated from:

```typescript
// OpenAPI spec generated from Hono routes and Zod schemas
import { OpenAPIHono } from '@hono/zod-openapi';

const app = new OpenAPIHono();

app.openapi(
  {
    method: 'post',
    path: '/users',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateUserRequest,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: CreateUserResponse,
          },
        },
        description: 'User created successfully',
      },
    },
  },
  async (c) => {
    // Implementation...
  }
);
```

### Manual Documentation

- **Business logic**: Domain concepts and business rules
- **Architecture decisions**: API design choices and trade-offs  
- **Integration guides**: How to consume the API
- **Migration guides**: Version upgrade instructions

## Testing Documentation

### API Testing Levels

1. **Contract Tests**: Verify request/response schemas match contracts
2. **Integration Tests**: Test full HTTP request/response cycle
3. **Domain Tests**: Test business logic in isolation
4. **E2E Tests**: Complete user journey testing

### Testing Tools

- **Vitest**: Unit and integration testing
- **Hono Test Client**: HTTP endpoint testing
- **MSW**: API mocking for frontend tests
- **Playwright**: E2E testing with API calls

## Development Commands

```bash
# API development (Phase 4+)
pnpm --filter @phoenix/api dev     # Start API development server
pnpm --filter @phoenix/api build   # Build API package
pnpm --filter @phoenix/api test    # Run API tests

# Contract development
pnpm --filter @phoenix/contracts build  # Build contract schemas
pnpm --filter @phoenix/contracts test   # Validate contracts

# Documentation generation
pnpm api:docs                      # Generate OpenAPI documentation
pnpm api:types                     # Generate TypeScript types
```

## API Endpoints (Planned)

### Authentication
- `POST /auth/login` - User authentication
- `POST /auth/logout` - Session termination  
- `POST /auth/refresh` - Token refresh
- `GET /auth/me` - Current user profile

### Users
- `GET /users` - List users (paginated)
- `POST /users` - Create user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Organizations (Phase 2+)
- `GET /orgs` - List organizations
- `POST /orgs` - Create organization
- `GET /orgs/:id` - Get organization
- `PUT /orgs/:id` - Update organization

*Note: Full API endpoints will be documented as they are implemented in Phase 4.*

## Security

### Authentication
- **Better-Auth**: Robust authentication with multiple providers
- **JWT tokens**: Stateless authentication for API access
- **Session management**: Secure session handling
- **Role-based access**: RBAC for different user types

### Input Validation
- **Schema validation**: All inputs validated with Zod
- **Sanitization**: XSS prevention through proper escaping
- **Rate limiting**: API abuse prevention
- **Request size limits**: Protection against large payload attacks

## Performance Monitoring

### Metrics (Phase 6+)
- **Response times**: < 200ms target for API endpoints
- **Throughput**: Requests per second under load
- **Error rates**: 4xx/5xx error monitoring
- **Database queries**: Query performance and N+1 detection

### Monitoring Tools
- **Application metrics**: Prometheus/Grafana integration
- **Error tracking**: Centralized error logging
- **Performance profiling**: Request tracing and bottleneck identification

---

**Status**: 📋 Phase 0 - Documentation Preparation  
**Next**: Phase 4 - Interface Adapters Implementation  
**API Server**: http://localhost:4001 (when implemented)