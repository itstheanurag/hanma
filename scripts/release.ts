/**
 * Release the hanma CLI.
 *
 * Usage:
 *   pnpm release patch
 *   pnpm release minor
 *   pnpm release major
 *   pnpm release 0.4.0
 *
 * By default the script bumps, validates, commits, tags, and pushes. Pushing the
 * tag starts the GitHub Actions publish workflow, which authenticates to npm
 * with OIDC trusted publishing. The script never publishes from this machine.
 *
 * Flags:
 *   --dry-run       Print the release plan without changing anything.
 *   --no-git        Bump and validate without committing, tagging, or pushing.
 *   --skip-checks   Skip lint and type checks (the build still runs).
 *   --allow-branch  Allow releasing from a branch other than main.
 *   --yes           Do not ask for confirmation.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(SCRIPT_DIR, "..");
const CLI_DIR = join(ROOT_DIR, "apps", "cli");
const CLI_PACKAGE_PATH = join(CLI_DIR, "package.json");
const CLI_ENTRY_PATH = join(CLI_DIR, "dist", "index.js");

interface ReleaseOptions {
  bump: string;
  dryRun: boolean;
  git: boolean;
  skipChecks: boolean;
  allowBranch: boolean;
  yes: boolean;
}

interface CliPackage {
  name: string;
  version: string;
  [key: string]: unknown;
}

function usage(): string {
  return `Usage: pnpm release <current|patch|minor|major|x.y.z> [options]

Options:
  --dry-run       Show the release plan without changing anything
  --no-git        Bump and validate without committing, tagging, or pushing
  --skip-checks   Skip lint and type checks
  --allow-branch  Allow releasing from a branch other than main
  --yes           Skip the confirmation prompt
  --help          Show this message

Pushing the tag starts .github/workflows/publish.yml, which publishes with
npm OIDC trusted publishing. The script itself never runs npm publish.

Use "current" to release the version already in apps/cli/package.json
without bumping it, for example when a prepared version was never released.`;
}

function parseArgs(args: string[]): ReleaseOptions {
  const flags = new Set(args.filter((arg) => arg.startsWith("-")));
  const positional = args.filter((arg) => !arg.startsWith("-"));
  const knownFlags = new Set([
    "--help",
    "-h",
    "--dry-run",
    "--no-git",
    "--skip-checks",
    "--allow-branch",
    "--yes",
  ]);

  if (flags.has("--help") || flags.has("-h")) {
    console.log(usage());
    process.exit(0);
  }

  for (const flag of flags) {
    if (!knownFlags.has(flag)) {
      throw new Error(`Unknown option: ${flag}\n\n${usage()}`);
    }
  }

  const bump = positional[0];
  if (!bump) {
    throw new Error(`Missing version bump.\n\n${usage()}`);
  }
  if (positional.length > 1) {
    throw new Error(`Unexpected arguments: ${positional.slice(1).join(" ")}`);
  }

  return {
    bump,
    dryRun: flags.has("--dry-run"),
    git: !flags.has("--no-git"),
    skipChecks: flags.has("--skip-checks"),
    allowBranch: flags.has("--allow-branch"),
    yes: flags.has("--yes"),
  };
}

function run(
  command: string,
  args: string[],
  options: { cwd?: string; stdio?: "inherit" | "pipe" } = {},
): string {
  const stdio = options.stdio ?? "inherit";
  return execFileSync(command, args, {
    cwd: options.cwd ?? ROOT_DIR,
    encoding: "utf-8",
    stdio,
  });
}

function tryRun(
  command: string,
  args: string[],
  cwd = ROOT_DIR,
): string | null {
  try {
    return run(command, args, { cwd, stdio: "pipe" }).trim();
  } catch {
    return null;
  }
}

function readCliPackage(): CliPackage {
  return JSON.parse(readFileSync(CLI_PACKAGE_PATH, "utf-8")) as CliPackage;
}

function parseCoreVersion(version: string): [number, number, number] {
  const match = /^(\d+)\.(\d+)\.(\d+)/.exec(version);
  if (!match) {
    throw new Error(`Unsupported version format: ${version}`);
  }

  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function compareVersions(left: string, right: string): number {
  const a = parseCoreVersion(left);
  const b = parseCoreVersion(right);

  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) {
      return a[index]! - b[index]!;
    }
  }

  return 0;
}

function getNextVersion(current: string, bump: string): string {
  if (bump === "current") {
    return current;
  }

  const explicit = /^\d+\.\d+\.\d+$/.test(bump) ? bump : null;
  if (explicit) {
    if (compareVersions(explicit, current) < 0) {
      throw new Error(
        `New version ${explicit} cannot be lower than current version ${current}.`,
      );
    }
    return explicit;
  }

  if (!["patch", "minor", "major"].includes(bump)) {
    throw new Error(
      `Version must be current, patch, minor, major, or an explicit x.y.z version.`,
    );
  }

  const [major, minor, patch] = parseCoreVersion(current);

  if (bump === "major") return `${major + 1}.0.0`;
  if (bump === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

async function confirm(question: string): Promise<boolean> {
  const readline = createInterface({ input: stdin, output: stdout });
  const answer = await readline.question(question);
  readline.close();
  return /^y(es)?$/i.test(answer.trim());
}

function assertGitPreflight(
  nextVersion: string,
  options: ReleaseOptions,
): void {
  const branch = tryRun("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
  if (!branch) {
    throw new Error("Could not determine the current git branch.");
  }

  if (branch !== "main" && !options.allowBranch) {
    throw new Error(
      `Releases must run from main (current: ${branch}). Use --allow-branch to override.`,
    );
  }

  const status = tryRun("git", ["status", "--porcelain"]);
  if (status === null) {
    throw new Error("Could not read the git working tree status.");
  }

  if (status.length > 0) {
    throw new Error(
      "The git working tree is not clean. Commit or stash changes before releasing.",
    );
  }

  const tag = `v${nextVersion}`;
  const existingTag = tryRun("git", [
    "rev-parse",
    "--verify",
    `refs/tags/${tag}`,
  ]);
  if (existingTag) {
    throw new Error(`Git tag ${tag} already exists.`);
  }
}

function assertNpmPreflight(nextVersion: string): void {
  const existing = tryRun("npm", ["view", `hanma@${nextVersion}`, "version"]);
  if (existing) {
    throw new Error(`hanma@${nextVersion} is already published on npm.`);
  }

  const latest = tryRun("npm", ["view", "hanma", "version"]);
  if (!latest) {
    console.warn("Warning: could not read the latest published hanma version.");
    return;
  }

  console.log(`npm latest: ${latest}`);
  const comparison = compareVersions(nextVersion, latest);
  if (comparison === 0) {
    throw new Error(`hanma@${nextVersion} is already published on npm.`);
  }
  if (comparison < 0) {
    throw new Error(
      `New version ${nextVersion} is lower than npm latest ${latest}.`,
    );
  }
}

function printPlan(
  currentVersion: string,
  nextVersion: string,
  options: ReleaseOptions,
): void {
  const isSameVersion = nextVersion === currentVersion;

  console.log(`\nhanma release\n`);
  console.log(`  Current version: ${currentVersion}`);
  console.log(
    `  Next version:    ${nextVersion}${isSameVersion ? " (publish current)" : ""}`,
  );
  console.log(
    `  Checks:          ${options.skipChecks ? "build only" : "lint, types, build"}`,
  );
  console.log(
    `  Git:             ${
      options.git
        ? `${isSameVersion ? "" : "commit, "}tag v${nextVersion}, push`
        : "skipped"
    }`,
  );
  console.log(
    `  Publish:         ${
      options.git
        ? "GitHub Actions on tag push (npm OIDC)"
        : "skipped (no tag pushed)"
    }`,
  );
  console.log("");
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const cliPackage = readCliPackage();
  const currentVersion = cliPackage.version;
  const nextVersion = getNextVersion(currentVersion, options.bump);
  const isSameVersion = nextVersion === currentVersion;
  const tagName = `v${nextVersion}`;
  const originalPackageJson = readFileSync(CLI_PACKAGE_PATH, "utf-8");

  printPlan(currentVersion, nextVersion, options);

  if (options.dryRun) {
    console.log("Dry run: no files, commits, tags, or packages were changed.");
    return;
  }

  if (!options.yes) {
    const confirmed = await confirm(
      `Release ${cliPackage.name}@${nextVersion}? [y/N] `,
    );
    if (!confirmed) {
      console.log("Release cancelled.");
      return;
    }
  }

  if (options.git) {
    assertGitPreflight(nextVersion, options);
    assertNpmPreflight(nextVersion);
  }

  if (!isSameVersion) {
    writeFileSync(
      CLI_PACKAGE_PATH,
      `${JSON.stringify({ ...cliPackage, version: nextVersion }, null, 2)}\n`,
      "utf-8",
    );
    console.log(`Updated apps/cli/package.json to ${nextVersion}.`);
  } else {
    console.log(`Keeping apps/cli/package.json at ${nextVersion}.`);
  }

  try {
    if (!options.skipChecks) {
      console.log("\nRunning lint...");
      run("pnpm", ["--filter", "hanma", "lint"]);
      console.log("\nRunning type checks...");
      run("pnpm", ["--filter", "hanma", "check-types"]);
    }

    console.log("\nBuilding CLI...");
    run("pnpm", ["--filter", "hanma", "build"]);

    const builtVersion = run(process.execPath, [CLI_ENTRY_PATH, "--version"], {
      stdio: "pipe",
    }).trim();

    if (builtVersion !== nextVersion) {
      throw new Error(
        `Built CLI reports ${builtVersion}, expected ${nextVersion}.`,
      );
    }
    console.log(`Verified built CLI version: ${builtVersion}`);
  } catch (error) {
    if (!isSameVersion) {
      writeFileSync(CLI_PACKAGE_PATH, originalPackageJson, "utf-8");
      console.error(
        "\nRelease validation failed. Restored apps/cli/package.json.",
      );
    }
    throw error;
  }

  if (options.git) {
    if (!isSameVersion) {
      console.log("\nCommitting release...");
      run("git", ["add", "apps/cli/package.json"]);
      run("git", ["commit", "-m", `chore(release): hanma v${nextVersion}`]);
    }

    console.log(
      "\nTagging and pushing (this starts the npm publish workflow)...",
    );
    run("git", ["tag", "-a", tagName, "-m", `hanma v${nextVersion}`]);
    run("git", ["push", "origin", "HEAD"]);
    run("git", ["push", "origin", tagName]);
    console.log(
      `\nPushed ${tagName}. GitHub Actions will publish hanma@${nextVersion} with npm OIDC.`,
    );
  }

  console.log(`\nRelease ${nextVersion} complete.`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\nRelease failed: ${message}`);
  process.exit(1);
});
