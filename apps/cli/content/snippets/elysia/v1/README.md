# Elysia v1 Snippets

A collection of production-ready code snippets for Elysia v1 applications. Each snippet is self-contained with YAML frontmatter defining dependencies, types, and output file paths.

## Table of Contents

- [Libs](#libs)
  - [Servers](#servers)
  - [HTTP Clients](#http-clients)
- [Plugins](#plugins)

---

## Libs

Core libraries and service integrations.

### Servers

#### servers/elysia-basic.hbs
Production-ready Elysia server with Bun-native graceful shutdown, structured errors, and Swagger documentation. Includes health check endpoints.

**Output:** `src/index.ts`

**Dependencies:** `elysia`, `@elysiajs/swagger`

---

### HTTP Clients

#### http-client.hbs
Type-safe HTTP client wrapper using Axios with automatic retry logic and exponential backoff.

**Output:** `src/libs/http-client.ts`

**Dependencies:** `axios`

---

## Plugins

#### plugins/elysia-cors.hbs
CORS plugin configuration for Elysia with environment-aware origin support.

**Output:** `src/plugins/cors.ts`

**Dependencies:** `@elysiajs/cors`

#### plugins/elysia-jwt.hbs
JWT authentication plugin for Elysia using `@elysiajs/jwt`. Includes setup for secret management and expiration.

**Output:** `src/plugins/jwt.ts`

**Dependencies:** `@elysiajs/jwt`

#### plugins/elysia-swagger.hbs
Swagger documentation plugin setup for Elysia. Generates OpenAPI 3.0 documentation for your API.

**Output:** `src/plugins/swagger.ts`

**Dependencies:** `@elysiajs/swagger`

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
hanma add elysia-basic --framework elysia

# Add multiple snippets
hanma add elysia-cors elysia-jwt --framework elysia
```
