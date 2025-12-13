import { Registry, registrySchema } from "../schema";

const REGISTRY_BASE_URL = "http://localhost:5173/registry";

export async function fetchFrameworks(): Promise<string[]> {
  const res = await fetch(`${REGISTRY_BASE_URL}/index.json`);
  if (!res.ok) {
    throw new Error(`Failed to fetch frameworks index: ${res.statusText}`);
  }
  return (await res.json()) as string[];
}

export async function fetchRegistry(framework: string): Promise<Registry> {
  const res = await fetch(`${REGISTRY_BASE_URL}/${framework}.json`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch registry for ${framework}: ${res.statusText}`
    );
  }
  const json = await res.json();
  const result = registrySchema.safeParse(json);

  if (!result.success) {
    throw new Error(
      `Invalid registry format for ${framework}: ${result.error.message}`
    );
  }

  return result.data;
}
