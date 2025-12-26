/**
 * Web App Constants
 * Centralized configuration for URLs, repo info, and other constants
 */

// =============================================================================
// GitHub Configuration
// =============================================================================

export const GITHUB = {
  /** GitHub username/organization */
  OWNER: "itstheanurag",

  /** Repository name */
  REPO: "hanma",

  /** Full repo identifier */
  get REPO_PATH() {
    return `${this.OWNER}/${this.REPO}`;
  },

  /** Repository URL */
  get REPO_URL() {
    return `https://github.com/${this.REPO_PATH}`;
  },

  /** GitHub API base URL for this repo */
  get API_URL() {
    return `https://api.github.com/repos/${this.REPO_PATH}`;
  },

  /** Contributors API endpoint */
  get CONTRIBUTORS_URL() {
    return `${this.API_URL}/contributors?per_page=100`;
  },
} as const;

// =============================================================================
// External Links
// =============================================================================

export const LINKS = {
  /** Documentation */
  DOCS: "/docs",

  /** Discord community (when available) */
  DISCORD: "",

  /** Twitter/X profile */
  TWITTER: "",

  /** NPM package */
  NPM: "https://www.npmjs.com/package/hanma",
} as const;

// =============================================================================
// App Metadata
// =============================================================================

export const APP = {
  /** Application name */
  NAME: "Hanma",

  /** Application tagline */
  TAGLINE: "The Express.js Developer Toolkit",

  /** Current version */
  VERSION: "1.0.0",

  /** Version label for badges */
  VERSION_LABEL: "Public Beta",
} as const;
