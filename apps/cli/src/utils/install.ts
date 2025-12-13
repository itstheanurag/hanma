import { execa } from "execa";
import { getUserPkgManager } from "./get-user-pkg-manager";

export async function installDependencies(
  dependencies: string[],
  dev: boolean = false
) {
  if (dependencies.length === 0) return;

  const pkgManager = getUserPkgManager();
  const args = [pkgManager === "npm" ? "install" : "add", ...dependencies];
  if (dev) {
    args.push("-D");
  }

  await execa(pkgManager, args, { stdio: "inherit" });
}
