import { execSync } from "child_process";
import { PackageManager } from "./get-user-pkg-manager";

/**
 * Check if a package manager is installed by running `<pm> --version`
 */
export function isPackageManagerInstalled(pm: PackageManager): boolean {
  try {
    execSync(`${pm} --version`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get list of installed package managers
 */
export function getInstalledPackageManagers(): PackageManager[] {
  const managers: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];
  return managers.filter(isPackageManagerInstalled);
}
