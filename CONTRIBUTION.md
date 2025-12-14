# Contributing to Hanma

We welcome contributions to the snippets, modules, and templates!

## Adding a New Snippet

1. **Choose the Framework**: Navigate to `apps/cli/content/snippets/<framework>`. If it doesn't exist, create it.
2. **Version Directory**: Create a directory for the framework version, e.g., `v1`, `v5`.
3. **Category Directory**: Place your snippet in the appropriate category (`libs`, `middleware`, `utils`).
4. **Create `.hbs` File**: Add your snippet with YAML frontmatter:

```yaml
---
name: my-snippet
description: What it does
dependencies: [package-name]
devDependencies: ["@types/package"]
files:
  - name: output-filename.ts
---
// Your TypeScript code here
```

## Adding a Module

Modules compose multiple snippets into a feature bundle:

1. Create `apps/cli/content/modules/<framework>/v<version>/<feature-name>/`
2. Add `_meta.yaml` referencing existing snippets
3. Add any module-specific files

## Naming Conventions

- **Directories**: Lowercase, kebab-case
- **Snippet Name**: Descriptive, e.g., `cors`, `jwt-auth`, `rate-limiter`

## Guidelines

- Make snippets as dynamic as possible
- Include types where applicable
- Avoid hardcoded values; use environment variables or configuration
- Reference existing snippets in modules (don't duplicate code)
