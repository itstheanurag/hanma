import { Registry, registrySchema } from "../schema";

const REGISTRY_URL = "http://localhost:3000/registry.json"; // TODO: Make this configurable or point to prod

export async function fetchRegistry(): Promise<Registry> {
  const res = await fetch(REGISTRY_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch registry: ${res.statusText}`);
  }
  const json = await res.json();
  const result = registrySchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid registry format: ${result.error.message}`);
  }

  return result.data;
}
