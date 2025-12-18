import fs from "fs";
import path from "path";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

/**
 * Detect package manager based on:
 * 1. npm_config_user_agent (when run via package manager script)
 * 2. Lockfile presence in current directory
 * 3. Default to npm
 */
export function getUserPkgManager(): PackageManager {
  // 1. Check user agent (set when run via package manager)
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent) {
    if (userAgent.startsWith("yarn")) {
      return "yarn";
    } else if (userAgent.startsWith("pnpm")) {
      return "pnpm";
    } else if (userAgent.startsWith("bun")) {
      return "bun";
    } else if (userAgent.startsWith("npm")) {
      return "npm";
    }
  }

  // 2. Check for lockfiles in current directory
  const cwd = process.cwd();

  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) {
    return "pnpm";
  }
  if (
    fs.existsSync(path.join(cwd, "bun.lockb")) ||
    fs.existsSync(path.join(cwd, "bun.lock"))
  ) {
    return "bun";
  }
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) {
    return "yarn";
  }
  if (fs.existsSync(path.join(cwd, "package-lock.json"))) {
    return "npm";
  }

  // 3. Default to npm
  return "npm";
}
