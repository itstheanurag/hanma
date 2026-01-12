/**
 * CLI Constants
 *
 * URLs can be overridden via environment variables for development:
 * - HANMA_REGISTRY_URL: Override registry base URL
 * - HANMA_TEMPLATES_URL: Override templates base URL
 * - HANMA_BASE_URL: Override both (if specific URLs not set)
 */

const PRODUCTION_BASE_URL = "https://hanma-a2n.pages.dev";
// const PRODUCTION_BASE_URL = "http://localhost:5173";

// Default to production, only use local if explicitly in dev mode
const BASE_URL = process.env.HANMA_BASE_URL || PRODUCTION_BASE_URL;

/**
 * Registry URL for fetching snippet registries
 */
export const REGISTRY_URL =
  process.env.HANMA_REGISTRY_URL || `${BASE_URL}/registry`;

/**
 * Templates URL for fetching project templates
 */
export const TEMPLATES_URL =
  process.env.HANMA_TEMPLATES_URL || `${BASE_URL}/templates`;

/**
 * Modules URL for fetching modules (auth, database, etc.)
 */
export const MODULES_URL =
  process.env.HANMA_MODULES_URL || `${BASE_URL}/modules`;

/**
 * Docs URL for fetching documentation
 */
export const DOCS_URL = process.env.HANMA_DOCS_URL || `${BASE_URL}/docs`;

/**
 * CLI Version
 */
export const VERSION = "0.3.3";

/**
 * Cache TTL (24 hours in milliseconds)
 */
export const CACHE_TTL = 24 * 60 * 60 * 1000;

/**
 * Bypass cache with environment variable
 */
export const BYPASS_CACHE = process.env.HANMA_NO_CACHE === "true";
