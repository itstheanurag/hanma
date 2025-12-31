import { fetchAddonsRegistry } from "../utils";
import { createAddCommand } from "../helpers";

export const addons = createAddCommand({
  name: "addons",
  description: "Add cross-framework addon snippets to your project",
  itemType: "addon",
  itemTypePlural: "addons",
  fetchRegistry: fetchAddonsRegistry,
  categoryHint: "db, libs, mailers, etc.",
});
