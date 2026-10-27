/**
 * Generate Open Graph / Twitter card images for every generated page.
 *
 * The output mirrors the canonical path under /og, for example
 * /framework/express becomes /og/framework/express.png.
 */

import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { GeneratedPage, PageMetadata } from "../types.js";
import { SITE_URL } from "../constant.js";
import { DIST_DIR } from "../paths.js";
import { renderSocialCard } from "../utils/og-image.js";

const CONCURRENCY = 6;

const HOME_METADATA: PageMetadata = {
  title: "Hanma | Copy-Paste Backend Snippets for Node.js",
  description:
    "Production-ready backend snippets for Express, Fastify, Hono, Elysia, and NestJS. Authentication, database clients, middleware, and utilities you can copy, paste, and ship.",
  canonical: `${SITE_URL}/`,
  ogImage: `${SITE_URL}/og/home.png`,
};

interface CardJob {
  metadata: PageMetadata;
  outputPath: string;
}

function getOutputPath(imageUrl: string): string {
  const pathname = decodeURIComponent(new URL(imageUrl).pathname);
  return join(DIST_DIR, pathname.replace(/^\/+/, ""));
}

async function runWithConcurrency(
  jobs: CardJob[],
  worker: (job: CardJob) => Promise<void>,
): Promise<void> {
  let nextIndex = 0;

  async function consume(): Promise<void> {
    while (nextIndex < jobs.length) {
      const job = jobs[nextIndex];
      nextIndex += 1;
      if (job) await worker(job);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, consume),
  );
}

/**
 * Render one social card per page and return the number written.
 */
export async function generateOgImages(
  pages: GeneratedPage[],
): Promise<number> {
  const jobs: CardJob[] = [];
  const seen = new Set<string>();

  for (const metadata of [
    HOME_METADATA,
    ...pages.map((page) => page.metadata),
  ]) {
    // Noindex pages (search results and empty collections) do not need a
    // social card, and skipping them keeps the build fast.
    if (metadata.noindex) continue;
    if (!metadata.ogImage || seen.has(metadata.ogImage)) continue;
    seen.add(metadata.ogImage);
    jobs.push({ metadata, outputPath: getOutputPath(metadata.ogImage) });
  }

  let completed = 0;

  await runWithConcurrency(jobs, async ({ metadata, outputPath }) => {
    const png = await renderSocialCard({
      title: metadata.title,
      description: metadata.description,
      canonical: metadata.canonical,
    });

    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, png);

    completed += 1;
    if (completed % 50 === 0 || completed === jobs.length) {
      console.log(`  Rendered ${completed}/${jobs.length} social cards`);
    }
  });

  return completed;
}
