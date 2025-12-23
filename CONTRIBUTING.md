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

# Generate registry
pnpm generate:registry

# Run web dev server
cd apps/web && pnpm dev
```

## Code Guidelines

- Use TypeScript for all source files
- Follow existing code patterns
- No emojis in code, comments, or documentation
- Keep console messages professional

## Adding a New Snippet

1. Create a `.hbs` template in `packages/snippets/<framework>/`
2. Add metadata to the snippet registry
3. Run `pnpm generate:registry`
4. Update documentation in `apps/web/public/docs/`
5. Test with `npx hanma add <snippet-name>`

## Pull Request Process

1. Ensure your code builds without errors
2. Update documentation if needed
3. Fill out the PR template completely
4. Wait for review

## Questions?

Open a [Discussion](https://github.com/itstheanurag/hanma/discussions) for questions.
