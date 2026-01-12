# Hono v4 Snippets

A comprehensive collection of production-ready code snippets for Hono v4 applications. Each snippet is self-contained with YAML frontmatter defining dependencies, types, and output file paths.

## Table of Contents

- [Libs](#libs)
  - [Servers](#servers)
- [Middleware](#middleware)
- [Docs](#docs)

---

## Libs

### Servers

#### servers/hono-basic.hbs
Production-ready Hono server for Node.js with security headers, timing, request ID generation, logging, and graceful shutdown. Includes comprehensive health check endpoints.

**Output:** `src/index.ts`

**Dependencies:** `hono`, `@hono/node-server`

#### servers/hono-bun.hbs
Hono server optimized for the Bun runtime.

**Output:** `src/index.ts`

#### servers/hono-cloudflare-workers.hbs
Hono server setup for Cloudflare Workers.

**Output:** `src/index.ts`

#### servers/hono-deno.hbs
Hono server setup for the Deno runtime.

**Output:** `src/index.ts`

#### servers/hono-lambda.hbs
Hono server setup for AWS Lambda.

**Output:** `src/index.ts`

#### servers/hono-vercel.hbs
Hono server setup for Vercel Edge functions.

**Output:** `src/index.ts`

---

## Middleware

#### middleware/hono-cors.hbs
CORS middleware with environment-aware origins and exposing standardized headers.

**Output:** `src/middleware/cors.ts`

#### middleware/hono-error-handler.hbs
Global error handler for Hono providing structured JSON responses and environment-aware error exposure.

**Output:** `src/middleware/error-handler.ts`

#### middleware/hono-jwt.hbs
JWT authentication with Role-Based Access Control (RBAC) and detailed error handling.

**Output:** `src/middleware/auth.ts`

#### middleware/hono-logger.hbs
Structured request logging middleware.

**Output:** `src/middleware/logger.ts`

#### middleware/hono-rate-limiter.hbs
Rate limiting middleware for Hono to prevent abuse.

**Output:** `src/middleware/rate-limiter.ts`

#### middleware/hono-security.hbs
Security headers using Hono's `secureHeaders` middleware.

**Output:** `src/middleware/security.ts`

#### middleware/hono-zod.hbs
Request validation middleware using Zod schemas for body, query, and params.

**Output:** `src/middleware/validation.ts`

**Dependencies:** `zod`, `@hono/zod-validator`

---

## Docs

#### docs/swagger.hbs
Swagger UI setup for Hono using `@hono/swagger-ui`.

**Output:** `src/docs/swagger.ts`

**Dependencies:** `@hono/swagger-ui`

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

## Installation

Use the Hanma CLI to add snippets to your project:

```bash
# Add a single snippet
hanma add hono-basic --framework hono

# Add multiple snippets
hanma add hono-jwt hono-zod --framework hono
```
