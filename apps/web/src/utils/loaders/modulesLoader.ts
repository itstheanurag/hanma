/**
 * Modules loader with dynamic imports
 */

export const loadModulesIndex = async () => {
  const module = await import("@/docs/modules/index.json");
  return module.default;
};
