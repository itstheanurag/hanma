import fs from "fs-extra";

const CONFIG_FILE = "hanma.json";

export interface HanmaConfig {
  componentsPath: string;
  utilsPath: string; // Generic utils
}

export async function getConfig(): Promise<HanmaConfig | null> {
  if (!fs.existsSync(CONFIG_FILE)) {
    return null;
  }
  return fs.readJSON(CONFIG_FILE);
}

export async function createConfig(config: HanmaConfig) {
  await fs.writeJSON(CONFIG_FILE, config, { spaces: 2 });
}
