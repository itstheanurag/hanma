import { spawn } from "child_process";
import { getUserPkgManager } from "./get-user-pkg-manager";

export async function installDependencies(
  dependencies: string[],
  dev: boolean = false,
) {
  if (dependencies.length === 0) return;

  const pkgManager = getUserPkgManager();
  const args = [pkgManager === "npm" ? "install" : "add", ...dependencies];
  if (dev) args.push("-D");

  return new Promise<void>((resolve, reject) => {
    const child = spawn(pkgManager, args, { stdio: "inherit", shell: true });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Install failed with code ${code}`));
    });
  });
}

/**
 * Batch install dependencies from multiple items
 * Deduplicates and runs single install commands for efficiency
 */
export async function batchInstallDependencies(
  allDeps: string[],
  allDevDeps: string[],
): Promise<void> {
  // Deduplicate
  const uniqueDeps = [...new Set(allDeps)];
  const uniqueDevDeps = [...new Set(allDevDeps)];

  // Install regular dependencies
  if (uniqueDeps.length > 0) {
    await installDependencies(uniqueDeps, false);
  }

  // Install dev dependencies
  if (uniqueDevDeps.length > 0) {
    await installDependencies(uniqueDevDeps, true);
  }
}
