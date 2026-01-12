# Elysia v1 Snippets

Production-ready code snippets for Elysia v1 applications. Each snippet is self-contained with YAML frontmatter defining dependencies, types, and output file paths.

## Table of Contents

- [Libs](#libs)
- [Plugins](#plugins)
- [Middleware](#middleware)
- [Guards](#guards)
- [Utils](#utils)
- [Validation](#validation)
- [Routes](#routes)

---

## Libs

### servers/elysia-basic.hbs
Production-ready Elysia server with Bun-native graceful shutdown, structured errors, and Swagger.

**Output:** `src/index.ts` | **Dependencies:** `elysia`, `@elysiajs/swagger`

---

## Plugins

### plugins/elysia-cors.hbs
CORS configuration with environment-aware origin support.

**Output:** `src/plugins/cors.ts` | **Dependencies:** `@elysiajs/cors`

### plugins/elysia-jwt.hbs
JWT authentication with role-based access control.

**Output:** `src/plugins/jwt.ts` | **Dependencies:** `@elysiajs/jwt`

### plugins/elysia-swagger.hbs
Swagger/OpenAPI documentation generation.

**Output:** `src/plugins/swagger.ts` | **Dependencies:** `@elysiajs/swagger`

### plugins/elysia-bearer.hbs
Bearer token extraction from multiple sources (header, query, cookie).

**Output:** `src/plugins/bearer.ts` | **Dependencies:** `@elysiajs/bearer`

### plugins/elysia-static.hbs
Static file serving with caching and SPA support.

**Output:** `src/plugins/static.ts` | **Dependencies:** `@elysiajs/static`

### plugins/elysia-html.hbs
HTML response helpers for server-side rendering.

**Output:** `src/plugins/html.ts` | **Dependencies:** `@elysiajs/html`

### plugins/elysia-stream.hbs
Server-sent events and streaming responses.

**Output:** `src/plugins/stream.ts` | **Dependencies:** `@elysiajs/stream`

---

## Middleware

### middleware/elysia-logger.hbs
HTTP request logging with timing and sensitive data masking.

**Output:** `src/middleware/logger.ts`

### middleware/elysia-rate-limiter.hbs
In-memory rate limiting with sliding window algorithm. Supports env config.

**Output:** `src/middleware/rate-limiter.ts`

### middleware/elysia-security-headers.hbs
Security headers (CSP, HSTS, X-Frame-Options, etc.).

**Output:** `src/middleware/security-headers.ts`

### middleware/elysia-request-id.hbs
Request ID tracing for distributed logging.

**Output:** `src/middleware/request-id.ts`

### middleware/elysia-error-handler.hbs
Centralized error handling with custom error classes.

**Output:** `src/middleware/error-handler.ts`

### middleware/elysia-timeout.hbs
Request timeout with configurable duration.

**Output:** `src/middleware/timeout.ts`

### middleware/elysia-compression.hbs
Response compression using Bun's native gzip.

**Output:** `src/middleware/compression.ts`

---

## Guards

### guards/elysia-auth-guard.hbs
JWT authentication guard with type-safe user context.

**Output:** `src/guards/auth.ts` | **Dependencies:** `@elysiajs/jwt`

### guards/elysia-api-key-guard.hbs
API key validation with constant-time comparison.

**Output:** `src/guards/api-key.ts`

### guards/elysia-role-guard.hbs
Role-based access control with role hierarchy.

**Output:** `src/guards/role.ts`

### guards/elysia-ownership-guard.hbs
Resource ownership validation for user-specific access.

**Output:** `src/guards/ownership.ts`

---

## Utils

### utils/elysia-pagination.hbs
Cursor and offset pagination with TypeBox schemas.

**Output:** `src/utils/pagination.ts`

### utils/elysia-response.hbs
Standardized API response helpers with type-safe schemas.

**Output:** `src/utils/response.ts`

### utils/elysia-env.hbs
Type-safe environment configuration with validation.

**Output:** `src/utils/env.ts`

### utils/elysia-crypto.hbs
Cryptographic utilities (password hashing, tokens, HMAC).

**Output:** `src/utils/crypto.ts`

### utils/elysia-slug.hbs
URL slug generation with transliteration.

**Output:** `src/utils/slug.ts`

### utils/elysia-date.hbs
Date formatting and timezone utilities.

**Output:** `src/utils/date.ts`

---

## Validation

### validation/elysia-typebox.hbs
Advanced TypeBox patterns with custom validators.

**Output:** `src/validation/typebox.ts`

### validation/elysia-zod.hbs
Zod schema integration with error formatting.

**Output:** `src/validation/zod.ts` | **Dependencies:** `zod`

---

## Routes

### routes/elysia-health.hbs
Comprehensive health checks (liveness, readiness, dependency checks).

**Output:** `src/routes/health.ts`

### routes/elysia-crud.hbs
Generic CRUD route factory with service pattern and hooks.

**Output:** `src/routes/crud.ts`

---

## Usage

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

## Installation

```bash
# Add a single snippet
hanma add elysia-basic --framework elysia

# Add multiple snippets
hanma add elysia-cors elysia-jwt --framework elysia

# Add middleware
hanma add elysia-logger elysia-rate-limiter --framework elysia
```
