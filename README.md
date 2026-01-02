# Hanma 🥷

Hanma is a powerful monorepo for sharing and managing backend code snippets, modules, and templates across different frameworks. It consists of a CLI tool for developers to easily add features to their projects and a web-based registry that serves the content.

## Architecture

- **`apps/cli`**: The core power of Hanma. A CLI tool (published as `hanma` on npm) that allows you to initialize projects, add snippets, and manage modules.
- **`apps/web`**: The public-facing registry and documentation site. It serves the JSON registries built from the CLI content.
- **`packages/*`**: Shared configurations for ESLint, TypeScript, and UI components.
- **`scripts/`**: Essential build scripts for generating the snippet, module, and template registries.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 18)
- [pnpm](https://pnpm.io/) (>= 9.0.0)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/itstheanurag/hanma.git
   cd hanma
   ```

2. Install dependencies:

   ```bash
   pnpm install --frozen-lockfile
   ```

## Development

Run the development server for all apps:

```bash
pnpm dev
```

### Building the Registry

Hanma uses build scripts to transform content into a JSON registry served by the web app.

```bash
# Build snippets registry
pnpm run build:registry

# Build modules registry
pnpm run build:modules

# Build templates registry
pnpm run build:templates

# build all ( registry, sources, templates and modules)
pnpm run build:scripts
```

### CLI Development

For local CLI development (linking globally, overriding base URLs), see [CONTRIBUTING.md](./CONTRIBUTING.md#local-development-with-cli).

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on adding new snippets, modules, or templates.

## Architecture & Design

For a deep dive into how Hanma works, check out [ARCHITECTURE.md](./ARCHITECTURE.md).

---

Built with ❤️ by the Hanma team.
