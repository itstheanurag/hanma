# Express v5 Snippets

A comprehensive collection of production-ready code snippets for Express.js v5 applications. Each snippet is self-contained with YAML frontmatter defining dependencies, types, and output file paths.

## Table of Contents

- [Libs](#libs)
  - [Servers](#servers)
  - [Database Clients](#database-clients)
  - [Queries / Storage](#queries--storage)
  - [Uploads](#uploads)
  - [Mailers](#mailers)
  - [External Services](#external-services)
  - [Core Utilities](#core-utilities)
- [Middleware](#middleware)
  - [Authentication](#authentication)
  - [Security](#security)
  - [Logging](#logging)
  - [Utilities](#utilities)
  - [Passwords](#passwords)
- [Routes](#routes)
- [Utils](#utils)

---

## Libs

Core libraries and service integrations.

### Servers

Server implementations for different protocols and frameworks.

#### servers/express-server.hbs
Production-ready Express HTTP server setup with graceful shutdown handling. Includes middleware configuration (JSON parsing, CORS, Helmet), health check endpoint, error handling, and signal handlers for SIGTERM/SIGINT. Tracks active connections and forces closure after a 10-second grace period.

**Output:** `libs/server.ts`

**Dependencies:** `express`, `cors`, `helmet`

#### servers/socket-server.hbs
Socket.io server setup with optional JWT authentication. Supports configurable CORS, token validation on connection handshake, and typed socket interfaces. Logs connection details including transport type and client IP.

**Output:** `libs/servers/socket-server.ts`

**Dependencies:** `socket.io`, `jsonwebtoken`

#### servers/graphql-server.hbs
Apollo GraphQL server with Express integration. Includes type definitions, resolvers, context creation for authentication, graceful shutdown plugin, and introspection control for production. Provides health check endpoint alongside GraphQL.

**Output:** `libs/servers/graphql-server.ts`

**Dependencies:** `@apollo/server`, `graphql`

#### servers/trpc-server.hbs
tRPC server with Express adapter for end-to-end typesafe APIs. Includes Zod validation, public and protected procedures, authentication middleware, nested routers, and error formatting. Exports router type for client inference.

**Output:** `libs/servers/trpc-server.ts`

**Dependencies:** `@trpc/server`, `zod`

#### servers/grpc-server.hbs
gRPC server using @grpc/grpc-js with proto-loader. Demonstrates all four RPC patterns: unary, server streaming, client streaming, and bidirectional streaming. Includes health check service implementation and graceful shutdown handling.

**Output:** `libs/servers/grpc-server.ts`

**Dependencies:** `@grpc/grpc-js`, `@grpc/proto-loader`

#### servers/http-server.hbs
Native Node.js HTTP server without Express. Includes custom router with path parameter support, JSON body parsing, CORS headers, and structured response helpers. Zero external dependencies for minimal footprint.

**Output:** `libs/servers/http-server.ts`

---

### Core Utilities

#### cors.hbs
CORS middleware configuration with environment variable support. Reads allowed origins, methods, and headers from environment variables. Includes origin validation, credentials support, and configuration validation utilities.

**Output:** `libs/cors.ts`

#### env-validation.hbs
Type-safe environment variable validation using Zod schemas. Validates required environment variables at startup and exits with detailed error messages if validation fails. Ensures runtime type safety for configuration values.

**Output:** `config/env.ts`

#### upload-multer.hbs
File upload configuration using Multer. Includes disk storage with unique filenames, file type filtering (images by default), and size limits. Configurable destination directory and extension handling.

**Output:** `config/upload.ts`

#### http-client.hbs
HTTP client wrapper using Axios with automatic retry logic and exponential backoff. Includes request/response interceptors, duration logging, configurable retry count, and type-safe request helpers for GET, POST, PUT, PATCH, DELETE operations.

**Output:** `libs/http-client.ts`

---

### Database Clients

#### db/prisma-client.hbs
Prisma ORM client setup with singleton pattern to prevent multiple instances during hot reloading. Includes connection retry logic with configurable attempts and delay, graceful disconnect, and health check query. Environment-aware logging (verbose in development, errors only in production).

**Output:** `libs/db/prisma.ts`

**Dependencies:** `@prisma/client`, `prisma` (dev)

#### db/drizzle-client.hbs
Drizzle ORM client with PostgreSQL connection pool. Configures pool size, idle timeout, and connection timeout. Includes connect/disconnect functions, health check, and transaction helper with proper typing support.

**Output:** `libs/db/drizzle.ts`

**Dependencies:** `drizzle-orm`, `pg`, `drizzle-kit` (dev)

#### db/redis-client.hbs
Redis client using ioredis with automatic retry strategy and exponential backoff. Includes connection event handlers, cache helpers with JSON serialization (get, set with TTL, delete, exists), and health check using PING command.

**Output:** `libs/db/redis.ts`

**Dependencies:** `ioredis`

---

### Queries / Storage

Generic Storage classes providing standardized CRUD operations, bulk operations, and pagination for various ORMs and database drivers.

#### queries/drizzle-storage.hbs
Generic Storage class for Drizzle ORM with type-safe operations. Includes filter builders with multiple operators (eq, neq, gt, gte, lt, lte, like, ilike), cursor and offset pagination, and bulk operations.

**Output:** `libs/queries/drizzle-storage.ts`

**Dependencies:** `drizzle-orm`, `pg`

#### queries/prisma-storage.hbs
Generic Storage class for Prisma ORM with full type safety. Includes relations support, upsert operations, transaction helpers, soft delete/restore, and cursor-based pagination with Prisma's native cursor API.

**Output:** `libs/queries/prisma-storage.ts`

**Dependencies:** `@prisma/client`

#### queries/sequelize-storage.hbs
Generic Storage class for Sequelize ORM. Supports paranoid mode for soft deletes, findOrCreate operations, transaction helpers, and findAndCountAll for efficient pagination.

**Output:** `libs/queries/sequelize-storage.ts`

**Dependencies:** `sequelize`, `pg`, `pg-hstore`

#### queries/pg-storage.hbs
Generic Storage class for raw PostgreSQL queries using pg Pool. Uses parameterized queries to prevent SQL injection, supports transactions with proper rollback, and includes RETURNING clauses for insert/update results.

**Output:** `libs/queries/pg-storage.ts`

**Dependencies:** `pg`

#### queries/mysql-storage.hbs
Generic Storage class for raw MySQL queries using mysql2. Uses prepared statements, supports connection pooling, transactions, and LAST_INSERT_ID for created records.

**Output:** `libs/queries/mysql-storage.ts`

**Dependencies:** `mysql2`

#### queries/sqlite-storage.hbs
Generic Storage class for SQLite using better-sqlite3. Synchronous API for maximum performance, WAL mode enabled, transaction support via .transaction(), and RETURNING clauses.

**Output:** `libs/queries/sqlite-storage.ts`

**Dependencies:** `better-sqlite3`

#### queries/mongodb-storage.hbs
Generic Storage class for MongoDB using native driver. Handles ObjectId conversion automatically, supports aggregation pipelines, cursor-based pagination, and soft delete/restore operations.

**Output:** `libs/queries/mongodb-storage.ts`

**Dependencies:** `mongodb`

---

### Uploads

Cloud storage upload utilities with presigned URL support for direct browser uploads.

#### uploads/aws-s3.hbs
AWS S3 file upload with presigned PUT URLs and POST policies. Supports direct browser uploads via presigned URLs, form-based uploads with POST policies (size limits, content-type restrictions), download URL generation, and file operations (delete, exists, metadata).

**Output:** `libs/uploads/aws-s3.ts`

**Dependencies:** `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`

#### uploads/gcp-storage.hbs
Google Cloud Storage upload with V4 signed URLs. Supports presigned upload URLs, resumable upload URLs for large files, download URL generation, and file operations. Uses service account or default credentials.

**Output:** `libs/uploads/gcp-storage.ts`

**Dependencies:** `@google-cloud/storage`

#### uploads/azure-blob.hbs
Azure Blob Storage upload with SAS (Shared Access Signature) URLs. Generates time-limited upload and download URLs, supports access tier management (Hot/Cool/Archive), and includes standard file operations.

**Output:** `libs/uploads/azure-blob.ts`

**Dependencies:** `@azure/storage-blob`

#### uploads/cloudflare-r2.hbs
Cloudflare R2 upload using S3-compatible API. Generates presigned PUT URLs and POST policies identical to S3, supports custom public URL domains, and includes all standard file operations.

**Output:** `libs/uploads/cloudflare-r2.ts`

**Dependencies:** `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`

#### uploads/cloudinary.hbs
Cloudinary upload with signed parameters for direct browser uploads. Generates signed upload params, supports transformations and format restrictions, includes URL transformation helpers, and automatic format/quality optimization.

**Output:** `libs/uploads/cloudinary.ts`

**Dependencies:** `cloudinary`

---

### Mailers

Email sending utilities with multiple provider support.

#### mailers/aws-ses.hbs
Email sending using AWS SES (Simple Email Service). Supports single and bulk email sending, SES templates, HTML/text content, and includes pre-built templates for password reset, welcome, and email verification.

**Output:** `libs/mailers/aws-ses.ts`

**Dependencies:** `@aws-sdk/client-ses`

#### mailers/nodemailer.hbs
Email sending using Nodemailer with SMTP configuration. Supports attachments, HTML/text content, transporter verification, and includes pre-built email templates. Works with any SMTP provider.

**Output:** `libs/mailers/nodemailer.ts`

**Dependencies:** `nodemailer`

#### mailers/resend.hbs
Email sending using Resend API. Modern email API with React email support, batch sending, and scheduling. Includes pre-built templates and supports attachments.

**Output:** `libs/mailers/resend.ts`

**Dependencies:** `resend`

#### mailers/sendgrid.hbs
Email sending using SendGrid API. Supports dynamic templates, batch sending, categories/tracking, and includes pre-built HTML templates. Full SendGrid API v3 integration.

**Output:** `libs/mailers/sendgrid.ts`

**Dependencies:** `@sendgrid/mail`

---

### External Services

#### sentry.hbs
Sentry error tracking and performance monitoring integration. Provides request handler, tracing handler, and error handler middlewares. Includes user context management, breadcrumb logging, and automatic sensitive header filtering. Configurable sample rates for development vs production.

**Output:** `libs/sentry.ts`

**Dependencies:** `@sentry/node`

#### s3-upload.hbs
AWS S3 file upload client using AWS SDK v3. Supports direct uploads, presigned URL generation for browser uploads, presigned download URLs for private files, file deletion, existence checks, and metadata retrieval. Generates unique file keys with date-based organization.

**Output:** `libs/s3.ts`

**Dependencies:** `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`

---

## Middleware

Reusable Express middleware functions.

### Authentication

#### auth/jwt-auth.hbs
JWT authentication middleware with Bearer token extraction from Authorization header. Provides `authenticate` for required auth, `optionalAuth` for routes that work with or without authentication, and `authorize` for role-based access control. Handles token expiration and invalid token errors with appropriate status codes.

**Output:** `middleware/auth/jwt-auth.ts`

**Dependencies:** `jsonwebtoken`

#### auth/api-key-auth.hbs
API key authentication middleware for service-to-service communication. Supports X-API-Key header, Authorization header with ApiKey scheme, and query parameter extraction. Uses timing-safe comparison to prevent timing attacks. Includes permission-based access control.

**Output:** `middleware/auth/api-key-auth.ts`

---

### Security

#### security/rate-limiter.hbs
Rate limiting middleware using express-rate-limit. Provides pre-configured limiters: `defaultLimiter` (100 req/15min), `authLimiter` (5 req/15min for login endpoints), and `apiLimiter` (1000 req/hour). Supports X-Forwarded-For for proxy environments and custom key generators.

**Output:** `middleware/security/rate-limiter.ts`

**Dependencies:** `express-rate-limit`

#### security/helmet.hbs
Security headers middleware using Helmet. Provides `securityHeaders` for production with full CSP, HSTS, and frame protection; `devSecurityHeaders` with relaxed settings for development; and `apiSecurityHeaders` for API-only servers. Includes environment-aware configuration selector.

**Output:** `middleware/security/helmet.ts`

**Dependencies:** `helmet`

#### security/sanitize.hbs
Input sanitization middleware to prevent XSS attacks using sanitize-html. Provides `sanitizeStrict` for removing all HTML, `sanitizeRichText` for allowing basic formatting tags, and `sanitizeFields` for targeting specific request body fields. Recursively sanitizes nested objects and arrays.

**Output:** `middleware/security/sanitize.ts`

**Dependencies:** `sanitize-html`

---

### Logging

#### loggers/winston-logger.hbs
Configurable logger using Winston with Morgan integration. Defines custom log levels with colors, environment-aware log level selection, timestamp formatting, and console transport. Includes Morgan-based HTTP request logger that pipes to Winston.

**Output:** `logger.ts`

**Dependencies:** `winston`, `morgan`

#### loggers/routes-logger.hbs
Utility to log all registered Express routes on application startup. Recursively extracts routes from the Express router stack, normalizes regex paths, and outputs a formatted list of HTTP methods and paths.

**Output:** `middleware/routes-logger.ts`

---

### Utilities

#### utils/async-handler.hbs
Async/await wrapper to eliminate try-catch boilerplate in route handlers. Wraps async functions and automatically catches errors, forwarding them to Express error handling middleware. Includes `wrapHandlers` for bulk wrapping multiple handlers.

**Output:** `middleware/utils/async-handler.ts`

#### utils/request-id.hbs
Request ID middleware for distributed tracing. Generates unique UUIDs for each request, preserves client-provided X-Request-ID, supports X-Correlation-ID for cross-service tracing. Attaches IDs to request object and response headers. Includes logging context builder.

**Output:** `middleware/utils/request-id.ts`

**Dependencies:** `uuid`

#### utils/compression.hbs
Response compression middleware using gzip. Provides `compress` (default, 1KB threshold), `compressAggressive` (512B threshold, level 9), `compressLight` (2KB threshold, level 1), and `compressSelectiveTypes` (skips already-compressed formats like images and videos).

**Output:** `middleware/utils/compression.ts`

**Dependencies:** `compression`

#### utils/cache-control.hbs
Cache control middleware for setting HTTP caching headers. Provides preset middlewares: `noCache`, `shortCache` (5min browser/1min CDN), `mediumCache` (1hr browser/30min CDN), `longCache` (1 year), `immutableCache`, and `privateCache`. Includes custom cache control builder.

**Output:** `middleware/utils/cache-control.ts`

#### utils/response-time.hbs
Response time middleware using high-precision timing (process.hrtime). Adds X-Response-Time header, optional request/response logging, and slow request warnings. Provides `devResponseTime` with logging and `prodResponseTime` without. Includes Server-Timing API support for browser DevTools.

**Output:** `middleware/response-time.ts`

#### error-middleware.hbs
Error handling middleware for Express. Includes `errorHandler` for catching and logging errors with environment-aware message exposure, and `notFoundHandler` for 404 responses with request path information.

**Output:** `middleware/error.ts`

#### validation-zod.hbs
Request validation middleware using Zod schemas. Validates request body, query parameters, and URL parameters against provided schema. Returns structured validation errors with field-level details.

**Output:** `middleware/validate.ts`

**Dependencies:** `zod`

---

### Passwords

#### passwords/password-argon2.hbs
Secure password hashing using Argon2id (OWASP recommended). Configured with 64MB memory cost, 3 iterations, and 4-way parallelism. Includes empty password validation, error handling in verification, and rehash detection for security upgrades.

**Output:** `utils/password.ts`

**Dependencies:** `argon2`

#### passwords/password-bcrypt.hbs
Secure password hashing using bcrypt with 12 salt rounds. Includes 72-byte password length check (bcrypt limitation), empty password validation, and rehash detection. Provides salt round extraction from existing hashes.

**Output:** `utils/password.ts`

**Dependencies:** `bcrypt`

#### passwords/password-crypto.hbs
Password hashing using Node.js native crypto module with scrypt algorithm. Zero external dependencies. Uses 32-byte salt, 64-byte key length, and N=131072 cost factor. Embeds parameters in hash format for future-proof verification and backward compatibility.

**Output:** `utils/password.ts`

---

## Routes

Pre-built route handlers.

#### health-check.hbs
Health and readiness check endpoints for monitoring and orchestration. Provides `/health` for basic liveness, `/health/live` for process status, `/health/ready` for dependency checks, and `/health/detailed` for full system information including memory usage. Supports pluggable health check functions for databases and external services.

**Output:** `routes/health.ts`

---

## Utils

Standalone utility functions.

#### pagination.hbs
Pagination helpers supporting both offset and cursor-based pagination. Includes parameter parsing from request query, response builders with metadata (total, pages, hasNext/hasPrev), cursor encoding/decoding (base64url), and examples for Prisma integration.

**Output:** `utils/pagination.ts`

#### slug.hbs
URL-safe slug generator using slugify library. Provides `generateSlug` for basic slugification, `generateUniqueSlug` with random suffix, `generateTimestampSlug` for time-based uniqueness, validation, and sanitization. Includes `createSlugChecker` factory for database collision avoidance.

**Output:** `utils/slug.ts`

**Dependencies:** `slugify`

#### crypto.hbs
Encryption utilities using AES-256-GCM authenticated encryption. Provides `encrypt`/`decrypt` for strings, `encryptObject`/`decryptObject` for JSON, random hex/base64 generators, SHA-256 hashing, and timing-safe string comparison. Key derived from ENCRYPTION_KEY environment variable.

**Output:** `utils/crypto.ts`

#### otp.hbs
TOTP/HOTP 2FA utilities using otpauth library. Generates secrets with configurable issuer, creates QR codes as data URLs or SVG, verifies tokens with time window tolerance, and generates backup codes. Supports standard authenticator apps (Google Authenticator, Authy, etc.).

**Output:** `utils/otp.ts`

**Dependencies:** `otpauth`, `qrcode`

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
