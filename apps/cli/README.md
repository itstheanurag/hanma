# Hanma CLI

<p align="center">
  <strong>Grapple your backend into shape with production-ready snippets and templates.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/hanma"><img src="https://img.shields.io/npm/v/hanma.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/hanma"><img src="https://img.shields.io/npm/dm/hanma.svg" alt="npm downloads"></a>
  <a href="https://github.com/itstheanurag/hanma/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/hanma.svg" alt="license"></a>
</p>

---

## What is Hanma?

Hanma is a CLI tool that helps you quickly scaffold backend projects and add production-ready code snippets. Instead of copy-pasting boilerplate code, use Hanma to:

- **Create new projects** with pre-configured frameworks (Express, Hono, Elysia)
- **Add snippets** for common functionality (auth, database, uploads, etc.)
- **Add modules** for complex multi-file features
- **Zero lock-in** - all code is added directly to your project

## Quick Start

```bash
# Create a new project
npx hanma create my-api

# Or install globally
npm install -g hanma
hanma create my-api
```

## Installation

### Using npx (recommended for one-off use)

```bash
npx hanma <command>
```

### Global Installation

```bash
# npm
npm install -g hanma

# pnpm
pnpm add -g hanma

# yarn
yarn global add hanma

# bun
bun add -g hanma
```

### Verify Installation

```bash
hanma --version
hanma --help
```

## Commands

### `create` - Scaffold a New Project

Create a new backend project with your choice of framework, database, auth, and more.

```bash
# Interactive mode (recommended)
npx hanma create my-api

# With flags
npx hanma create my-api --framework express --database drizzle-postgres --auth jwt-auth
```

#### Available Frameworks

| Framework | Description |
|-----------|-------------|
| `express` | Express.js v5 with TypeScript |
| `express-graphql` | Express + Apollo GraphQL |
| `express-trpc` | Express + tRPC |
| `express-socket` | Express + Socket.io |
| `hono` | Hono framework (Node.js) |
| `hono-bun` | Hono optimized for Bun |
| `hono-cloudflare` | Hono for Cloudflare Workers |
| `hono-vercel` | Hono for Vercel Edge |
| `hono-deno` | Hono for Deno |
| `hono-lambda` | Hono for AWS Lambda |
| `elysia` | Elysia framework for Bun |

#### Available Databases

| Database | Description |
|----------|-------------|
| `drizzle-postgres` | Drizzle ORM + PostgreSQL |
| `drizzle-mysql` | Drizzle ORM + MySQL |
| `drizzle-sqlite` | Drizzle ORM + SQLite |
| `prisma-postgres` | Prisma ORM + PostgreSQL |
| `mongodb` | MongoDB native driver |

#### Available Auth Options

| Auth | Description |
|------|-------------|
| `better-auth` | Better Auth library |
| `jwt-auth` | Custom JWT authentication |
| `passport-local` | Passport.js local strategy |

#### Create Command Options

| Option | Description |
|--------|-------------|
| `--framework <fw>` | Base framework |
| `--database <db>` | Database setup |
| `--auth <auth>` | Authentication method |
| `--mailer <mailer>` | Email provider (nodemailer, resend, sendgrid, aws-ses) |
| `--upload <upload>` | File uploads (s3, cloudinary, local, r2, gcp) |
| `--cache <cache>` | Caching (redis) |
| `--logging <log>` | Logging (winston) |
| `--monitoring <mon>` | Monitoring (sentry) |
| `--preset <preset>` | Security preset (security-basic, security-strict) |
| `--tooling <tool>` | Linting/formatting (biome, eslint, prettier) |
| `--pm <pm>` | Package manager (npm, pnpm, yarn, bun) |
| `--skip-install` | Skip dependency installation |

---

### `add` - Add Snippets

Add individual code snippets to your existing project.

```bash
# Interactive mode
npx hanma add

# Add specific snippets
npx hanma add cors jwt rate-limiter

# Filter by category
npx hanma add --category middleware

# Add all snippets in a category
npx hanma add --all --category utils
```

#### Add Command Options

| Option | Description |
|--------|-------------|
| `-a, --all` | Add all snippets (use with `--category`) |
| `-c, --category <cat>` | Filter by category |
| `-f, --framework <fw>` | Framework to use (express, hono, elysia) |
| `-v, --version <ver>` | Framework version |
| `-p, --path <path>` | Destination path |

---

### `module` - Add Modules

Add multi-file modules for complex features.

```bash
# Interactive mode
npx hanma module

# Add specific modules
npx hanma module auth-jwt
npx hanma mod auth-jwt  # 'mod' is an alias
```

#### Module Command Options

| Option | Description |
|--------|-------------|
| `-f, --framework <fw>` | Framework to use |
| `-v, --version <ver>` | Framework version |
| `-p, --path <path>` | Destination path |

---

### `show` - View Available Snippets & Templates

Browse available snippets and templates without adding them to your project.

```bash
# Show all snippets for a framework
npx hanma show snippets --framework express

# Show details for a specific snippet
npx hanma show snippets cors --framework express

# Show available templates
npx hanma show templates --framework hono

# Output as JSON (for scripting)
npx hanma show snippets --framework express --json
```

#### Show Command Options

| Option | Description |
|--------|-------------|
| `-f, --framework <fw>` | Framework to use (express, hono, elysia, fastify, shared) |
| `--json` | Output in JSON format |

---

### `init` - Initialize Configuration

Create a `hanma.json` configuration file in your project.

```bash
npx hanma init
```

This creates a config file that stores your project defaults:

```json
{
  "componentsPath": "src",
  "utilsPath": "src/utils",
  "framework": "express"
}
```

---

## Examples

### Create a Full-Featured Express API

```bash
npx hanma create my-api \
  --framework express \
  --database drizzle-postgres \
  --auth jwt-auth \
  --mailer resend \
  --upload s3 \
  --cache redis \
  --preset security-strict \
  --tooling biome
```

### Create a Hono API for Cloudflare Workers

```bash
npx hanma create worker-api --framework hono-cloudflare
```

### Create an Elysia API for Bun

```bash
npx hanma create bun-api --framework elysia --database drizzle-sqlite
```

### Add JWT Auth to Existing Project

```bash
cd my-project
npx hanma add jwt-auth
```

---

## Available Snippet Categories

| Category | Examples |
|----------|----------|
| **Middleware** | cors, rate-limiter, helmet, compression |
| **Auth** | jwt-auth, passport, session |
| **Database** | drizzle, prisma, mongodb |
| **Utils** | logger, validation, error-handler |
| **Uploads** | s3, cloudinary, multer, r2 |
| **Mailers** | nodemailer, resend, sendgrid, ses |
| **Caching** | redis |

---

## Configuration

Hanma uses a `hanma.json` file for project configuration:

```json
{
  "componentsPath": "src",
  "utilsPath": "src/utils",
  "framework": "express"
}
```

| Field | Description | Default |
|-------|-------------|---------|
| `componentsPath` | Where to add components | `src` |
| `utilsPath` | Where to add utilities | `src/utils` |
| `framework` | Default framework | auto-detected |

---

## Documentation

For full documentation, visit: **[hanma-a2n.pages.dev](https://hanma-a2n.pages.dev)**

---

## Contributing

Contributions are welcome! Please see our [GitHub repository](https://github.com/itstheanurag/hanma).

---

## License

MIT © [Gaurav Kumar](https://github.com/itstheanurag)
