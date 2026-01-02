# Fastify v5 Snippets

A comprehensive collection of production-ready code snippets for Fastify v5 applications. Each snippet is self-contained with YAML frontmatter defining dependencies, types, and output file paths.

## Table of Contents

- [Libs](#libs)
  - [Servers](#servers)
  - [API Protocols](#api-protocols)
- [Middleware](#middleware)
- [Utils](#utils)
- [Docs](#docs)

---

## Libs

### Servers

#### libs/fastify-server.hbs
Production-ready Fastify HTTP server with graceful shutdown handlers, health check endpoints, security headers via Helmet, and CORS configuration.

**Output:** `src/server.ts`

**Dependencies:** `fastify`, `@fastify/cors`, `@fastify/helmet`

#### libs/fastify-socket-server.hbs
WebSocket server integration for Fastify using `@fastify/websocket`.

**Output:** `src/libs/socket.ts`

**Dependencies:** `@fastify/websocket`

---

### API Protocols

#### libs/fastify-graphql-server.hbs
Mercurius GraphQL server integration for Fastify.

**Output:** `src/libs/graphql.ts`

**Dependencies:** `mercurius`, `graphql`

---

## Middleware

#### middleware/fastify-jwt.hbs
JWT authentication using `@fastify/jwt` with role-based access control and token generation helpers.

**Output:** `src/middleware/jwt-auth.ts`

**Dependencies:** `fastify`, `@fastify/jwt`

#### middleware/fastify-cors.hbs
Standalone CORS configuration using `@fastify/cors`.

**Output:** `src/plugins/cors.ts`

**Dependencies:** `@fastify/cors`

#### middleware/fastify-helmet.hbs
Security headers using `@fastify/helmet`.

**Output:** `src/plugins/helmet.ts`

**Dependencies:** `@fastify/helmet`

#### middleware/fastify-error-handler.hbs
Structured error handling for Fastify.

**Output:** `src/plugins/error-handler.ts`

#### middleware/fastify-logger.hbs
Pino logger configuration for Fastify.

**Output:** `src/plugins/logger.ts`

#### middleware/fastify-rate-limiter.hbs
Rate limiting for Fastify using `@fastify/rate-limit`.

**Output:** `src/plugins/rate-limit.ts`

**Dependencies:** `@fastify/rate-limit`

#### middleware/fastify-api-key.hbs
API Key authentication middleware.

**Output:** `src/middleware/api-key.ts`

#### middleware/fastify-zod.hbs
Zod validation and serialization for Fastify.

**Output:** `src/plugins/zod.ts`

**Dependencies:** `zod`, `fastify-type-provider-zod`

---

## Utils

#### utils/fastify-compression.hbs
Response compression using `@fastify/compress`.

**Output:** `src/plugins/compression.ts`

**Dependencies:** `@fastify/compress`

#### utils/fastify-request-id.hbs
Request ID generation and propagation.

**Output:** `src/plugins/request-id.ts`

#### utils/fastify-response-time.hbs
Response time header and logging.

**Output:** `src/plugins/response-time.ts`

---

## Docs

#### docs/fastify-swagger.hbs
OpenAPI/Swagger documentation using `@fastify/swagger` and `@fastify/swagger-ui`.

**Output:** `src/plugins/swagger.ts`

**Dependencies:** `@fastify/swagger`, `@fastify/swagger-ui`

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
hanma add fastify-server --framework fastify

# Add multiple snippets
hanma add fastify-jwt fastify-swagger --framework fastify
```
