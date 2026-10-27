/**
 * Social card renderer.
 *
 * Vite does not generate Open Graph images, so the SEO build renders one PNG
 * per page after the SPA build. Satori turns the card markup into SVG and resvg
 * rasterizes it without a headless browser.
 */

import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import satori, { type Font } from "satori";
import { Resvg } from "@resvg/resvg-js";

const MODULE_DIR = dirname(fileURLToPath(import.meta.url));
const FONT_DIR = join(MODULE_DIR, "..", "assets", "fonts");

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;

const COLORS = {
  background: "#0b0b12",
  surface: "#16161d",
  border: "#2a2a35",
  foreground: "#fafafa",
  muted: "#a1a1aa",
  accent: "#fb923c",
} as const;

export interface SocialCardInput {
  title: string;
  description: string;
  canonical: string;
}

let fontsPromise: Promise<Font[]> | null = null;

function loadFonts(): Promise<Font[]> {
  fontsPromise ??= Promise.all([
    readFile(join(FONT_DIR, "inter-latin-400-normal.woff")),
    readFile(join(FONT_DIR, "inter-latin-700-normal.woff")),
  ]).then(([regular, bold]) => [
    { name: "Inter", data: regular, weight: 400, style: "normal" },
    { name: "Inter", data: bold, weight: 700, style: "normal" },
  ]);

  return fontsPromise;
}

type CardElement = Parameters<typeof satori>[0];

function element(
  type: string,
  style: Record<string, string | number>,
  children: CardElement | CardElement[] | string,
): CardElement {
  return {
    type,
    props: { style, children },
  } as unknown as CardElement;
}

function truncate(value: string, maxLength: number): string {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) return trimmed;

  const cut = trimmed.slice(0, maxLength - 3).trimEnd();
  const lastSpace = cut.lastIndexOf(" ");
  const safeCut = (lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut)
    .replace(/[.,;:!?-]+$/, "")
    .trimEnd();

  return `${safeCut}...`;
}

function getCardTitle(title: string): string {
  return truncate(
    title.replace(/\s*\|\s*Hanma\s*$/, "").replace(/^Hanma\s*\|\s*/, ""),
    78,
  );
}

function getLabel(canonical: string): string {
  const { pathname } = new URL(canonical);
  const segments = pathname.split("/").filter(Boolean);
  const [section] = segments;

  if (section === "framework") {
    return segments.length > 1 ? "Framework category" : "Framework snippets";
  }

  const labels: Record<string, string> = {
    snippet: "Code snippet",
    "use-case": "Use case",
    compare: "Framework comparison",
    guide: "Guide",
    tag: "Snippet collection",
    pattern: "Design pattern",
  };

  return labels[section ?? ""] ?? "Backend snippets for TypeScript";
}

function getPathLabel(canonical: string): string {
  const { host, pathname } = new URL(canonical);
  return truncate(`${host}${pathname === "/" ? "" : pathname}`, 72);
}

/**
 * Render a 1200x630 PNG social card for a page.
 */
export async function renderSocialCard({
  title,
  description,
  canonical,
}: SocialCardInput): Promise<Buffer> {
  const fonts = await loadFonts();

  const card = element(
    "div",
    {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "64px",
      boxSizing: "border-box",
      backgroundColor: COLORS.background,
      backgroundImage:
        "linear-gradient(135deg, rgba(251, 146, 60, 0.14) 0%, rgba(11, 11, 18, 0) 45%)",
      color: COLORS.foreground,
      fontFamily: "Inter",
    },
    [
      element(
        "div",
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        },
        [
          element(
            "div",
            { display: "flex", alignItems: "center", gap: "18px" },
            [
              element(
                "div",
                {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  backgroundColor: COLORS.accent,
                  color: COLORS.background,
                  fontSize: "32px",
                  fontWeight: 700,
                },
                "H",
              ),
              element(
                "div",
                { display: "flex", fontSize: "30px", fontWeight: 700 },
                "hanma",
              ),
            ],
          ),
          element(
            "div",
            { display: "flex", fontSize: "20px", color: COLORS.muted },
            "TypeScript backend toolkit",
          ),
        ],
      ),
      element(
        "div",
        {
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          width: "100%",
        },
        [
          element(
            "div",
            {
              display: "flex",
              fontSize: "20px",
              fontWeight: 700,
              color: COLORS.accent,
              letterSpacing: "0.16em",
            },
            getLabel(canonical).toUpperCase(),
          ),
          element(
            "div",
            {
              display: "flex",
              fontSize: getCardTitle(title).length > 52 ? "56px" : "68px",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              maxWidth: "1040px",
            },
            getCardTitle(title),
          ),
          element(
            "div",
            {
              display: "flex",
              fontSize: "26px",
              lineHeight: 1.4,
              color: COLORS.muted,
              maxWidth: "980px",
            },
            truncate(description, 150),
          ),
        ],
      ),
      element(
        "div",
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingTop: "24px",
          borderTop: `1px solid ${COLORS.border}`,
          fontSize: "20px",
          color: COLORS.muted,
        },
        [
          element("div", { display: "flex" }, getPathLabel(canonical)),
          element(
            "div",
            { display: "flex", color: COLORS.foreground },
            "github.com/itstheanurag/hanma",
          ),
        ],
      ),
    ],
  );

  const svg = await satori(card, {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    fonts,
  });

  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: CARD_WIDTH },
  })
    .render()
    .asPng();

  return Buffer.from(png);
}
