# Contributing to Snippets

We welcome contributions to the snippets library!

## Adding a New Snippet

1.  **Choose the Framework**: Navigate to `packages/snippets/<framework>`. If it doesn't exist, create it.
2.  **Version Directory**: Create a directory for the framework version you are targeting, e.g., `v1`, `v5`.
3.  **Create Source File**: Add your code file (e.g., `rate-limiter.ts`).
4.  **Create Metadata**: Add a corresponding `.json` file (e.g., `rate-limiter.json`).

## Naming Conventions

-   **Directories**: Lowercase, kebab-case.
-   **Snippet Name**: Format as `<framework>-v<version>-<feature>`, e.g., `express-v5-cors`.

## Guidelines

-   Make snippets as dynamic as possible.
-   Include types where applicable.
-   Avoid hardcoded values; use environment variables or configuration objects.
