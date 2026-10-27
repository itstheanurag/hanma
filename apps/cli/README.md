# ⚔️ Hanma CLI

<p align="center">
  <strong>Grapple your backend into shape with production-ready snippets, modules, and composable templates.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/hanma"><img src="https://img.shields.io/npm/v/hanma.svg?style=flat-square&color=ea580c" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/hanma"><img src="https://img.shields.io/npm/dm/hanma.svg?style=flat-square&color=ea580c" alt="npm downloads"></a>
  <a href="https://github.com/itstheanurag/hanma/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/hanma.svg?style=flat-square" alt="license"></a>
  <a href="https://hanma-a2n.pages.dev/docs"><img src="https://img.shields.io/badge/docs-vibrant-ea580c?style=flat-square" alt="documentation"></a>
</p>

---

## What is Hanma?

**Hanma** is a specialized CLI engine designed to eliminate the tedious "boilerplate phase" of backend development. Inspired by tools like shadcn/ui but built for the **server-side**, Hanma doesn't provide a library; it provides **source code**.

### Why Hanma?

- **Zero Lock-in**: You own the code. Once added, it's just local files in your project. No runtime dependencies on Hanma.
- **Composable Architecture**: Mix and match templates. Need Express with Drizzle, Clerk Auth, and Socket.io? Hanma builds it for you.
- **Framework Aware**: Hanma understands whether you're using Express, Hono, or Elysia and adapts the code it gives you accordingly.
- **Production Grade**: Every snippet and module following industry best practices for security, types, and structure.
- **Offline Aware & Faster**: Registry data is cached locally, allowing for instant lookups and fallback when offline.

---

## Core Concepts

To get the most out of Hanma, it helps to understand the three types of code it provides:

### 1. Composable Templates (`create`)

Scaffolding a project isn't just picking a framework. It's picking a _stack_. The `create` command uses a composable engine that stitches together base frameworks with database ORMs, auth handlers, and middleware setups during initialization.

### 2. Modules (`module`)

A module is a complex, multi-file feature. Adding a "Better Auth" module doesn't just add one file; it adds routes, middleware, types, and schema files, ensuring everything is wired up correctly from the start.

### 3. Snippets (`add`)

The building blocks. Individual files or functions for specific tasks—CORS setup, JWT utilities, validation schemas, or custom error handlers.

---

## Quick Start

```bash
# Run without installing
npx hanma@latest create my-project

# Or install globally
npm install -g hanma

# Start the interactive project builder
npx hanma create my-project

# Create a project non-interactively
npx hanma create my-api --framework express --template express --pm npm --skip-install

# Add a module to an existing project
cd my-project
npx hanma mod drizzle-postgres

# Inject a specific utility snippet
npx hanma add logger

# Sync all registry metadata and verify cache
npx hanma sync --info
```

---

## Detailed Command Reference

### `create [name]`

The entry point for new projects. Run it interactively or pass flags for a reproducible scaffold command.

| Flag                                        | Description                                                      |
| :------------------------------------------ | :--------------------------------------------------------------- |
| `--framework <fw>`                          | Force a specific framework (e.g., `express`, `hono`, `elysia`)   |
| `--template <template>`                     | Pre-select the base template (e.g., `express`, `hono`, `elysia`) |
| `--server <template>`                       | Backward-compatible alias for `--template`                       |
| `--database <db>` / `--db <db>`             | Pre-select database (e.g., `drizzle-postgres`, `prisma-mysql`)   |
| `--auth <auth>`                             | Pre-select auth provider (e.g., `better-auth`, `jwt-auth`)       |
| `--preset <preset>` / `--security <preset>` | Pre-select a preset template                                     |
| `--mailer <mailer>`                         | Pre-select a mailer feature                                      |
| `--upload <upload>`                         | Pre-select an upload feature                                     |
| `--cache <cache>`                           | Pre-select a cache feature                                       |
| `--tooling <tooling>`                       | Pre-select a tooling feature                                     |
| `--features <items>`                        | Add comma-separated feature templates                            |
| `--pm <package-manager>`                    | Select package manager (only shows installed ones)               |
| `--skip-install`                            | Scaffold only, don't run the installer                           |

> **Note:** The CLI automatically detects which package managers are installed on your system and only shows those as options.

Examples:

```bash
hanma create my-api --framework express --template express --pm npm
hanma create edge-api --framework hono --template hono --pm pnpm --skip-install
hanma create app --server express --db drizzle-postgres --auth jwt-auth
```

### `add [snippets...]`

Smart snippet injection. Hanma reads your `hanma.json` to ensure you get the right code for your framework.

```bash
# Multi-select interactively (recommened)
hanma add

# Category filtered select
hanma add --category middleware
```

### `show <type> [name]`

The Discovery Engine. Browse the registry without leaving your terminal.

- `hanma show snippets`: List all snippets for your detected framework.
- `hanma show templates`: Browse the scaffolding library.
- `hanma show modules`: See complex multi-file features.
- `hanma show tooling`: Browse dev-tools configurations.

### `sync`

Registry & Cache Management. Keep your local registry metadata updated.

- `hanma sync`: Refresh all registry metadata from the remote source.
- `hanma sync --info`: View local cache statistics (size, files, last update).
- `hanma sync --clear`: Wipe the local cache to force a fresh pull on next command.

If framework selection ever shows no results, refresh the local registry cache:

```bash
hanma sync --clear
hanma sync
```

### `update`

Keep your CLI up to date.

```bash
# Check for updates
hanma update --check

# Update to latest version
hanma update
```

---

## Compatibility Matrix

Hanma is designed to grow. Here is the current state of support:

| Feature Area         | Express | Hono | Elysia | Fastify |
| :------------------- | :-----: | :--: | :----: | :-----: |
| Core Scaffolding     |   ✅    |  ✅  |   ✅   |   🚧    |
| Snippet Library      |   ✅    |  ✅  |   ✅   |   ✅    |
| Auth Modules         |   ✅    |  ✅  |   ✅   |   🚧    |
| DB Integrations      |   ✅    |  ✅  |   ✅   |   ✅    |
| Tooling (Biome, etc) |   ✅    |  ✅  |   ✅   |   ✅    |

---

## ⚙️ How it Works: `hanma.json`

When you run `hanma init` or `hanma create`, a small configuration file is created. This is the **brain** of the CLI—it keeps Hanma "framework aware".

```json
{
  "framework": "express",
  "componentsPath": "src",
  "utilsPath": "src/utils"
}
```

- **Framework Awareness**: When you run `hanma add cors`, Hanma checks this file. If it's `express`, it fetches the Express middleware. If it's `hono`, it fetches the Hono version.
- **Custom Paths**: Tired of `src/`? Change `componentsPath` to `./lib` and Hanma will respect it.

---

## Documentation & Resources

- **Full Documentation**: [hanma-a2n.pages.dev/docs](https://hanma-a2n.pages.dev/docs)
- **Code Patterns**: View the source of snippets at our [Web Registry](https://hanma-a2n.pages.dev/registry).
- **GitHub**: [itstheanurag/hanma](https://github.com/itstheanurag/hanma)

---

## License

MIT © [Gaurav Kumar](https://github.com/itstheanurag)
