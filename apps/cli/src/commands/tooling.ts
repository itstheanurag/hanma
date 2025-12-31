import { fetchToolingRegistry } from "../utils";
import { createAddCommand } from "../helpers";

export const tooling = createAddCommand({
  name: "tooling",
  description: "Add development tooling configuration to your project",
  itemType: "tooling",
  itemTypePlural: "tooling configs",
  fetchRegistry: fetchToolingRegistry,
  defaultPath: ".",
  categoryHint: "biome, eslint, prettier, tsconfig",
});
