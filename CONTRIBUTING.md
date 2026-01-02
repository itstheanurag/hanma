# Contributing to Hanma

Thank you for your interest in contributing to Hanma. This document provides guidelines for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/hanma.git`
3. Install dependencies: `pnpm install`
4. Create a branch: `git checkout -b feature/your-feature`

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run CLI in development
pnpm dev

# Generate registry and sources
pnpm build:scripts

# Run web dev server
cd apps/web && pnpm dev
```

### Local Development with CLI

#### Linking the CLI Globally

To run the local CLI as the `hanma` command:

```bash
# Build the CLI first
pnpm build

# Link the CLI package globally
cd apps/cli
pnpm link --global

# Now you can use 'hanma' command anywhere
hanma --help
```

To unlink when done:

```bash
cd apps/cli
pnpm unlink --global
```

#### Overriding the Base URL

By default, the CLI points to the production URL. To test the CLI against your local web server, use environment variables:

```bash
# Override all URLs to point to local server
HANMA_BASE_URL=http://localhost:5173 npx hanma <command>

# Or export for the session
export HANMA_BASE_URL=http://localhost:5173
pnpm dev  # or npx hanma <command>
```

Available environment variables:

| Variable | Description |
|----------|-------------|
| `HANMA_BASE_URL` | Override all URLs (registry, templates, modules, docs) |
| `HANMA_REGISTRY_URL` | Override only the registry URL |
| `HANMA_TEMPLATES_URL` | Override only the templates URL |
| `HANMA_MODULES_URL` | Override only the modules URL |
| `HANMA_DOCS_URL` | Override only the docs URL |

## Code Guidelines

- Use TypeScript for all source files
- Follow existing code patterns
- No emojis in code, comments, or documentation
- Keep console messages professional

## Adding a New Snippet

1. Create a `.hbs` template in `packages/snippets/<framework>/`
2. Add metadata to the snippet registry
3. Run `pnpm run build:scripts`
4. Update documentation in `apps/web/src/docs/`
5. Test with `npx hanma <command> <options>`

## Pull Request Process

1. Ensure your code builds without errors
2. Update documentation if needed
3. Fill out the PR template completely
4. Wait for review

## Questions?

Open a [Discussion](https://github.com/itstheanurag/hanma/discussions) for questions.
