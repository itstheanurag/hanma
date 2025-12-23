# AGENTS.md

## Purpose
This file defines mandatory rules for all AI agents operating in this repository.

The goal is to produce **senior-quality, maintainable, predictable code** that aligns with best practices and existing project patterns.

Speed is secondary to correctness, clarity, and long-term maintainability.

---

## Core Principles
- Think before writing code
- Prefer small, composable units over large abstractions
- Optimize for readability and maintainability, not cleverness
- Match existing architectural and stylistic patterns
- Act like a senior engineer reviewing their own PR

---

## Hard Rules (Non-Negotiable)

### Output & Communication
- **Do NOT use emojis**
- Do NOT include unnecessary commentary
- Do NOT explain code unless explicitly asked
- Output only what is requested

### File Size & Code Volume
- keep component size small, easy to read and maintain
- avoid large files, if the resulting file size is large like 1000+ lines, break it into multiple files 

### Components & Structure
- Components must be **small, focused, and single-purpose**
- Large components must be broken into smaller ones
- Avoid deeply nested components or logic-heavy render functions
- Design components to minimize unnecessary re-renders

---

## React / Frontend Rules (If Applicable)
- Prefer composition over inheritance
- Avoid prop drilling when reasonable alternatives exist
- Memoize expensive computations when justified
- Do not introduce premature optimization
- Avoid anonymous functions in render when possible
- Keep side effects isolated and explicit

---

## Code Quality Standards
- Follow existing naming conventions and patterns
- Prefer explicit code over implicit behavior
- Avoid magic numbers and hardcoded values
- No unused imports, variables, or dead code
- No speculative features or future-proofing unless requested

---

## Documentation Expectations
- Public functions, complex logic, and non-obvious decisions **must be documented**
- Comments should explain **why**, not **what**
- Avoid redundant or obvious comments
- Documentation should be concise and intentional

---

## Change Management
- Do not rename files, functions, variables, or APIs unless explicitly instructed
- Do not introduce new dependencies without permission
- Do not remove or rewrite existing logic unless required
- Make the smallest correct change needed to satisfy the request

---

## Safety & Assumptions
- Do NOT guess requirements, configs, paths, or environment variables
- Do NOT assume framework versions or tooling
- If context is missing or ambiguous, **ask a clarifying question**
- Doing nothing is better than doing the wrong thing

---

## Testing & Reliability
- Preserve existing behavior unless explicitly changing it
- If logic is non-trivial, suggest tests instead of skipping validation
- Avoid fragile or tightly coupled implementations

---

## Failure Mode
If a request conflicts with these rules:
1. Stop
2. Explain the conflict briefly
3. Ask how to proceed

Never silently violate this file.

---

## Final Reminder
You are not here to impress.
You are here to leave the codebase better than you found it.
