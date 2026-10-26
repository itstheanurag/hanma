/**
 * Filesystem paths for the SEO build.
 *
 * Resolving paths from this module keeps the build working regardless of the
 * directory it is started from (repository root, app directory, or CI).
 */

import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

export const WEB_DIR = resolve(SCRIPT_DIR, "../..");
export const DOCS_DIR = join(WEB_DIR, "src", "docs");
export const PUBLIC_DIR = join(WEB_DIR, "public");

/**
 * Generated pages live next to the SPA output so canonical URLs such as
 * `/framework/express` resolve to `dist/framework/express.html`.
 */
export const DIST_DIR = join(WEB_DIR, "dist");
