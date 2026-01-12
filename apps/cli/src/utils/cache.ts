import fs from "fs-extra";
import path from "path";
import os from "os";

/**
 * Cache metadata structure
 */
interface CacheMeta {
  version: string;
  lastUpdate: number;
  entries: Record<string, { timestamp: number; size: number }>;
}

/**
 * Simple mutex for serializing metadata writes
 */
let metaLock: Promise<void> = Promise.resolve();

async function withMetaLock<T>(fn: () => Promise<T>): Promise<T> {
  // Chain onto the existing lock
  const currentLock = metaLock;
  let resolve: () => void;
  metaLock = new Promise((r) => (resolve = r));

  try {
    // Wait for previous operation to complete
    await currentLock;
    return await fn();
  } finally {
    resolve!();
  }
}

/**
 * Get the cache directory path based on platform
 */
export function getCacheDir(): string {
  const platform = process.platform;

  if (platform === "win32") {
    // Windows: %LOCALAPPDATA%\hanma\cache
    const localAppData =
      process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
    return path.join(localAppData, "hanma", "cache");
  }

  // Unix-like (Linux, macOS): ~/.hanma/cache
  return path.join(os.homedir(), ".hanma", "cache");
}

/**
 * Get full path for a cache key
 */
export function getCachePath(key: string): string {
  return path.join(getCacheDir(), `${key}.json`);
}

/**
 * Get cache metadata path
 */
function getMetaPath(): string {
  return path.join(getCacheDir(), ".cache-meta.json");
}

/**
 * Read cache metadata
 */
async function readMeta(): Promise<CacheMeta> {
  const metaPath = getMetaPath();
  const defaultMeta: CacheMeta = { version: "1.0", lastUpdate: 0, entries: {} };

  if (!(await fs.pathExists(metaPath))) {
    return defaultMeta;
  }

  try {
    return await fs.readJSON(metaPath);
  } catch (error) {
    // If JSON is corrupted, return default and log warning in dev
    if (process.env.NODE_ENV === "development") {
      console.warn("Cache metadata corrupted, resetting...");
    }
    return defaultMeta;
  }
}

/**
 * Write cache metadata
 */
async function writeMeta(meta: CacheMeta): Promise<void> {
  const metaPath = getMetaPath();
  await fs.ensureDir(getCacheDir());
  await fs.writeJSON(metaPath, meta, { spaces: 2 });
}

/**
 * Check if cache entry exists and is within TTL
 */
export async function isCacheValid(
  key: string,
  ttlMs: number,
): Promise<boolean> {
  const cachePath = getCachePath(key);

  if (!(await fs.pathExists(cachePath))) {
    return false;
  }

  const meta = await readMeta();
  const entry = meta.entries[key];

  if (!entry) {
    // Cache file exists but no metadata - read file stat
    const stat = await fs.stat(cachePath);
    return Date.now() - stat.mtimeMs < ttlMs;
  }

  return Date.now() - entry.timestamp < ttlMs;
}

/**
 * Read cached data
 */
export async function readCache<T>(key: string): Promise<T | null> {
  const cachePath = getCachePath(key);

  if (!(await fs.pathExists(cachePath))) {
    return null;
  }

  try {
    return await fs.readJSON(cachePath);
  } catch {
    return null;
  }
}

/**
 * Write data to cache
 */
export async function writeCache<T>(key: string, data: T): Promise<void> {
  const cachePath = getCachePath(key);

  await fs.ensureDir(getCacheDir());
  await fs.writeJSON(cachePath, data);

  // Update metadata with lock to prevent race conditions
  await withMetaLock(async () => {
    const meta = await readMeta();
    const stat = await fs.stat(cachePath);

    meta.lastUpdate = Date.now();
    meta.entries[key] = {
      timestamp: Date.now(),
      size: stat.size,
    };

    await writeMeta(meta);
  });
}

/**
 * Clear all cached data
 */
export async function clearCache(): Promise<void> {
  const cacheDir = getCacheDir();
  if (await fs.pathExists(cacheDir)) {
    await fs.remove(cacheDir);
  }
}

/**
 * Get cache information
 */
export interface CacheInfo {
  exists: boolean;
  directory: string;
  totalSize: number;
  fileCount: number;
  lastUpdate: Date | null;
  entries: Array<{ key: string; size: number; age: string }>;
}

export async function getCacheInfo(): Promise<CacheInfo> {
  const cacheDir = getCacheDir();
  const info: CacheInfo = {
    exists: false,
    directory: cacheDir,
    totalSize: 0,
    fileCount: 0,
    lastUpdate: null,
    entries: [],
  };

  if (!(await fs.pathExists(cacheDir))) {
    return info;
  }

  info.exists = true;
  const meta = await readMeta();

  if (meta.lastUpdate) {
    info.lastUpdate = new Date(meta.lastUpdate);
  }

  const files = await fs.readdir(cacheDir);

  for (const file of files) {
    if (file.startsWith(".")) continue; // Skip hidden/meta files

    const filePath = path.join(cacheDir, file);
    const stat = await fs.stat(filePath);

    info.totalSize += stat.size;
    info.fileCount++;

    const key = file.replace(".json", "");
    const entry = meta.entries[key];
    const ageMs = entry
      ? Date.now() - entry.timestamp
      : Date.now() - stat.mtimeMs;

    info.entries.push({
      key,
      size: stat.size,
      age: formatAge(ageMs),
    });
  }

  return info;
}

/**
 * Format age in human-readable form
 */
function formatAge(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}
