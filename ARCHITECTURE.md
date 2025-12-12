# Snippets Architecture

This package contains reusable code snippets for various frameworks.

## Directory Structure

We use a versioned directory structure to support different versions of frameworks.

```
packages/snippets/
├── <framework>/          # e.g. express, elysia
│   ├── v<version>/       # e.g. v5, v1
│   │   ├── <feature>.ts  # Source code
│   │   └── <feature>.json # Snippet metadata
│   └── ...
└── ...
```

## Snippet Definition

Each snippet is defined by a `*.json` file. The build script recursively searches for these JSON files.

### JSON Format

```json
{
  "name": "unique-snippet-name",
  "description": "Description...",
  "dependencies": ["pkg1"],
  "devDependencies": ["pkg2"],
  "files": [
    {
      "name": "filename.ts",
      "source": "filename.ts"
    }
  ]
}
```
