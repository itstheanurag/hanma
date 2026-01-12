# NestJS v10 Snippets

A comprehensive collection of production-ready code snippets for NestJS v10 applications. Each snippet is self-contained with YAML frontmatter defining dependencies, types, and output file paths.

## Table of Contents

- [Libs](#libs)
  - [Servers](#servers)
  - [Database](#database)
- [Decorators](#decorators)
- [Guards](#guards)
- [Interceptors](#interceptors)
- [Pipes](#pipes)
- [Filters](#filters)
- [Middleware](#middleware)
- [Providers](#providers)
- [Utils](#utils)

---

## Libs

Core libraries and service integrations.

### Servers

Server implementations for different protocols and communication patterns.

#### servers/nest-server.hbs
Production-ready NestJS HTTP server bootstrap with graceful shutdown, global validation pipes, CORS configuration, and shutdown hooks.

**Output:** `main.ts`

**Dependencies:** `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`, `reflect-metadata`

#### servers/nest-websocket.hbs
WebSocket gateway using Socket.io for real-time communication. Includes room management, broadcasting utilities, and connection lifecycle handling.

**Output:** `gateways/websocket.gateway.ts`

**Dependencies:** `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`

#### servers/nest-graphql.hbs
Apollo GraphQL server setup with code-first approach. Includes context creation, custom error formatting, subscriptions configuration, and playground toggle.

**Output:** `graphql/graphql.module.ts`

**Dependencies:** `@nestjs/graphql`, `@nestjs/apollo`, `@apollo/server`, `graphql`

#### servers/nest-microservice.hbs
Hybrid NestJS application with TCP and Redis microservice transports. Demonstrates how to run HTTP server alongside microservices.

**Output:** `main.ts`

**Dependencies:** `@nestjs/microservices`

#### servers/nest-grpc.hbs
gRPC server configuration with proto loading. Includes commented example for controller implementation with unary and streaming methods.

**Output:** `grpc/grpc.options.ts`

**Dependencies:** `@nestjs/microservices`, `@grpc/grpc-js`, `@grpc/proto-loader`

---

### Database

Database clients and ORM integrations as NestJS services.

#### db/prisma-service.hbs
Prisma client as injectable service with lifecycle hooks. Includes health check, connection retry logic, and transaction helper with automatic retry.

**Output:** `providers/prisma.service.ts`

**Dependencies:** `@prisma/client`, `prisma` (dev)

#### db/drizzle-service.hbs
Drizzle ORM service with PostgreSQL connection pool. Includes transaction support, raw SQL execution, and health check.

**Output:** `providers/drizzle.service.ts`

**Dependencies:** `drizzle-orm`, `pg`, `drizzle-kit` (dev)

#### db/redis-service.hbs
Comprehensive Redis client with ioredis. Includes cache-aside pattern, pub/sub, hash operations, and list operations.

**Output:** `providers/redis.service.ts`

**Dependencies:** `ioredis`

#### db/typeorm-service.hbs
TypeORM configuration factory with environment-aware settings. Includes connection pool, SSL support, and migration configuration.

**Output:** `providers/typeorm.config.ts`

**Dependencies:** `@nestjs/typeorm`, `typeorm`, `pg`

#### db/mongoose-service.hbs
MongoDB connection with Mongoose. Includes schema configuration example and connection event handling.

**Output:** `providers/mongoose.config.ts`

**Dependencies:** `@nestjs/mongoose`, `mongoose`

#### db/kafka-service.hbs
Apache Kafka client with producer, consumer, and admin operations. Supports batch publishing, consumer groups, and topic management.

**Output:** `providers/kafka.service.ts`

**Dependencies:** `kafkajs`

---

## Decorators

Custom decorators for metadata annotations.

#### decorators/current-user.hbs
Extract authenticated user from request object. Supports extracting specific properties.

**Output:** `decorators/current-user.decorator.ts`

#### decorators/roles.hbs
Role-based access control decorator with `Role` enum. Supports single role, multiple roles (OR logic), and all roles (AND logic).

**Output:** `decorators/roles.decorator.ts`

#### decorators/public.hbs
Mark routes as public to skip authentication in global guards.

**Output:** `decorators/public.decorator.ts`

#### decorators/api-response.hbs
Swagger decorators for paginated responses, success wrappers, and common error responses.

**Output:** `decorators/api-response.decorator.ts`

**Dependencies:** `@nestjs/swagger`

#### decorators/message.hbs
Enhanced message pattern decorators for microservices with metadata support. Includes versioned and deprecated patterns.

**Output:** `decorators/message.decorator.ts`

**Dependencies:** `@nestjs/microservices`

#### decorators/auth.hbs
Combined authentication decorator applying JWT guard with optional role requirements. Includes `@AdminOnly()` and `@ModeratorOnly()` shortcuts.

**Output:** `decorators/auth.decorator.ts`

---

## Guards

Authentication and authorization guards.

#### guards/jwt-auth.hbs
JWT authentication guard with Passport integration. Supports public route bypass and detailed error messages for token expiration.

**Output:** `guards/jwt-auth.guard.ts`

**Dependencies:** `@nestjs/passport`, `passport`, `passport-jwt`, `jsonwebtoken`

#### guards/roles.hbs
Role-based access control guard. Works with `@Roles()` decorator, supporting both OR and AND logic.

**Output:** `guards/roles.guard.ts`

#### guards/api-key.hbs
API key authentication guard for service-to-service communication. Uses timing-safe comparison and supports multiple extraction methods.

**Output:** `guards/api-key.guard.ts`

#### guards/throttle.hbs
Custom throttler guard with per-route limits via decorator. Includes `@Throttle()` and `@SkipThrottle()` decorators.

**Output:** `guards/throttle.guard.ts`

**Dependencies:** `@nestjs/throttler`

---

## Interceptors

Request/response transformation and cross-cutting concerns.

#### interceptors/logging.hbs
Request/response logging with duration tracking, sensitive data masking, and status-based log levels.

**Output:** `interceptors/logging.interceptor.ts`

#### interceptors/transform.hbs
Response transformation to wrap data in consistent API format. Includes paginated response variant and `@SkipTransform()` decorator.

**Output:** `interceptors/transform.interceptor.ts`

#### interceptors/timeout.hbs
Request timeout handling with configurable duration via `@Timeout()` decorator.

**Output:** `interceptors/timeout.interceptor.ts`

**Dependencies:** `rxjs`

#### interceptors/cache.hbs
HTTP response caching with TTL control, key generation, and `@NoCache()` decorator. Includes cache invalidation service.

**Output:** `interceptors/cache.interceptor.ts`

**Dependencies:** `@nestjs/cache-manager`, `cache-manager`

#### interceptors/serialize.hbs
Response serialization using class-transformer with `@Serialize()` decorator for DTO-based response shaping.

**Output:** `interceptors/serialize.interceptor.ts`

**Dependencies:** `class-transformer`

---

## Pipes

Input validation and transformation.

#### pipes/class-validator.hbs
Validation pipe using class-validator with detailed error formatting. Handles nested validation errors.

**Output:** `pipes/validation.pipe.ts`

**Dependencies:** `class-validator`, `class-transformer`

#### pipes/zod-validation.hbs
Validation pipe using Zod schemas with `@ZodValidate()` decorator and detailed error formatting.

**Output:** `pipes/zod-validation.pipe.ts`

**Dependencies:** `zod`

#### pipes/parse-uuid.hbs
Custom UUID parsing pipe with version validation and optional handling.

**Output:** `pipes/parse-uuid.pipe.ts`

#### pipes/file-validation.hbs
File upload validation for size, MIME type, and extension. Includes presets for images and documents.

**Output:** `pipes/file-validation.pipe.ts`

#### pipes/trim-strings.hbs
Trim whitespace from string fields with include/exclude options and empty-to-null conversion.

**Output:** `pipes/trim-strings.pipe.ts`

---

## Filters

Exception handling filters.

#### filters/http-exception.hbs
Global HTTP exception filter with structured error responses and status-based logging.

**Output:** `filters/http-exception.filter.ts`

#### filters/all-exceptions.hbs
Catch-all exception filter with sanitized logging and production-safe error messages.

**Output:** `filters/all-exceptions.filter.ts`

#### filters/validation.hbs
Validation-specific exception filter with custom `ValidationException` class for field-level errors.

**Output:** `filters/validation.filter.ts`

#### filters/prisma-exception.hbs
Prisma error transformer mapping database error codes to user-friendly HTTP responses.

**Output:** `filters/prisma-exception.filter.ts`

**Dependencies:** `@prisma/client`

---

## Middleware

Express-compatible middleware for NestJS.

#### middleware/request-id.hbs
Request ID generation and propagation for distributed tracing. Supports correlation IDs.

**Output:** `middleware/request-id.middleware.ts`

**Dependencies:** `uuid`

#### middleware/logger.hbs
HTTP request logging middleware with configurable body/header logging and sensitive data masking.

**Output:** `middleware/logger.middleware.ts`

---

## Providers

Injectable services for common patterns.

#### providers/logger.hbs
Custom Winston-based logger service with structured logging, context support, and execution time measurement.

**Output:** `providers/logger.service.ts`

**Dependencies:** `winston`

#### providers/config.hbs
Type-safe configuration service with Zod validation. Environment variable validation at startup with helpful error messages.

**Output:** `providers/config.service.ts`

**Dependencies:** `zod`

#### providers/health.hbs
Health check indicators for databases, Redis, memory, and external APIs. Compatible with `@nestjs/terminus`.

**Output:** `providers/health.service.ts`

**Dependencies:** `@nestjs/terminus`

---

## Utils

Standalone utility functions.

#### utils/pagination.hbs
Pagination DTOs and helpers for both offset and cursor-based pagination. Includes Prisma integration helpers.

**Output:** `utils/pagination.ts`

#### utils/password.hbs
Argon2 password hashing utilities with configurable options. Includes password strength checking and rehash detection.

**Output:** `utils/password.ts`

**Dependencies:** `argon2`

#### utils/crypto.hbs
Encryption utilities using AES-256-GCM. Includes HMAC generation, token creation, and timing-safe comparison.

**Output:** `utils/crypto.ts`

#### utils/slug.hbs
URL-safe slug generation with uniqueness helpers and database collision avoidance factory.

**Output:** `utils/slug.ts`

**Dependencies:** `slugify`

---

## Usage

Each snippet is a Handlebars template (`.hbs`) with YAML frontmatter containing:

```yaml
---
name: snippet-name
description: Brief description
dependencies:
  - runtime-dependency
devDependencies:
  - dev-dependency
files:
  - name: output/path.ts
---
```

The code following the frontmatter delimiter (`---`) is the actual snippet content.

## Installation

Use the Hanma CLI to add snippets to your project:

```bash
# Add a single snippet
hanma add nest-server --framework nest

# Add multiple snippets
hanma add prisma-service redis-service --framework nest
```
