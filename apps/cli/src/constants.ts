/**
 * CLI Constants
 *
 * URLs can be overridden via environment variables for development:
 * - HANMA_REGISTRY_URL: Override registry base URL
 * - HANMA_TEMPLATES_URL: Override templates base URL
 * - HANMA_BASE_URL: Override both (if specific URLs not set)
 */

// Production base URL
const PRODUCTION_BASE_URL = "https://hanma-a2n.pages.dev";

// Allow full override or use production
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
 * Docs URL for fetching documentation
 */
export const DOCS_URL = process.env.HANMA_DOCS_URL || `${BASE_URL}/docs`;
